import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.raw('ALTER TABLE `administrators` MODIFY COLUMN `user_id` VARCHAR(24) NOT NULL')
  }

  public async down() {
    this.schema.raw('ALTER TABLE `administrators` MODIFY COLUMN `user_id` INT UNSIGNED NOT NULL')
  }
}
