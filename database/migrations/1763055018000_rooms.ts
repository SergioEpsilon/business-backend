import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('hotel_id').unsigned().notNullable()
      table.foreign('hotel_id').references('id').inTable('hotels').onDelete('CASCADE')

      table.string('room_number', 20).notNullable()
      table.enum('room_type', ['single', 'double', 'triple', 'suite', 'family']).notNullable()
      table.integer('capacity').notNullable()
      table.integer('num_beds').notNullable()
      table.enum('bed_type', ['single', 'double', 'queen', 'king']).notNullable()
      table.decimal('price_per_night', 10, 2).notNullable()
      table.text('description').nullable()
      table.boolean('has_bathroom').notNullable().defaultTo(true)
      table.boolean('has_tv').notNullable().defaultTo(true)
      table.boolean('has_minibar').notNullable().defaultTo(false)
      table.boolean('has_balcony').notNullable().defaultTo(false)
      table.boolean('has_air_conditioning').notNullable().defaultTo(true)
      table.boolean('is_available').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['hotel_id', 'room_number'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
