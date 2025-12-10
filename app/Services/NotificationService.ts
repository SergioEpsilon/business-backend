import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

/**
 * Servicio para enviar notificaciones a través del microservicio de notificaciones
 */
export default class NotificationService {
  private static readonly MS_NOTIFICATIONS_URL =
    Env.get('MS_NOTIFICATIONS') || 'http://127.0.0.1:5000'

  /**
   * Enviar email a un destinatario
   */
  public static async sendEmail(
    to: string,
    subject: string,
    message: string,
    sender: string = 'no-reply@agenciaviajes.com'
  ): Promise<{
    success: boolean
    message: string
    data?: any
  }> {
    try {
      console.log('📧 Enviando email a:', to)
      console.log('📝 Asunto:', subject)

      const response = await axios.post(
        `${this.MS_NOTIFICATIONS_URL}/send-email`,
        {
          sender,
          to,
          subject,
          message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 segundos
        }
      )

      console.log('✅ Email enviado exitosamente')
      return {
        success: true,
        message: 'Email enviado correctamente',
        data: response.data,
      }
    } catch (error) {
      console.error('❌ Error enviando email:', error.message)
      return {
        success: false,
        message: `Error enviando email: ${error.message}`,
      }
    }
  }

  /**
   * Enviar SMS a un número de teléfono
   */
  public static async sendSMS(
    phone: string,
    message: string
  ): Promise<{
    success: boolean
    message: string
    data?: any
  }> {
    try {
      console.log('📱 Enviando SMS a:', phone)
      console.log('📝 Mensaje:', message)

      const response = await axios.post(
        `${this.MS_NOTIFICATIONS_URL}/send-sms`,
        {
          phone,
          message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      )

      console.log('✅ SMS enviado exitosamente')
      return {
        success: true,
        message: 'SMS enviado correctamente',
        data: response.data,
      }
    } catch (error) {
      console.error('❌ Error enviando SMS:', error.message)
      return {
        success: false,
        message: `Error enviando SMS: ${error.message}`,
      }
    }
  }

  /**
   * Enviar email a múltiples destinatarios
   */
  public static async sendBulkEmail(
    recipients: string[],
    subject: string,
    message: string,
    sender: string = 'no-reply@agenciaviajes.com'
  ): Promise<{
    success: boolean
    message: string
    sent: number
    failed: number
    details: Array<{ email: string; success: boolean; error?: string }>
  }> {
    console.log(`📧 Enviando emails masivos a ${recipients.length} destinatarios`)

    const results = await Promise.all(
      recipients.map(async (email) => {
        const result = await this.sendEmail(email, subject, message, sender)
        return {
          email,
          success: result.success,
          error: result.success ? undefined : result.message,
        }
      })
    )

    const sent = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    return {
      success: sent > 0,
      message: `Se enviaron ${sent} de ${recipients.length} emails`,
      sent,
      failed,
      details: results,
    }
  }

  /**
   * Notificar sobre creación de viaje
   */
  public static async notifyTripCreated(
    clientEmail: string,
    tripData: {
      destination: string
      startDate: string
      endDate: string
      totalAmount: number
    }
  ): Promise<any> {
    const subject = '✅ Confirmación de Viaje - Agencia de Viajes'
    const message = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2c5aa0; text-align: center;">🎉 ¡Tu Viaje ha sido Confirmado!</h2>
            
            <p>Estimado cliente,</p>
            
            <p>Tu viaje ha sido registrado exitosamente en nuestro sistema. A continuación, los detalles:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>📍 Destino:</strong> ${tripData.destination}</p>
              <p><strong>📅 Fecha de inicio:</strong> ${tripData.startDate}</p>
              <p><strong>📅 Fecha de fin:</strong> ${tripData.endDate}</p>
              <p><strong>💰 Monto total:</strong> COP $${tripData.totalAmount.toLocaleString()}</p>
            </div>
            
            <p>Pronto te contactaremos con más información sobre tu viaje.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="text-align: center; color: #999; font-size: 12px;">
              Saludos,<br>
              <strong>El equipo de Agencia de Viajes</strong>
            </p>
          </div>
        </body>
      </html>
    `

    return await this.sendEmail(clientEmail, subject, message)
  }

  /**
   * Notificar sobre actualización de estado de viaje
   */
  public static async notifyTripStatusChange(
    clientEmail: string,
    tripData: {
      destination: string
      newStatus: string
      message?: string
    }
  ): Promise<any> {
    const subject = '🔔 Actualización de Estado de Viaje'
    const message = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2c5aa0; text-align: center;">Actualización de tu Viaje</h2>
            
            <p>Estimado cliente,</p>
            
            <p>El estado de tu viaje ha sido actualizado:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>📍 Destino:</strong> ${tripData.destination}</p>
              <p><strong>🔄 Nuevo estado:</strong> ${tripData.newStatus}</p>
              ${tripData.message ? `<p><strong>📝 Mensaje:</strong> ${tripData.message}</p>` : ''}
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="text-align: center; color: #999; font-size: 12px;">
              Saludos,<br>
              <strong>El equipo de Agencia de Viajes</strong>
            </p>
          </div>
        </body>
      </html>
    `

    return await this.sendEmail(clientEmail, subject, message)
  }

  /**
   * Notificar recordatorio de pago de cuota
   */
  public static async notifyInstallmentReminder(
    clientEmail: string,
    installmentData: {
      amount: number
      dueDate: string
      installmentNumber: number
      totalInstallments: number
    }
  ): Promise<any> {
    const subject = '💰 Recordatorio de Pago - Cuota de Viaje'
    const message = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2c5aa0; text-align: center;">💳 Recordatorio de Pago</h2>
            
            <p>Estimado cliente,</p>
            
            <p>Te recordamos que tienes un pago pendiente:</p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p><strong>💰 Monto:</strong> COP $${installmentData.amount.toLocaleString()}</p>
              <p><strong>📅 Fecha de vencimiento:</strong> ${installmentData.dueDate}</p>
              <p><strong>📊 Cuota:</strong> ${installmentData.installmentNumber} de ${installmentData.totalInstallments}</p>
            </div>
            
            <p>Por favor, realiza el pago antes de la fecha de vencimiento para evitar recargos.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="text-align: center; color: #999; font-size: 12px;">
              Saludos,<br>
              <strong>El equipo de Agencia de Viajes</strong>
            </p>
          </div>
        </body>
      </html>
    `

    return await this.sendEmail(clientEmail, subject, message)
  }

  /**
   * Notificar alerta climática a conductores
   */
  public static async notifyWeatherAlert(
    emails: string[],
    alertData: {
      message: string
      severity: string
    }
  ): Promise<any> {
    const subject = `⚠️ Alerta Climática - ${alertData.severity || 'IMPORTANTE'}`
    const message = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #d32f2f; text-align: center;">⚠️ Alerta Climática</h2>
            
            <p>Estimado/a Conductor,</p>
            
            <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #d32f2f;">
              <p style="margin: 0;"><strong>${alertData.message}</strong></p>
            </div>
            
            <p><strong>Nivel de alerta:</strong> ${alertData.severity || 'MODERADO'}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CO')}</p>
            
            <p>Por favor, tome las precauciones necesarias.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="text-align: center; color: #999; font-size: 12px;">
              Saludos,<br>
              <strong>Sistema de Gestión de Viajes</strong>
            </p>
          </div>
        </body>
      </html>
    `

    return await this.sendBulkEmail(emails, subject, message)
  }
}
