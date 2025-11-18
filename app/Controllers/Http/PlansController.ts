import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Plan from 'App/Models/Plan'

export default class PlansController {
  /**
   * Lista todos los planes turísticos
   * GET /plans
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const category = request.input('category')
      const isActive = request.input('is_active')

      const query = Plan.query().preload('touristActivities', (activitiesQuery) => {
        activitiesQuery.preload('guides')
        activitiesQuery.preload('municipality')
      })

      if (category) {
        query.where('category', category)
      }

      if (isActive !== undefined) {
        query.where('is_active', isActive === 'true')
      }

      const plans = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(plans)
    } catch (error) {
      return response.badRequest({ message: 'Error al obtener planes', error: error.message })
    }
  }

  /**
   * Crea un nuevo plan turístico
   * POST /plans
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      // 🚨 MODO TESTING: Simplificar creación de plan
      console.log('⚠️ PlansController.store - TESTING MODE')

      const data = request.only([
        'name',
        'description',
        'price',
        'duration',
        'isActive',
      ])

      // Generar plan_code único si no se proporciona
      const planCode = `PLAN-${Date.now()}`

      const plan = await Plan.create({
        planCode: planCode,
        name: data.name,
        description: data.description,
        basePrice: data.price || 0,
        duration: data.duration,
        isActive: data.isActive !== undefined ? data.isActive : true,
        category: 'general', // Categoría por defecto para testing
        seasonType: 'all_year', // Temporada por defecto para testing
        // Valores por defecto para campos opcionales
        maxPeople: 50,
        minPeople: 1,
        includesAccommodation: false,
        includesTransport: false,
        includesMeals: false,
      })

      return response.created({
        message: 'Plan creado exitosamente',
        data: plan,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear plan',
        error: error.message,
      })
    }
  }

  /**
   * Muestra un plan específico con todas sus relaciones
   * GET /plans/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const plan = await Plan.query()
        .where('id', params.id)
        .preload('touristActivities', (activitiesQuery) => {
          activitiesQuery.preload('guides')
          activitiesQuery.preload('municipality')
        })
        .preload('trips', (tripsQuery) => {
          tripsQuery.preload('clients')
        })
        .firstOrFail()

      return response.ok(plan)
    } catch (error) {
      return response.notFound({
        message: 'Plan no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza un plan
   * PUT /plans/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const plan = await Plan.findOrFail(params.id)

      const data = request.only([
        'name',
        'description',
        'planCode',
        'duration',
        'basePrice',
        'maxPeople',
        'minPeople',
        'includesAccommodation',
        'includesTransport',
        'includesMeals',
        'mealPlan',
        'category',
        'seasonType',
        'isActive',
      ])

      plan.merge(data)
      await plan.save()

      return response.ok({
        message: 'Plan actualizado exitosamente',
        data: plan,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar plan',
        error: error.message,
      })
    }
  }

  /**
   * Elimina un plan
   * DELETE /plans/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const plan = await Plan.findOrFail(params.id)
      await plan.delete()

      return response.ok({
        message: 'Plan eliminado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar plan',
        error: error.message,
      })
    }
  }

  /**
   * Asocia actividades turísticas a un plan
   * POST /plans/:id/activities
   */
  public async attachActivities({ params, request, response }: HttpContextContract) {
    try {
      const plan = await Plan.findOrFail(params.id)
      const { activityIds, customData } = request.only(['activityIds', 'customData'])

      if (!activityIds || !Array.isArray(activityIds)) {
        return response.badRequest({ message: 'activityIds debe ser un array' })
      }

      // Preparar datos del pivot con información personalizada
      const pivotData = {}
      if (customData) {
        activityIds.forEach((activityId) => {
          pivotData[activityId] = customData[activityId] || {}
        })
      }

      await plan.related('touristActivities').attach(pivotData)

      return response.ok({
        message: 'Actividades asociadas exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al asociar actividades',
        error: error.message,
      })
    }
  }

  /**
   * Desasocia actividades de un plan
   * DELETE /plans/:id/activities
   */
  public async detachActivities({ params, request, response }: HttpContextContract) {
    try {
      const plan = await Plan.findOrFail(params.id)
      const { activityIds } = request.only(['activityIds'])

      if (!activityIds || !Array.isArray(activityIds)) {
        return response.badRequest({ message: 'activityIds debe ser un array' })
      }

      await plan.related('touristActivities').detach(activityIds)

      return response.ok({
        message: 'Actividades desasociadas exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al desasociar actividades',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene las actividades de un plan
   * GET /plans/:id/activities
   */
  public async activities({ params, response }: HttpContextContract) {
    try {
      const plan = await Plan.findOrFail(params.id)
      await plan.load('touristActivities', (activitiesQuery) => {
        activitiesQuery.preload('guides')
        activitiesQuery.preload('municipality')
      })

      return response.ok(plan.touristActivities)
    } catch (error) {
      return response.notFound({
        message: 'Plan no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Activa o desactiva un plan
   * PATCH /plans/:id/toggle-active
   */
  public async toggleActive({ params, response }: HttpContextContract) {
    try {
      const plan = await Plan.findOrFail(params.id)
      plan.isActive = !plan.isActive
      await plan.save()

      return response.ok({
        message: `Plan ${plan.isActive ? 'activado' : 'desactivado'} exitosamente`,
        data: plan,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al cambiar estado del plan',
        error: error.message,
      })
    }
  }
}
