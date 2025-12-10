import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotificationService from 'App/Services/NotificationService'

export default class NotificationsController {
  /**
   * Enviar email personalizado
   * POST /notifications/send-email
   */
  public async sendEmail({ request, response }: HttpContextContract) {
    try {
      const { to, subject, message, sender } = request.only(['to', 'subject', 'message', 'sender'])

      if (!to || !subject || !message) {
        return response.badRequest({
          message: 'Faltan campos requeridos: to, subject, message',
        })
      }

      const result = await NotificationService.sendEmail(to, subject, message, sender)

      if (result.success) {
        return response.ok({
          message: 'Email enviado correctamente',
          data: result.data,
        })
      } else {
        return response.badRequest({
          message: result.message,
        })
      }
    } catch (error) {
      return response.badRequest({
        message: 'Error al enviar email',
        error: error.message,
      })
    }
  }

  /**
   * Enviar SMS
   * POST /notifications/send-sms
   */
  public async sendSMS({ request, response }: HttpContextContract) {
    try {
      const { phone, message } = request.only(['phone', 'message'])

      if (!phone || !message) {
        return response.badRequest({
          message: 'Faltan campos requeridos: phone, message',
        })
      }

      const result = await NotificationService.sendSMS(phone, message)

      if (result.success) {
        return response.ok({
          message: 'SMS enviado correctamente',
          data: result.data,
        })
      } else {
        return response.badRequest({
          message: result.message,
        })
      }
    } catch (error) {
      return response.badRequest({
        message: 'Error al enviar SMS',
        error: error.message,
      })
    }
  }

  /**
   * Enviar emails masivos
   * POST /notifications/send-bulk-email
   */
  public async sendBulkEmail({ request, response }: HttpContextContract) {
    try {
      const { recipients, subject, message, sender } = request.only([
        'recipients',
        'subject',
        'message',
        'sender',
      ])

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return response.badRequest({
          message: 'Se requiere un array de destinatarios (recipients)',
        })
      }

      if (!subject || !message) {
        return response.badRequest({
          message: 'Faltan campos requeridos: subject, message',
        })
      }

      const result = await NotificationService.sendBulkEmail(
        recipients,
        subject,
        message,
        sender
      )

      return response.ok({
        message: result.message,
        sent: result.sent,
        failed: result.failed,
        details: result.details,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al enviar emails masivos',
        error: error.message,
      })
    }
  }

  /**
   * Enviar alerta climática a conductores
   * POST /notifications/weather-alert
   */
  public async sendWeatherAlert({ request, response }: HttpContextContract) {
    try {
      const { emails, message, severity } = request.only(['emails', 'message', 'severity'])

      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return response.badRequest({
          message: 'Se requiere un array de emails',
        })
      }

      if (!message) {
        return response.badRequest({
          message: 'El mensaje es requerido',
        })
      }

      const result = await NotificationService.notifyWeatherAlert(emails, {
        message,
        severity: severity || 'MODERADO',
      })

      return response.ok({
        message: result.message,
        sent: result.sent,
        failed: result.failed,
        details: result.details,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al enviar alerta climática',
        error: error.message,
      })
    }
  }

  /**
   * Test de conectividad con MS-Notifications
   * GET /notifications/test
   */
  public async test({ response }: HttpContextContract) {
    try {
      const testEmail = 'test@example.com'
      const result = await NotificationService.sendEmail(
        testEmail,
        'Test de Notificaciones',
        'Este es un mensaje de prueba del sistema de notificaciones.'
      )

      return response.ok({
        message: 'Test completado',
        success: result.success,
        details: result,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error en test de notificaciones',
        error: error.message,
      })
    }
  }
}
