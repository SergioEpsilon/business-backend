import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable('administrators', (table) => {
      table.dropColumn('first_name')
      table.dropColumn('last_name')
    })
  }

  public async down() {
    this.schema.alterTable('administrators', (table) => {
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
    })
  }
}
