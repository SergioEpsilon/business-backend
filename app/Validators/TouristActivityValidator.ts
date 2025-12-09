import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TouristActivityValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(100)]),
    description: schema.string.optional({ trim: true }, [rules.maxLength(500)]),
    price: schema.number([rules.unsigned(), rules.range(0, 999999999)]),
    duration: schema.number([
      rules.unsigned(),
      rules.range(1, 720), // Hasta 12 horas
    ]),
    difficulty: schema.enum(['easy', 'medium', 'hard'] as const),
    municipalityId: schema.number([rules.exists({ table: 'municipalities', column: 'id' })]),
  })

  public messages: CustomMessages = {
    'name.required': 'El nombre de la actividad es requerido',
    'name.minLength': 'El nombre debe tener al menos 3 caracteres',
    'name.maxLength': 'El nombre no puede exceder 100 caracteres',
    'description.maxLength': 'La descripción no puede exceder 500 caracteres',
    'price.required': 'El precio es requerido',
    'price.unsigned': 'El precio debe ser un número positivo',
    'price.range': 'El precio debe estar entre 0 y 999999999',
    'duration.required': 'La duración es requerida',
    'duration.unsigned': 'La duración debe ser un número positivo',
    'duration.range': 'La duración debe estar entre 1 y 720 minutos (12 horas)',
    'difficulty.required': 'La dificultad es requerida',
    'difficulty.enum': 'La dificultad debe ser: easy, medium o hard',
    'municipalityId.required': 'El ID del municipio es requerido',
    'municipalityId.exists': 'El municipio especificado no existe',
  }
}
