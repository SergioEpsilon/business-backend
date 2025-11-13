import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from 'App/Models/Vehicle'

export default class Driver extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

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
  public licenseType: string

  @column()
  public licenseExpiryDate: DateTime

  @column()
  public yearsOfExperience: number

  @column()
  public vehicleId: number | null

  @column()
  public isAvailable: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación muchos a muchos con Vehicle a través de driver_shifts
  @manyToMany(() => Vehicle, {
    pivotTable: 'driver_shifts',
    pivotForeignKey: 'driver_id',
    pivotRelatedForeignKey: 'vehicle_id',
    pivotTimestamps: true,
    pivotColumns: ['shift_start', 'shift_end', 'status'],
  })
  public vehicles: ManyToMany<typeof Vehicle>
}
