import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Administrator from 'App/Models/Administrator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AdministratorsController {
  /**
   * Lista todos los administradores
   * GET /administrators
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const department = request.input('department')

      const query = Administrator.query()

      if (department) {
        query.where('department', 'like', `%${department}%`)
      }

      const administrators = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(administrators)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener administradores',
        error: error.message,
      })
    }
  }

  /**
   * Crea un nuevo administrador
   * POST /administrators
   * Valida que el user_id existe en el microservicio de seguridad
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'userId',
        'document',
        'phone',
        'department',
        'accessLevel',
        'canManageUsers',
        'canManageTrips',
        'canManageInvoices',
      ])

      // Validar que el usuario existe en MS-Security
      const token = request.header('Authorization')?.replace('Bearer ', '')

      if (!token) {
        return response.unauthorized({
          message: 'Token de autenticación requerido',
        })
      }

      // Validar contra MS-Security que el usuario existe y es tipo 'administrator'
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

        // Validar userType: permitir 'administrator' o 'administrator-hotel'
        const userType = userValidation.data.userType
        if (userType && userType !== 'administrator' && userType !== 'administrator-hotel') {
          return response.badRequest({
            message: `El usuario es de tipo '${userType}', debe ser 'administrator' o 'administrator-hotel'`,
          })
        }
      } catch (error) {
        console.error('Error al validar con MS-Security:', error.message)
        return response.badRequest({
          message: 'Error al validar usuario en MS-Security',
          error: error.response?.data || error.message,
        })
      }

      const administrator = await Administrator.create({
        id: data.userId,
        ...data,
        accessLevel: data.accessLevel || 1,
        canManageUsers: data.canManageUsers !== undefined ? data.canManageUsers : false,
        canManageTrips: data.canManageTrips !== undefined ? data.canManageTrips : false,
        canManageInvoices: data.canManageInvoices !== undefined ? data.canManageInvoices : false,
      })

      return response.created({
        message: 'Administrador registrado exitosamente',
        data: administrator,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear administrador',
        error: error.message,
      })
    }
  }

  /**
   * Muestra un administrador específico
   * GET /administrators/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const administrator = await Administrator.query()
        .where('id', params.id)
        .preload('hotels', (hotelsQuery) => {
          hotelsQuery.preload('municipality')
        })
        .firstOrFail()

      return response.ok(administrator)
    } catch (error) {
      return response.notFound({
        message: 'Administrador no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza un administrador
   * PUT /administrators/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const administrator = await Administrator.findOrFail(params.id)

      const data = request.only([
        'firstName',
        'lastName',
        'documentType',
        'documentNumber',
        'phone',
        'department',
        'accessLevel',
        'canManageUsers',
        'canManageTrips',
        'canManageInvoices',
      ])

      administrator.merge(data)
      await administrator.save()

      return response.ok({
        message: 'Administrador actualizado exitosamente',
        data: administrator,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar administrador',
        error: error.message,
      })
    }
  }

  /**
   * Elimina un administrador
   * DELETE /administrators/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const administrator = await Administrator.findOrFail(params.id)
      await administrator.delete()

      return response.ok({
        message: 'Administrador eliminado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar administrador',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza los permisos de un administrador
   * PATCH /administrators/:id/permissions
   */
  public async updatePermissions({ params, request, response }: HttpContextContract) {
    try {
      const administrator = await Administrator.findOrFail(params.id)

      const permissions = request.only([
        'canManageUsers',
        'canManageTrips',
        'canManageInvoices',
        'accessLevel',
      ])

      administrator.merge(permissions)
      await administrator.save()

      return response.ok({
        message: 'Permisos actualizados exitosamente',
        data: administrator,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar permisos',
        error: error.message,
      })
    }
  }
}
