import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import TouristActivity from './TouristActivity'

export default class Municipality extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public department: string

  @column()
  public country: string

  @column()
  public population: number

  @column()
  public area: number // en km²

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column()
  public description: string

  @column()
  public climate: string

  @column()
  public altitude: number // en metros

  // Relación 1-n con TouristActivity (un municipio puede tener múltiples actividades)
  @hasMany(() => TouristActivity, {
    foreignKey: 'municipalityId',
  })
  public touristActivities: HasMany<typeof TouristActivity>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
