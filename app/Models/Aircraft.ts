import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from './Vehicle'
import Airline from './Airline'

export default class Aircraft extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación uno a uno con Vehicle
  @column()
  public vehicleId: number

  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  public vehicle: BelongsTo<typeof Vehicle>

  // Relación muchos a uno con Airline
  @column()
  public airlineId: number

  @belongsTo(() => Airline, {
    foreignKey: 'airlineId',
  })
  public airline: BelongsTo<typeof Airline>

  @column()
  public registrationNumber: string

  @column()
  public aircraftType: 'commercial' | 'private' | 'charter'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
