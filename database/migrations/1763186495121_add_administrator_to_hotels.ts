import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'hotels'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('administrator_id').unsigned().nullable()
      table
        .foreign('administrator_id')
        .references('id')
        .inTable('administrators')
        .onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['administrator_id'])
      table.dropColumn('administrator_id')
    })
  }
}
