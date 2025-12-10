import { BaseCommand } from '@adonisjs/core/build/standalone'
import Installment from 'App/Models/Installment'
import NotificationService from 'App/Services/NotificationService'
import UserService from 'App/Services/UserService'
import { DateTime } from 'luxon'

export default class SendPaymentReminders extends BaseCommand {
  /**
   * Nombre del comando
   */
  public static commandName = 'reminders:send'

  /**
   * Descripción del comando
   */
  public static description = 'Envía recordatorios de pago a clientes con cuotas por vencer'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    this.logger.info('🔔 Iniciando envío de recordatorios de pago...')

    try {
      // Cuotas que vencen en los próximos 7 días
      const daysAhead = 7
      const futureDate = DateTime.now().plus({ days: daysAhead }).toSQLDate()

      const installments = await Installment.query()
        .where('status', 'pending')
        .where('due_date', '<=', futureDate)
        .where('due_date', '>=', DateTime.now().toSQLDate())
        .preload('trip', (tripQuery) => {
          tripQuery.preload('clients')
        })

      this.logger.info(`📧 Encontradas ${installments.length} cuotas por vencer`)

      let sentCount = 0
      let errorCount = 0

      for (const installment of installments) {
        try {
          const clients = installment.trip.clients || []

          for (const client of clients) {
            try {
              const userInfo = await UserService.getUserInfo(client.id)

              if (userInfo?.email) {
                const result = await NotificationService.notifyInstallmentReminder(userInfo.email, {
                  amount: installment.amount,
                  dueDate: installment.dueDate.toFormat('dd/MM/yyyy'),
                  installmentNumber: installment.installmentNumber,
                  totalInstallments: 1,
                })

                if (result.success) {
                  sentCount++
                  this.logger.success(`✅ Recordatorio enviado a: ${userInfo.email}`)
                } else {
                  errorCount++
                  this.logger.error(`❌ Error enviando a ${userInfo.email}: ${result.message}`)
                }
              }
            } catch (clientError) {
              errorCount++
              this.logger.error(`❌ Error procesando cliente ${client.id}:`, clientError.message)
            }
          }
        } catch (installmentError) {
          errorCount++
          this.logger.error(`❌ Error procesando cuota ${installment.id}:`, installmentError.message)
        }
      }

      this.logger.info(`
📊 Resumen:
  ✅ Enviados: ${sentCount}
  ❌ Errores: ${errorCount}
  📧 Total procesados: ${installments.length}
      `)

      this.logger.success('✅ Proceso completado')
    } catch (error) {
      this.logger.error('💥 Error crítico:', error.message)
      this.exitCode = 1
    }
  }
}
