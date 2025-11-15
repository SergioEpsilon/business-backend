import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Aircraft from 'App/Models/Aircraft'
import Vehicle from 'App/Models/Vehicle'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AircraftsController {
  /**
   * Lista todas las aeronaves
   * GET /aircrafts
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 10)

      const aircrafts = await Aircraft.query()
        .preload('vehicle')
        .orderBy('created_at', 'desc')
        .paginate(page, perPage)

      return response.ok(aircrafts)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener aeronaves',
        error: error.message,
      })
    }
  }

  /**
   * Crear una nueva aeronave
   * POST /aircrafts
   */
  public async store({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()
    try {
      // Datos del vehículo base
      const vehicleData = request.only([
        'brand',
        'model',
        'year',
        'licensePlate',
        'capacity',
        'hasAirConditioning',
        'hasWifi',
      ])

      // Datos específicos de la aeronave
      const aircraftData = request.only(['airlineId', 'registrationNumber', 'aircraftType'])

      // Crear el vehículo base
      const vehicle = await Vehicle.create(
        {
          ...vehicleData,
          vehicleType: 'aircraft',
          isActive: true,
        },
        { client: trx }
      )

      // Crear la aeronave con la referencia al vehículo
      const aircraft = await Aircraft.create(
        {
          ...aircraftData,
          vehicleId: vehicle.id,
        },
        { client: trx }
      )

      await trx.commit()

      // Cargar las relaciones
      await aircraft.load('vehicle')

      return response.created({
        message: 'Aeronave registrada exitosamente',
        data: aircraft,
      })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({
        message: 'Error al registrar aeronave',
        error: error.message,
      })
    }
  }

  /**
   * Obtener una aeronave específica
   * GET /aircrafts/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const aircraft = await Aircraft.query()
        .where('id', params.id)
        .preload('vehicle')
        .firstOrFail()

      return response.ok(aircraft)
    } catch (error) {
      return response.notFound({
        message: 'Aeronave no encontrada',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar una aeronave
   * PUT /aircrafts/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    const trx = await Database.transaction()
    try {
      const aircraft = await Aircraft.findOrFail(params.id)
      await aircraft.load('vehicle')

      // Datos del vehículo base
      const vehicleData = request.only([
        'brand',
        'model',
        'year',
        'licensePlate',
        'capacity',
        'hasAirConditioning',
        'hasWifi',
        'isActive',
      ])

      // Datos específicos de la aeronave
      const aircraftData = request.only(['airlineId', 'registrationNumber', 'aircraftType'])

      // Actualizar el vehículo base
      aircraft.vehicle.useTransaction(trx)
      aircraft.vehicle.merge(vehicleData)
      await aircraft.vehicle.save()

      // Actualizar la aeronave
      aircraft.useTransaction(trx)
      aircraft.merge(aircraftData)
      await aircraft.save()

      await trx.commit()

      await aircraft.load('vehicle')

      return response.ok({
        message: 'Aeronave actualizada exitosamente',
        data: aircraft,
      })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({
        message: 'Error al actualizar aeronave',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar una aeronave
   * DELETE /aircrafts/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    const trx = await Database.transaction()
    try {
      const aircraft = await Aircraft.findOrFail(params.id)
      await aircraft.load('vehicle')

      // Eliminar la aeronave primero
      aircraft.useTransaction(trx)
      await aircraft.delete()

      // Luego eliminar el vehículo base
      aircraft.vehicle.useTransaction(trx)
      await aircraft.vehicle.delete()

      await trx.commit()

      return response.ok({
        message: 'Aeronave eliminada exitosamente',
      })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({
        message: 'Error al eliminar aeronave',
        error: error.message,
      })
    }
  }
}
