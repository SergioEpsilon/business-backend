import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BankCardValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    cardNumber: schema.string({ trim: true }, [
      rules.regex(/^\d{13,19}$/), // 13-19 dígitos
    ]),
    cardholderName: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(100),
    ]),
    expiryDate: schema.string({ trim: true }, [
      rules.regex(/^(0[1-9]|1[0-2])\/\d{2}$/), // MM/YY
    ]),
    cvv: schema.string({ trim: true }, [
      rules.regex(/^\d{3,4}$/), // 3-4 dígitos
    ]),
    cardType: schema.enum(['visa', 'mastercard', 'amex', 'dinners'] as const),
    clientId: schema.string({ trim: true }, [
      rules.exists({ table: 'clients', column: 'id' }),
    ]),
  })

  public messages: CustomMessages = {
    'cardNumber.required': 'El número de tarjeta es requerido',
    'cardNumber.regex': 'El número de tarjeta debe tener entre 13 y 19 dígitos',
    'cardholderName.required': 'El nombre del titular es requerido',
    'cardholderName.minLength': 'El nombre debe tener al menos 3 caracteres',
    'cardholderName.maxLength': 'El nombre no puede exceder 100 caracteres',
    'expiryDate.required': 'La fecha de expiración es requerida',
    'expiryDate.regex': 'La fecha de expiración debe tener el formato MM/YY',
    'cvv.required': 'El CVV es requerido',
    'cvv.regex': 'El CVV debe tener 3 o 4 dígitos',
    'cardType.required': 'El tipo de tarjeta es requerido',
    'cardType.enum': 'El tipo de tarjeta debe ser: visa, mastercard, amex o dinners',
    'clientId.required': 'El ID del cliente es requerido',
    'clientId.exists': 'El cliente especificado no existe',
  }
}
