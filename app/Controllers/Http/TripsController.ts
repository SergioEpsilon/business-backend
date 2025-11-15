import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Trip from 'App/Models/Trip'
import TripValidator from 'App/Validators/TripValidator'

export default class TripsController {
  /**
   * Lista todos los viajes
   */
  public async index({ request }: HttpContextContract) {
    const data = request.all()
    if ('page' in data && 'per_page' in data) {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      return await Trip.query().paginate(page, perPage)
    }
    return await Trip.all()
  }

  /**
   * Almacena la información de un viaje
   */
  public async store({ request, response }: HttpContextContract) {
    const payload = request.body()
    const trip = await Trip.create(payload)
    return response.created(trip)
  }

  /**
   * Muestra la información de un solo viaje
   */
  public async show({ params }: HttpContextContract) {
    const theTrip: Trip = await Trip.findOrFail(params.id)
    await theTrip.load('clients')
    return theTrip
  }

  /**
   * Actualiza la información de un viaje basado
   * en el identificador y nuevos parámetros
   */
  public async update({ params, request }: HttpContextContract) {
    const theTrip: Trip = await Trip.findOrFail(params.id)
    const body = request.body()
    if (body.destination) theTrip.destination = body.destination
    if (body.description) theTrip.description = body.description
    if (body.startDate) theTrip.startDate = body.startDate
    if (body.endDate) theTrip.endDate = body.endDate
    if (body.price !== undefined) theTrip.price = body.price
    if (body.capacity !== undefined) theTrip.capacity = body.capacity
    return await theTrip.save()
  }

  /**
   * Elimina a un viaje basado en el identificador
   */
  public async destroy({ params }: HttpContextContract) {
    const theTrip: Trip = await Trip.findOrFail(params.id)
    return await theTrip.delete()
  }

  public async attachClient({ params, response }: HttpContextContract) {
    const trip: Trip = await Trip.findOrFail(params.id)
    const clientId = params.clientId

    // Asociar el cliente al viaje (many-to-many)
    await trip.related('clients').attach([clientId])

    return response.ok({ message: 'Client attached to trip successfully' })
  }

  public async detachClient({ params, response }: HttpContextContract) {
    const trip: Trip = await Trip.findOrFail(params.id)
    const clientId = params.clientId

    // Desasociar el cliente del viaje
    await trip.related('clients').detach([clientId])

    return response.ok({ message: 'Client detached from trip successfully' })
  }

  public async clients({ params }: HttpContextContract) {
    const theTrip: Trip = await Trip.findOrFail(params.id)
    await theTrip.load('clients')
    return theTrip.clients
  }

  /**
   * Asocia un trayecto a un viaje
   * POST /trips/:id/routes/:routeId
   */
  public async attachRoute({ params, response }: HttpContextContract) {
    const trip: Trip = await Trip.findOrFail(params.id)
    const routeId = params.routeId

    await trip.related('routes').attach([routeId])

    return response.ok({ message: 'Route attached to trip successfully' })
  }

  /**
   * Desasocia un trayecto de un viaje
   * DELETE /trips/:id/routes/:routeId
   */
  public async detachRoute({ params, response }: HttpContextContract) {
    const trip: Trip = await Trip.findOrFail(params.id)
    const routeId = params.routeId

    await trip.related('routes').detach([routeId])

    return response.ok({ message: 'Route detached from trip successfully' })
  }

  /**
   * Obtiene los trayectos de un viaje
   * GET /trips/:id/routes
   */
  public async routes({ params }: HttpContextContract) {
    const theTrip: Trip = await Trip.findOrFail(params.id)
    await theTrip.load('routes')
    return theTrip.routes
  }
}
