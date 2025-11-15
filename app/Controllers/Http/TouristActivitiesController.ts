import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TouristActivity from 'App/Models/TouristActivity'

export default class TouristActivitiesController {
  /**
   * Lista todas las actividades turísticas
   * GET /tourist-activities
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const municipalityId = request.input('municipality_id')
      const activityType = request.input('activity_type')
      const isActive = request.input('is_active')

      const query = TouristActivity.query().preload('guides').preload('municipality')

      if (municipalityId) {
        query.where('municipality_id', municipalityId)
      }

      if (activityType) {
        query.where('activity_type', activityType)
      }

      if (isActive !== undefined) {
        query.where('is_active', isActive === 'true')
      }

      const activities = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(activities)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener actividades',
        error: error.message,
      })
    }
  }

  /**
   * Crea una nueva actividad turística
   * POST /tourist-activities
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'municipalityId',
        'name',
        'description',
        'activityType',
        'duration',
        'price',
        'maxCapacity',
        'minCapacity',
        'difficulty',
        'includesTransport',
        'includesMeals',
        'requirements',
        'isActive',
      ])

      const activity = await TouristActivity.create(data)
      await activity.load('guides')
      await activity.load('municipality')

      return response.created({
        message: 'Actividad creada exitosamente',
        data: activity,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear actividad',
        error: error.message,
      })
    }
  }

  /**
   * Muestra una actividad específica
   * GET /tourist-activities/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const activity = await TouristActivity.query()
        .where('id', params.id)
        .preload('guides', (guideQuery) => {
          guideQuery.preload('user')
        })
        .preload('municipality')
        .preload('plans')
        .firstOrFail()

      return response.ok(activity)
    } catch (error) {
      return response.notFound({
        message: 'Actividad no encontrada',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza una actividad
   * PUT /tourist-activities/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const activity = await TouristActivity.findOrFail(params.id)

      const data = request.only([
        'municipalityId',
        'name',
        'description',
        'activityType',
        'duration',
        'price',
        'maxCapacity',
        'minCapacity',
        'difficulty',
        'includesTransport',
        'includesMeals',
        'requirements',
        'isActive',
      ])

      activity.merge(data)
      await activity.save()

      await activity.load('guides')
      await activity.load('municipality')

      return response.ok({
        message: 'Actividad actualizada exitosamente',
        data: activity,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar actividad',
        error: error.message,
      })
    }
  }

  /**
   * Elimina una actividad
   * DELETE /tourist-activities/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const activity = await TouristActivity.findOrFail(params.id)
      await activity.delete()

      return response.ok({
        message: 'Actividad eliminada exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar actividad',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene los planes que incluyen esta actividad
   * GET /tourist-activities/:id/plans
   */
  public async plans({ params, response }: HttpContextContract) {
    try {
      const activity = await TouristActivity.findOrFail(params.id)
      await activity.load('plans')

      return response.ok(activity.plans)
    } catch (error) {
      return response.notFound({
        message: 'Actividad no encontrada',
        error: error.message,
      })
    }
  }

  /**
   * Activa o desactiva una actividad
   * PATCH /tourist-activities/:id/toggle-active
   */
  public async toggleActive({ params, response }: HttpContextContract) {
    try {
      const activity = await TouristActivity.findOrFail(params.id)
      activity.isActive = !activity.isActive
      await activity.save()

      return response.ok({
        message: `Actividad ${activity.isActive ? 'activada' : 'desactivada'} exitosamente`,
        data: activity,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al cambiar estado de la actividad',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene actividades por tipo
   * GET /tourist-activities/by-type/:type
   */
  public async byType({ params, response }: HttpContextContract) {
    try {
      const activities = await TouristActivity.query()
        .where('activity_type', params.type)
        .where('is_active', true)
        .preload('guides')
        .preload('municipality')

      return response.ok(activities)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener actividades por tipo',
        error: error.message,
      })
    }
  }

  /**
   * Asocia un guía a una actividad
   * POST /tourist-activities/:id/guides/:guideId
   */
  public async attachGuide({ params, response }: HttpContextContract) {
    try {
      const activity = await TouristActivity.findOrFail(params.id)
      await activity.related('guides').attach([params.guideId])

      return response.ok({
        message: 'Guía asociado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al asociar guía',
        error: error.message,
      })
    }
  }

  /**
   * Desasocia un guía de una actividad
   * DELETE /tourist-activities/:id/guides/:guideId
   */
  public async detachGuide({ params, response }: HttpContextContract) {
    try {
      const activity = await TouristActivity.findOrFail(params.id)
      await activity.related('guides').detach([params.guideId])

      return response.ok({
        message: 'Guía desasociado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al desasociar guía',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene los guías de una actividad
   * GET /tourist-activities/:id/guides
   */
  public async guides({ params, response }: HttpContextContract) {
    try {
      const activity = await TouristActivity.findOrFail(params.id)
      await activity.load('guides', (query) => {
        query.preload('user')
      })

      return response.ok(activity.guides)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener guías',
        error: error.message,
      })
    }
  }
}
