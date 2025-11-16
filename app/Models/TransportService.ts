import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Route from './Route'
import Aircraft from './Aircraft'
import Vehicle from './Vehicle'

export default class TransportService extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación muchos a uno con Route
  @column()
  public routeId: number

  @belongsTo(() => Route, {
    foreignKey: 'routeId',
  })
  public route: BelongsTo<typeof Route>

  @column()
  public transportType: 'flight' | 'bus' | 'car' | 'van' | 'train'

  // Relación muchos a uno con Aircraft (opcional, solo para vuelos)
  @column()
  public aircraftId: number

  @belongsTo(() => Aircraft, {
    foreignKey: 'aircraftId',
  })
  public aircraft: BelongsTo<typeof Aircraft>

  // Relación muchos a uno con Vehicle (opcional, para transporte terrestre)
  @column()
  public vehicleId: number

  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  public vehicle: BelongsTo<typeof Vehicle>

  @column()
  public serviceNumber: string

  @column.dateTime()
  public departureTime: DateTime

  @column.dateTime()
  public arrivalTime: DateTime

  @column()
  public price: number

  @column()
  public availableSeats: number

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
