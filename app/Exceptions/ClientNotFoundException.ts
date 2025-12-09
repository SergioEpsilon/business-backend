import { Exception } from '@poppinss/utils'

export default class ClientNotFoundException extends Exception {
  public code = 'E_CLIENT_NOT_FOUND'

  constructor(message: string = 'Client not found') {
    super(message, 404)
  }
}
