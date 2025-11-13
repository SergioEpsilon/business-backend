import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Client from 'App/Models/Client'
import Guide from 'App/Models/Guide'
import Administrator from 'App/Models/Administrator'

export default class UsersController {
  /**
   * Lista todos los usuarios
   * GET /users
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const userType = request.input('user_type')
      const isActive = request.input('is_active')

      const query = User.query()

      if (userType) {
        query.where('user_type', userType)
      }

      if (isActive !== undefined) {
        query.where('is_active', isActive === 'true')
      }

      // Cargar relaciones según el tipo de usuario
      query.preload('client')
      query.preload('guide')
      query.preload('administrator')

      const users = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(users)
    } catch (error) {
      return response.badRequest({ message: 'Error al obtener usuarios', error: error.message })
    }
  }

  /**
   * Muestra un usuario específico
   * GET /users/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.query()
        .where('id', params.id)
        .preload('client', (clientQuery) => {
          clientQuery.preload('trips')
          clientQuery.preload('bankCards')
        })
        .preload('guide', (guideQuery) => {
          guideQuery.preload('touristActivities')
        })
        .preload('administrator')
        .firstOrFail()

      return response.ok(user)
    } catch (error) {
      return response.notFound({
        message: 'Usuario no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza un usuario
   * PUT /users/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)

      const data = request.only(['username', 'email', 'isActive'])

      user.merge(data)
      await user.save()

      return response.ok({
        message: 'Usuario actualizado exitosamente',
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar usuario',
        error: error.message,
      })
    }
  }

  /**
   * Cambia el estado de un usuario
   * PATCH /users/:id/toggle-status
   */
  public async toggleStatus({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      user.isActive = !user.isActive
      await user.save()

      return response.ok({
        message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`,
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al cambiar estado del usuario',
        error: error.message,
      })
    }
  }

  /**
   * Cambia la contraseña de un usuario
   * PATCH /users/:id/change-password
   */
  public async changePassword({ params, request, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      const { currentPassword, newPassword } = request.only(['currentPassword', 'newPassword'])

      // TODO: Verificar currentPassword con Hash.verify() en producción
      // if (!(await Hash.verify(user.password, currentPassword))) {
      //   return response.unauthorized({ message: 'Contraseña actual incorrecta' })
      // }

      // TODO: Hashear newPassword con Hash.make() en producción
      user.password = newPassword
      await user.save()

      return response.ok({
        message: 'Contraseña cambiada exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al cambiar contraseña',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene el perfil del usuario según su tipo
   * GET /users/:id/profile
   */
  public async profile({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)

      let profile

      switch (user.userType) {
        case 'client':
          profile = await Client.query()
            .where('user_id', user.id)
            .preload('trips', (tripsQuery) => {
              tripsQuery.preload('plans')
              tripsQuery.orderBy('created_at', 'desc')
            })
            .preload('bankCards', (cardsQuery) => {
              cardsQuery.where('is_active', true)
            })
            .firstOrFail()
          break

        case 'guide':
          profile = await Guide.query()
            .where('user_id', user.id)
            .preload('touristActivities', (activitiesQuery) => {
              activitiesQuery.preload('municipality')
            })
            .firstOrFail()
          break

        case 'administrator':
          profile = await Administrator.query().where('user_id', user.id).firstOrFail()
          break

        default:
          return response.badRequest({ message: 'Tipo de usuario no válido' })
      }

      return response.ok({
        user,
        profile,
      })
    } catch (error) {
      return response.notFound({
        message: 'Perfil de usuario no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene estadísticas de usuarios
   * GET /users/stats
   */
  public async stats({ response }: HttpContextContract) {
    try {
      const totalUsers = await User.query().count('* as total')
      const activeUsers = await User.query().where('is_active', true).count('* as total')
      const clients = await User.query().where('user_type', 'client').count('* as total')
      const guides = await User.query().where('user_type', 'guide').count('* as total')
      const administrators = await User.query()
        .where('user_type', 'administrator')
        .count('* as total')

      return response.ok({
        total: totalUsers[0].$extras.total,
        active: activeUsers[0].$extras.total,
        byType: {
          clients: clients[0].$extras.total,
          guides: guides[0].$extras.total,
          administrators: administrators[0].$extras.total,
        },
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener estadísticas',
        error: error.message,
      })
    }
  }
}
