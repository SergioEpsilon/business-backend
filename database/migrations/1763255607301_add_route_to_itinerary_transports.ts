import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'itinerary_transports'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('route_id').unsigned().nullable()
      table.foreign('route_id').references('id').inTable('routes').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['route_id'])
      table.dropColumn('route_id')
    })
  }
}
