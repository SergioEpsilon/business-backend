import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TripValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    destination: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(100)]),
    description: schema.string({ trim: true }, [rules.minLength(10), rules.maxLength(500)]),
    startDate: schema.date({ format: 'yyyy-MM-dd' }),
    endDate: schema.date({ format: 'yyyy-MM-dd' }, [rules.afterField('startDate')]),
    price: schema.number([rules.unsigned(), rules.range(0, 999999)]),
    capacity: schema.number([rules.unsigned(), rules.range(1, 1000)]),
  })

  public messages: CustomMessages = {
    'destination.required': 'El destino es requerido',
    'destination.minLength': 'El destino debe tener al menos 3 caracteres',
    'description.required': 'La descripción es requerida',
    'description.minLength': 'La descripción debe tener al menos 10 caracteres',
    'startDate.required': 'La fecha de inicio es requerida',
    'startDate.date': 'La fecha de inicio debe ser una fecha válida',
    'endDate.required': 'La fecha de fin es requerida',
    'endDate.afterField': 'La fecha de fin debe ser posterior a la fecha de inicio',
    'price.required': 'El precio es requerido',
    'price.unsigned': 'El precio debe ser un número positivo',
    'capacity.required': 'La capacidad es requerida',
    'capacity.unsigned': 'La capacidad debe ser un número positivo',
    'capacity.range': 'La capacidad debe estar entre 1 y 1000',
  }
}
