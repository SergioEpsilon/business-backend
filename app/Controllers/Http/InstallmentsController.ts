import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Installment from 'App/Models/Installment'
import { DateTime } from 'luxon'

export default class InstallmentsController {
  /**
   * Lista todas las cuotas
   * GET /installments
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const status = request.input('status')
      const tripId = request.input('trip_id')

      const query = Installment.query()
        .preload('trip', (tripQuery) => {
          tripQuery.preload('clients')
        })
        .preload('invoice')

      if (status) {
        query.where('status', status)
      }

      if (tripId) {
        query.where('trip_id', tripId)
      }

      const installments = await query.orderBy('due_date', 'asc').paginate(page, perPage)

      return response.ok(installments)
    } catch (error) {
      return response.badRequest({ message: 'Error al obtener cuotas', error: error.message })
    }
  }

  /**
   * Crea una nueva cuota
   * POST /installments
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'tripId',
        'invoiceId',
        'installmentNumber',
        'amount',
        'dueDate',
        'status',
      ])

      const installment = await Installment.create(data)
      await installment.load('trip')
      await installment.load('invoice')

      return response.created({
        message: 'Cuota creada exitosamente',
        data: installment,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear cuota',
        error: error.message,
      })
    }
  }

  /**
   * Muestra una cuota específica
   * GET /installments/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const installment = await Installment.query()
        .where('id', params.id)
        .preload('trip', (tripQuery) => {
          tripQuery.preload('clients')
        })
        .preload('invoice')
        .firstOrFail()

      return response.ok(installment)
    } catch (error) {
      return response.notFound({
        message: 'Cuota no encontrada',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza una cuota
   * PUT /installments/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const installment = await Installment.findOrFail(params.id)

      const data = request.only(['amount', 'dueDate', 'status', 'notes'])

      installment.merge(data)
      await installment.save()

      return response.ok({
        message: 'Cuota actualizada exitosamente',
        data: installment,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar cuota',
        error: error.message,
      })
    }
  }

  /**
   * Elimina una cuota
   * DELETE /installments/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const installment = await Installment.findOrFail(params.id)
      await installment.delete()

      return response.ok({
        message: 'Cuota eliminada exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar cuota',
        error: error.message,
      })
    }
  }

  /**
   * Registra el pago de una cuota
   * POST /installments/:id/pay
   */
  public async pay({ params, request, response }: HttpContextContract) {
    try {
      const installment = await Installment.findOrFail(params.id)

      if (installment.status === 'paid') {
        return response.badRequest({ message: 'Esta cuota ya está pagada' })
      }

      const { paymentMethod, transactionReference } = request.only([
        'paymentMethod',
        'transactionReference',
      ])

      installment.status = 'paid'
      installment.paidDate = DateTime.now()
      installment.paymentMethod = paymentMethod
      installment.transactionReference = transactionReference

      await installment.save()

      return response.ok({
        message: 'Pago de cuota registrado exitosamente',
        data: installment,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al registrar pago',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene cuotas vencidas
   * GET /installments/overdue
   */
  public async overdue({ response }: HttpContextContract) {
    try {
      const installments = await Installment.query()
        .where('status', '!=', 'paid')
        .where('due_date', '<', DateTime.now().toSQLDate())
        .preload('trip', (tripQuery) => {
          tripQuery.preload('clients')
        })
        .orderBy('due_date', 'asc')

      return response.ok(installments)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener cuotas vencidas',
        error: error.message,
      })
    }
  }

  /**
   * Marca cuotas vencidas
   * PATCH /installments/mark-overdue
   */
  public async markOverdue({ response }: HttpContextContract) {
    try {
      const updated = await Installment.query()
        .where('status', 'pending')
        .where('due_date', '<', DateTime.now().toSQLDate())
        .update({ status: 'overdue' })

      return response.ok({
        message: `${updated} cuota(s) marcada(s) como vencida(s)`,
        count: updated,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al marcar cuotas vencidas',
        error: error.message,
      })
    }
  }
}
