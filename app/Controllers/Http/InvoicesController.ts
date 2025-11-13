import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Invoice from 'App/Models/Invoice'
import Installment from 'App/Models/Installment'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

export default class InvoicesController {
  /**
   * Lista todas las facturas
   * GET /invoices
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const status = request.input('status')
      const tripId = request.input('trip_id')

      const query = Invoice.query()
        .preload('trip', (tripQuery) => {
          tripQuery.preload('client')
        })
        .preload('bankCard')
        .preload('installments')

      if (status) {
        query.where('status', status)
      }

      if (tripId) {
        query.where('trip_id', tripId)
      }

      const invoices = await query.orderBy('created_at', 'desc').paginate(page, perPage)

      return response.ok(invoices)
    } catch (error) {
      return response.badRequest({ message: 'Error al obtener facturas', error: error.message })
    }
  }

  /**
   * Crea una nueva factura
   * POST /invoices
   */
  public async store({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      const {
        tripId,
        bankCardId,
        invoiceNumber,
        issueDate,
        dueDate,
        subtotal,
        tax,
        discount,
        paymentMethod,
        notes,
        createInstallments,
        numberOfInstallments,
      } = request.only([
        'tripId',
        'bankCardId',
        'invoiceNumber',
        'issueDate',
        'dueDate',
        'subtotal',
        'tax',
        'discount',
        'paymentMethod',
        'notes',
        'createInstallments',
        'numberOfInstallments',
      ])

      const totalAmount = subtotal + tax - discount
      const invoice = await Invoice.create(
        {
          tripId,
          bankCardId,
          invoiceNumber,
          issueDate: DateTime.fromISO(issueDate),
          dueDate: DateTime.fromISO(dueDate),
          subtotal,
          tax,
          discount,
          totalAmount,
          paidAmount: 0,
          balance: totalAmount,
          status: 'pending',
          paymentMethod,
          notes,
        },
        { client: trx }
      )

      // Crear cuotas si se solicitó
      if (createInstallments && numberOfInstallments > 0) {
        const installmentAmount = totalAmount / numberOfInstallments
        for (let i = 1; i <= numberOfInstallments; i++) {
          await Installment.create(
            {
              tripId,
              invoiceId: invoice.id,
              installmentNumber: i,
              amount: installmentAmount,
              dueDate: DateTime.fromISO(dueDate).plus({ months: i - 1 }),
              status: 'pending',
            },
            { client: trx }
          )
        }
      }

      await trx.commit()

      await invoice.load('trip')
      await invoice.load('installments')

      return response.created({
        message: 'Factura creada exitosamente',
        data: invoice,
      })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({
        message: 'Error al crear factura',
        error: error.message,
      })
    }
  }

  /**
   * Muestra una factura específica
   * GET /invoices/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const invoice = await Invoice.query()
        .where('id', params.id)
        .preload('trip', (tripQuery) => {
          tripQuery.preload('client', (clientQuery) => {
            clientQuery.preload('user')
          })
        })
        .preload('bankCard')
        .preload('installments', (installmentsQuery) => {
          installmentsQuery.orderBy('installment_number', 'asc')
        })
        .firstOrFail()

      return response.ok(invoice)
    } catch (error) {
      return response.notFound({
        message: 'Factura no encontrada',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza una factura
   * PUT /invoices/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const invoice = await Invoice.findOrFail(params.id)

      const data = request.only([
        'bankCardId',
        'dueDate',
        'subtotal',
        'tax',
        'discount',
        'status',
        'paymentMethod',
        'notes',
      ])

      // Recalcular totales si cambian los montos
      if (data.subtotal !== undefined || data.tax !== undefined || data.discount !== undefined) {
        const subtotal = data.subtotal !== undefined ? data.subtotal : invoice.subtotal
        const tax = data.tax !== undefined ? data.tax : invoice.tax
        const discount = data.discount !== undefined ? data.discount : invoice.discount

        invoice.subtotal = subtotal
        invoice.tax = tax
        invoice.discount = discount
        invoice.totalAmount = subtotal + tax - discount
        invoice.balance = invoice.totalAmount - invoice.paidAmount
      }

      // Actualizar otros campos
      if (data.bankCardId !== undefined) invoice.bankCardId = data.bankCardId
      if (data.dueDate !== undefined) invoice.dueDate = DateTime.fromISO(data.dueDate)
      if (data.status !== undefined) invoice.status = data.status
      if (data.paymentMethod !== undefined) invoice.paymentMethod = data.paymentMethod
      if (data.notes !== undefined) invoice.notes = data.notes

      await invoice.save()

      return response.ok({
        message: 'Factura actualizada exitosamente',
        data: invoice,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar factura',
        error: error.message,
      })
    }
  }

  /**
   * Elimina una factura
   * DELETE /invoices/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const invoice = await Invoice.findOrFail(params.id)
      await invoice.delete()

      return response.ok({
        message: 'Factura eliminada exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar factura',
        error: error.message,
      })
    }
  }

  /**
   * Registra un pago en una factura
   * POST /invoices/:id/payment
   */
  public async registerPayment({ params, request, response }: HttpContextContract) {
    try {
      const invoice = await Invoice.findOrFail(params.id)
      const { amount, paymentMethod } = request.only(['amount', 'paymentMethod'])

      if (amount <= 0) {
        return response.badRequest({ message: 'El monto debe ser mayor a 0' })
      }

      if (amount > invoice.balance) {
        return response.badRequest({ message: 'El monto excede el saldo pendiente' })
      }

      invoice.paidAmount += amount
      invoice.balance -= amount

      if (invoice.balance === 0) {
        invoice.status = 'paid'
      } else if (invoice.paidAmount > 0) {
        invoice.status = 'partial'
      }

      if (paymentMethod) {
        invoice.paymentMethod = paymentMethod
      }

      await invoice.save()

      return response.ok({
        message: 'Pago registrado exitosamente',
        data: invoice,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al registrar pago',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene las cuotas de una factura
   * GET /invoices/:id/installments
   */
  public async installments({ params, response }: HttpContextContract) {
    try {
      const invoice = await Invoice.findOrFail(params.id)
      await invoice.load('installments', (installmentsQuery) => {
        installmentsQuery.orderBy('installment_number', 'asc')
      })

      return response.ok(invoice.installments)
    } catch (error) {
      return response.notFound({
        message: 'Factura no encontrada',
        error: error.message,
      })
    }
  }

  /**
   * Marca una factura como vencida
   * PATCH /invoices/:id/mark-overdue
   */
  public async markOverdue({ params, response }: HttpContextContract) {
    try {
      const invoice = await Invoice.findOrFail(params.id)

      if (invoice.status === 'paid') {
        return response.badRequest({ message: 'La factura ya está pagada' })
      }

      invoice.status = 'overdue'
      await invoice.save()

      return response.ok({
        message: 'Factura marcada como vencida',
        data: invoice,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al marcar factura como vencida',
        error: error.message,
      })
    }
  }
}
