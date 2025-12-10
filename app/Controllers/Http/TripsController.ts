import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Trip from 'App/Models/Trip'
import TripValidator from 'App/Validators/TripValidator'
import NotificationService from 'App/Services/NotificationService'
import UserService from 'App/Services/UserService'

export default class TripsController {
  /**
   * Lista todos los viajes
   */
  public async index({ request }: HttpContextContract) {
    const data = request.all()
    if ('page' in data && 'per_page' in data) {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      return await Trip.query().paginate(page, perPage)
    }
    return await Trip.all()
  }

  /**
   * Almacena la información de un viaje
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      // 🚨 MODO TESTING: Simplificar creación de viaje
      console.log('⚠️ TripsController.store - TESTING MODE')

      const data = request.only(['destination', 'startDate', 'endDate', 'numPassengers', 'status'])

      // Generar trip_code único
      const tripCode = `TRIP-${Date.now()}`

      // Validar que el status sea uno de los valores permitidos
      const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
      const validStatus = validStatuses.includes(data.status) ? data.status : 'pending'

      // Convertir fechas de ISO a formato MySQL (YYYY-MM-DD)
      const formatDate = (dateString: string) => {
        if (!dateString) return undefined
        const date = new Date(dateString)
        return date.toISOString().split('T')[0] // Extrae solo YYYY-MM-DD
      }

      // Crear viaje con valores por defecto para testing
      const trip = await Trip.create({
        tripCode: tripCode,
        destination: data.destination,
        startDate: formatDate(data.startDate) as any,
        endDate: formatDate(data.endDate) as any,
        numberOfPassengers: data.numPassengers || 1,
        totalPrice: 0, // Precio por defecto
        status: validStatus,
        paymentStatus: 'pending',
      })

      // 📧 Enviar notificación por email al cliente (si tiene clientId)
      const clientId = request.input('clientId')
      if (clientId) {
        try {
          const token = request.header('Authorization')?.replace('Bearer ', '')
          const userInfo = await UserService.getUserInfo(clientId, token)
          
          if (userInfo?.email) {
            await NotificationService.notifyTripCreated(userInfo.email, {
              destination: trip.destination,
              startDate: trip.startDate.toString(),
              endDate: trip.endDate.toString(),
              totalAmount: trip.totalPrice || 0,
            })
            console.log('✅ Notificación de viaje enviada a:', userInfo.email)
          }
        } catch (notifError) {
          console.error('⚠️ Error enviando notificación:', notifError.message)
          // No fallar la creación del viaje si falla la notificación
        }
      }

      return response.created({
        message: 'Viaje creado exitosamente',
        data: trip,
      })
    } catch (error) {
      console.error('Error al crear viaje:', error)
      return response.badRequest({
        message: 'Error al crear viaje',
        error: error.message,
      })
    }
  }

  /**
   * Muestra la información de un solo viaje
   */
  public async show({ params }: HttpContextContract) {
    const theTrip: Trip = await Trip.findOrFail(params.id)
    await theTrip.load('clients')
    return theTrip
  }

  /**
   * Actualiza la información de un viaje basado
   * en el identificador y nuevos parámetros
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const theTrip: Trip = await Trip.findOrFail(params.id)
      const body = request.body()

      // Función helper para convertir fecha ISO a formato MySQL (YYYY-MM-DD)
      const formatDate = (dateString: string) => {
        if (!dateString) return undefined
        const date = new Date(dateString)
        return date.toISOString().split('T')[0] // Extrae solo YYYY-MM-DD
      }

      const oldStatus = theTrip.status
      
      if (body.destination) theTrip.destination = body.destination
      if (body.description) theTrip.description = body.description
      if (body.startDate) theTrip.startDate = formatDate(body.startDate) as any
      if (body.endDate) theTrip.endDate = formatDate(body.endDate) as any
      if (body.price !== undefined) theTrip.price = body.price
      if (body.capacity !== undefined) theTrip.capacity = body.capacity
      if (body.status) theTrip.status = body.status

      await theTrip.save()

      // 📧 Notificar cambio de estado a los clientes asociados
      if (body.status && body.status !== oldStatus) {
        try {
          await theTrip.load('clients')
          const token = request.header('Authorization')?.replace('Bearer ', '')
          
          for (const client of theTrip.clients) {
            try {
              const userInfo = await UserService.getUserInfo(client.id, token)
              if (userInfo?.email) {
                await NotificationService.notifyTripStatusChange(userInfo.email, {
                  destination: theTrip.destination,
                  newStatus: theTrip.status,
                  message: body.statusMessage,
                })
                console.log('✅ Notificación de cambio de estado enviada a:', userInfo.email)
              }
            } catch (clientNotifError) {
              console.error('⚠️ Error notificando cliente:', clientNotifError.message)
            }
          }
        } catch (notifError) {
          console.error('⚠️ Error enviando notificaciones:', notifError.message)
        }
      }

      return response.ok({
        message: 'Viaje actualizado exitosamente',
        data: theTrip,
      })
    } catch (error) {
      console.error('Error al actualizar viaje:', error.message)
      return response.badRequest({
        message: 'Error al actualizar viaje',
        error: error.message,
      })
    }
  }

  /**
   * Elimina a un viaje basado en el identificador
   */
  public async destroy({ params }: HttpContextContract) {
    const theTrip: Trip = await Trip.findOrFail(params.id)
    return await theTrip.delete()
  }

  public async attachClient({ params, response }: HttpContextContract) {
    const trip: Trip = await Trip.findOrFail(params.id)
    const clientId = params.clientId

    // Asociar el cliente al viaje (many-to-many)
    await trip.related('clients').attach([clientId])

    return response.ok({ message: 'Client attached to trip successfully' })
  }

  public async detachClient({ params, response }: HttpContextContract) {
    const trip: Trip = await Trip.findOrFail(params.id)
    const clientId = params.clientId

    // Desasociar el cliente del viaje
    await trip.related('clients').detach([clientId])

    return response.ok({ message: 'Client detached from trip successfully' })
  }

  public async clients({ params }: HttpContextContract) {
    const theTrip: Trip = await Trip.findOrFail(params.id)
    await theTrip.load('clients')
    return theTrip.clients
  }

  /**
   * Asocia un trayecto a un viaje
   * POST /trips/:id/routes/:routeId
   */
  public async attachRoute({ params, response }: HttpContextContract) {
    const trip: Trip = await Trip.findOrFail(params.id)
    const routeId = params.routeId

    await trip.related('routes').attach([routeId])

    return response.ok({ message: 'Route attached to trip successfully' })
  }

  /**
   * Desasocia un trayecto de un viaje
   * DELETE /trips/:id/routes/:routeId
   */
  public async detachRoute({ params, response }: HttpContextContract) {
    const trip: Trip = await Trip.findOrFail(params.id)
    const routeId = params.routeId

    await trip.related('routes').detach([routeId])

    return response.ok({ message: 'Route detached from trip successfully' })
  }

  /**
   * Obtiene los trayectos de un viaje
   * GET /trips/:id/routes
   */
  public async routes({ params }: HttpContextContract) {
    const theTrip: Trip = await Trip.findOrFail(params.id)
    await theTrip.load('routes')
    return theTrip.routes
  }
}
