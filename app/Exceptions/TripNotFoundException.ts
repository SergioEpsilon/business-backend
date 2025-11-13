import { Exception } from '@poppinss/utils'

export default class TripNotFoundException extends Exception {
  constructor(message: string = 'Trip not found') {
    super(message, 404, 'E_TRIP_NOT_FOUND')
  }
}
