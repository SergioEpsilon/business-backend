/**
 * Script para limpiar migraciones corruptas de la base de datos
 * Ejecutar: node clean-corrupt-migrations.js
 */

const mysql = require('mysql2/promise')
require('dotenv').config()

async function cleanCorruptMigrations() {
  console.log('🔧 Limpiando migraciones corruptas...\n')

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
  })

  try {
    // Obtener todas las migraciones corruptas
    const [rows] = await connection.execute(
      `SELECT name, batch FROM adonis_schema WHERE name LIKE '%1699851%'`
    )

    if (rows.length === 0) {
      console.log('✅ No hay migraciones corruptas para limpiar.')
      return
    }

    console.log(`❌ Encontradas ${rows.length} migraciones corruptas:\n`)
    rows.forEach((row) => {
      console.log(`   - ${row.name} (batch ${row.batch})`)
    })

    // Eliminar migraciones corruptas
    const [result] = await connection.execute(
      `DELETE FROM adonis_schema WHERE name LIKE '%1699851%'`
    )

    console.log(`\n✅ Eliminadas ${result.affectedRows} migraciones corruptas.`)
    console.log('\n📋 Ahora puedes ejecutar: node ace migration:run')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await connection.end()
  }
}

cleanCorruptMigrations()
