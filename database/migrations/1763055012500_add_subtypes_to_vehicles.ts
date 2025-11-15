import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'vehicles'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Campos específicos de Car (cuando vehicleType = 'car')
      table.string('rental_company', 255).nullable()
      table.decimal('daily_rate', 10, 2).nullable()
      table.string('insurance_type', 100).nullable()
      table.boolean('includes_driver').nullable()

      // Campos específicos de Aircraft (cuando vehicleType = 'aircraft')
      table.integer('airline_id').unsigned().nullable()
      table.foreign('airline_id').references('id').inTable('airlines').onDelete('SET NULL')
      table.string('registration_number', 50).nullable()
      table.enum('aircraft_type', ['commercial', 'private', 'charter']).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Eliminar campos de Car
      table.dropColumn('rental_company')
      table.dropColumn('daily_rate')
      table.dropColumn('insurance_type')
      table.dropColumn('includes_driver')

      // Eliminar campos de Aircraft
      table.dropForeign(['airline_id'])
      table.dropColumn('airline_id')
      table.dropColumn('registration_number')
      table.dropColumn('aircraft_type')
    })
  }
}
