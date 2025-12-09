import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoomValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    hotelId: schema.number([rules.exists({ table: 'hotels', column: 'id' })]),
    roomNumber: schema.string({ trim: true }, [rules.minLength(1), rules.maxLength(20)]),
    roomType: schema.enum(['single', 'double', 'triple', 'suite', 'family'] as const),
    capacity: schema.number([rules.unsigned(), rules.range(1, 20)]),
    numBeds: schema.number([rules.unsigned(), rules.range(1, 10)]),
    bedType: schema.enum(['single', 'double', 'queen', 'king'] as const),
    pricePerNight: schema.number([rules.unsigned(), rules.range(0, 999999999)]),
    description: schema.string.optional({ trim: true }, [rules.maxLength(500)]),
    hasBathroom: schema.boolean.optional(),
    hasTv: schema.boolean.optional(),
    hasMinibar: schema.boolean.optional(),
    hasBalcony: schema.boolean.optional(),
    hasAirConditioning: schema.boolean.optional(),
    isAvailable: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    'hotelId.required': 'El ID del hotel es requerido',
    'hotelId.exists': 'El hotel especificado no existe',
    'roomNumber.required': 'El número de habitación es requerido',
    'roomNumber.minLength': 'El número de habitación debe tener al menos 1 caracter',
    'roomNumber.maxLength': 'El número de habitación no puede exceder 20 caracteres',
    'roomType.required': 'El tipo de habitación es requerido',
    'roomType.enum': 'El tipo de habitación debe ser: single, double, triple, suite o family',
    'capacity.required': 'La capacidad es requerida',
    'capacity.unsigned': 'La capacidad debe ser un número positivo',
    'capacity.range': 'La capacidad debe estar entre 1 y 20 personas',
    'numBeds.required': 'El número de camas es requerido',
    'numBeds.unsigned': 'El número de camas debe ser positivo',
    'numBeds.range': 'El número de camas debe estar entre 1 y 10',
    'bedType.required': 'El tipo de cama es requerido',
    'bedType.enum': 'El tipo de cama debe ser: single, double, queen o king',
    'pricePerNight.required': 'El precio por noche es requerido',
    'pricePerNight.unsigned': 'El precio debe ser un número positivo',
    'pricePerNight.range': 'El precio debe estar entre 0 y 999999999',
    'description.maxLength': 'La descripción no puede exceder 500 caracteres',
  }
}
