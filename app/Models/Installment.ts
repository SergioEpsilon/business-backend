import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Trip from './Trip'
import Invoice from './Invoice'

export default class Installment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación n-1 con Trip (cada cuota pertenece a un viaje)
  @column()
  public tripId: number

  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  public trip: BelongsTo<typeof Trip>

  // Relación n-1 con Invoice (cada cuota puede estar asociada a una factura)
  @column()
  public invoiceId: number

  @belongsTo(() => Invoice, {
    foreignKey: 'invoiceId',
  })
  public invoice: BelongsTo<typeof Invoice>

  // Información de la cuota
  @column()
  public installmentNumber: number

  @column()
  public amount: number

  @column.date()
  public dueDate: DateTime

  @column.date()
  public paidDate: DateTime

  @column()
  public status: 'pending' | 'paid' | 'overdue' | 'cancelled'

  @column()
  public paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash'

  @column()
  public transactionReference: string

  @column()
  public notes: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
