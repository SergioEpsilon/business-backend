import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'aircraft'

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
      table.string('registration', 50).notNullable()
      table.integer('max_altitude').unsigned().notNullable()
      table.integer('range').unsigned().notNullable()

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
