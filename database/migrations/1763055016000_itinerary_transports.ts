import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'itinerary_transports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('trip_id').unsigned().notNullable()
      table.foreign('trip_id').references('id').inTable('trips').onDelete('CASCADE')

      table.integer('transport_service_id').unsigned().notNullable()
      table
        .foreign('transport_service_id')
        .references('id')
        .inTable('transport_services')
        .onDelete('CASCADE')

      table.integer('day_number').notNullable()
      table.integer('order_in_day').notNullable()
      table.integer('num_passengers').notNullable()
      table.decimal('total_cost', 10, 2).notNullable()
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
