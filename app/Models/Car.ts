import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from './Vehicle'
import Hotel from './Hotel'

export default class Car extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación uno a uno con Vehicle
  @column()
  public vehicleId: number

  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  public vehicle: BelongsTo<typeof Vehicle>

  // Relación muchos a uno con Hotel
  @column()
  public hotelId: number

  @belongsTo(() => Hotel, {
    foreignKey: 'hotelId',
  })
  public hotel: BelongsTo<typeof Hotel>

  @column()
  public rentalCompany: string

  @column()
  public dailyRate: number

  @column()
  public insuranceType: string

  @column()
  public includesDriver: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
