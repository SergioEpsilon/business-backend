const Database = require('@adonisjs/lucid/build/src/Database').default

async function fixMigrations() {
  const db = Database.manager.connection('mysql')

  try {
    // Eliminar registros de migraciones problemáticas
    await db.rawQuery('DELETE FROM adonis_schema WHERE name = ?', [
      'database/migrations/1763055021000_alter_drivers_user_id',
    ])
    await db.rawQuery('DELETE FROM adonis_schema WHERE name = ?', [
      'database/migrations/1763055023000_alter_drivers_and_shifts_to_string_ids',
    ])

    console.log('Registros de migraciones eliminados')

    // Verificar las tablas actuales
    const [drivers] = await db.rawQuery('DESCRIBE drivers')
    console.log('\nEstructura de drivers:')
    console.log(drivers)
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await db.manager.closeAll()
  }
}

fixMigrations()
