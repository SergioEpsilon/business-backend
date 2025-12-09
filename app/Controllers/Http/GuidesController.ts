import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Guide from 'App/Models/Guide'
import Database from '@ioc:Adonis/Lucid/Database'

export default class GuidesController {
  /**
   * Lista todos los guías
   * GET /guides
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const specialization = request.input('specialization')
      const isAvailable = request.input('is_available')

      const query = Guide.query()

      if (specialization) {
        query.where('specialization', 'like', `%${specialization}%`)
      }

      if (isAvailable !== undefined) {
        query.where('is_available', isAvailable === 'true')
      }

      const guides = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(guides)
    } catch (error) {
      return response.badRequest({ message: 'Error al obtener guías', error: error.message })
    }
  }

  /**
   * Crea un nuevo guía
   * POST /guides
   * El id debe ser el _id del usuario de MS-SECURITY
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'id',
        'document',
        'phone',
        'license_number',
        'specialization',
        'languages',
        'years_of_experience',
      ])

      // Validar que se envió el id (debe ser el _id del usuario de MS-SECURITY)
      if (!data.id) {
        return response.badRequest({
          message: 'El campo id es requerido (debe ser el _id del usuario de MS-SECURITY)',
        })
      }

      // Verificar que el guía no exista previamente
      const existingGuide = await Guide.find(data.id)
      if (existingGuide) {
        return response.conflict({
          message: 'Ya existe un guía con este ID',
          data: existingGuide,
        })
      }

      // Crear guía usando el MISMO ID del usuario de MS-SECURITY
      const guide = await Guide.create({
        id: data.id,
        document: data.document,
        phone: data.phone,
        licenseNumber: data.license_number,
        specialization: data.specialization,
        languages: JSON.stringify(data.languages), // Convertir array a JSON string
        yearsOfExperience: data.years_of_experience || 0,
        isAvailable: true,
      })

      return response.created({
        message: 'Guía registrado exitosamente',
        data: guide,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear guía',
        error: error.message,
      })
    }
  }

  /**
   * Muestra un guía específico
   * GET /guides/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const guide = await Guide.query()
        .where('id', params.id)
        .preload('touristActivities', (activitiesQuery) => {
          activitiesQuery.preload('municipality')
        })
        .firstOrFail()

      return response.ok(guide)
    } catch (error) {
      return response.notFound({
        message: 'Guía no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza un guía
   * PUT /guides/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const guide = await Guide.findOrFail(params.id)

      const data = request.only([
        'firstName',
        'lastName',
        'documentType',
        'documentNumber',
        'phone',
        'licenseNumber',
        'specialization',
        'languages',
        'yearsOfExperience',
        'isAvailable',
      ])

      // Convertir array de idiomas a JSON si existe
      if (data.languages && Array.isArray(data.languages)) {
        data.languages = JSON.stringify(data.languages)
      }

      guide.merge(data)
      await guide.save()

      return response.ok({
        message: 'Guía actualizado exitosamente',
        data: guide,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar guía',
        error: error.message,
      })
    }
  }

  /**
   * Elimina un guía
   * DELETE /guides/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const guide = await Guide.findOrFail(params.id)
      await guide.delete()

      return response.ok({
        message: 'Guía eliminado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar guía',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene las actividades de un guía
   * GET /guides/:id/activities
   */
  public async activities({ params, response }: HttpContextContract) {
    try {
      const guide = await Guide.findOrFail(params.id)
      await guide.load('touristActivities', (activitiesQuery) => {
        activitiesQuery.preload('municipality')
        activitiesQuery.orderBy('created_at', 'desc')
      })

      return response.ok(guide.touristActivities)
    } catch (error) {
      return response.notFound({
        message: 'Guía no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Cambia la disponibilidad de un guía
   * PATCH /guides/:id/toggle-availability
   */
  public async toggleAvailability({ params, response }: HttpContextContract) {
    try {
      const guide = await Guide.findOrFail(params.id)
      guide.isAvailable = !guide.isAvailable
      await guide.save()

      return response.ok({
        message: `Guía ${guide.isAvailable ? 'disponible' : 'no disponible'}`,
        data: guide,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al cambiar disponibilidad',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene guías disponibles
   * GET /guides/available
   */
  public async available({ response }: HttpContextContract) {
    try {
      const guides = await Guide.query().where('is_available', true).orderBy('first_name', 'asc')

      return response.ok(guides)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener guías disponibles',
        error: error.message,
      })
    }
  }
}
