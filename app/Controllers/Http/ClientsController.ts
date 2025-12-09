import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'

export default class ClientsController {
  /**
   * Lista todos los clientes
   * GET /clients
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      // 🚨 MODO TESTING: Validaciones deshabilitadas temporalmente
      console.log('⚠️ ClientsController.index - TESTING MODE (sin validaciones)')

      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const clients = await Client.query().orderBy('created_at', 'desc').paginate(page, perPage)
      return response.ok(clients)

      /* CÓDIGO ORIGINAL COMENTADO PARA TESTING:
      // Validar rol ADMINISTRADOR en MS-SECURITY
      const token = request.header('Authorization')?.replace('Bearer ', '')
      if (!token) {
        return response.unauthorized({ message: 'Token de autenticación requerido' })
      }
      const axios = (await import('axios')).default
      const Env = (await import('@ioc:Adonis/Core/Env')).default
      // Obtener info de usuario
      const userInfo = await axios.get(`${Env.get('MS_SECURITY')}/api/auth/my-roles`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (
        !userInfo.data ||
        !userInfo.data.roles ||
        !userInfo.data.roles.includes('administrator')
      ) {
        return response.forbidden({ message: 'Solo administradores pueden listar clientes' })
      }
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const clients = await Client.query().orderBy('created_at', 'desc').paginate(page, perPage)
      return response.ok(clients)
      */
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
   * El id debe ser el _id del usuario de MS-SECURITY
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['id', 'document', 'phone', 'address'])

      // Validar que se envió el id (debe ser el _id del usuario de MS-SECURITY)
      if (!data.id) {
        return response.badRequest({
          message: 'El campo id es requerido (debe ser el _id del usuario de MS-SECURITY)',
        })
      }

      // Verificar que el cliente no exista previamente
      const existingClient = await Client.find(data.id)
      if (existingClient) {
        return response.conflict({
          message: 'Ya existe un cliente con este ID',
          data: existingClient,
        })
      }

      // Crear cliente usando el MISMO ID del usuario de MS-SECURITY
      const client = await Client.create({
        id: data.id, // ⭐ ID del usuario de MS-SECURITY
        document: data.document,
        phone: data.phone,
        address: data.address,
      })

      return response.created({
        message: 'Cliente registrado exitosamente',
        data: client,
      })

      /* CÓDIGO ORIGINAL COMENTADO PARA TESTING:
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
      */
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
      // 🚨 MODO TESTING: Validaciones deshabilitadas temporalmente
      console.log('⚠️ ClientsController.show - TESTING MODE (sin validaciones)')

      const clientId = params.id

      // Buscar cliente directamente sin validación
      const client = await Client.query()
        .where('id', clientId)
        .preload('trips')
        .preload('bankCards')
        .first()

      if (!client) {
        return response.notFound({
          message: 'Cliente no encontrado',
          error: 'No existe un cliente con ese id',
        })
      }

      return response.ok(client)

      /* CÓDIGO ORIGINAL COMENTADO PARA TESTING:
      // Solo el propio cliente o admin puede ver el perfil
      const token = request.header('Authorization')?.replace('Bearer ', '')
      if (!token) {
        return response.unauthorized({ message: 'Token de autenticación requerido' })
      }
      const axios = (await import('axios')).default
      const Env = (await import('@ioc:Adonis/Core/Env')).default
      const userInfoResp = await axios.get(`${Env.get('MS_SECURITY')}/api/auth/my-roles`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const userInfo = userInfoResp.data
      let clientId = params.id
      // Si la ruta es /me, usar el userId del usuario autenticado
      if (clientId === 'me') {
        clientId = userInfo.userId
      }
      // LOGS DETALLADOS
      console.log('[DEBUG] params:', params)
      console.log('[DEBUG] userInfo:', userInfo)
      console.log('[DEBUG] Valor recibido en params.id:', params.id)
      console.log('[DEBUG] Valor final de clientId:', clientId)
      console.log('[DEBUG] Tipo de clientId:', typeof clientId)
      // Validación de permisos
      if (
        !userInfo ||
        (!userInfo.roles.includes('administrator') && userInfo.userId !== clientId)
      ) {
        return response.forbidden({ message: 'No autorizado para ver este cliente' })
      }
      // Buscar cliente en MySQL
      console.log('[DEBUG] Buscando en la base de datos Client con id:', clientId)
      const clientEnDb = await Client.query().where('id', clientId).first()
      if (!clientEnDb) {
        console.log('[DEBUG] No se encontró el cliente en MySQL con id:', clientId)
        const allClients = await Client.all()
        console.log(
          '[DEBUG] Todos los IDs de clientes en MySQL:',
          allClients.map((c) => c.id)
        )
        return response.notFound({
          message: 'Cliente no encontrado',
          error: 'No existe un cliente con ese id',
        })
      } else {
        console.log('[DEBUG] Cliente encontrado en MySQL:', clientEnDb)
      }
      // Preload de relaciones
      const client = await Client.query()
        .where('id', clientId)
        .preload('trips')
        .preload('bankCards')
        .first()
      console.log('[DEBUG] Resultado de la consulta Client:', client)
      if (!client) {
        return response.notFound({
          message: 'Cliente no encontrado',
          error: 'No existe un cliente con ese id',
        })
      }
      return response.ok(client)
      */
    } catch (error: any) {
      console.log('[DEBUG] Error en show:', error)
      return response.notFound({
        message: 'Cliente no encontrado',
        error: error?.message || error,
      })
    }
  }

  /**
   * Actualiza un cliente
   * PUT /clients/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      console.log('⚠️ ClientsController.update - TESTING MODE (auth bypassed)')

      const client = await Client.findOrFail(params.id)
      const data = request.only(['phone', 'address', 'document'])
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
      console.log('⚠️ ClientsController.destroy - TESTING MODE (auth bypassed)')

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
      console.log('⚠️ ClientsController.attachTrip - TESTING MODE (auth bypassed)')

      // Bypass de autenticación para testing
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
      console.log('⚠️ ClientsController.detachTrip - TESTING MODE (auth bypassed)')

      // Bypass de autenticación para testing
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
      console.log('⚠️ ClientsController.trips - TESTING MODE (auth bypassed)')

      // Bypass de autenticación para testing
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
