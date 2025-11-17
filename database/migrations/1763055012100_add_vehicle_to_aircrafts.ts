import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'aircrafts'

  public async up() {
    // Verificar si la columna ya existe antes de agregarla
    try {
      await this.raw('ALTER TABLE `aircrafts` ADD COLUMN `vehicle_id` INT UNSIGNED NULL UNIQUE')
    } catch (error) {
      // La columna ya existe, solo agregamos la foreign key si no existe
    }

    try {
      await this.raw(
        'ALTER TABLE `aircrafts` ADD CONSTRAINT `aircrafts_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE'
      )
    } catch (error) {
      // La foreign key ya existe
    }
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['vehicle_id'])
      table.dropColumn('vehicle_id')
    })
  }
}
