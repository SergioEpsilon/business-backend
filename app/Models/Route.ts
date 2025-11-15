import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Trip from './Trip'
import Vehicle from './Vehicle'

export default class Route extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public origin: string

  @column()
  public destination: string

  @column()
  public distanceKm: number

  @column()
  public estimatedDurationMinutes: number

  @column()
  public description: string

  @column()
  public isActive: boolean

  // Relación muchos a muchos con Trip
  @manyToMany(() => Trip, {
    pivotTable: 'trip_route',
  })
  public trips: ManyToMany<typeof Trip>

  // Relación muchos a muchos con Vehicle
  @manyToMany(() => Vehicle, {
    pivotTable: 'route_vehicle',
  })
  public vehicles: ManyToMany<typeof Vehicle>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
