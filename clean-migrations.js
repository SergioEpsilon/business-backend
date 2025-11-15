const mysql = require('mysql2/promise')

async function cleanMigrations() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'adonisuser',
    password: 'Adonis2025!',
    database: 'bussiness-backend',
  })

  try {
    await conn.query('DELETE FROM adonis_schema WHERE name IN (?, ?)', [
      'database/migrations/1763055021000_alter_drivers_user_id',
      'database/migrations/1763055023000_alter_drivers_and_shifts_to_string_ids',
    ])
    console.log('Registros de migraciones eliminados')

    const [rows] = await conn.query('SELECT name FROM adonis_schema ORDER BY id DESC LIMIT 5')
    console.log('\nÚltimas migraciones:')
    rows.forEach((row) => console.log('-', row.name))
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await conn.end()
  }
}

cleanMigrations()
