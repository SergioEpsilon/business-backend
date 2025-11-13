import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ClientsController {
  /**
   * Lista todos los clientes con paginación
   * GET /clients
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)

      const clients = await Client.query()
        .preload('user')
        .preload('trips', (tripsQuery) => {
          tripsQuery.select('id', 'trip_code', 'destination', 'start_date', 'status')
        })
        .paginate(page, perPage)

      return response.ok(clients)
    } catch (error) {
      return response.badRequest({ message: 'Error al obtener clientes', error: error.message })
    }
  }

  /**
   * Crea un nuevo cliente junto con su usuario
   * POST /clients
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
        address,
        city,
        country,
        birthDate,
      } = request.only([
        'username',
        'email',
        'password',
        'firstName',
        'lastName',
        'documentType',
        'documentNumber',
        'phone',
        'address',
        'city',
        'country',
        'birthDate',
      ])

      // Crear usuario
      const user = await User.create(
        {
          username,
          email,
          password, // En producción usar Hash.make(password)
          userType: 'client',
          isActive: true,
        },
        { client: trx }
      )

      // Crear cliente
      const client = await Client.create(
        {
          userId: user.id,
          firstName,
          lastName,
          documentType,
          documentNumber,
          phone,
          address,
          city,
          country,
          birthDate,
        },
        { client: trx }
      )

      await trx.commit()

      await client.load('user')
      return response.created({
        message: 'Cliente creado exitosamente',
        data: client,
      })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({
        message: 'Error al crear cliente',
        error: error.message,
      })
    }
  }

  /**
   * Muestra un cliente específico con todas sus relaciones
   * GET /clients/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const client = await Client.query()
        .where('id', params.id)
        .preload('user')
        .preload('trips', (tripsQuery) => {
          tripsQuery.preload('plans')
          tripsQuery.preload('invoices')
        })
        .preload('bankCards', (cardsQuery) => {
          cardsQuery.where('is_active', true)
        })
        .firstOrFail()

      return response.ok(client)
    } catch (error) {
      return response.notFound({
        message: 'Cliente no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza la información de un cliente
   * PUT /clients/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id)

      const data = request.only([
        'firstName',
        'lastName',
        'documentType',
        'documentNumber',
        'phone',
        'address',
        'city',
        'country',
        'birthDate',
      ])

      client.merge(data)
      await client.save()

      await client.load('user')

      return response.ok({
        message: 'Cliente actualizado exitosamente',
        data: client,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar cliente',
        error: error.message,
      })
    }
  }

  /**
   * Elimina un cliente (soft delete recomendado en producción)
   * DELETE /clients/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      const client = await Client.findOrFail(params.id)
      const user = await User.findOrFail(client.userId)

      // Eliminar cliente y usuario
      await client.delete()
      await user.delete()

      await trx.commit()

      return response.ok({
        message: 'Cliente eliminado exitosamente',
      })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({
        message: 'Error al eliminar cliente',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene todos los viajes de un cliente
   * GET /clients/:id/trips
   */
  public async trips({ params, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id)
      await client.load('trips', (tripsQuery) => {
        tripsQuery.preload('plans')
        tripsQuery.orderBy('start_date', 'desc')
      })

      return response.ok(client.trips)
    } catch (error) {
      return response.notFound({
        message: 'Cliente no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene todas las tarjetas bancarias de un cliente
   * GET /clients/:id/bank-cards
   */
  public async bankCards({ params, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id)
      await client.load('bankCards', (cardsQuery) => {
        cardsQuery.where('is_active', true)
      })

      return response.ok(client.bankCards)
    } catch (error) {
      return response.notFound({
        message: 'Cliente no encontrado',
        error: error.message,
      })
    }
  }
}
