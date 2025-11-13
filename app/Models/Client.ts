import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Trip from './Trip'
import BankCard from './BankCard'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación 1-1 con User
  @column()
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  // Información del cliente
  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public documentType: string

  @column()
  public documentNumber: string

  @column()
  public phone: string

  @column()
  public address: string

  @column()
  public city: string

  @column()
  public country: string

  @column.date()
  public birthDate: DateTime

  // Relación 1-n con Trip (un cliente puede tener múltiples viajes)
  @hasMany(() => Trip, {
    foreignKey: 'clientId',
  })
  public trips: HasMany<typeof Trip>

  // Relación 1-n con BankCard (un cliente puede tener múltiples tarjetas)
  @hasMany(() => BankCard, {
    foreignKey: 'clientId',
  })
  public bankCards: HasMany<typeof BankCard>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
