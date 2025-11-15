import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'aircrafts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('airline_id').unsigned().nullable()
      table.foreign('airline_id').references('id').inTable('airlines').onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['airline_id'])
      table.dropColumn('airline_id')
    })
  }
}
