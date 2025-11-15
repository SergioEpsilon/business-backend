import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'aircrafts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('vehicle_id').unsigned().nullable().unique()
      table.foreign('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['vehicle_id'])
      table.dropColumn('vehicle_id')
    })
  }
}
