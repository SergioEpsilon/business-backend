import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Client from 'App/Models/Client'
import Guide from 'App/Models/Guide'
import Administrator from 'App/Models/Administrator'
import Driver from 'App/Models/Driver'

export default class UsersController {
  /**
   * Obtiene usuarios disponibles que NO tienen una entidad de negocio asignada
   * GET /users/available-for/:roleType
   * roleType puede ser: client, guide, administrator, driver
   */
  public async availableForRole({ params, request, response }: HttpContextContract) {
    try {
      const { roleType } = params
      const token = request.header('Authorization')?.replace('Bearer ', '')

      if (!token) {
        return response.unauthorized({
          message: 'Token de autenticación requerido',
        })
      }

      // Mapear roleType a nombre de rol en MS-SECURITY
      const roleMap = {
        client: 'CLIENTE',
        guide: 'GUIA',
        administrator: 'ADMINISTRADOR',
        driver: 'CONDUCTOR',
      }

      const roleName = roleMap[roleType]

      if (!roleName) {
        return response.badRequest({
          message: `Tipo de rol inválido. Debe ser: client, guide, administrator o driver`,
        })
      }

      // 1. Obtener todos los usuarios con ese rol desde MS-SECURITY
      let allUsersWithRole
      try {
        const usersResponse = await axios.get(
          `${Env.get('MS_SECURITY')}/api/users/by-role/${roleName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        allUsersWithRole = usersResponse.data
      } catch (error) {
        console.error('Error al obtener usuarios de MS-SECURITY:', error.message)
        return response.badRequest({
          message: 'Error al obtener usuarios del microservicio de seguridad',
          error: error.response?.data || error.message,
        })
      }

      // 2. Obtener IDs de usuarios que YA tienen entidad de negocio
      let assignedUserIds: string[] = []

      switch (roleType) {
        case 'client':
          const clients = await Client.query().select('id')
          assignedUserIds = clients.map((c) => c.id)
          break
        case 'guide':
          const guides = await Guide.query().select('id')
          assignedUserIds = guides.map((g) => g.id)
          break
        case 'administrator':
          const administrators = await Administrator.query().select('id')
          assignedUserIds = administrators.map((a) => a.id)
          break
        case 'driver':
          const drivers = await Driver.query().select('id')
          assignedUserIds = drivers.map((d) => d.id)
          break
      }

      // 3. Filtrar usuarios disponibles (que NO están asignados)
      const availableUsers = allUsersWithRole.filter((user) => !assignedUserIds.includes(user._id))

      return response.ok({
        roleType,
        roleName,
        total: availableUsers.length,
        users: availableUsers.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          authenticated: user.authenticated,
        })),
      })
    } catch (error) {
      console.error('Error en availableForRole:', error)
      return response.badRequest({
        message: 'Error al obtener usuarios disponibles',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene información de un usuario desde MS-SECURITY
   * GET /users/:id
   */
  public async show({ params, request, response }: HttpContextContract) {
    try {
      const { id } = params
      const token = request.header('Authorization')?.replace('Bearer ', '')

      if (!token) {
        return response.unauthorized({
          message: 'Token de autenticación requerido',
        })
      }

      const userResponse = await axios.get(`${Env.get('MS_SECURITY')}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      return response.ok(userResponse.data)
    } catch (error) {
      console.error('Error al obtener usuario:', error.message)
      return response.notFound({
        message: 'Usuario no encontrado',
        error: error.response?.data || error.message,
      })
    }
  }
}
