import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tourist_activities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('municipality_id').unsigned().notNullable()
      table
        .foreign('municipality_id')
        .references('id')
        .inTable('municipalities')
        .onDelete('RESTRICT')

      table.string('name', 200).notNullable()
      table.text('description').notNullable()
      table.string('activity_type', 100).notNullable()
      table.integer('duration').unsigned().notNullable() // horas
      table.decimal('price', 10, 2).notNullable()
      table.integer('max_capacity').unsigned().notNullable()
      table.integer('min_capacity').unsigned().notNullable()
      table.enum('difficulty', ['easy', 'moderate', 'hard']).notNullable().defaultTo('moderate')
      table.boolean('includes_transport').notNullable().defaultTo(false)
      table.boolean('includes_meals').notNullable().defaultTo(false)
      table.text('requirements').nullable()
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
