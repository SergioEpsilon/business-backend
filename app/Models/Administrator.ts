import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hotel from './Hotel'

export default class Administrator extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  // NO hay userId separado - el id ES el userId de MS-SECURITY

  @column()
  public document: string

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
