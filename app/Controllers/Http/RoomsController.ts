import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Room from 'App/Models/Room'
import RoomValidator from 'App/Validators/RoomValidator'

export default class RoomsController {
  /**
   * GET /api/v1/rooms
   * Obtener todas las habitaciones con paginación
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('perPage', 10)

      const rooms = await Room.query().preload('hotel').paginate(page, perPage)

      return response.ok({
        meta: rooms.getMeta(),
        data: rooms.all(),
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener habitaciones',
        error: error.message,
      })
    }
  }

  /**
   * POST /api/v1/rooms
   * Crear una nueva habitación
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      // 🚨 MODO TESTING: Simplificar creación de habitación
      console.log('⚠️ RoomsController.store - TESTING MODE')

      const data = request.only([
        'hotelId',
        'roomNumber',
        'roomType',
        'capacity',
        'pricePerNight',
        'isAvailable',
        'floor',
        'hasBalcony',
        'hasKitchen',
        'hasAirConditioning',
        'description',
        'amenities',
        'numBeds',
        'bedType',
      ])

      // Mapeo de roomType español → inglés
      const roomTypeMap = {
        individual: 'single',
        doble: 'double',
        triple: 'triple',
        suite: 'suite',
        familiar: 'family',
      }

      // Mapeo de bedType español → inglés
      const bedTypeMap = {
        individual: 'single',
        doble: 'double',
        queen: 'queen',
        king: 'king',
      }

      const validRoomType = roomTypeMap[data.roomType] || data.roomType || 'double'
      const validBedType = bedTypeMap[data.bedType] || data.bedType || 'double'

      const room = await Room.create({
        hotelId: data.hotelId,
        roomNumber: data.roomNumber,
        roomType: validRoomType,
        capacity: data.capacity || 2,
        numBeds: data.numBeds || 2, // Campo requerido
        bedType: validBedType, // Campo requerido
        pricePerNight: data.pricePerNight || 0,
        description: data.description || '',
        hasBathroom: true, // Por defecto true
        hasTv: true,
        hasMinibar: false,
        hasBalcony: data.hasBalcony !== undefined ? data.hasBalcony : false,
        hasAirConditioning: data.hasAirConditioning !== undefined ? data.hasAirConditioning : true,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      })

      await room.load('hotel')

      return response.created({
        message: 'Habitación creada exitosamente',
        data: room,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear habitación',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/v1/rooms/:id
   * Obtener una habitación por ID
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const room = await Room.query()
        .where('id', params.id)
        .preload('hotel')
        .preload('trips')
        .firstOrFail()

      return response.ok({
        data: room,
      })
    } catch (error) {
      return response.notFound({
        message: 'Habitación no encontrada',
      })
    }
  }

  /**
   * PUT /api/v1/rooms/:id
   * Actualizar una habitación
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const room = await Room.findOrFail(params.id)
      const payload = await request.validate(RoomValidator)

      room.merge(payload)
      await room.save()
      await room.load('hotel')

      return response.ok({
        message: 'Habitación actualizada exitosamente',
        data: room,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar habitación',
        error: error.messages || error.message,
      })
    }
  }

  /**
   * DELETE /api/v1/rooms/:id
   * Eliminar una habitación
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const room = await Room.findOrFail(params.id)
      await room.delete()

      return response.ok({
        message: 'Habitación eliminada exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar habitación',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/v1/rooms/hotel/:hotelId
   * Obtener todas las habitaciones de un hotel
   */
  public async byHotel({ params, response }: HttpContextContract) {
    try {
      const rooms = await Room.query().where('hotelId', params.hotelId).preload('hotel')

      return response.ok({
        data: rooms,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener habitaciones del hotel',
        error: error.message,
      })
    }
  }
}
