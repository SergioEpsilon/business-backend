import { Exception } from '@poppinss/utils'

export default class ClientNotFoundException extends Exception {
  constructor(message: string = 'Client not found') {
    super(message, 404, 'E_CLIENT_NOT_FOUND')
  }
}
