import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from './Vehicle'
import Trip from './Trip'

export default class Gp extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación con Trip (pasajero pertenece a un viaje)
  @column()
  public tripId: number

  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  public trip: BelongsTo<typeof Trip>

  // Relación con Vehicle (GPS asociado a un vehículo)
  @column()
  public vehicleId: number

  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  public vehicle: BelongsTo<typeof Vehicle>

  // Datos del pasajero
  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public documentType: string

  @column()
  public documentNumber: string

  @column.date()
  public birthDate: DateTime

  @column()
  public gender: string

  @column()
  public nationality: string

  @column()
  public phone: string

  @column()
  public email: string

  @column()
  public emergencyContactName: string

  @column()
  public emergencyContactPhone: string

  @column()
  public specialRequirements: string

  @column()
  public dietaryRestrictions: string

  @column()
  public isPrimaryPassenger: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
