import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'trip_plan'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('trip_id').unsigned().notNullable()
      table.foreign('trip_id').references('id').inTable('trips').onDelete('CASCADE')

      table.integer('plan_id').unsigned().notNullable()
      table.foreign('plan_id').references('id').inTable('plans').onDelete('CASCADE')

      // Campos adicionales para la relación
      table.integer('order_in_trip').unsigned().nullable() // orden del plan en el viaje
      table.date('start_date').nullable()
      table.date('end_date').nullable()
      table.decimal('custom_price', 10, 2).nullable() // precio personalizado para este plan en este viaje

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Unique constraint para evitar duplicados
      table.unique(['trip_id', 'plan_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
