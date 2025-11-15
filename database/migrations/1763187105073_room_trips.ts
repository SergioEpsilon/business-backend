import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'room_trip'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('room_id').unsigned().notNullable()
      table.integer('trip_id').unsigned().notNullable()

      table.foreign('room_id').references('id').inTable('rooms').onDelete('CASCADE')
      table.foreign('trip_id').references('id').inTable('trips').onDelete('CASCADE')

      table.date('check_in_date').nullable()
      table.date('check_out_date').nullable()
      table.integer('num_guests').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['room_id', 'trip_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
