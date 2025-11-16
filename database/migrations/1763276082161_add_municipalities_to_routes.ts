import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'routes'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('origin_municipality_id').unsigned().notNullable()
      table
        .foreign('origin_municipality_id')
        .references('id')
        .inTable('municipalities')
        .onDelete('CASCADE')

      table.integer('destination_municipality_id').unsigned().notNullable()
      table
        .foreign('destination_municipality_id')
        .references('id')
        .inTable('municipalities')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['origin_municipality_id'])
      table.dropForeign(['destination_municipality_id'])
      table.dropColumn('origin_municipality_id')
      table.dropColumn('destination_municipality_id')
    })
  }
}
