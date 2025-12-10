import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Driver from 'App/Models/Driver'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import UserService from 'App/Services/UserService'
import NotificationService from 'App/Services/NotificationService'

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

      // Extraer token para consultar MS-SECURITY
      const token = request.header('Authorization')?.replace('Bearer ', '')

      // Serializar modelos a JSON plano
      const serializedDrivers = drivers.all().map((driver) => driver.serialize())

      // Enriquecer con información del usuario
      const enrichedData = await UserService.enrichWithUserInfo(serializedDrivers, token)
      return response.ok({
        meta: drivers.getMeta(),
        data: enrichedData,
      })
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
   * Body: {id, document, phone, licenseNumber, licenseType, licenseExpiryDate, yearsOfExperience}
   * El 'id' es el _id del usuario en MS-SECURITY
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      console.log('🎯 === DriversController.store() ===')
      console.log('📥 Body completo:', request.body())

      const data = request.only([
        'id', // Este es el _id de MS-SECURITY
        'document',
        'phone',
        'licenseNumber',
        'licenseType',
        'licenseExpiryDate',
        'yearsOfExperience',
      ])

      console.log('📦 Datos extraídos:', data)

      // Validar que el usuario existe en MS-Security
      const token = request.header('Authorization')?.replace('Bearer ', '')

      if (!token) {
        return response.unauthorized({
          message: 'Token de autenticación requerido',
        })
      }

      // Validar contra MS-Security que el usuario existe
      try {
        const userValidation = await axios.get(`${Env.get('MS_SECURITY')}/api/users/${data.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('Usuario validado en MS-Security:', userValidation.data)

        if (!userValidation.data) {
          return response.badRequest({
            message: 'El usuario no existe en MS-Security',
          })
        }

        // Nota: No validamos roles aquí - eso se hace en MS-SECURITY
      } catch (error) {
        console.error('❌ Error al validar con MS-Security:', error.message)
        console.error('📄 Detalles:', error.response?.data)
        return response.badRequest({
          message: 'Error al validar usuario en MS-Security',
          error: error.response?.data || error.message,
          hint: 'Verifica que MS-Security esté corriendo en ' + Env.get('MS_SECURITY'),
        })
      }

      console.log('✅ Creando conductor con datos:', data)

      const driver = await Driver.create({
        ...data,
        isAvailable: true,
      })

      console.log('✅ Conductor creado exitosamente:', driver.id)

      return response.created({
        message: 'Conductor registrado exitosamente',
        data: driver,
      })
    } catch (error) {
      console.error('❌ ERROR en DriversController.store():', error.message)
      console.error('📄 Stack:', error.stack)
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
        'document',
        'phone',
        'licenseNumber',
        'licenseType',
        'licenseExpiryDate',
        'yearsOfExperience',
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
      const userResponse = await axios.get(`${Env.get('MS_SECURITY')}/api/users/${driver.id}`, {
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
      const emails: string[] = []

      for (const driver of drivers) {
        try {
          const userInfo = await UserService.getUserInfo(driver.id, token)
          if (userInfo?.email) {
            emails.push(userInfo.email)
          }
        } catch (error) {
          console.warn(`No se pudo obtener email del conductor ${driver.id}`)
        }
      }

      if (emails.length === 0) {
        return response.badRequest({
          message: 'No se encontraron emails de conductores',
        })
      }

      // 📧 Usar NotificationService para enviar alertas
      const result = await NotificationService.notifyWeatherAlert(emails, {
        message,
        severity: severity || 'MODERADO',
      })

      return response.ok({
        message: 'Alerta climática enviada',
        totalDrivers: drivers.length,
        sent: result.sent,
        failed: result.failed,
        details: result.details,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al enviar alerta climática',
        error: error.message,
      })
    }
  }
}
