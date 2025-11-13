import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'plan_tourist_activities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('plan_id').unsigned().notNullable()
      table.foreign('plan_id').references('id').inTable('plans').onDelete('CASCADE')

      table.integer('tourist_activity_id').unsigned().notNullable()
      table
        .foreign('tourist_activity_id')
        .references('id')
        .inTable('tourist_activities')
        .onDelete('CASCADE')

      // Campos adicionales para la relación
      table.integer('day_number').unsigned().nullable() // día del plan en que se realiza
      table.integer('order_in_day').unsigned().nullable() // orden en el día
      table.boolean('is_optional').notNullable().defaultTo(false)
      table.decimal('custom_price', 10, 2).nullable() // precio personalizado

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Unique constraint para evitar duplicados
      table.unique(['plan_id', 'tourist_activity_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
