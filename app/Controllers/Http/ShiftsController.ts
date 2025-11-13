import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Shift from 'App/Models/Shift'
import Driver from 'App/Models/Driver'
import Vehicle from 'App/Models/Vehicle'
import { DateTime } from 'luxon'

export default class ShiftsController {
  /**
   * Lista todos los turnos
   * GET /shifts
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 10)
      const status = request.input('status')
      const driverId = request.input('driver_id')
      const vehicleId = request.input('vehicle_id')

      const query = Shift.query().preload('driver').preload('vehicle')

      if (status) {
        query.where('status', status)
      }

      if (driverId) {
        query.where('driver_id', driverId)
      }

      if (vehicleId) {
        query.where('vehicle_id', vehicleId)
      }

      const shifts = await query.orderBy('shift_start', 'desc').paginate(page, perPage)

      return response.ok(shifts)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener turnos',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo turno (asignar conductor a vehículo)
   * POST /shifts
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['driverId', 'vehicleId', 'shiftStart', 'shiftEnd'])

      // Validar que el conductor existe
      const driver = await Driver.findOrFail(data.driverId)

      // Validar que el vehículo existe
      const vehicle = await Vehicle.findOrFail(data.vehicleId)

      // Validar que el conductor esté disponible
      if (!driver.isAvailable) {
        return response.badRequest({
          message: 'El conductor no está disponible',
        })
      }

      // Validar que el vehículo esté activo
      if (!vehicle.isActive) {
        return response.badRequest({
          message: 'El vehículo no está activo',
        })
      }

      // Validar solapamiento de turnos para el conductor
      const driverConflict = await Shift.query()
        .where('driver_id', data.driverId)
        .where('status', '!=', 'cancelled')
        .where((query) => {
          query
            .whereBetween('shift_start', [data.shiftStart, data.shiftEnd])
            .orWhereBetween('shift_end', [data.shiftStart, data.shiftEnd])
            .orWhere((subQuery) => {
              subQuery
                .where('shift_start', '<=', data.shiftStart)
                .where('shift_end', '>=', data.shiftEnd)
            })
        })
        .first()

      if (driverConflict) {
        return response.badRequest({
          message: 'El conductor ya tiene un turno asignado en ese horario',
        })
      }

      // Validar solapamiento de turnos para el vehículo
      const vehicleConflict = await Shift.query()
        .where('vehicle_id', data.vehicleId)
        .where('status', '!=', 'cancelled')
        .where((query) => {
          query
            .whereBetween('shift_start', [data.shiftStart, data.shiftEnd])
            .orWhereBetween('shift_end', [data.shiftStart, data.shiftEnd])
            .orWhere((subQuery) => {
              subQuery
                .where('shift_start', '<=', data.shiftStart)
                .where('shift_end', '>=', data.shiftEnd)
            })
        })
        .first()

      if (vehicleConflict) {
        return response.badRequest({
          message: 'El vehículo ya tiene un conductor asignado en ese horario',
        })
      }

      const shift = await Shift.create({
        ...data,
        status: 'scheduled',
      })

      await shift.load('driver')
      await shift.load('vehicle')

      return response.created({
        message: 'Turno creado exitosamente',
        data: shift,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear turno',
        error: error.message,
      })
    }
  }

  /**
   * Obtener un turno específico
   * GET /shifts/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const shift = await Shift.query()
        .where('id', params.id)
        .preload('driver')
        .preload('vehicle')
        .firstOrFail()

      return response.ok(shift)
    } catch (error) {
      return response.notFound({
        message: 'Turno no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un turno
   * PUT /shifts/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const shift = await Shift.findOrFail(params.id)

      const data = request.only(['shiftStart', 'shiftEnd', 'status'])

      shift.merge(data)
      await shift.save()

      await shift.load('driver')
      await shift.load('vehicle')

      return response.ok({
        message: 'Turno actualizado exitosamente',
        data: shift,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar turno',
        error: error.message,
      })
    }
  }

  /**
   * Cancelar un turno
   * DELETE /shifts/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const shift = await Shift.findOrFail(params.id)

      shift.status = 'cancelled'
      await shift.save()

      return response.ok({
        message: 'Turno cancelado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al cancelar turno',
        error: error.message,
      })
    }
  }

  /**
   * Iniciar un turno
   * PATCH /shifts/:id/start
   */
  public async start({ params, response }: HttpContextContract) {
    try {
      const shift = await Shift.findOrFail(params.id)

      if (shift.status !== 'scheduled') {
        return response.badRequest({
          message: `No se puede iniciar un turno con estado '${shift.status}'`,
        })
      }

      shift.status = 'in_progress'
      shift.shiftStart = DateTime.now()
      await shift.save()

      await shift.load('driver')
      await shift.load('vehicle')

      return response.ok({
        message: 'Turno iniciado exitosamente',
        data: shift,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al iniciar turno',
        error: error.message,
      })
    }
  }

  /**
   * Finalizar un turno
   * PATCH /shifts/:id/complete
   */
  public async complete({ params, response }: HttpContextContract) {
    try {
      const shift = await Shift.findOrFail(params.id)

      if (shift.status !== 'in_progress') {
        return response.badRequest({
          message: `No se puede finalizar un turno con estado '${shift.status}'`,
        })
      }

      shift.status = 'completed'
      shift.shiftEnd = DateTime.now()
      await shift.save()

      await shift.load('driver')
      await shift.load('vehicle')

      return response.ok({
        message: 'Turno finalizado exitosamente',
        data: shift,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al finalizar turno',
        error: error.message,
      })
    }
  }
}
