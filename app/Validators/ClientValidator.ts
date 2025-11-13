import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ClientValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(100)]),
    email: schema.string({ trim: true }, [rules.email()]),
    phone: schema.string({ trim: true }, [rules.minLength(8), rules.maxLength(20)]),
    address: schema.string({ trim: true }, [rules.minLength(5), rules.maxLength(255)]),
  })

  public messages: CustomMessages = {
    'name.required': 'El nombre es requerido',
    'name.minLength': 'El nombre debe tener al menos 3 caracteres',
    'name.maxLength': 'El nombre no puede exceder 100 caracteres',
    'email.required': 'El email es requerido',
    'email.email': 'El email debe ser válido',
    'phone.required': 'El teléfono es requerido',
    'phone.minLength': 'El teléfono debe tener al menos 8 caracteres',
    'address.required': 'La dirección es requerida',
    'address.minLength': 'La dirección debe tener al menos 5 caracteres',
  }
}
