import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable('guides', (table) => {
      table.dropColumn('first_name')
      table.dropColumn('last_name')
      table.dropColumn('document_type')
      table.dropColumn('document_number')
    })
  }

  public async down() {
    this.schema.alterTable('guides', (table) => {
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('document_type', 50).notNullable()
      table.string('document_number', 50).notNullable()
    })
  }
}
