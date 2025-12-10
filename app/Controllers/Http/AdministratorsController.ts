import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Administrator from 'App/Models/Administrator'
import Database from '@ioc:Adonis/Lucid/Database'
import UserService from 'App/Services/UserService'

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

      // Extraer token para consultar MS-SECURITY
      const token = request.header('Authorization')?.replace('Bearer ', '')

      // Serializar modelos a JSON plano
      const serializedAdmins = administrators.all().map((admin) => admin.serialize())

      // Enriquecer con información del usuario
      const enrichedData = await UserService.enrichWithUserInfo(serializedAdmins, token)
      return response.ok({
        meta: administrators.getMeta(),
        data: enrichedData,
      })
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
   * El id debe ser el _id del usuario de MS-SECURITY
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      console.log('🎯 === AdministratorsController.store() ===')
      console.log('📥 Body completo:', request.body())

      const data = request.only([
        'id',
        'document',
        'phone',
        'department',
        'accessLevel',
        'canManageUsers',
        'canManageTrips',
        'canManageInvoices',
      ])

      console.log('📦 Datos extraídos:', data)

      // Validar que se envió el id (debe ser el _id del usuario de MS-SECURITY)
      if (!data.id) {
        return response.badRequest({
          message: 'El campo id es requerido (debe ser el _id del usuario de MS-SECURITY)',
        })
      }

      // Verificar que el administrador no exista previamente
      const existingAdmin = await Administrator.find(data.id)
      if (existingAdmin) {
        return response.conflict({
          message: 'Ya existe un administrador con este ID',
          data: existingAdmin,
        })
      }

      console.log('✅ Creando administrador con datos:', data)

      // Crear administrador usando el MISMO ID del usuario de MS-SECURITY
      const administrator = await Administrator.create({
        id: data.id,
        document: data.document,
        phone: data.phone,
        department: data.department,
        accessLevel: data.accessLevel || 1,
        canManageUsers: data.canManageUsers !== undefined ? data.canManageUsers : false,
        canManageTrips: data.canManageTrips !== undefined ? data.canManageTrips : false,
        canManageInvoices: data.canManageInvoices !== undefined ? data.canManageInvoices : false,
      })

      console.log('✅ Administrador creado exitosamente:', administrator.id)

      return response.created({
        message: 'Administrador registrado exitosamente',
        data: administrator,
      })
    } catch (error) {
      console.error('❌ ERROR en AdministratorsController.store():', error.message)
      console.error('📄 Stack:', error.stack)
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
