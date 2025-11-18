import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'

export default class ClientsController {
  /**
   * Lista todos los clientes
   * GET /clients
   */
  public async index({ request, response }: HttpContextContract) {
    try {
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
  public async show({ params, response, request }: HttpContextContract) {
    try {
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
      // Solo el propio cliente o admin puede actualizar
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
      if (clientId === 'me') {
        clientId = userInfo.userId
      }
      if (
        !userInfo ||
        (!userInfo.roles.includes('administrator') && userInfo.userId !== clientId)
      ) {
        return response.forbidden({ message: 'No autorizado para actualizar este cliente' })
      }
      const client = await Client.findOrFail(clientId)
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
  public async destroy({ params, response, request }: HttpContextContract) {
    try {
      // Solo el propio cliente o admin puede eliminar
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
      if (clientId === 'me') {
        clientId = userInfo.userId
      }
      if (
        !userInfo ||
        (!userInfo.roles.includes('administrator') && userInfo.userId !== clientId)
      ) {
        return response.forbidden({ message: 'No autorizado para eliminar este cliente' })
      }
      const client = await Client.findOrFail(clientId)
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
  public async attachTrip({ params, response, request }: HttpContextContract) {
    try {
      // Solo el propio cliente o admin puede asociar viajes
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
      if (
        !userInfo ||
        (!userInfo.roles.includes('administrator') && userInfo.userId !== params.id)
      ) {
        return response.forbidden({ message: 'No autorizado para asociar viaje a este cliente' })
      }
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
  public async detachTrip({ params, response, request }: HttpContextContract) {
    try {
      // Solo el propio cliente o admin puede desasociar viajes
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
      if (
        !userInfo ||
        (!userInfo.roles.includes('administrator') && userInfo.userId !== params.id)
      ) {
        return response.forbidden({
          message: 'No autorizado para desasociar viaje de este cliente',
        })
      }
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
  public async trips({ params, response, request }: HttpContextContract) {
    try {
      // Solo el propio cliente o admin puede ver los viajes
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
      if (
        !userInfo ||
        (!userInfo.roles.includes('administrator') && userInfo.userId !== params.id)
      ) {
        return response.forbidden({ message: 'No autorizado para ver los viajes de este cliente' })
      }
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
