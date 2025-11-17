import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'

export default class ClientsController {
  /**
   * Lista todos los clientes
   * GET /clients
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)

      const clients = await Client.query().orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(clients)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener clientes',
        error: error.message,
      })
    }
  }

  /**
   * Crea un nuevo cliente
   * POST /clients
   * Valida que el user_id existe en el microservicio de seguridad
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['userId', 'document', 'phone', 'address'])

      // Validar que el usuario existe en MS-Security
      const token = request.header('Authorization')?.replace('Bearer ', '')

      if (!token) {
        return response.unauthorized({
          message: 'Token de autenticación requerido',
        })
      }

      // Validar contra MS-Security que el usuario existe y es tipo 'client'
      try {
        const axios = (await import('axios')).default
        const Env = (await import('@ioc:Adonis/Core/Env')).default

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

        // Validar userType solo si existe y no es 'client'
        const userType = userValidation.data.userType
        if (userType && userType !== 'client') {
          return response.badRequest({
            message: `El usuario es de tipo '${userType}', debe ser 'client'`,
          })
        }

        // Crear cliente usando el MISMO ID del usuario de MS-SECURITY
        const client = await Client.create({
          id: data.userId, // ⭐ Usar el mismo ID de MS-SECURITY
          document: data.document,
          phone: data.phone,
          address: data.address,
        })

        return response.created({
          message: 'Cliente registrado exitosamente',
          data: client,
        })
      } catch (error) {
        console.error('Error al validar con MS-Security:', error.message)
        return response.badRequest({
          message: 'Error al validar usuario en MS-Security',
          error: error.response?.data || error.message,
        })
      }
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear cliente',
        error: error.message,
      })
    }
  }

  /**
   * Muestra un cliente específico
   * GET /clients/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const client = await Client.query()
        .where('id', params.id)
        .preload('trips')
        .preload('bankCards')
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
   * Actualiza un cliente
   * PUT /clients/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id)

      const data = request.only(['phone', 'address'])

      client.merge(data)
      await client.save()

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
   * Elimina un cliente
   * DELETE /clients/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id)
      await client.delete()

      return response.ok({
        message: 'Cliente eliminado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar cliente',
        error: error.message,
      })
    }
  }

  /**
   * Asocia un viaje a un cliente
   * POST /clients/:id/trips/:tripId
   */
  public async attachTrip({ params, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id)
      await client.related('trips').attach([params.tripId])

      return response.ok({
        message: 'Viaje asociado al cliente exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al asociar viaje',
        error: error.message,
      })
    }
  }

  /**
   * Desasocia un viaje de un cliente
   * DELETE /clients/:id/trips/:tripId
   */
  public async detachTrip({ params, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id)
      await client.related('trips').detach([params.tripId])

      return response.ok({
        message: 'Viaje desasociado del cliente exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al desasociar viaje',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene los viajes de un cliente
   * GET /clients/:id/trips
   */
  public async trips({ params, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id)
      await client.load('trips')

      return response.ok(client.trips)
    } catch (error) {
      return response.notFound({
        message: 'Cliente no encontrado',
        error: error.message,
      })
    }
  }
}
