import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Aircraft from './Aircraft'

export default class Airline extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public iataCode: string

  @column()
  public icaoCode: string

  @column()
  public country: string

  @column()
  public logoUrl: string

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación uno a muchos con Aircraft
  @hasMany(() => Aircraft, {
    foreignKey: 'airlineId',
  })
  public aircrafts: HasMany<typeof Aircraft>
}
