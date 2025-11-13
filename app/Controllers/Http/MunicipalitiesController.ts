import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Municipality from 'App/Models/Municipality'

export default class MunicipalitiesController {
  /**
   * Lista todos los municipios
   * GET /municipalities
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const department = request.input('department')
      const country = request.input('country')

      const query = Municipality.query()

      if (department) {
        query.where('department', 'like', `%${department}%`)
      }

      if (country) {
        query.where('country', country)
      }

      const municipalities = await query.orderBy('name', 'asc').paginate(page, perPage)

      return response.ok(municipalities)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener municipios',
        error: error.message,
      })
    }
  }

  /**
   * Crea un nuevo municipio
   * POST /municipalities
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'name',
        'department',
        'country',
        'population',
        'area',
        'latitude',
        'longitude',
        'description',
        'climate',
        'altitude',
      ])

      const municipality = await Municipality.create(data)

      return response.created({
        message: 'Municipio creado exitosamente',
        data: municipality,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear municipio',
        error: error.message,
      })
    }
  }

  /**
   * Muestra un municipio específico
   * GET /municipalities/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const municipality = await Municipality.query()
        .where('id', params.id)
        .preload('touristActivities', (activitiesQuery) => {
          activitiesQuery.where('is_active', true)
          activitiesQuery.preload('guide')
        })
        .firstOrFail()

      return response.ok(municipality)
    } catch (error) {
      return response.notFound({
        message: 'Municipio no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza un municipio
   * PUT /municipalities/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const municipality = await Municipality.findOrFail(params.id)

      const data = request.only([
        'name',
        'department',
        'country',
        'population',
        'area',
        'latitude',
        'longitude',
        'description',
        'climate',
        'altitude',
      ])

      municipality.merge(data)
      await municipality.save()

      return response.ok({
        message: 'Municipio actualizado exitosamente',
        data: municipality,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar municipio',
        error: error.message,
      })
    }
  }

  /**
   * Elimina un municipio
   * DELETE /municipalities/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const municipality = await Municipality.findOrFail(params.id)
      await municipality.delete()

      return response.ok({
        message: 'Municipio eliminado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar municipio',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene las actividades turísticas de un municipio
   * GET /municipalities/:id/activities
   */
  public async activities({ params, response }: HttpContextContract) {
    try {
      const municipality = await Municipality.findOrFail(params.id)
      await municipality.load('touristActivities', (activitiesQuery) => {
        activitiesQuery.preload('guide')
      })

      return response.ok(municipality.touristActivities)
    } catch (error) {
      return response.notFound({
        message: 'Municipio no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Busca municipios por nombre
   * GET /municipalities/search
   */
  public async search({ request, response }: HttpContextContract) {
    try {
      const { query } = request.only(['query'])

      if (!query || query.length < 2) {
        return response.badRequest({ message: 'La búsqueda debe tener al menos 2 caracteres' })
      }

      const municipalities = await Municipality.query()
        .where('name', 'like', `%${query}%`)
        .orWhere('department', 'like', `%${query}%`)
        .orderBy('name', 'asc')
        .limit(10)

      return response.ok(municipalities)
    } catch (error) {
      return response.badRequest({
        message: 'Error al buscar municipios',
        error: error.message,
      })
    }
  }
}
