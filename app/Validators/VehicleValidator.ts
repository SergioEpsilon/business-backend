import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VehicleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    brand: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(50)]),
    model: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(50)]),
    year: schema.number([rules.range(1900, new Date().getFullYear() + 1)]),
    licensePlate: schema.string({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(10),
      rules.regex(/^[A-Z0-9-]+$/),
    ]),
    vehicleType: schema.string({ trim: true }),
    capacity: schema.number([rules.unsigned(), rules.range(1, 300)]),
    hasAirConditioning: schema.boolean.optional(),
    hasWifi: schema.boolean.optional(),
    isActive: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    'brand.required': 'La marca es requerida',
    'brand.minLength': 'La marca debe tener al menos 2 caracteres',
    'brand.maxLength': 'La marca no puede exceder 50 caracteres',
    'model.required': 'El modelo es requerido',
    'model.minLength': 'El modelo debe tener al menos 2 caracteres',
    'model.maxLength': 'El modelo no puede exceder 50 caracteres',
    'year.required': 'El año es requerido',
    'year.range': 'El año debe estar entre 1900 y el año actual',
    'licensePlate.required': 'La placa es requerida',
    'licensePlate.minLength': 'La placa debe tener al menos 5 caracteres',
    'licensePlate.maxLength': 'La placa no puede exceder 10 caracteres',
    'licensePlate.regex': 'La placa solo puede contener letras mayúsculas, números y guiones',
    'vehicleType.required': 'El tipo de vehículo es requerido',
    'capacity.required': 'La capacidad es requerida',
    'capacity.unsigned': 'La capacidad debe ser un número positivo',
    'capacity.range': 'La capacidad debe estar entre 1 y 300 personas',
  }
}
