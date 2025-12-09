import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import TouristActivity from './TouristActivity'

export default class Guide extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  // NO hay userId separado - el id ES el userId de MS-SECURITY

  @column()
  public document: string

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

  // Relación n-n con TouristActivity (un guía puede dirigir múltiples actividades)
  @manyToMany(() => TouristActivity, {
    pivotTable: 'guide_tourist_activity',
  })
  public touristActivities: ManyToMany<typeof TouristActivity>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
