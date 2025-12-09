import { Exception } from '@poppinss/utils'

export default class InvalidDataException extends Exception {
  public code = 'E_INVALID_DATA'

  constructor(message: string = 'Invalid data provided') {
    super(message, 400)
  }
}
