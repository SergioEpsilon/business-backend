import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'installments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('trip_id').unsigned().notNullable()
      table.foreign('trip_id').references('id').inTable('trips').onDelete('RESTRICT')

      table.integer('invoice_id').unsigned().nullable()
      table.foreign('invoice_id').references('id').inTable('invoices').onDelete('SET NULL')

      table.integer('installment_number').unsigned().notNullable()
      table.decimal('amount', 10, 2).notNullable()
      table.date('due_date').notNullable()
      table.date('paid_date').nullable()
      table
        .enum('status', ['pending', 'paid', 'overdue', 'cancelled'])
        .notNullable()
        .defaultTo('pending')
      table
        .enum('payment_method', ['credit_card', 'debit_card', 'bank_transfer', 'cash'])
        .nullable()
      table.string('transaction_reference', 100).nullable()
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
