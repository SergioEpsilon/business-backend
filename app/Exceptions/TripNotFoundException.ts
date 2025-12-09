import { Exception } from '@poppinss/utils'

export default class TripNotFoundException extends Exception {
  public code = 'E_TRIP_NOT_FOUND'

  constructor(message: string = 'Trip not found') {
    super(message, 404)
  }
}
