import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Hotel from './Hotel'
import Trip from './Trip'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public hotelId: number

  @column()
  public roomNumber: string

  @column()
  public roomType: 'single' | 'double' | 'triple' | 'suite' | 'family'

  @column()
  public capacity: number

  @column()
  public numBeds: number

  @column()
  public bedType: 'single' | 'double' | 'queen' | 'king'

  @column()
  public pricePerNight: number

  @column()
  public description: string

  @column()
  public hasBathroom: boolean

  @column()
  public hasTv: boolean

  @column()
  public hasMinibar: boolean

  @column()
  public hasBalcony: boolean

  @column()
  public hasAirConditioning: boolean

  @column()
  public isAvailable: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación muchos a uno con Hotel
  @belongsTo(() => Hotel, {
    foreignKey: 'hotelId',
  })
  public hotel: BelongsTo<typeof Hotel>

  // Relación muchos a muchos con Trip
  @manyToMany(() => Trip, {
    pivotTable: 'room_trip',
    pivotColumns: ['check_in_date', 'check_out_date', 'num_guests'],
  })
  public trips: ManyToMany<typeof Trip>
}
