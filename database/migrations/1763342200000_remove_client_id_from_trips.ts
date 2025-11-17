import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'trips'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['client_id'])
      table.dropColumn('client_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('client_id').notNullable()
      // Si necesitas restaurar la FK, ajusta según corresponda
    })
  }
}
