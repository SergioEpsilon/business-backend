import Database from '@ioc:Adonis/Lucid/Database'

async function fixClientsTable() {
  try {
    console.log('🔧 Verificando estructura de clients...')

    const columns = await Database.rawQuery('SHOW COLUMNS FROM clients')
    console.log('📋 Columnas actuales:', columns[0])

    const hasIdOld = columns[0].some((col: any) => col.Field === 'id_old')

    if (hasIdOld) {
      console.log('⚠️  Columna id_old encontrada, eliminando...')
      await Database.rawQuery('ALTER TABLE clients DROP COLUMN id_old')
      console.log('✅ Columna id_old eliminada')
    } else {
      console.log('✅ Columna id_old no existe')
    }

    console.log('🧹 Limpiando migraciones corruptas...')
    await Database.rawQuery(
      "DELETE FROM adonis_schema WHERE name IN ('database/migrations/1768791000000_clients_prepare_string_id', 'database/migrations/1768792000000_clients_add_string_id')"
    )
    console.log('✅ Migraciones corruptas eliminadas')

    console.log('📋 Estructura final:')
    const finalColumns = await Database.rawQuery('SHOW COLUMNS FROM clients')
    console.table(finalColumns[0])

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

fixClientsTable()
