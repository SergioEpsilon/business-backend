import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from './Vehicle'

export default class VehicleGps extends BaseModel {
  public static table = 'vehicle_gps'

  @column({ isPrimary: true })
  public id: number

  // Relación con Vehicle
  @column()
  public vehicleId: number

  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  public vehicle: BelongsTo<typeof Vehicle>

  // Coordenadas GPS
  @column()
  public latitude: number

  @column()
  public longitude: number

  // Datos adicionales del GPS
  @column()
  public speed: number // km/h

  @column()
  public heading: number // grados (0-360)

  @column()
  public altitude: number // metros sobre el nivel del mar

  @column()
  public accuracy: number // precisión en metros

  // Estado
  @column()
  public isActive: boolean

  @column()
  public status: 'moving' | 'stopped' | 'idle' | 'offline'

  // Metadatos
  @column.dateTime()
  public lastUpdate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
