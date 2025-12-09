import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Invoice from './Invoice'

export default class BankCard extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Relación n-1 con Client (cada tarjeta pertenece a un cliente)
  @column()
  public clientId: string

  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  public client: BelongsTo<typeof Client>

  // Información de la tarjeta
  @column()
  public cardHolderName: string

  @column({ serializeAs: null })
  public cardNumber: string // DEBE SER ENCRIPTADO en producción

  @column()
  public cardType: 'credit' | 'debit'

  @column()
  public cardBrand: string // Visa, Mastercard, American Express, etc.

  @column()
  public expiryMonth: number

  @column()
  public expiryYear: number

  @column({ serializeAs: null })
  public cvv: string // DEBE SER ENCRIPTADO en producción

  @column()
  public billingAddress: string

  @column()
  public billingCity: string

  @column()
  public billingCountry: string

  @column()
  public billingZipCode: string

  @column()
  public isDefault: boolean

  @column()
  public isActive: boolean

  // Relación 1-n con Invoice (una tarjeta puede usarse en múltiples facturas)
  @hasMany(() => Invoice, {
    foreignKey: 'bankCardId',
  })
  public invoices: HasMany<typeof Invoice>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
