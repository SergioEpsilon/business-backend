import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VehicleGps from 'App/Models/VehicleGps'
import Vehicle from 'App/Models/Vehicle'
import { DateTime } from 'luxon'

export default class VehicleGpsController {
  /**
   * GET /vehicle-gps
   * Obtener todas las posiciones GPS activas
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const isActive = request.input('is_active', true)
      const status = request.input('status')

      const query = VehicleGps.query().preload('vehicle')

      if (isActive !== undefined) {
        query.where('is_active', isActive)
      }

      if (status) {
        query.where('status', status)
      }

      const gpsData = await query.orderBy('last_update', 'desc')

      return response.ok(gpsData)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener posiciones GPS',
        error: error.message,
      })
    }
  }

  /**
   * GET /vehicle-gps/:vehicleId
   * Obtener posición GPS de un vehículo específico
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const gpsData = await VehicleGps.query()
        .where('vehicle_id', params.vehicleId)
        .preload('vehicle')
        .firstOrFail()

      return response.ok(gpsData)
    } catch (error) {
      return response.notFound({
        message: 'GPS no encontrado para este vehículo',
        error: error.message,
      })
    }
  }

  /**
   * POST /vehicle-gps/:vehicleId
   * Actualizar posición GPS de un vehículo
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const { latitude, longitude, speed, heading, altitude, accuracy, status } = request.only([
        'latitude',
        'longitude',
        'speed',
        'heading',
        'altitude',
        'accuracy',
        'status',
      ])

      // Verificar que el vehículo existe
      await Vehicle.findOrFail(params.vehicleId)

      // Buscar o crear GPS para el vehículo
      let gpsData = await VehicleGps.query().where('vehicle_id', params.vehicleId).first()

      if (gpsData) {
        // Actualizar GPS existente
        gpsData.latitude = latitude
        gpsData.longitude = longitude
        gpsData.speed = speed || 0
        gpsData.heading = heading || 0
        gpsData.altitude = altitude
        gpsData.accuracy = accuracy || 10
        gpsData.status = status || 'idle'
        gpsData.lastUpdate = DateTime.now()
        await gpsData.save()
      } else {
        // Crear nuevo GPS
        gpsData = await VehicleGps.create({
          vehicleId: params.vehicleId,
          latitude,
          longitude,
          speed: speed || 0,
          heading: heading || 0,
          altitude,
          accuracy: accuracy || 10,
          status: status || 'idle',
          isActive: true,
          lastUpdate: DateTime.now(),
        })
      }

      // TODO: Emit WebSocket event
      // Ws.io.emit('gps:update', gpsData.serialize())

      return response.ok({
        message: 'Posición GPS actualizada',
        data: gpsData,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar GPS',
        error: error.message,
      })
    }
  }

  /**
   * POST /vehicle-gps/:vehicleId/simulate
   * Simular movimiento GPS (para testing)
   */
  public async simulate({ params, request, response }: HttpContextContract) {
    try {
      const { startLat, startLon, endLat, endLon, steps } = request.only([
        'startLat',
        'startLon',
        'endLat',
        'endLon',
        'steps',
      ])

      const vehicle = await Vehicle.findOrFail(params.vehicleId)

      // Calcular incrementos
      const latStep = (endLat - startLat) / (steps || 10)
      const lonStep = (endLon - startLon) / (steps || 10)

      let currentLat = startLat
      let currentLon = startLon

      // Buscar o crear GPS
      let gpsData = await VehicleGps.query().where('vehicle_id', params.vehicleId).first()

      if (!gpsData) {
        gpsData = await VehicleGps.create({
          vehicleId: params.vehicleId,
          latitude: currentLat,
          longitude: currentLon,
          speed: 60,
          heading: 0,
          status: 'moving',
          isActive: true,
          lastUpdate: DateTime.now(),
        })
      }

      // Actualizar posición inicial
      gpsData.latitude = currentLat
      gpsData.longitude = currentLon
      gpsData.speed = 60
      gpsData.status = 'moving'
      gpsData.lastUpdate = DateTime.now()
      await gpsData.save()

      return response.ok({
        message: 'Simulación GPS iniciada',
        data: gpsData,
        simulation: {
          startLat,
          startLon,
          endLat,
          endLon,
          steps: steps || 10,
          latStep,
          lonStep,
        },
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al simular GPS',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /vehicle-gps/:vehicleId
   * Desactivar GPS de un vehículo
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const gpsData = await VehicleGps.query().where('vehicle_id', params.vehicleId).firstOrFail()

      gpsData.isActive = false
      gpsData.status = 'offline'
      await gpsData.save()

      return response.ok({
        message: 'GPS desactivado',
        data: gpsData,
      })
    } catch (error) {
      return response.notFound({
        message: 'GPS no encontrado',
        error: error.message,
      })
    }
  }
}
