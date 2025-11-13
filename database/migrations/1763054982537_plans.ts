import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'plans'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 200).notNullable()
      table.text('description').notNullable()
      table.string('plan_code', 50).notNullable().unique()
      table.integer('duration').unsigned().notNullable() // días
      table.decimal('base_price', 10, 2).notNullable()
      table.integer('max_people').unsigned().notNullable()
      table.integer('min_people').unsigned().notNullable()
      table.boolean('includes_accommodation').notNullable().defaultTo(true)
      table.boolean('includes_transport').notNullable().defaultTo(true)
      table.boolean('includes_meals').notNullable().defaultTo(false)
      table.string('meal_plan', 100).nullable()
      table.string('category', 50).notNullable()
      table.string('season_type', 50).notNullable()
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
