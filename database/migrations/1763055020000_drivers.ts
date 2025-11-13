import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'drivers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 50).primary()
      table.string('user_id', 50).notNullable().unique()
      // user_id references user in security microservice (MongoDB ObjectId)

      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('document_type', 50).notNullable()
      table.string('document_number', 50).notNullable().unique()
      table.string('phone', 20).notNullable()
      table.string('license_number', 50).notNullable().unique()
      table.string('license_type', 20).notNullable()
      table.date('license_expiry_date').notNullable()
      table.integer('years_of_experience').unsigned().defaultTo(0)
      table.boolean('is_available').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
