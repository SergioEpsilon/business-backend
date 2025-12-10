import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'drivers'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Eliminar columnas antiguas
      table.dropColumn('first_name')
      table.dropColumn('last_name')
      table.dropColumn('document_type')
      table.dropColumn('document_number')

      // Agregar nuevas columnas simplificadas
      table.string('document', 50).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Restaurar columnas antiguas
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('document_type', 50).notNullable()
      table.string('document_number', 50).notNullable().unique()

      // Eliminar columna nueva
      table.dropColumn('document')
    })
  }
}
