import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

/**
 * Servicio para obtener información de usuarios desde MS-SECURITY
 */
export default class UserService {
  private static readonly MS_SECURITY_URL = Env.get('MS_SECURITY') || 'http://localhost:8080'

  /**
   * Obtener información básica de un usuario por su ID
   */
  public static async getUserInfo(
    userId: string,
    token?: string
  ): Promise<{
    name: string
    email: string
  } | null> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.get(`${this.MS_SECURITY_URL}/api/users/${userId}`, {
        headers,
      })
      return {
        name: response.data.name || 'N/A',
        email: response.data.email || 'N/A',
      }
    } catch (error) {
      console.error(`Error al obtener usuario ${userId}:`, error.message)
      return null
    }
  }

  /**
   * Enriquecer una lista de entidades con información de usuario
   */
  public static async enrichWithUserInfo<T extends { id: string }>(
    entities: T[],
    token?: string
  ): Promise<Array<T & { name?: string; email?: string }>> {
    const enrichedEntities = await Promise.all(
      entities.map(async (entity) => {
        const userInfo = await this.getUserInfo(entity.id, token)
        return {
          ...entity,
          name: userInfo?.name,
          email: userInfo?.email,
        }
      })
    )
    return enrichedEntities
  }
}
