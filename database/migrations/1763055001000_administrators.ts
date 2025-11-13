import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'administrators'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().unique()
      // user_id references user in security microservice

      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('document_type', 50).notNullable()
      table.string('document_number', 50).notNullable().unique()
      table.string('phone', 20).notNullable()
      table.string('department', 100).notNullable()
      table.integer('access_level').unsigned().notNullable().defaultTo(1)
      table.boolean('can_manage_users').notNullable().defaultTo(false)
      table.boolean('can_manage_trips').notNullable().defaultTo(false)
      table.boolean('can_manage_invoices').notNullable().defaultTo(false)

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
