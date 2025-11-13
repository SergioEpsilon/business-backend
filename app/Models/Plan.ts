import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import TouristActivity from './TouristActivity'
import Trip from './Trip'

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public planCode: string

  @column()
  public duration: number // duración en días

  @column()
  public basePrice: number

  @column()
  public maxPeople: number

  @column()
  public minPeople: number

  @column()
  public includesAccommodation: boolean

  @column()
  public includesTransport: boolean

  @column()
  public includesMeals: boolean

  @column()
  public mealPlan: string // desayuno, media pensión, pensión completa

  @column()
  public category: string // económico, estándar, premium, lujo

  @column()
  public seasonType: string // baja, media, alta

  @column()
  public isActive: boolean

  // Relación n-m con TouristActivity (un plan puede incluir varias actividades)
  @manyToMany(() => TouristActivity, {
    pivotTable: 'plan_tourist_activities',
    pivotForeignKey: 'plan_id',
    pivotRelatedForeignKey: 'tourist_activity_id',
    pivotTimestamps: true,
  })
  public touristActivities: ManyToMany<typeof TouristActivity>

  // Relación n-m con Trip (un plan puede estar en varios viajes)
  @manyToMany(() => Trip, {
    pivotTable: 'trip_plan',
    pivotForeignKey: 'plan_id',
    pivotRelatedForeignKey: 'trip_id',
    pivotTimestamps: true,
  })
  public trips: ManyToMany<typeof Trip>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
