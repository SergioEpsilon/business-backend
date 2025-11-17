import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bank_cards'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('client_id', 24).notNullable()
      table.foreign('client_id').references('id').inTable('clients').onDelete('CASCADE')

      table.string('card_holder_name', 200).notNullable()
      table.string('card_number', 255).notNullable() // DEBE SER ENCRIPTADO
      table.enum('card_type', ['credit', 'debit']).notNullable()
      table.string('card_brand', 50).notNullable()
      table.integer('expiry_month').unsigned().notNullable()
      table.integer('expiry_year').unsigned().notNullable()
      table.string('cvv', 255).notNullable() // DEBE SER ENCRIPTADO
      table.string('billing_address', 255).notNullable()
      table.string('billing_city', 100).notNullable()
      table.string('billing_country', 100).notNullable()
      table.string('billing_zip_code', 20).notNullable()
      table.boolean('is_default').notNullable().defaultTo(false)
      table.boolean('is_active').notNullable().defaultTo(true)

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
