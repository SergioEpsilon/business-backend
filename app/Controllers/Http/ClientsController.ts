import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import ClientValidator from 'App/Validators/ClientValidator'

export default class ClientsController {
  /**
   * Lista todos los clientes
   */
  public async index({ request }: HttpContextContract) {
    const data = request.all()
    if ('page' in data && 'per_page' in data) {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      return await Client.query().paginate(page, perPage)
    }
    return await Client.all()
  }

  /**
   * Almacena la información de un cliente
   */
  public async store({ request, response }: HttpContextContract) {
    const payload = request.body()
    const client = await Client.create(payload)
    return response.created(client)
  }

  /**
   * Muestra la información de un solo cliente
   */
  public async show({ params }: HttpContextContract) {
    const theClient: Client = await Client.findOrFail(params.id)
    await theClient.load('trips')
    return theClient
  }

  /**
   * Actualiza la información de un cliente basado
   * en el identificador y nuevos parámetros
   */
  public async update({ params, request }: HttpContextContract) {
    const theClient: Client = await Client.findOrFail(params.id)
    const body = request.body()
    if (body.name) theClient.name = body.name
    if (body.email) theClient.email = body.email
    if (body.phone) theClient.phone = body.phone
    if (body.address) theClient.address = body.address
    return await theClient.save()
  }

  /**
   * Elimina a un cliente basado en el identificador
   */
  public async destroy({ params }: HttpContextContract) {
    const theClient: Client = await Client.findOrFail(params.id)
    return await theClient.delete()
  }

  public async attachTrip({ params, response }: HttpContextContract) {
    const client: Client = await Client.findOrFail(params.id)
    const tripId = params.tripId

    // Asociar el viaje al cliente (many-to-many)
    await client.related('trips').attach([tripId])

    return response.ok({ message: 'Trip attached to client successfully' })
  }

  public async detachTrip({ params, response }: HttpContextContract) {
    const client: Client = await Client.findOrFail(params.id)
    const tripId = params.tripId

    // Desasociar el viaje del cliente
    await client.related('trips').detach([tripId])

    return response.ok({ message: 'Trip detached from client successfully' })
  }

  public async trips({ params }: HttpContextContract) {
    const theClient: Client = await Client.findOrFail(params.id)
    await theClient.load('trips')
    return theClient.trips
  }
}
