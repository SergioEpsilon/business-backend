import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cars'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('hotel_id').unsigned().nullable()
      table.foreign('hotel_id').references('id').inTable('hotels').onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['hotel_id'])
      table.dropColumn('hotel_id')
    })
  }
}
