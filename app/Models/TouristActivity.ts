import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Guide from './Guide'
import Municipality from './Municipality'
import Plan from './Plan'

export default class TouristActivity extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación n-1 con Guide (cada actividad es dirigida por un guía)
  @column()
  public guideId: number

  @belongsTo(() => Guide, {
    foreignKey: 'guideId',
  })
  public guide: BelongsTo<typeof Guide>

  // Relación n-1 con Municipality (cada actividad se desarrolla en un municipio)
  @column()
  public municipalityId: number

  @belongsTo(() => Municipality, {
    foreignKey: 'municipalityId',
  })
  public municipality: BelongsTo<typeof Municipality>

  // Información de la actividad turística
  @column()
  public name: string

  @column()
  public description: string

  @column()
  public activityType: string // naturaleza, cultura, aventura, gastronomía, etc.

  @column()
  public duration: number // duración en horas

  @column()
  public price: number

  @column()
  public maxCapacity: number

  @column()
  public minCapacity: number

  @column()
  public difficulty: 'easy' | 'moderate' | 'hard'

  @column()
  public includesTransport: boolean

  @column()
  public includesMeals: boolean

  @column()
  public requirements: string // requisitos especiales

  @column()
  public isActive: boolean

  // Relación n-m con Plan (una actividad puede pertenecer a varios planes)
  @manyToMany(() => Plan, {
    pivotTable: 'plan_tourist_activities',
    pivotForeignKey: 'tourist_activity_id',
    pivotRelatedForeignKey: 'plan_id',
    pivotTimestamps: true,
  })
  public plans: ManyToMany<typeof Plan>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
