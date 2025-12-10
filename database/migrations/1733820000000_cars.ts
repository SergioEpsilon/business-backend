import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cars'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('vehicle_id')
        .unsigned()
        .references('id')
        .inTable('vehicles')
        .onDelete('CASCADE')
        .unique()
      table.integer('doors').unsigned().notNullable()
      table.string('transmission', 50).notNullable()
      table.string('fuel_type', 50).notNullable()

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
