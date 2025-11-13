import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Guide from './Guide'
import Administrator from './Administrator'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public userType: 'client' | 'guide' | 'administrator'

  @column()
  public isActive: boolean

  // Relación 1-1 con Client
  @hasOne(() => Client, {
    foreignKey: 'userId',
  })
  public client: HasOne<typeof Client>

  // Relación 1-1 con Guide
  @hasOne(() => Guide, {
    foreignKey: 'userId',
  })
  public guide: HasOne<typeof Guide>

  // Relación 1-1 con Administrator
  @hasOne(() => Administrator, {
    foreignKey: 'userId',
  })
  public administrator: HasOne<typeof Administrator>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
