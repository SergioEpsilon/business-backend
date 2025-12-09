import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ItineraryTransportValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    tripId: schema.number([rules.exists({ table: 'trips', column: 'id' })]),
    routeId: schema.number([rules.exists({ table: 'routes', column: 'id' })]),
    transportServiceId: schema.number.optional([
      rules.exists({ table: 'transport_services', column: 'id' }),
    ]),
    dayNumber: schema.number([rules.unsigned(), rules.range(1, 365)]),
    orderInDay: schema.number([rules.unsigned(), rules.range(1, 100)]),
    numPassengers: schema.number([rules.unsigned(), rules.range(1, 1000)]),
    totalCost: schema.number([rules.unsigned()]),
    notes: schema.string.optional(),
  })

  public messages: CustomMessages = {
    'tripId.required': 'El ID del viaje es requerido',
    'tripId.exists': 'El viaje especificado no existe',
    'routeId.required': 'El ID de la ruta es requerido',
    'routeId.exists': 'La ruta especificada no existe',
    'transportServiceId.exists': 'El servicio de transporte especificado no existe',
    'dayNumber.required': 'El número de día es requerido',
    'dayNumber.unsigned': 'El número de día debe ser positivo',
    'dayNumber.range': 'El número de día debe estar entre 1 y 365',
    'orderInDay.required': 'El orden en el día es requerido',
    'orderInDay.unsigned': 'El orden en el día debe ser positivo',
    'orderInDay.range': 'El orden en el día debe estar entre 1 y 100',
    'numPassengers.required': 'El número de pasajeros es requerido',
    'numPassengers.unsigned': 'El número de pasajeros debe ser positivo',
    'numPassengers.range': 'El número de pasajeros debe estar entre 1 y 1000',
    'totalCost.required': 'El costo total es requerido',
    'totalCost.unsigned': 'El costo total debe ser positivo',
  }
}
