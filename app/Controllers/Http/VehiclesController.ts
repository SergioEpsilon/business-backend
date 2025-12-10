import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vehicle from 'App/Models/Vehicle'
import VehicleValidator from 'App/Validators/VehicleValidator'

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
      // Validar datos de entrada
      const payload = await request.validate(VehicleValidator)

      const vehicle = await Vehicle.create({
        ...payload,
        isActive: payload.isActive !== undefined ? payload.isActive : true,
      })

      // Inicializar GPS automáticamente para el nuevo vehículo
      try {
        const { default: GpsSimulatorService } = await import('App/Services/GpsSimulatorService')
        await GpsSimulatorService.initializeVehicleGps(vehicle.id)

        // Si el simulador no está corriendo, iniciarlo
        const status = GpsSimulatorService.getStatus()
        if (!status.isRunning) {
          GpsSimulatorService.start()
        }
      } catch (gpsError) {
        console.error('⚠️ Error inicializando GPS para vehículo:', gpsError.message)
        // No fallar la creación del vehículo si el GPS falla
      }

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
        .preload('gps')
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

  /**
   * Obtiene los trayectos de un vehículo
   * GET /vehicles/:id/routes
   */
  public async routes({ params, response }: HttpContextContract) {
    try {
      const vehicle = await Vehicle.findOrFail(params.id)
      await vehicle.load('routes')

      return response.ok(vehicle.routes)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener trayectos del vehículo',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene el GPS asociado a un vehículo
   * GET /vehicles/:id/gps
   */
  public async gps({ params, response }: HttpContextContract) {
    try {
      const vehicle = await Vehicle.findOrFail(params.id)
      await vehicle.load('gps')

      if (!vehicle.gps) {
        return response.notFound({
          message: 'Este vehículo no tiene GPS asociado',
        })
      }

      return response.ok(vehicle.gps)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener GPS del vehículo',
        error: error.message,
      })
    }
  }
}
