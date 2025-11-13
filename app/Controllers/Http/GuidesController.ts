import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Guide from 'App/Models/Guide'
import User from 'App/Models/User'
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

      const query = Guide.query().preload('user')

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
   * Crea un nuevo guía junto con su usuario
   * POST /guides
   */
  public async store({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        documentType,
        documentNumber,
        phone,
        licenseNumber,
        specialization,
        languages,
        yearsOfExperience,
        isAvailable,
      } = request.only([
        'username',
        'email',
        'password',
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

      // Crear usuario
      const user = await User.create(
        {
          username,
          email,
          password, // En producción usar Hash.make(password)
          userType: 'guide',
          isActive: true,
        },
        { client: trx }
      )

      // Crear guía
      const guide = await Guide.create(
        {
          userId: user.id,
          firstName,
          lastName,
          documentType,
          documentNumber,
          phone,
          licenseNumber,
          specialization,
          languages: JSON.stringify(languages),
          yearsOfExperience,
          isAvailable: isAvailable !== undefined ? isAvailable : true,
        },
        { client: trx }
      )

      await trx.commit()

      await guide.load('user')
      return response.created({
        message: 'Guía creado exitosamente',
        data: guide,
      })
    } catch (error) {
      await trx.rollback()
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
        .preload('user')
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

      await guide.load('user')

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
    const trx = await Database.transaction()

    try {
      const guide = await Guide.findOrFail(params.id)
      const user = await User.findOrFail(guide.userId)

      await guide.delete()
      await user.delete()

      await trx.commit()

      return response.ok({
        message: 'Guía eliminado exitosamente',
      })
    } catch (error) {
      await trx.rollback()
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
      const guides = await Guide.query()
        .where('is_available', true)
        .preload('user')
        .orderBy('first_name', 'asc')

      return response.ok(guides)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener guías disponibles',
        error: error.message,
      })
    }
  }
}
