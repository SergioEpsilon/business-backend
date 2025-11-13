import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'vehicles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('brand', 100).notNullable()
      table.string('model', 100).notNullable()
      table.integer('year').notNullable()
      table.string('license_plate', 20).notNullable().unique()
      table.enum('vehicle_type', ['bus', 'van', 'car', 'suv']).notNullable()
      table.integer('capacity').notNullable()
      table.boolean('has_air_conditioning').notNullable().defaultTo(true)
      table.boolean('has_wifi').notNullable().defaultTo(false)
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
