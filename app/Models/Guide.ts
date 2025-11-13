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
import TouristActivity from './TouristActivity'

export default class Guide extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación 1-1 con User
  @column()
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  // Información del guía
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
  public licenseNumber: string

  @column()
  public specialization: string

  @column()
  public languages: string // JSON array de idiomas

  @column()
  public yearsOfExperience: number

  @column()
  public isAvailable: boolean

  // Relación 1-n con TouristActivity (un guía puede dirigir múltiples actividades)
  @hasMany(() => TouristActivity, {
    foreignKey: 'guideId',
  })
  public touristActivities: HasMany<typeof TouristActivity>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
