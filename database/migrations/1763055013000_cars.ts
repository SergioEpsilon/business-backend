import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cars'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('vehicle_id').unsigned().notNullable().unique()
      table.foreign('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE')

      table.string('rental_company', 255).notNullable()
      table.decimal('daily_rate', 10, 2).notNullable()
      table.string('insurance_type', 100).nullable()
      table.boolean('includes_driver').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
