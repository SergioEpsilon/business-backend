import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Driver from 'App/Models/Driver'
import Vehicle from 'App/Models/Vehicle'

export default class Shift extends BaseModel {
  public static table = 'driver_shifts'

  @column({ isPrimary: true })
  public id: number

  @column()
  public driverId: string

  @column()
  public vehicleId: number

  @column.dateTime()
  public shiftStart: DateTime

  @column.dateTime()
  public shiftEnd: DateTime

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relaciones
  @belongsTo(() => Driver)
  public driver: BelongsTo<typeof Driver>

  @belongsTo(() => Vehicle)
  public vehicle: BelongsTo<typeof Vehicle>
}
