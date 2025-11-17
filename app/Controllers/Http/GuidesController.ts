import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Guide from 'App/Models/Guide'
import Database from '@ioc:Adonis/Lucid/Database'

export default class GuidesController {
  /**
   * Lista todos los guías
   * GET /guides
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const specialization = request.input('specialization')
      const isAvailable = request.input('is_available')

      const query = Guide.query()

      if (specialization) {
        query.where('specialization', 'like', `%${specialization}%`)
      }

      if (isAvailable !== undefined) {
        query.where('is_available', isAvailable === 'true')
      }

      const guides = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(guides)
    } catch (error) {
      return response.badRequest({ message: 'Error al obtener guías', error: error.message })
    }
  }

  /**
   * Crea un nuevo guía
   * POST /guides
   * Valida que el user_id existe en el microservicio de seguridad
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'userId',
        'document',
        'phone',
        'licenseNumber',
        'specialization',
        'languages',
        'yearsOfExperience',
      ])

      // Validar que el usuario existe en MS-Security
      const token = request.header('Authorization')?.replace('Bearer ', '')

      if (!token) {
        return response.unauthorized({
          message: 'Token de autenticación requerido',
        })
      }

      // Validar contra MS-Security que el usuario existe y es tipo 'guide'
      try {
        const axios = (await import('axios')).default
        const Env = (await import('@ioc:Adonis/Core/Env')).default
        const { v4: uuidv4 } = await import('uuid')

        const userValidation = await axios.get(
          `${Env.get('MS_SECURITY')}/api/users/${data.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!userValidation.data) {
          return response.badRequest({
            message: 'El usuario no existe en MS-Security',
          })
        }

        // Validar userType solo si existe y no es 'guide'
        const userType = userValidation.data.userType
        if (userType && userType !== 'guide') {
          return response.badRequest({
            message: `El usuario es de tipo '${userType}', debe ser 'guide'`,
          })
        }
      } catch (error) {
        console.error('Error al validar con MS-Security:', error.message)
        return response.badRequest({
          message: 'Error al validar usuario en MS-Security',
          error: error.response?.data || error.message,
        })
      }

      const axios = (await import('axios')).default
      const guide = await Guide.create({
        id: data.userId,
        ...data,
        isAvailable: true,
      })

      return response.created({
        message: 'Guía registrado exitosamente',
        data: guide,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear guía',
        error: error.message,
      })
    }
  }

  /**
   * Muestra un guía específico
   * GET /guides/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const guide = await Guide.query()
        .where('id', params.id)
        .preload('touristActivities', (activitiesQuery) => {
          activitiesQuery.preload('municipality')
        })
        .firstOrFail()

      return response.ok(guide)
    } catch (error) {
      return response.notFound({
        message: 'Guía no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza un guía
   * PUT /guides/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const guide = await Guide.findOrFail(params.id)

      const data = request.only([
        'firstName',
        'lastName',
        'documentType',
        'documentNumber',
        'phone',
        'licenseNumber',
        'specialization',
        'languages',
        'yearsOfExperience',
        'isAvailable',
      ])

      // Convertir array de idiomas a JSON si existe
      if (data.languages && Array.isArray(data.languages)) {
        data.languages = JSON.stringify(data.languages)
      }

      guide.merge(data)
      await guide.save()

      return response.ok({
        message: 'Guía actualizado exitosamente',
        data: guide,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar guía',
        error: error.message,
      })
    }
  }

  /**
   * Elimina un guía
   * DELETE /guides/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const guide = await Guide.findOrFail(params.id)
      await guide.delete()

      return response.ok({
        message: 'Guía eliminado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar guía',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene las actividades de un guía
   * GET /guides/:id/activities
   */
  public async activities({ params, response }: HttpContextContract) {
    try {
      const guide = await Guide.findOrFail(params.id)
      await guide.load('touristActivities', (activitiesQuery) => {
        activitiesQuery.preload('municipality')
        activitiesQuery.orderBy('created_at', 'desc')
      })

      return response.ok(guide.touristActivities)
    } catch (error) {
      return response.notFound({
        message: 'Guía no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Cambia la disponibilidad de un guía
   * PATCH /guides/:id/toggle-availability
   */
  public async toggleAvailability({ params, response }: HttpContextContract) {
    try {
      const guide = await Guide.findOrFail(params.id)
      guide.isAvailable = !guide.isAvailable
      await guide.save()

      return response.ok({
        message: `Guía ${guide.isAvailable ? 'disponible' : 'no disponible'}`,
        data: guide,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al cambiar disponibilidad',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene guías disponibles
   * GET /guides/available
   */
  public async available({ response }: HttpContextContract) {
    try {
      const guides = await Guide.query().where('is_available', true).orderBy('first_name', 'asc')

      return response.ok(guides)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener guías disponibles',
        error: error.message,
      })
    }
  }
}
