import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Trip from './Trip'
import BankCard from './BankCard'
import Installment from './Installment'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación n-1 con Trip
  @column()
  public tripId: number

  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  public trip: BelongsTo<typeof Trip>

  // Relación n-1 con BankCard (cada factura se paga con una tarjeta)
  @column()
  public bankCardId: number

  @belongsTo(() => BankCard, {
    foreignKey: 'bankCardId',
  })
  public bankCard: BelongsTo<typeof BankCard>

  // Información de la factura
  @column()
  public invoiceNumber: string

  @column.date()
  public issueDate: DateTime

  @column.date()
  public dueDate: DateTime

  @column()
  public subtotal: number

  @column()
  public tax: number

  @column()
  public discount: number

  @column()
  public totalAmount: number

  @column()
  public paidAmount: number

  @column()
  public balance: number

  @column()
  public status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'

  @column()
  public paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash'

  @column()
  public notes: string

  // Relación 1-n con Installment (una factura puede tener múltiples cuotas)
  @hasMany(() => Installment, {
    foreignKey: 'invoiceId',
  })
  public installments: HasMany<typeof Installment>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
