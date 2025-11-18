import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from 'App/Models/Route'

export default class RoutesController {
  /**
   * Lista todos los trayectos
   * GET /routes
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const isActive = request.input('is_active')

      const query = Route.query()

      if (isActive !== undefined) {
        query.where('is_active', isActive === 'true')
      }

      const routes = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(routes)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener trayectos',
        error: error.message,
      })
    }
  }

  /**
   * Crea un nuevo trayecto
   * POST /routes
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      // 🚨 MODO TESTING: Simplificar creación de ruta
      console.log('⚠️ RoutesController.store - TESTING MODE')

      const data = request.only([
        'name',
        'origin',
        'destination',
        'distance',
        'distanceKm',
        'estimatedDuration',
        'estimatedDurationMinutes',
        'description',
        'stops',
        'isActive',
      ])

      // Mapeo de campos: soportar ambos formatos
      const distanceKm = data.distanceKm || data.distance || 0
      const estimatedDurationMinutes = data.estimatedDurationMinutes || data.estimatedDuration || 0

      const route = await Route.create({
        originMunicipalityId: 1, // Municipio por defecto para testing
        destinationMunicipalityId: 1, // Municipio por defecto para testing
        origin: data.origin,
        destination: data.destination,
        distanceKm: distanceKm,
        estimatedDurationMinutes: estimatedDurationMinutes,
        description: data.description || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
      })

      return response.created({
        message: 'Trayecto creado exitosamente',
        data: route,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear trayecto',
        error: error.message,
      })
    }
  }

  /**
   * Muestra un trayecto específico
   * GET /routes/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const route = await Route.query().where('id', params.id).preload('trips').firstOrFail()

      return response.ok(route)
    } catch (error) {
      return response.notFound({
        message: 'Trayecto no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza un trayecto
   * PUT /routes/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const route = await Route.findOrFail(params.id)

      const data = request.only([
        'origin',
        'destination',
        'distanceKm',
        'estimatedDurationMinutes',
        'description',
        'isActive',
      ])

      route.merge(data)
      await route.save()

      return response.ok({
        message: 'Trayecto actualizado exitosamente',
        data: route,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar trayecto',
        error: error.message,
      })
    }
  }

  /**
   * Elimina un trayecto
   * DELETE /routes/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const route = await Route.findOrFail(params.id)
      await route.delete()

      return response.ok({
        message: 'Trayecto eliminado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar trayecto',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene los viajes de un trayecto
   * GET /routes/:id/trips
   */
  public async trips({ params, response }: HttpContextContract) {
    try {
      const route = await Route.findOrFail(params.id)
      await route.load('trips')

      return response.ok(route.trips)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener viajes del trayecto',
        error: error.message,
      })
    }
  }

  /**
   * Asocia un vehículo a un trayecto
   * POST /routes/:id/vehicles/:vehicleId
   */
  public async attachVehicle({ params, response }: HttpContextContract) {
    try {
      const route = await Route.findOrFail(params.id)
      await route.related('vehicles').attach([params.vehicleId])

      return response.ok({
        message: 'Vehículo asociado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al asociar vehículo',
        error: error.message,
      })
    }
  }

  /**
   * Desasocia un vehículo de un trayecto
   * DELETE /routes/:id/vehicles/:vehicleId
   */
  public async detachVehicle({ params, response }: HttpContextContract) {
    try {
      const route = await Route.findOrFail(params.id)
      await route.related('vehicles').detach([params.vehicleId])

      return response.ok({
        message: 'Vehículo desasociado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al desasociar vehículo',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene los vehículos de un trayecto
   * GET /routes/:id/vehicles
   */
  public async vehicles({ params, response }: HttpContextContract) {
    try {
      const route = await Route.findOrFail(params.id)
      await route.load('vehicles')

      return response.ok(route.vehicles)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener vehículos del trayecto',
        error: error.message,
      })
    }
  }
}
