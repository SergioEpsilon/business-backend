import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'vehicle_gps'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Relación con Vehicle
      table
        .integer('vehicle_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('vehicles')
        .onDelete('CASCADE')
      table.unique('vehicle_id') // Un vehículo solo tiene un registro GPS activo

      // Coordenadas GPS
      table.decimal('latitude', 10, 8).notNullable() // -90.00000000 a 90.00000000
      table.decimal('longitude', 11, 8).notNullable() // -180.00000000 a 180.00000000

      // Datos adicionales
      table.decimal('speed', 6, 2).defaultTo(0) // km/h
      table.decimal('heading', 5, 2).defaultTo(0) // 0-360 grados
      table.decimal('altitude', 8, 2).nullable() // metros
      table.decimal('accuracy', 6, 2).defaultTo(10) // precisión en metros

      // Estado
      table.boolean('is_active').defaultTo(true)
      table.enum('status', ['moving', 'stopped', 'idle', 'offline']).defaultTo('idle')

      // Metadatos
      table.timestamp('last_update', { useTz: true }).notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Índices para búsquedas espaciales
      table.index(['latitude', 'longitude'])
      table.index('is_active')
      table.index('status')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
