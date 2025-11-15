import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Trip from './Trip'
import BankCard from './BankCard'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public address: string

  // Relación muchos a muchos con Trip
  @manyToMany(() => Trip, {
    pivotTable: 'client_trip',
  })
  public trips: ManyToMany<typeof Trip>

  // Relación uno a muchos con BankCard
  @hasMany(() => BankCard, {
    foreignKey: 'clientId',
  })
  public bankCards: HasMany<typeof BankCard>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
