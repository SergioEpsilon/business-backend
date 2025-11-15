import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Room from './Room'
import Municipality from './Municipality'
import Administrator from './Administrator'
import Car from './Car'

export default class Hotel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public municipalityId: number

  @column()
  public administratorId: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public phone: string

  @column()
  public email: string

  @column()
  public website: string

  @column()
  public stars: number

  @column()
  public description: string

  @column()
  public amenities: string

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column()
  public hasParking: boolean

  @column()
  public hasPool: boolean

  @column()
  public hasRestaurant: boolean

  @column()
  public hasWifi: boolean

  @column()
  public hasGym: boolean

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación muchos a uno con Municipality
  @belongsTo(() => Municipality, {
    foreignKey: 'municipalityId',
  })
  public municipality: BelongsTo<typeof Municipality>

  // Relación muchos a uno con Administrator
  @belongsTo(() => Administrator, {
    foreignKey: 'administratorId',
  })
  public administrator: BelongsTo<typeof Administrator>

  // Relación uno a muchos con Room
  @hasMany(() => Room, {
    foreignKey: 'hotelId',
  })
  public rooms: HasMany<typeof Room>

  // Relación uno a muchos con Car
  @hasMany(() => Car, {
    foreignKey: 'hotelId',
  })
  public cars: HasMany<typeof Car>
}
