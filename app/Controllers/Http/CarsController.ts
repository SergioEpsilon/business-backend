import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Car from 'App/Models/Car'
import Vehicle from 'App/Models/Vehicle'
import Database from '@ioc:Adonis/Lucid/Database'

export default class CarsController {
  /**
   * Lista todos los carros
   * GET /cars
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 10)

      const cars = await Car.query()
        .preload('vehicle')
        .orderBy('created_at', 'desc')
        .paginate(page, perPage)

      return response.ok(cars)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener carros',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo carro
   * POST /cars
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

      // Datos específicos del carro
      const carData = request.only([
        'rentalCompany',
        'dailyRate',
        'insuranceType',
        'includesDriver',
      ])

      // Crear el vehículo base
      const vehicle = await Vehicle.create(
        {
          ...vehicleData,
          vehicleType: 'car',
          isActive: true,
        },
        { client: trx }
      )

      // Crear el carro con la referencia al vehículo
      const car = await Car.create(
        {
          ...carData,
          vehicleId: vehicle.id,
        },
        { client: trx }
      )

      await trx.commit()

      // Cargar la relación del vehículo
      await car.load('vehicle')

      return response.created({
        message: 'Carro registrado exitosamente',
        data: car,
      })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({
        message: 'Error al registrar carro',
        error: error.message,
      })
    }
  }

  /**
   * Obtener un carro específico
   * GET /cars/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const car = await Car.query().where('id', params.id).preload('vehicle').firstOrFail()

      return response.ok(car)
    } catch (error) {
      return response.notFound({
        message: 'Carro no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un carro
   * PUT /cars/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    const trx = await Database.transaction()
    try {
      const car = await Car.findOrFail(params.id)
      await car.load('vehicle')

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

      // Datos específicos del carro
      const carData = request.only([
        'rentalCompany',
        'dailyRate',
        'insuranceType',
        'includesDriver',
      ])

      // Actualizar el vehículo base
      car.vehicle.useTransaction(trx)
      car.vehicle.merge(vehicleData)
      await car.vehicle.save()

      // Actualizar el carro
      car.useTransaction(trx)
      car.merge(carData)
      await car.save()

      await trx.commit()

      await car.load('vehicle')

      return response.ok({
        message: 'Carro actualizado exitosamente',
        data: car,
      })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({
        message: 'Error al actualizar carro',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un carro
   * DELETE /cars/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    const trx = await Database.transaction()
    try {
      const car = await Car.findOrFail(params.id)
      await car.load('vehicle')

      // Eliminar el carro primero
      car.useTransaction(trx)
      await car.delete()

      // Luego eliminar el vehículo base
      car.vehicle.useTransaction(trx)
      await car.vehicle.delete()

      await trx.commit()

      return response.ok({
        message: 'Carro eliminado exitosamente',
      })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({
        message: 'Error al eliminar carro',
        error: error.message,
      })
    }
  }
}
