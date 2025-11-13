const mysql = require('mysql2/promise')

async function fixDriversTable() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'adonisuser',
    password: 'Adonis2025!',
    database: 'bussiness-backend',
  })

  try {
    console.log('Eliminando tabla drivers...')
    await connection.execute('DROP TABLE IF EXISTS drivers')
    console.log('✅ Tabla drivers eliminada')
    
    console.log('Ejecuta: node ace migration:run')
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await connection.end()
  }
}

fixDriversTable()
