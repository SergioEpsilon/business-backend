import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable('clients', (table) => {
      table.string('document', 50).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable('clients', (table) => {
      table.dropColumn('document')
    })
  }
}
