import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Hotel from './Hotel'

export default class Administrator extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación 1-1 con User
  @column()
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  // Información del administrador
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
  public department: string

  @column()
  public accessLevel: number // 1: básico, 2: medio, 3: total

  @column()
  public canManageUsers: boolean

  @column()
  public canManageTrips: boolean

  @column()
  public canManageInvoices: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación uno a muchos con Hotel
  @hasMany(() => Hotel, {
    foreignKey: 'administratorId',
  })
  public hotels: HasMany<typeof Hotel>
}
