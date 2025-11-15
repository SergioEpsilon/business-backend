import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Route from './Route'
import Room from './Room'
import Plan from './Plan'
import Installment from './Installment'

export default class Trip extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public destination: string

  @column()
  public description: string

  @column.date()
  public startDate: DateTime

  @column.date()
  public endDate: DateTime

  @column()
  public price: number

  @column()
  public capacity: number

  // Relación muchos a muchos con Client
  @manyToMany(() => Client, {
    pivotTable: 'client_trip',
  })
  public clients: ManyToMany<typeof Client>

  // Relación muchos a muchos con Route (trayecto)
  @manyToMany(() => Route, {
    pivotTable: 'trip_route',
  })
  public routes: ManyToMany<typeof Route>

  // Relación muchos a muchos con Room
  @manyToMany(() => Room, {
    pivotTable: 'room_trip',
    pivotColumns: ['check_in_date', 'check_out_date', 'num_guests'],
  })
  public rooms: ManyToMany<typeof Room>

  // Relación muchos a muchos con Plan
  @manyToMany(() => Plan, {
    pivotTable: 'trip_plan',
  })
  public plans: ManyToMany<typeof Plan>

  // Relación uno a muchos con Installment
  @hasMany(() => Installment, {
    foreignKey: 'tripId',
  })
  public installments: HasMany<typeof Installment>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
