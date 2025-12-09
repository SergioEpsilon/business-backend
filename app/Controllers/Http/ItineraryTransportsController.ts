import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ItineraryTransport from 'App/Models/ItineraryTransport'
import ItineraryTransportValidator from 'App/Validators/ItineraryTransportValidator'

export default class ItineraryTransportsController {
  /**
   * GET /api/v1/itinerary-transports
   * Obtener todos los itinerarios con paginación
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('perPage', 10)

      const itineraries = await ItineraryTransport.query()
        .preload('trip')
        .preload('route')
        .preload('transportService')
        .orderBy('dayNumber', 'asc')
        .orderBy('orderInDay', 'asc')
        .paginate(page, perPage)

      return response.ok({
        meta: itineraries.getMeta(),
        data: itineraries.all(),
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener itinerarios',
        error: error.message,
      })
    }
  }

  /**
   * POST /api/v1/itinerary-transports
   * Crear un nuevo itinerario
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      console.log('⚠️ ItineraryTransportsController.store - TESTING MODE')

      const payload = await request.validate(ItineraryTransportValidator)

      // Si no se proporciona transportServiceId, verificar si existe alguno en la BD
      if (!payload.transportServiceId) {
        // Buscar si existe al menos un TransportService
        const TransportService = (await import('App/Models/TransportService')).default
        const { DateTime } = await import('luxon')
        const firstService = await TransportService.query().first()

        if (firstService) {
          payload.transportServiceId = firstService.id
        } else {
          // Si no existe ninguno, crear uno por defecto para testing
          const newService = await TransportService.create({
            routeId: payload.routeId || 1,
            transportType: 'bus',
            vehicleId: 1, // El vehículo que creaste antes
            serviceNumber: `SRV-${Date.now()}`,
            departureTime: DateTime.now().plus({ hours: 1 }),
            arrivalTime: DateTime.now().plus({ hours: 7 }),
            price: 50000,
            availableSeats: 20,
            isActive: true,
          })
          payload.transportServiceId = newService.id
        }
      }

      const itinerary = await ItineraryTransport.create(payload)

      await itinerary.load('trip')
      await itinerary.load('route')
      await itinerary.load('transportService')

      return response.created({
        message: 'Itinerario creado exitosamente',
        data: itinerary,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear itinerario',
        error: error.messages || error.message,
      })
    }
  }

  /**
   * GET /api/v1/itinerary-transports/:id
   * Obtener un itinerario por ID
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const itinerary = await ItineraryTransport.query()
        .where('id', params.id)
        .preload('trip')
        .preload('route')
        .preload('transportService')
        .firstOrFail()

      return response.ok({
        data: itinerary,
      })
    } catch (error) {
      return response.notFound({
        message: 'Itinerario no encontrado',
      })
    }
  }

  /**
   * PUT /api/v1/itinerary-transports/:id
   * Actualizar un itinerario
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const itinerary = await ItineraryTransport.findOrFail(params.id)
      const payload = await request.validate(ItineraryTransportValidator)

      itinerary.merge(payload)
      await itinerary.save()
      await itinerary.load('trip')
      await itinerary.load('route')
      await itinerary.load('transportService')

      return response.ok({
        message: 'Itinerario actualizado exitosamente',
        data: itinerary,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar itinerario',
        error: error.messages || error.message,
      })
    }
  }

  /**
   * DELETE /api/v1/itinerary-transports/:id
   * Eliminar un itinerario
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const itinerary = await ItineraryTransport.findOrFail(params.id)
      await itinerary.delete()

      return response.ok({
        message: 'Itinerario eliminado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar itinerario',
        error: error.message,
      })
    }
  }
}
