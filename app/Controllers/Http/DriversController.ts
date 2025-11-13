import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Driver from 'App/Models/Driver'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import { v4 as uuidv4 } from 'uuid'

export default class DriversController {
  /**
   * Lista todos los conductores
   * GET /drivers
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 10)
      const isAvailable = request.input('is_available')

      const query = Driver.query()

      if (isAvailable !== undefined) {
        query.where('is_available', isAvailable === 'true')
      }

      const drivers = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(drivers)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener conductores',
        error: error.message,
      })
    }
  }

  /**
   * Muestra un conductor específico
   * GET /drivers/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const driver = await Driver.findOrFail(params.id)

      return response.ok(driver)
    } catch (error) {
      return response.notFound({
        message: 'Conductor no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Crea un nuevo conductor
   * POST /drivers
   * Valida que el user_id existe en el microservicio de seguridad
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'userId',
        'firstName',
        'lastName',
        'documentType',
        'documentNumber',
        'phone',
        'licenseNumber',
        'licenseType',
        'licenseExpiryDate',
        'yearsOfExperience',
        'vehicleId',
      ])

      // Validar que el usuario existe en MS-Security
      const token = request.header('Authorization')?.replace('Bearer ', '')

      if (!token) {
        return response.unauthorized({
          message: 'Token de autenticación requerido',
        })
      }

      // Validar contra MS-Security que el usuario existe y es tipo 'driver'
      try {
        const userValidation = await axios.get(
          `${Env.get('MS_SECURITY')}/api/users/${data.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        console.log('Usuario validado en MS-Security:', userValidation.data)

        if (!userValidation.data) {
          return response.badRequest({
            message: 'El usuario no existe en MS-Security',
          })
        }

        // Validar userType solo si existe y no es 'driver'
        const userType = userValidation.data.userType
        if (userType && userType !== 'driver') {
          return response.badRequest({
            message: `El usuario es de tipo '${userType}', debe ser 'driver'`,
          })
        }

        // Nota: No validamos 'autenticado' para permitir crear drivers sin verificación completa
      } catch (error) {
        console.error('Error al validar con MS-Security:', error.message)
        return response.badRequest({
          message: 'Error al validar usuario en MS-Security',
          error: error.response?.data || error.message,
          hint: 'Verifica que MS-Security esté corriendo en ' + Env.get('MS_SECURITY'),
        })
      }

      const driver = await Driver.create({
        id: uuidv4(),
        ...data,
        isAvailable: true,
      })

      return response.created({
        message: 'Conductor registrado exitosamente',
        data: driver,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al registrar conductor',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza un conductor
   * PUT /drivers/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const driver = await Driver.findOrFail(params.id)

      const data = request.only([
        'firstName',
        'lastName',
        'documentType',
        'documentNumber',
        'phone',
        'licenseNumber',
        'licenseType',
        'licenseExpiryDate',
        'yearsOfExperience',
        'vehicleId',
        'isAvailable',
      ])

      driver.merge(data)
      await driver.save()

      return response.ok({
        message: 'Conductor actualizado exitosamente',
        data: driver,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar conductor',
        error: error.message,
      })
    }
  }

  /**
   * Elimina (desactiva) un conductor
   * DELETE /drivers/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const driver = await Driver.findOrFail(params.id)

      driver.isAvailable = false
      await driver.save()

      return response.ok({
        message: 'Conductor desactivado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al desactivar conductor',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene estadísticas de conductores
   * GET /drivers/stats
   */
  public async stats({ response }: HttpContextContract) {
    try {
      const total = await Driver.query().count('* as total')
      const available = await Driver.query().where('is_available', true).count('* as total')
      const unavailable = await Driver.query().where('is_available', false).count('* as total')

      return response.ok({
        total: total[0].$extras.total,
        available: available[0].$extras.total,
        unavailable: unavailable[0].$extras.total,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener estadísticas',
        error: error.message,
      })
    }
  }

  /**
   * Valida la información del conductor con el microservicio de seguridad
   * GET /drivers/:id/validate
   */
  public async validate({ params, request, response }: HttpContextContract) {
    try {
      const driver = await Driver.findOrFail(params.id)
      const token = request.header('Authorization')?.replace('Bearer ', '')

      // Consultar el usuario en el microservicio de seguridad
      const userResponse = await axios.get(`${Env.get('MS_SECURITY')}/api/users/${driver.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.ok({
        driver: driver,
        user: userResponse.data,
        isValid: userResponse.data.userType === 'driver' && userResponse.data.isActive,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al validar conductor con microservicio de seguridad',
        error: error.message,
      })
    }
  }

  /**
   * Envía alerta climática a todos los conductores activos
   * POST /drivers/weather-alert
   */
  public async sendWeatherAlert({ request, response }: HttpContextContract) {
    try {
      const { message, severity } = request.only(['message', 'severity'])

      if (!message) {
        return response.badRequest({
          message: 'El mensaje de alerta es requerido',
        })
      }

      // Obtener todos los conductores activos
      const drivers = await Driver.query().where('is_available', true)

      if (drivers.length === 0) {
        return response.ok({
          message: 'No hay conductores activos para notificar',
          sent: 0,
        })
      }

      // Obtener emails de los usuarios desde MS-Security
      const token = request.header('Authorization')?.replace('Bearer ', '')
            const userIds = drivers.map((d) => d.userId)
      
      const emailPromises = drivers.map(async (driver) => {
        try {
          // Consultar usuario en MS-Security para obtener email
          const userResponse = await axios.get(
            `${Env.get('MS_SECURITY')}/api/users/${driver.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )

          const userEmail = userResponse.data.email

          if (!userEmail) {
            console.warn(`Conductor ${driver.firstName} ${driver.lastName} no tiene email`)
            return null
          }

          // Enviar notificación por email usando MS-Notifications
          await axios.post(
            `${Env.get('MS_NOTIFICATIONS')}/send-email`,
            {
              to: userEmail,
              subject: `⚠️ Alerta Climática - ${severity || 'IMPORTANTE'}`,
              message: `Estimado/a ${driver.firstName} ${driver.lastName},

${message}

Nivel de alerta: ${severity || 'MODERADO'}
Fecha: ${new Date().toLocaleString('es-PE')}

Por favor, tome las precauciones necesarias.

Saludos,
Sistema de Gestión de Viajes`,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )

          return {
            driverId: driver.id,
            driverName: `${driver.firstName} ${driver.lastName}`,
            email: userEmail,
            sent: true,
          }
        } catch (error) {
          console.error(`Error enviando alerta a conductor ${driver.id}:`, error.message)
          return {
            driverId: driver.id,
            driverName: `${driver.firstName} ${driver.lastName}`,
            sent: false,
            error: error.message,
          }
        }
      })

      const results = await Promise.all(emailPromises)
      const successCount = results.filter((r) => r?.sent).length
      const failedCount = results.filter((r) => r && !r.sent).length

      return response.ok({
        message: 'Alerta climática enviada',
        totalDrivers: drivers.length,
        sent: successCount,
        failed: failedCount,
        results: results.filter((r) => r !== null),
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al enviar alerta climática',
        error: error.message,
      })
    }
  }
}
