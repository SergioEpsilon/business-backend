import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'aircrafts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('airline_id').unsigned().notNullable()
      table.foreign('airline_id').references('id').inTable('airlines').onDelete('CASCADE')

      table.string('model', 100).notNullable()
      table.string('registration_number', 50).notNullable().unique()
      table.integer('capacity').notNullable()
      table.enum('aircraft_type', ['commercial', 'private', 'charter']).notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
