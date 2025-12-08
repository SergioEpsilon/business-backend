import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hotel from 'App/Models/Hotel'

export default class HotelsController {
  /**
   * GET /api/v1/hotels
   * Obtener todos los hoteles con paginación
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('perPage', 10)

      const hotels = await Hotel.query()
        .preload('rooms')
        .paginate(page, perPage)

      return response.ok({
        meta: hotels.getMeta(),
        data: hotels.all(),
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener hoteles',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/v1/hotels/:id
   * Obtener un hotel por ID
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const hotel = await Hotel.query()
        .where('id', params.id)
        .preload('rooms')
        .firstOrFail()

      return response.ok({
        data: hotel,
      })
    } catch (error) {
      return response.notFound({
        message: 'Hotel no encontrado',
      })
    }
  }

  /**
   * POST /api/v1/hotels
   * Crear un nuevo hotel
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      // 🚨 MODO TESTING: Simplificar creación de hotel
      console.log('⚠️ HotelsController.store - TESTING MODE')

      const data = request.only([
        'name',
        'address',
        'phone',
        'email',
        'website',
        'stars',
        'description',
        'amenities',
        'hasParking',
        'hasPool',
        'hasRestaurant',
        'hasWifi',
        'hasGym',
        'isActive',
      ])

      // Verificar/crear municipio si no existe
      const Municipality = (await import('App/Models/Municipality')).default
      let municipality = await Municipality.find(1)
      if (!municipality) {
        console.log('⚠️ Municipio no existe, creando Cartagena...')
        municipality = await Municipality.create({
          name: 'Cartagena',
          department: 'Bolívar',
          country: 'Colombia', // Campo requerido
        })
      }

      const hotel = await Hotel.create({
        municipalityId: municipality.id,
        name: data.name || 'Hotel Sin Nombre',
        address: data.address || 'Dirección por defecto',
        phone: data.phone || '3000000000',
        email: data.email || 'hotel@example.com',
        website: data.website || null,
        stars: data.stars || 3,
        description: data.description || '',
        amenities: data.amenities || '',
        hasParking: data.hasParking !== undefined ? data.hasParking : false,
        hasPool: data.hasPool !== undefined ? data.hasPool : false,
        hasRestaurant: data.hasRestaurant !== undefined ? data.hasRestaurant : false,
        hasWifi: data.hasWifi !== undefined ? data.hasWifi : true,
        hasGym: data.hasGym !== undefined ? data.hasGym : false,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })

      return response.created({
        message: 'Hotel creado exitosamente',
        data: hotel,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear hotel',
        error: error.message,
      })
    }
  }

  /**
   * PUT /api/v1/hotels/:id
   * Actualizar un hotel
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      console.log('⚠️ HotelsController.update - TESTING MODE')

      const hotel = await Hotel.findOrFail(params.id)

      const data = request.only([
        'name',
        'address',
        'phone',
        'email',
        'website',
        'stars',
        'description',
        'amenities',
        'hasParking',
        'hasPool',
        'hasRestaurant',
        'hasWifi',
        'hasGym',
        'isActive',
      ])

      hotel.merge(data)
      await hotel.save()

      return response.ok({
        message: 'Hotel actualizado exitosamente',
        data: hotel,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar hotel',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /api/v1/hotels/:id
   * Eliminar un hotel
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      console.log('⚠️ HotelsController.destroy - TESTING MODE')

      const hotel = await Hotel.findOrFail(params.id)
      await hotel.delete()

      return response.ok({
        message: 'Hotel eliminado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar hotel',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/v1/hotels/:id/rooms
   * Obtener todas las habitaciones de un hotel
   */
  public async rooms({ params, response }: HttpContextContract) {
    try {
      const hotel = await Hotel.findOrFail(params.id)
      await hotel.load('rooms')

      return response.ok({
        data: hotel.rooms,
      })
    } catch (error) {
      return response.notFound({
        message: 'Hotel no encontrado',
      })
    }
  }
}
