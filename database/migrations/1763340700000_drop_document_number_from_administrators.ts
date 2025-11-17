import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable('administrators', (table) => {
      table.dropColumn('document_number')
    })
  }

  public async down() {
    this.schema.alterTable('administrators', (table) => {
      table.string('document_number', 50).notNullable()
    })
  }
}
