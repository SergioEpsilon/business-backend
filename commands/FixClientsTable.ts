import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'

export default class FixClientsTable extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'fix:clients_table'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Fix clients table structure (remove id_old column)'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    try {
      this.logger.info('🔧 Verificando estructura de clients...')

      const columns = await Database.rawQuery('SHOW COLUMNS FROM clients')
      const hasIdOld = columns[0].some((col: any) => col.Field === 'id_old')

      if (hasIdOld) {
        this.logger.warning('⚠️  Columna id_old encontrada')

        // Eliminar todas las foreign keys que apuntan a id_old
        const foreignKeys = [
          { table: 'client_trip', constraint: 'client_trip_client_id_foreign' },
          { table: 'bank_cards', constraint: 'bank_cards_client_id_foreign' },
          { table: 'trips', constraint: 'trips_client_id_foreign' },
        ]

        for (const fk of foreignKeys) {
          try {
            this.logger.info(`🔗 Eliminando foreign key ${fk.constraint} de ${fk.table}...`)
            await Database.rawQuery(
              `ALTER TABLE \`${fk.table}\` DROP FOREIGN KEY \`${fk.constraint}\``
            )
            this.logger.success(`✅ Foreign key ${fk.constraint} eliminada`)
          } catch (error) {
            this.logger.info(`ℹ️  Foreign key ${fk.constraint} no existe o ya fue eliminada`)
          }
        }

        // Eliminar columna id_old
        this.logger.info('🗑️  Eliminando columna id_old...')
        await Database.rawQuery('ALTER TABLE clients DROP COLUMN id_old')
        this.logger.success('✅ Columna id_old eliminada')

        // Cambiar tipo de client_id en tablas relacionadas
        this.logger.info('🔄 Actualizando tipo de client_id en client_trip...')
        await Database.rawQuery(
          'ALTER TABLE `client_trip` MODIFY COLUMN `client_id` VARCHAR(24) NOT NULL'
        )
        this.logger.success('✅ Tipo de client_id actualizado en client_trip')

        // Recrear foreign keys correctas (apuntando a id)
        this.logger.info('🔗 Recreando foreign keys...')
        await Database.rawQuery(
          'ALTER TABLE `client_trip` ADD CONSTRAINT `client_trip_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE'
        )
        this.logger.success('✅ Foreign key client_trip recreada')
      } else {
        this.logger.success('✅ Columna id_old no existe')
      }

      this.logger.info('🧹 Limpiando migraciones corruptas...')
      await Database.rawQuery(
        "DELETE FROM adonis_schema WHERE name IN ('database/migrations/1768791000000_clients_prepare_string_id', 'database/migrations/1768792000000_clients_add_string_id')"
      )
      this.logger.success('✅ Migraciones corruptas eliminadas')

      // Asegurar que id sea PRIMARY KEY y NOT NULL
      this.logger.info('🔑 Configurando id como PRIMARY KEY...')
      try {
        await Database.rawQuery('ALTER TABLE clients DROP PRIMARY KEY')
      } catch (error) {
        this.logger.info('ℹ️  No hay PRIMARY KEY previa')
      }
      await Database.rawQuery('ALTER TABLE clients MODIFY COLUMN id VARCHAR(24) NOT NULL')
      await Database.rawQuery('ALTER TABLE clients ADD PRIMARY KEY (id)')
      this.logger.success('✅ PRIMARY KEY configurada')

      this.logger.info('📋 Estructura final de clients:')
      const finalColumns = await Database.rawQuery('SHOW COLUMNS FROM clients')
      console.table(finalColumns[0])
    } catch (error) {
      this.logger.error('❌ Error: ' + error.message)
    }
  }
}
