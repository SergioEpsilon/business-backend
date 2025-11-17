import jwt from 'jsonwebtoken'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
export default class Security {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    let theRequest = request.toJSON()
    console.log(theRequest)
    if (theRequest.headers.authorization) {
      let token = theRequest.headers.authorization.replace('Bearer ', '')
      let thePermission: object = {
        url: theRequest.url,
        method: theRequest.method,
      }
      try {
        const result = await axios.post(
          `${Env.get('MS_SECURITY')}/api/public/security/permissions-validation`,
          thePermission,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log('La respuesta de ms-security >', JSON.stringify(result.data), '<')
        // Ajuste: validar por hasPermission
        if (result.data.hasPermission === true) {
          console.log('Permiso concedido')
          // Decodificar el JWT y exponer el usuario autenticado
          try {
            const decoded = jwt.decode(token)
            // Puedes ajustar el objeto según lo que necesites en los controladores
            // Ejemplo: ctx.auth = { user: { ...decoded } }
            // Como no usamos el provider de Adonis, lo ponemos en request['user']
            request['user'] = decoded
            console.log('Usuario autenticado extraído del token:', decoded)
          } catch (err) {
            console.warn('No se pudo decodificar el token JWT:', err)
          }
          await next()
        } else {
          console.log('no puede ingresar')
          return response.status(401).send({ error: 'No autorizado por permisos' })
        }
      } catch (error) {
        console.error(error)
        return response.status(401)
      }
    } else {
      return response.status(401)
    }
  }
}
