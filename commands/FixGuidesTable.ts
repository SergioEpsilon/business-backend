import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'

export default class FixGuidesTable extends BaseCommand {
  public static commandName = 'fix:guides_table'
  public static description = 'Fix guides table structure (remove user_id column)'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    try {
      this.logger.info('🔧 Verificando estructura de guides...')

      const columns = await Database.rawQuery('SHOW COLUMNS FROM guides')
      const hasUserId = columns[0].some((col: any) => col.Field === 'user_id')

      if (hasUserId) {
        this.logger.warning('⚠️  Columna user_id encontrada')

        // Eliminar foreign keys relacionadas si existen
        const foreignKeys = [
          {
            table: 'guide_tourist_activity',
            constraint: 'guide_tourist_activity_guide_id_foreign',
          },
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

        // Eliminar columna user_id
        this.logger.info('🗑️  Eliminando columna user_id...')
        await Database.rawQuery('ALTER TABLE guides DROP COLUMN user_id')
        this.logger.success('✅ Columna user_id eliminada')

        // Cambiar tipo de guide_id en guide_tourist_activity
        this.logger.info('🔄 Actualizando tipo de guide_id en guide_tourist_activity...')
        await Database.rawQuery(
          'ALTER TABLE `guide_tourist_activity` MODIFY COLUMN `guide_id` VARCHAR(24) NOT NULL'
        )
        this.logger.success('✅ Tipo de guide_id actualizado')

        // Recrear foreign key
        this.logger.info('🔗 Recreando foreign key...')
        await Database.rawQuery(
          'ALTER TABLE `guide_tourist_activity` ADD CONSTRAINT `guide_tourist_activity_guide_id_foreign` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`) ON DELETE CASCADE'
        )
        this.logger.success('✅ Foreign key recreada')
      } else {
        this.logger.success('✅ Columna user_id no existe')
      }

      // Asegurar que id sea PRIMARY KEY y NOT NULL
      this.logger.info('🔑 Configurando id como PRIMARY KEY...')
      try {
        await Database.rawQuery('ALTER TABLE guides DROP PRIMARY KEY')
      } catch (error) {
        this.logger.info('ℹ️  No hay PRIMARY KEY previa')
      }
      await Database.rawQuery('ALTER TABLE guides MODIFY COLUMN id VARCHAR(24) NOT NULL')
      await Database.rawQuery('ALTER TABLE guides ADD PRIMARY KEY (id)')
      this.logger.success('✅ PRIMARY KEY configurada')

      this.logger.info('📋 Estructura final de guides:')
      const finalColumns = await Database.rawQuery('SHOW COLUMNS FROM guides')
      console.table(finalColumns[0])
    } catch (error) {
      this.logger.error('❌ Error: ' + error.message)
    }
  }
}
