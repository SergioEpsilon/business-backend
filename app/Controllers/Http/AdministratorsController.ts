import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Administrator from 'App/Models/Administrator'
import User from 'App/Models/User'
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

      const query = Administrator.query().preload('user')

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
   * Crea un nuevo administrador junto con su usuario
   * POST /administrators
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
        department,
        accessLevel,
        canManageUsers,
        canManageTrips,
        canManageInvoices,
      } = request.only([
        'username',
        'email',
        'password',
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

      // Crear usuario
      const user = await User.create(
        {
          username,
          email,
          password, // En producción usar Hash.make(password)
          userType: 'administrator',
          isActive: true,
        },
        { client: trx }
      )

      // Crear administrador
      const administrator = await Administrator.create(
        {
          userId: user.id,
          firstName,
          lastName,
          documentType,
          documentNumber,
          phone,
          department,
          accessLevel: accessLevel || 1,
          canManageUsers: canManageUsers !== undefined ? canManageUsers : false,
          canManageTrips: canManageTrips !== undefined ? canManageTrips : false,
          canManageInvoices: canManageInvoices !== undefined ? canManageInvoices : false,
        },
        { client: trx }
      )

      await trx.commit()

      await administrator.load('user')
      return response.created({
        message: 'Administrador creado exitosamente',
        data: administrator,
      })
    } catch (error) {
      await trx.rollback()
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
        .preload('user')
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

      await administrator.load('user')

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
    const trx = await Database.transaction()

    try {
      const administrator = await Administrator.findOrFail(params.id)
      const user = await User.findOrFail(administrator.userId)

      await administrator.delete()
      await user.delete()

      await trx.commit()

      return response.ok({
        message: 'Administrador eliminado exitosamente',
      })
    } catch (error) {
      await trx.rollback()
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
