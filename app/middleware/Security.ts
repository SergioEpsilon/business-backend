import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export default class Security {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    let theRequest = request.toJSON()
    console.log('🔒 === [Security Middleware] Validando solicitud ===')
    console.log('📍 URL:', theRequest.url)
    console.log('🔧 Método:', theRequest.method)

    if (theRequest.headers.authorization) {
      let token = theRequest.headers.authorization.replace('Bearer ', '')
      let thePermission: object = {
        url: theRequest.url,
        method: theRequest.method,
      }
      const url = `${Env.get('MS_SECURITY')}/api/public/security/permissions-validation`
      console.log('🔗 Validando permiso en:', url)

      try {
        const result = await axios.post(url, thePermission, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('📥 Respuesta de ms-security:', result.data)

        if (result.data === true || result.data?.hasPermission === true) {
          console.log('✅ PERMISO CONCEDIDO - Continuando con la solicitud')
          await next()
        } else {
          console.log('❌ PERMISO DENEGADO')
          return response.status(403).send({
            message: 'No tienes permiso para acceder a este recurso',
            detalle: result.data,
          })
        }
      } catch (error) {
        console.error('💥 Error al conectar con ms-security:', error?.message)
        if (error?.response) {
          console.error('📄 Respuesta de error:', error.response.data)
        }
        return response.status(401).send({
          message: 'Error al validar permiso',
          error: error?.message,
          detalle: error?.response?.data,
        })
      }
    } else {
      console.log('⚠️ No se encontró header Authorization')
      return response.status(401).send({
        message: 'No autenticado: Se requiere token de autorización',
      })
    }
  }
}
