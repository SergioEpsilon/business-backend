import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    // 1. Eliminar foreign keys primero (solo de tablas que existen)
    try {
      await this.raw('ALTER TABLE `trips` DROP FOREIGN KEY `trips_client_id_foreign`')
    } catch (error) {
      // Ignorar si no existe
    }

    try {
      await this.raw('ALTER TABLE `client_trip` DROP FOREIGN KEY `client_trip_client_id_foreign`')
    } catch (error) {
      // Ignorar si no existe
    }

    // 2. Eliminar columnas duplicadas de clients
    const columns = [
      'user_id',
      'first_name',
      'last_name',
      'document_type',
      'document_number',
      'city',
      'country',
      'birth_date',
    ]

    for (const column of columns) {
      try {
        await this.raw(`ALTER TABLE \`clients\` DROP COLUMN \`${column}\``)
      } catch (error) {
        // Ignorar si la columna no existe
      }
    }

    // 3. Cambiar tipo de id en clients (de INT a VARCHAR)
    await this.raw(
      'ALTER TABLE `clients` DROP PRIMARY KEY, MODIFY COLUMN `id` VARCHAR(24) NOT NULL, ADD PRIMARY KEY (`id`)'
    )

    // 4. Cambiar tipo de client_id en tablas relacionadas que existen
    await this.raw('ALTER TABLE `trips` MODIFY COLUMN `client_id` VARCHAR(24) NOT NULL')
    await this.raw('ALTER TABLE `client_trip` MODIFY COLUMN `client_id` VARCHAR(24) NOT NULL')

    // 5. Re-crear foreign keys
    await this.raw(
      'ALTER TABLE `trips` ADD CONSTRAINT `trips_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE RESTRICT'
    )
    await this.raw(
      'ALTER TABLE `client_trip` ADD CONSTRAINT `client_trip_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE'
    )
  }

  public async down() {
    // Revertir cambios (opcional, solo si es necesario)
    this.schema.alterTable('trips', (table) => {
      table.dropForeign(['client_id'])
    })

    this.schema.alterTable('client_trip', (table) => {
      table.dropForeign(['client_id'])
    })

    this.schema.alterTable('bank_cards', (table) => {
      table.dropForeign(['client_id'])
    })

    this.schema.raw('ALTER TABLE `trips` MODIFY COLUMN `client_id` INT UNSIGNED NOT NULL')
    this.schema.raw('ALTER TABLE `client_trip` MODIFY COLUMN `client_id` INT UNSIGNED NOT NULL')
    this.schema.raw('ALTER TABLE `bank_cards` MODIFY COLUMN `client_id` INT UNSIGNED NOT NULL')

    this.schema.raw(
      'ALTER TABLE `clients` DROP PRIMARY KEY, MODIFY COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (`id`)'
    )

    this.schema.alterTable('clients', (table) => {
      table.integer('user_id').unsigned().notNullable().unique()
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('document_type', 50).notNullable()
      table.string('document_number', 50).notNullable().unique()
      table.string('city', 100).notNullable()
      table.string('country', 100).notNullable()
      table.date('birth_date').notNullable()
    })

    this.schema.alterTable('trips', (table) => {
      table.foreign('client_id').references('id').inTable('clients').onDelete('RESTRICT')
    })

    this.schema.alterTable('client_trip', (table) => {
      table.foreign('client_id').references('id').inTable('clients').onDelete('CASCADE')
    })

    this.schema.alterTable('bank_cards', (table) => {
      table.foreign('client_id').references('id').inTable('clients').onDelete('CASCADE')
    })
  }
}
