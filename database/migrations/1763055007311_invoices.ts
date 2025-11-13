import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'invoices'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('trip_id').unsigned().notNullable()
      table.foreign('trip_id').references('id').inTable('trips').onDelete('RESTRICT')

      table.integer('bank_card_id').unsigned().nullable()
      table.foreign('bank_card_id').references('id').inTable('bank_cards').onDelete('SET NULL')

      table.string('invoice_number', 50).notNullable().unique()
      table.date('issue_date').notNullable()
      table.date('due_date').notNullable()
      table.decimal('subtotal', 10, 2).notNullable()
      table.decimal('tax', 10, 2).notNullable().defaultTo(0)
      table.decimal('discount', 10, 2).notNullable().defaultTo(0)
      table.decimal('total_amount', 10, 2).notNullable()
      table.decimal('paid_amount', 10, 2).notNullable().defaultTo(0)
      table.decimal('balance', 10, 2).notNullable()
      table
        .enum('status', ['pending', 'partial', 'paid', 'overdue', 'cancelled'])
        .notNullable()
        .defaultTo('pending')
      table
        .enum('payment_method', ['credit_card', 'debit_card', 'bank_transfer', 'cash'])
        .nullable()
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
