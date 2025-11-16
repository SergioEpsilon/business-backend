import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Trip from './Trip'
import Route from './Route'
import TransportService from './TransportService'

export default class ItineraryTransport extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación muchos a uno con Trip
  @column()
  public tripId: number

  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  public trip: BelongsTo<typeof Trip>

  // Relación muchos a uno con Route (nace de la relación N:N entre Trip y Route)
  @column()
  public routeId: number

  @belongsTo(() => Route, {
    foreignKey: 'routeId',
  })
  public route: BelongsTo<typeof Route>

  // Relación muchos a uno con TransportService
  @column()
  public transportServiceId: number

  @belongsTo(() => TransportService, {
    foreignKey: 'transportServiceId',
  })
  public transportService: BelongsTo<typeof TransportService>

  @column()
  public dayNumber: number

  @column()
  public orderInDay: number

  @column()
  public numPassengers: number

  @column()
  public totalCost: number

  @column()
  public notes: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
