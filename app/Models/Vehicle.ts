import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Driver from 'App/Models/Driver'
import Route from 'App/Models/Route'
import Gp from 'App/Models/Gp'
import Car from 'App/Models/Car'
import Aircraft from 'App/Models/Aircraft'

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public brand: string

  @column()
  public model: string

  @column()
  public year: number

  @column()
  public licensePlate: string

  @column()
  public vehicleType: string

  @column()
  public capacity: number

  @column()
  public hasAirConditioning: boolean

  @column()
  public hasWifi: boolean

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación muchos a muchos con Driver a través de driver_shifts
  @manyToMany(() => Driver, {
    pivotTable: 'driver_shifts',
    pivotForeignKey: 'vehicle_id',
    pivotRelatedForeignKey: 'driver_id',
    pivotTimestamps: true,
    pivotColumns: ['shift_start', 'shift_end', 'status'],
  })
  public drivers: ManyToMany<typeof Driver>

  // Relación muchos a muchos con Route
  @manyToMany(() => Route, {
    pivotTable: 'route_vehicle',
  })
  public routes: ManyToMany<typeof Route>

  // Relación uno a uno con GPS
  @hasOne(() => Gp, {
    foreignKey: 'vehicleId',
  })
  public gps: HasOne<typeof Gp>

  // Relación uno a uno con Car (cuando vehicleType = 'car')
  @hasOne(() => Car, {
    foreignKey: 'vehicleId',
  })
  public car: HasOne<typeof Car>

  // Relación uno a uno con Aircraft (cuando vehicleType = 'aircraft')
  @hasOne(() => Aircraft, {
    foreignKey: 'vehicleId',
  })
  public aircraft: HasOne<typeof Aircraft>
}
