import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    // Eliminar la foreign key que causa problemas
    try {
      await this.raw('ALTER TABLE `bank_cards` DROP FOREIGN KEY `bank_cards_client_id_foreign`')
    } catch (error) {
      console.log('Foreign key ya eliminada o no existe')
    }

    // Cambiar tipo de client_id en bank_cards de INT a VARCHAR
    await this.raw('ALTER TABLE `bank_cards` MODIFY COLUMN `client_id` VARCHAR(24) NOT NULL')

    // Eliminar id_old si existe
    try {
      await this.raw('ALTER TABLE `clients` DROP COLUMN `id_old`')
    } catch (error) {
      console.log('Columna id_old no existe')
    }
  }

  public async down() {
    // No es necesario revertir
  }
}
