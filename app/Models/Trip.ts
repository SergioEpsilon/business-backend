import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Plan from './Plan'
import Installment from './Installment'
import Invoice from './Invoice'

export default class Trip extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación n-1 con Client (cada viaje pertenece a un cliente)
  @column()
  public clientId: number

  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  public client: BelongsTo<typeof Client>

  // Información del viaje
  @column()
  public tripCode: string

  @column()
  public destination: string

  @column()
  public description: string

  @column.date()
  public startDate: DateTime

  @column.date()
  public endDate: DateTime

  @column()
  public totalPrice: number

  @column()
  public numberOfPassengers: number

  @column()
  public status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

  @column()
  public paymentStatus: 'pending' | 'partial' | 'paid'

  @column()
  public notes: string

  // Relación n-m con Plan (un viaje puede incluir varios planes)
  @manyToMany(() => Plan, {
    pivotTable: 'trip_plan',
    pivotForeignKey: 'trip_id',
    pivotRelatedForeignKey: 'plan_id',
    pivotTimestamps: true,
  })
  public plans: ManyToMany<typeof Plan>

  // Relación 1-n con Installment (un viaje puede tener múltiples cuotas)
  @hasMany(() => Installment, {
    foreignKey: 'tripId',
  })
  public installments: HasMany<typeof Installment>

  // Relación 1-n con Invoice (un viaje puede tener múltiples facturas)
  @hasMany(() => Invoice, {
    foreignKey: 'tripId',
  })
  public invoices: HasMany<typeof Invoice>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
