import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RouteValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    origin: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(100),
    ]),
    destination: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(100),
    ]),
    distance: schema.number([
      rules.unsigned(),
      rules.range(1, 50000), // Hasta 50,000 km
    ]),
    estimatedDuration: schema.number([
      rules.unsigned(),
      rules.range(1, 100000), // Hasta 100,000 minutos (~69 días)
    ]),
    price: schema.number([
      rules.unsigned(),
      rules.range(0, 999999999),
    ]),
  })

  public messages: CustomMessages = {
    'origin.required': 'El origen es requerido',
    'origin.minLength': 'El origen debe tener al menos 3 caracteres',
    'origin.maxLength': 'El origen no puede exceder 100 caracteres',
    'destination.required': 'El destino es requerido',
    'destination.minLength': 'El destino debe tener al menos 3 caracteres',
    'destination.maxLength': 'El destino no puede exceder 100 caracteres',
    'distance.required': 'La distancia es requerida',
    'distance.unsigned': 'La distancia debe ser un número positivo',
    'distance.range': 'La distancia debe estar entre 1 y 50000 km',
    'estimatedDuration.required': 'La duración estimada es requerida',
    'estimatedDuration.unsigned': 'La duración debe ser un número positivo',
    'estimatedDuration.range': 'La duración debe estar entre 1 y 100000 minutos',
    'price.required': 'El precio es requerido',
    'price.unsigned': 'El precio debe ser un número positivo',
    'price.range': 'El precio debe estar entre 0 y 999999999',
  }
}
