import { Exception } from '@poppinss/utils'

export default class InvalidDataException extends Exception {
  constructor(message: string = 'Invalid data provided') {
    super(message, 400, 'E_INVALID_DATA')
  }
}
