import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InstallmentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    amount: schema.number([rules.unsigned(), rules.range(1, 999999999)]),
    dueDate: schema.date({ format: 'yyyy-MM-dd' }),
    paidDate: schema.date.optional({ format: 'yyyy-MM-dd' }),
    status: schema.enum(['pending', 'paid', 'overdue'] as const),
    tripId: schema.number([rules.exists({ table: 'trips', column: 'id' })]),
    invoiceId: schema.number.optional([rules.exists({ table: 'invoices', column: 'id' })]),
  })

  public messages: CustomMessages = {
    'amount.required': 'El monto es requerido',
    'amount.unsigned': 'El monto debe ser un número positivo',
    'amount.range': 'El monto debe estar entre 1 y 999999999',
    'dueDate.required': 'La fecha de vencimiento es requerida',
    'dueDate.date': 'La fecha de vencimiento debe ser una fecha válida',
    'paidDate.date': 'La fecha de pago debe ser una fecha válida',
    'status.required': 'El estado es requerido',
    'status.enum': 'El estado debe ser: pending, paid o overdue',
    'tripId.required': 'El ID del viaje es requerido',
    'tripId.exists': 'El viaje especificado no existe',
    'invoiceId.exists': 'La factura especificada no existe',
  }
}
