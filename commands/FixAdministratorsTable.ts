import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'

export default class FixAdministratorsTable extends BaseCommand {
  public static commandName = 'fix:administrators_table'
  public static description = 'Fix administrators table structure (remove user_id column)'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    try {
      this.logger.info('🔧 Verificando estructura de administrators...')

      const columns = await Database.rawQuery('SHOW COLUMNS FROM administrators')
      const hasUserId = columns[0].some((col: any) => col.Field === 'user_id')

      if (hasUserId) {
        this.logger.warning('⚠️  Columna user_id encontrada')

        // Eliminar foreign keys relacionadas con hotels si existen
        try {
          this.logger.info('🔗 Eliminando foreign key hotels_administrator_id_foreign...')
          await Database.rawQuery(
            'ALTER TABLE `hotels` DROP FOREIGN KEY `hotels_administrator_id_foreign`'
          )
          this.logger.success('✅ Foreign key eliminada')
        } catch (error) {
          this.logger.info('ℹ️  Foreign key no existe o ya fue eliminada')
        }

        // Eliminar columna user_id
        this.logger.info('🗑️  Eliminando columna user_id...')
        await Database.rawQuery('ALTER TABLE administrators DROP COLUMN user_id')
        this.logger.success('✅ Columna user_id eliminada')

        // Cambiar tipo de administrator_id en hotels si existe
        try {
          this.logger.info('🔄 Actualizando tipo de administrator_id en hotels...')
          await Database.rawQuery(
            'ALTER TABLE `hotels` MODIFY COLUMN `administrator_id` VARCHAR(24) NULL'
          )
          this.logger.success('✅ Tipo de administrator_id actualizado')
        } catch (error) {
          this.logger.info('ℹ️  Columna administrator_id no existe en hotels')
        }

        // Recrear foreign key si la columna existe
        try {
          this.logger.info('🔗 Recreando foreign key...')
          await Database.rawQuery(
            'ALTER TABLE `hotels` ADD CONSTRAINT `hotels_administrator_id_foreign` FOREIGN KEY (`administrator_id`) REFERENCES `administrators` (`id`) ON DELETE SET NULL'
          )
          this.logger.success('✅ Foreign key recreada')
        } catch (error) {
          this.logger.info('ℹ️  No se pudo recrear foreign key')
        }
      } else {
        this.logger.success('✅ Columna user_id no existe')
      }

      // Asegurar que id sea PRIMARY KEY y NOT NULL
      this.logger.info('🔑 Configurando id como PRIMARY KEY...')
      try {
        await Database.rawQuery('ALTER TABLE administrators DROP PRIMARY KEY')
      } catch (error) {
        this.logger.info('ℹ️  No hay PRIMARY KEY previa o ya está configurada')
      }
      await Database.rawQuery('ALTER TABLE administrators MODIFY COLUMN id VARCHAR(24) NOT NULL')
      try {
        await Database.rawQuery('ALTER TABLE administrators ADD PRIMARY KEY (id)')
        this.logger.success('✅ PRIMARY KEY configurada')
      } catch (error) {
        this.logger.info('ℹ️  PRIMARY KEY ya existe')
      }

      this.logger.info('📋 Estructura final de administrators:')
      const finalColumns = await Database.rawQuery('SHOW COLUMNS FROM administrators')
      console.table(finalColumns[0])
    } catch (error) {
      this.logger.error('❌ Error: ' + error.message)
    }
  }
}
