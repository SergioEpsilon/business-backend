import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
export default class Security {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // 🚨 MODO TESTING: Deshabilitar seguridad temporalmente
    console.log('⚠️ SECURITY MIDDLEWARE BYPASSED - TESTING MODE')
    return await next()
    
    // Código original comentado para testing
    /*
    let theRequest = request.toJSON()
    console.log('--- [Security Middleware] ---')
    console.log('Request:', theRequest)
    if (theRequest.headers.authorization) {
      let token = theRequest.headers.authorization.replace('Bearer ', '')
      let thePermission: object = {
        url: theRequest.url,
        method: theRequest.method,
      }
      const url = `${Env.get('MS_SECURITY')}/api/public/security/permissions-validation`
      console.log('Intentando validar permiso en:', url)
      try {
        const result = await axios.post(url, thePermission, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('Respuesta completa de ms-security:', result.data)
        if (result.data === true || result.data?.hasPermission === true) {
          console.log('Permiso concedido por ms-security')
          console.log('PASÓ EL MIDDLEWARE')
          await next()
        } else {
          console.log('Permiso denegado por ms-security')
          return response
            .status(401)
            .send({ message: 'Permiso denegado por ms-security', detalle: result.data })
        }
      } catch (error) {
        console.error('Error al conectar con ms-security:', error?.message)
        if (error?.response) {
          console.error('Respuesta de error:', error.response.data)
        }
        return response.status(401).send({
          message: 'Error al validar permiso',
          error: error?.message,
          detalle: error?.response?.data,
        })
      }
    } else {
      console.log('No se encontró header Authorization')
      return response.status(401).send({ message: 'No autenticado: falta Authorization' })
    }
    */
  }
}
