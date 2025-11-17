import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    // 1. Eliminar la foreign key en hotels
    this.schema.raw('ALTER TABLE `hotels` DROP FOREIGN KEY `hotels_administrator_id_foreign`')
    // 2. Cambiar el tipo de administrator_id en hotels
    this.schema.raw('ALTER TABLE `hotels` MODIFY COLUMN `administrator_id` VARCHAR(24)')
    // 3. Cambiar el tipo de id en administrators
    this.schema.raw(
      'ALTER TABLE `administrators` DROP PRIMARY KEY, MODIFY COLUMN `id` VARCHAR(24) NOT NULL, ADD PRIMARY KEY (`id`)'
    )
    // 4. Volver a crear la foreign key en hotels
    this.schema.raw(
      'ALTER TABLE `hotels` ADD CONSTRAINT `hotels_administrator_id_foreign` FOREIGN KEY (`administrator_id`) REFERENCES `administrators`(`id`) ON DELETE SET NULL'
    )
  }

  public async down() {
    this.schema.raw('ALTER TABLE `hotels` DROP FOREIGN KEY `hotels_administrator_id_foreign`')
    this.schema.raw('ALTER TABLE `hotels` MODIFY COLUMN `administrator_id` INT UNSIGNED')
    this.schema.raw(
      'ALTER TABLE `administrators` DROP PRIMARY KEY, MODIFY COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (`id`)'
    )
    this.schema.raw(
      'ALTER TABLE `hotels` ADD CONSTRAINT `hotels_administrator_id_foreign` FOREIGN KEY (`administrator_id`) REFERENCES `administrators`(`id`) ON DELETE SET NULL'
    )
  }
}
