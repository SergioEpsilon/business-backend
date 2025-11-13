import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'gps'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('trip_id').unsigned().notNullable()
      table.foreign('trip_id').references('id').inTable('trips').onDelete('CASCADE')

      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('document_type', 50).notNullable()
      table.string('document_number', 50).notNullable()
      table.date('birth_date').notNullable()
      table.string('gender', 20).nullable()
      table.string('nationality', 100).notNullable()
      table.string('phone', 20).nullable()
      table.string('email', 255).nullable()
      table.string('emergency_contact_name', 200).nullable()
      table.string('emergency_contact_phone', 20).nullable()
      table.text('special_requirements').nullable()
      table.text('dietary_restrictions').nullable()
      table.boolean('is_primary_passenger').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
