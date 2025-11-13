import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transport_services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('route_id').unsigned().notNullable()
      table.foreign('route_id').references('id').inTable('routes').onDelete('CASCADE')

      table.enum('transport_type', ['flight', 'bus', 'car', 'van', 'train']).notNullable()
      table.integer('aircraft_id').unsigned().nullable()
      table
        .foreign('aircraft_id')
        .references('id')
        .inTable('aircrafts')
        .onDelete('SET NULL')
      table.integer('vehicle_id').unsigned().nullable()
      table
        .foreign('vehicle_id')
        .references('id')
        .inTable('vehicles')
        .onDelete('SET NULL')

      table.string('service_number', 50).nullable()
      table.dateTime('departure_time').notNullable()
      table.dateTime('arrival_time').notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.integer('available_seats').notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
