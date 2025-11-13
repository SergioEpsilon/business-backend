import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'hotels'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('municipality_id').unsigned().notNullable()
      table
        .foreign('municipality_id')
        .references('id')
        .inTable('municipalities')
        .onDelete('CASCADE')

      table.string('name', 255).notNullable()
      table.string('address', 500).notNullable()
      table.string('phone', 20).notNullable()
      table.string('email', 255).notNullable()
      table.string('website', 500).nullable()
      table.integer('stars').notNullable().checkBetween([1, 5])
      table.text('description').nullable()
      table.text('amenities').nullable()
      table.decimal('latitude', 10, 8).nullable()
      table.decimal('longitude', 11, 8).nullable()
      table.boolean('has_parking').notNullable().defaultTo(false)
      table.boolean('has_pool').notNullable().defaultTo(false)
      table.boolean('has_restaurant').notNullable().defaultTo(false)
      table.boolean('has_wifi').notNullable().defaultTo(true)
      table.boolean('has_gym').notNullable().defaultTo(false)
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
