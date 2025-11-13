import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'trips'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('client_id').unsigned().notNullable()
      table.foreign('client_id').references('id').inTable('clients').onDelete('RESTRICT')

      table.string('trip_code', 50).notNullable().unique()
      table.string('destination', 200).notNullable()
      table.text('description').nullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.decimal('total_price', 10, 2).notNullable()
      table.integer('number_of_passengers').unsigned().notNullable()
      table
        .enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])
        .notNullable()
        .defaultTo('pending')
      table
        .enum('payment_status', ['pending', 'partial', 'paid'])
        .notNullable()
        .defaultTo('pending')
      table.text('notes').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
