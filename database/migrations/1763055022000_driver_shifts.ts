import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'driver_shifts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys
      table.string('driver_id', 50).notNullable()
      table.integer('vehicle_id').unsigned().notNullable()

      table.foreign('driver_id').references('id').inTable('drivers').onDelete('CASCADE')
      table.foreign('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE')

      // Campos del turno
      table.dateTime('shift_start').notNullable()
      table.dateTime('shift_end').notNullable()
      table
        .enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])
        .notNullable()
        .defaultTo('scheduled')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Índices para optimizar consultas
      table.index(['driver_id', 'shift_start', 'shift_end'])
      table.index(['vehicle_id', 'shift_start', 'shift_end'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
