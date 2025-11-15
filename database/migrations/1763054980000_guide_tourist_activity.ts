import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'guide_tourist_activity'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .onDelete('CASCADE')
      table
        .integer('tourist_activity_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tourist_activities')
        .onDelete('CASCADE')

      // Evitar duplicados
      table.unique(['guide_id', 'tourist_activity_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
