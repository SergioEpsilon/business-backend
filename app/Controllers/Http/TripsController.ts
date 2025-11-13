import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Trip from 'App/Models/Trip'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

export default class TripsController {
  /**
   * Lista todos los viajes con filtros opcionales
   * GET /trips
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const status = request.input('status')
      const clientId = request.input('client_id')

      const query = Trip.query()
        .preload('client', (clientQuery) => {
          clientQuery.preload('user')
        })
        .preload('plans')

      if (status) {
        query.where('status', status)
      }

      if (clientId) {
        query.where('client_id', clientId)
      }

      const trips = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(trips)
    } catch (error) {
      return response.badRequest({ message: 'Error al obtener viajes', error: error.message })
    }
  }

  /**
   * Crea un nuevo viaje
   * POST /trips
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'clientId',
        'tripCode',
        'destination',
        'description',
        'startDate',
        'endDate',
        'totalPrice',
        'numberOfPassengers',
        'status',
        'paymentStatus',
        'notes',
      ])

      const trip = await Trip.create(data)
      await trip.load('client')

      return response.created({
        message: 'Viaje creado exitosamente',
        data: trip,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear viaje',
        error: error.message,
      })
    }
  }

  /**
   * Muestra un viaje específico con todas sus relaciones
   * GET /trips/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const trip = await Trip.query()
        .where('id', params.id)
        .preload('client', (clientQuery) => {
          clientQuery.preload('user')
        })
        .preload('plans', (plansQuery) => {
          plansQuery.preload('touristActivities', (activitiesQuery) => {
            activitiesQuery.preload('guide')
            activitiesQuery.preload('municipality')
          })
        })
        .preload('invoices')
        .preload('installments', (installmentsQuery) => {
          installmentsQuery.orderBy('installment_number', 'asc')
        })
        .firstOrFail()

      return response.ok(trip)
    } catch (error) {
      return response.notFound({
        message: 'Viaje no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza un viaje
   * PUT /trips/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const trip = await Trip.findOrFail(params.id)

      const data = request.only([
        'destination',
        'description',
        'startDate',
        'endDate',
        'totalPrice',
        'numberOfPassengers',
        'status',
        'paymentStatus',
        'notes',
      ])

      trip.merge(data)
      await trip.save()

      await trip.load('client')
      await trip.load('plans')

      return response.ok({
        message: 'Viaje actualizado exitosamente',
        data: trip,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar viaje',
        error: error.message,
      })
    }
  }

  /**
   * Elimina un viaje
   * DELETE /trips/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const trip = await Trip.findOrFail(params.id)
      await trip.delete()

      return response.ok({
        message: 'Viaje eliminado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar viaje',
        error: error.message,
      })
    }
  }

  /**
   * Asocia planes a un viaje
   * POST /trips/:id/plans
   */
  public async attachPlans({ params, request, response }: HttpContextContract) {
    try {
      const trip = await Trip.findOrFail(params.id)
      const { planIds, customData } = request.only(['planIds', 'customData'])

      if (!planIds || !Array.isArray(planIds)) {
        return response.badRequest({ message: 'planIds debe ser un array' })
      }

      // Asociar con datos personalizados si existen
      const pivotData = {}
      if (customData) {
        planIds.forEach((planId) => {
          pivotData[planId] = customData[planId] || {}
        })
      }

      await trip.related('plans').attach(pivotData)

      return response.ok({
        message: 'Planes asociados exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al asociar planes',
        error: error.message,
      })
    }
  }

  /**
   * Desasocia planes de un viaje
   * DELETE /trips/:id/plans
   */
  public async detachPlans({ params, request, response }: HttpContextContract) {
    try {
      const trip = await Trip.findOrFail(params.id)
      const { planIds } = request.only(['planIds'])

      if (!planIds || !Array.isArray(planIds)) {
        return response.badRequest({ message: 'planIds debe ser un array' })
      }

      await trip.related('plans').detach(planIds)

      return response.ok({
        message: 'Planes desasociados exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al desasociar planes',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene los planes de un viaje
   * GET /trips/:id/plans
   */
  public async plans({ params, response }: HttpContextContract) {
    try {
      const trip = await Trip.findOrFail(params.id)
      await trip.load('plans', (plansQuery) => {
        plansQuery.preload('touristActivities')
      })

      return response.ok(trip.plans)
    } catch (error) {
      return response.notFound({
        message: 'Viaje no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene las facturas de un viaje
   * GET /trips/:id/invoices
   */
  public async invoices({ params, response }: HttpContextContract) {
    try {
      const trip = await Trip.findOrFail(params.id)
      await trip.load('invoices', (invoicesQuery) => {
        invoicesQuery.preload('installments')
      })

      return response.ok(trip.invoices)
    } catch (error) {
      return response.notFound({
        message: 'Viaje no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Cambia el estado de un viaje
   * PATCH /trips/:id/status
   */
  public async updateStatus({ params, request, response }: HttpContextContract) {
    try {
      const trip = await Trip.findOrFail(params.id)
      const { status } = request.only(['status'])

      const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
      if (!validStatuses.includes(status)) {
        return response.badRequest({
          message: 'Estado inválido',
          validStatuses,
        })
      }

      trip.status = status
      await trip.save()

      return response.ok({
        message: 'Estado actualizado exitosamente',
        data: trip,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar estado',
        error: error.message,
      })
    }
  }
}
