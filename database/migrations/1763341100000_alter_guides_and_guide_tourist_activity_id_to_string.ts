import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    // 1. Eliminar la foreign key en guide_tourist_activity
    this.schema.raw(
      'ALTER TABLE `guide_tourist_activity` DROP FOREIGN KEY `guide_tourist_activity_guide_id_foreign`'
    )
    // 2. Cambiar el tipo de guide_id en guide_tourist_activity primero
    this.schema.raw(
      'ALTER TABLE `guide_tourist_activity` MODIFY COLUMN `guide_id` VARCHAR(24) NOT NULL'
    )
    // 3. Cambiar el tipo de id en guides después
    this.schema.raw(
      'ALTER TABLE `guides` DROP PRIMARY KEY, MODIFY COLUMN `id` VARCHAR(24) NOT NULL, ADD PRIMARY KEY (`id`)'
    )
    // 4. Volver a crear la foreign key en guide_tourist_activity
    this.schema.raw(
      'ALTER TABLE `guide_tourist_activity` ADD CONSTRAINT `guide_tourist_activity_guide_id_foreign` FOREIGN KEY (`guide_id`) REFERENCES `guides`(`id`) ON DELETE CASCADE'
    )
  }

  public async down() {
    this.schema.raw(
      'ALTER TABLE `guide_tourist_activity` DROP FOREIGN KEY `guide_tourist_activity_guide_id_foreign`'
    )
    this.schema.raw(
      'ALTER TABLE `guide_tourist_activity` MODIFY COLUMN `guide_id` INT UNSIGNED NOT NULL'
    )
    this.schema.raw(
      'ALTER TABLE `guides` DROP PRIMARY KEY, MODIFY COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (`id`)'
    )
    this.schema.raw(
      'ALTER TABLE `guide_tourist_activity` ADD CONSTRAINT `guide_tourist_activity_guide_id_foreign` FOREIGN KEY (`guide_id`) REFERENCES `guides`(`id`) ON DELETE CASCADE'
    )
  }
}
