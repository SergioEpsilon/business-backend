import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VehicleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    licensePlate: schema.string({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(10),
      rules.regex(/^[A-Z0-9-]+$/),
    ]),
    model: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(50)]),
    capacity: schema.number([rules.unsigned(), rules.range(1, 300)]),
    vehicleType: schema.enum(['car', 'bus', 'van', 'aircraft'] as const),
    status: schema.enum(['available', 'in_use', 'maintenance', 'out_of_service'] as const),
    gpsId: schema.number.optional([rules.exists({ table: 'gps', column: 'id' })]),
  })

  public messages: CustomMessages = {
    'licensePlate.required': 'La placa es requerida',
    'licensePlate.minLength': 'La placa debe tener al menos 5 caracteres',
    'licensePlate.maxLength': 'La placa no puede exceder 10 caracteres',
    'licensePlate.regex': 'La placa solo puede contener letras mayúsculas, números y guiones',
    'model.required': 'El modelo es requerido',
    'model.minLength': 'El modelo debe tener al menos 2 caracteres',
    'model.maxLength': 'El modelo no puede exceder 50 caracteres',
    'capacity.required': 'La capacidad es requerida',
    'capacity.unsigned': 'La capacidad debe ser un número positivo',
    'capacity.range': 'La capacidad debe estar entre 1 y 300 personas',
    'vehicleType.required': 'El tipo de vehículo es requerido',
    'vehicleType.enum': 'El tipo de vehículo debe ser: car, bus, van o aircraft',
    'status.required': 'El estado es requerido',
    'status.enum': 'El estado debe ser: available, in_use, maintenance o out_of_service',
    'gpsId.exists': 'El GPS especificado no existe',
  }
}
