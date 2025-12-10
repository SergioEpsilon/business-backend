import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Installment from 'App/Models/Installment'
import { DateTime } from 'luxon'
import NotificationService from 'App/Services/NotificationService'
import UserService from 'App/Services/UserService'

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
      console.log('⚠️ InstallmentsController.store - TESTING MODE')

      const data = request.only([
        'tripId',
        'invoiceId',
        'installmentNumber',
        'amount',
        'dueDate',
        'status',
        'notes',
      ])

      // Mapeo de status español a inglés
      const statusMap = {
        pendiente: 'pending',
        pagado: 'paid',
        pagada: 'paid',
        vencido: 'overdue',
        vencida: 'overdue',
        cancelado: 'cancelled',
        cancelada: 'cancelled',
      }
      const status = statusMap[data.status?.toLowerCase()] || data.status || 'pending'

      // Generar installmentNumber si no existe - usar número secuencial pequeño
      let installmentNumber = data.installmentNumber
      if (!installmentNumber) {
        // Contar cuántas cuotas tiene este viaje para asignar número secuencial
        const tripId = data.tripId || 1
        const count = await Installment.query().where('trip_id', tripId).count('* as total')
        installmentNumber = (count[0].$extras.total || 0) + 1
      }

      // Verificar si el invoiceId existe, si no, crear uno automáticamente
      let invoiceId = data.invoiceId
      if (invoiceId) {
        const Invoice = (await import('App/Models/Invoice')).default
        const invoiceExists = await Invoice.find(invoiceId)

        if (!invoiceExists) {
          // Crear factura automáticamente para testing
          const newInvoice = await Invoice.create({
            tripId: data.tripId || 1,
            invoiceNumber: `INV-${Date.now()}`,
            issueDate: DateTime.now(),
            dueDate: data.dueDate
              ? DateTime.fromISO(data.dueDate)
              : DateTime.now().plus({ days: 30 }),
            subtotal: data.amount || 0,
            tax: 0,
            discount: 0,
            totalAmount: data.amount || 0,
            paidAmount: 0,
            balance: data.amount || 0,
            status: 'pending',
            notes: 'Factura generada automáticamente',
          })
          invoiceId = newInvoice.id
        }
      }

      const installment = await Installment.create({
        tripId: data.tripId || 1,
        invoiceId: invoiceId || null, // Puede ser null
        installmentNumber: installmentNumber,
        amount: data.amount || 0,
        dueDate: data.dueDate || DateTime.now().plus({ days: 30 }).toSQLDate(),
        status: status,
        notes: data.notes || '',
      })

      await installment.load('trip')
      if (installment.invoiceId) {
        await installment.load('invoice')
      }

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

  /**
   * Envía recordatorio de pago a cuotas pendientes que vencen pronto
   * POST /installments/send-reminders
   */
  public async sendReminders({ request, response }: HttpContextContract) {
    try {
      const daysAhead = request.input('days_ahead', 7) // Cuotas que vencen en los próximos X días
      const token = request.header('Authorization')?.replace('Bearer ', '')

      // Obtener cuotas pendientes que vencen pronto
      const futureDate = DateTime.now().plus({ days: daysAhead }).toSQLDate()
      const installments = await Installment.query()
        .where('status', 'pending')
        .where('due_date', '<=', futureDate)
        .where('due_date', '>=', DateTime.now().toSQLDate())
        .preload('trip', (tripQuery) => {
          tripQuery.preload('clients')
        })

      console.log(`📧 Enviando recordatorios para ${installments.length} cuotas`)

      let sentCount = 0
      let errorCount = 0

      for (const installment of installments) {
        try {
          // Obtener clientes del viaje
          const clients = installment.trip.clients || []

          for (const client of clients) {
            try {
              const userInfo = await UserService.getUserInfo(client.id, token)

              if (userInfo?.email) {
                const result = await NotificationService.notifyInstallmentReminder(userInfo.email, {
                  amount: installment.amount,
                  dueDate: installment.dueDate.toFormat('dd/MM/yyyy'),
                  installmentNumber: installment.installmentNumber,
                  totalInstallments: 1, // TODO: calcular total de cuotas del viaje
                })

                if (result.success) {
                  sentCount++
                  console.log(`✅ Recordatorio enviado a: ${userInfo.email}`)
                } else {
                  errorCount++
                  console.error(`❌ Error enviando a ${userInfo.email}:`, result.message)
                }
              }
            } catch (clientError) {
              errorCount++
              console.error(`❌ Error procesando cliente ${client.id}:`, clientError.message)
            }
          }
        } catch (installmentError) {
          errorCount++
          console.error(
            `❌ Error procesando cuota ${installment.id}:`,
            installmentError.message
          )
        }
      }

      return response.ok({
        message: 'Recordatorios procesados',
        sent: sentCount,
        errors: errorCount,
        total: installments.length,
      })
    } catch (error) {
      console.error('❌ Error enviando recordatorios:', error.message)
      return response.badRequest({
        message: 'Error al enviar recordatorios',
        error: error.message,
      })
    }
  }

  /**
   * Envía recordatorio de pago a una cuota específica
   * POST /installments/:id/send-reminder
   */
  public async sendSingleReminder({ params, request, response }: HttpContextContract) {
    try {
      const installment = await Installment.query()
        .where('id', params.id)
        .preload('trip', (tripQuery) => {
          tripQuery.preload('clients')
        })
        .firstOrFail()

      const token = request.header('Authorization')?.replace('Bearer ', '')
      const clients = installment.trip.clients || []

      if (clients.length === 0) {
        return response.badRequest({
          message: 'No hay clientes asociados a este viaje',
        })
      }

      let sentCount = 0
      const errors: string[] = []

      for (const client of clients) {
        try {
          const userInfo = await UserService.getUserInfo(client.id, token)

          if (userInfo?.email) {
            const result = await NotificationService.notifyInstallmentReminder(userInfo.email, {
              amount: installment.amount,
              dueDate: installment.dueDate.toFormat('dd/MM/yyyy'),
              installmentNumber: installment.installmentNumber,
              totalInstallments: 1,
            })

            if (result.success) {
              sentCount++
            } else {
              errors.push(`${userInfo.email}: ${result.message}`)
            }
          }
        } catch (clientError) {
          errors.push(`Cliente ${client.id}: ${clientError.message}`)
        }
      }

      return response.ok({
        message: `Recordatorio enviado a ${sentCount} cliente(s)`,
        sent: sentCount,
        errors: errors.length > 0 ? errors : undefined,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al enviar recordatorio',
        error: error.message,
      })
    }
  }
}

