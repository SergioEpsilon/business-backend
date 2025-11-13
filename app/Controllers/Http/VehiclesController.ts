import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vehicle from 'App/Models/Vehicle'

export default class VehiclesController {
  /**
   * Lista todos los vehículos
   * GET /vehicles
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 10)
      const isActive = request.input('is_active')
      const vehicleType = request.input('vehicle_type')

      const query = Vehicle.query()

      if (isActive !== undefined) {
        query.where('is_active', isActive === 'true')
      }

      if (vehicleType) {
        query.where('vehicle_type', vehicleType)
      }

      const vehicles = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(vehicles)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener vehículos',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo vehículo
   * POST /vehicles
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'brand',
        'model',
        'year',
        'licensePlate',
        'vehicleType',
        'capacity',
        'hasAirConditioning',
        'hasWifi',
      ])

      const vehicle = await Vehicle.create({
        ...data,
        isActive: true,
      })

      return response.created({
        message: 'Vehículo registrado exitosamente',
        data: vehicle,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al registrar vehículo',
        error: error.message,
      })
    }
  }

  /**
   * Obtener un vehículo específico
   * GET /vehicles/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const vehicle = await Vehicle.query()
        .where('id', params.id)
        .preload('drivers', (driversQuery) => {
          driversQuery.pivotColumns(['shift_start', 'shift_end', 'status'])
        })
        .firstOrFail()

      return response.ok(vehicle)
    } catch (error) {
      return response.notFound({
        message: 'Vehículo no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un vehículo
   * PUT /vehicles/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const vehicle = await Vehicle.findOrFail(params.id)

      const data = request.only([
        'brand',
        'model',
        'year',
        'licensePlate',
        'vehicleType',
        'capacity',
        'hasAirConditioning',
        'hasWifi',
        'isActive',
      ])

      vehicle.merge(data)
      await vehicle.save()

      return response.ok({
        message: 'Vehículo actualizado exitosamente',
        data: vehicle,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar vehículo',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar (desactivar) un vehículo
   * DELETE /vehicles/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const vehicle = await Vehicle.findOrFail(params.id)

      vehicle.isActive = false
      await vehicle.save()

      return response.ok({
        message: 'Vehículo desactivado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al desactivar vehículo',
        error: error.message,
      })
    }
  }

  /**
   * Obtener conductores asignados a un vehículo
   * GET /vehicles/:id/drivers
   */
  public async drivers({ params, response }: HttpContextContract) {
    try {
      const vehicle = await Vehicle.query()
        .where('id', params.id)
        .preload('drivers', (driversQuery) => {
          driversQuery.pivotColumns(['shift_start', 'shift_end', 'status'])
        })
        .firstOrFail()

      return response.ok({
        vehicle: {
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          licensePlate: vehicle.licensePlate,
        },
        drivers: vehicle.drivers,
      })
    } catch (error) {
      return response.notFound({
        message: 'Vehículo no encontrado',
        error: error.message,
      })
    }
  }
}
