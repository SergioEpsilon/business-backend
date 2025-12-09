# Script PowerShell para crear TODOS los permisos en MongoDB ATLAS
# Ejecutar: .\crear-permisos-atlas-completo.ps1

$mongoUri = "mongodb://SergioBedoya:Arcueid@ac-pev5y96-shard-00-00.g0vqckb.mongodb.net:27017,ac-pev5y96-shard-00-01.g0vqckb.mongodb.net:27017,ac-pev5y96-shard-00-02.g0vqckb.mongodb.net:27017/db_security?ssl=true&replicaSet=atlas-qhsr2b-shard-0&authSource=admin&retryWrites=true&w=majority"

Write-Host "🚀 Iniciando creación de permisos en MongoDB ATLAS..." -ForegroundColor Cyan
Write-Host "📡 Conectando a: MongoDB Atlas - db_security" -ForegroundColor Yellow
Write-Host ""

# Función para ejecutar comando MongoDB
function Invoke-MongoCommand {
    param([string]$Command)
    $result = mongosh $mongoUri --quiet --eval $Command 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error: $result" -ForegroundColor Red
        return $false
    }
    return $true
}

# 1. LIMPIAR TODOS LOS PERMISOS EXISTENTES
Write-Host "🧹 Limpiando TODOS los permisos existentes..." -ForegroundColor Yellow
$cleanCmd = "db.permission.deleteMany({})"
Invoke-MongoCommand $cleanCmd
Write-Host "✅ Limpieza completada`n" -ForegroundColor Green

# 2. CREAR PERMISOS - CLIENTS
Write-Host "👥 Creando permisos de CLIENTS..." -ForegroundColor Cyan
$clientsCmd = @"
db.permission.insertMany([
  { url: '/api/v1/clients', method: 'GET', description: 'Listar clientes', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/clients', method: 'POST', description: 'Crear cliente', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/clients/:id', method: 'GET', description: 'Ver cliente', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/clients/:id', method: 'PUT', description: 'Actualizar cliente', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/clients/:id', method: 'DELETE', description: 'Eliminar cliente', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/clients/:id/trips', method: 'GET', description: 'Ver viajes del cliente', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/clients/:id/trips/:tripId', method: 'POST', description: 'Asignar viaje', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/clients/:id/trips/:tripId', method: 'DELETE', description: 'Desasignar viaje', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $clientsCmd

# 3. GUIDES
Write-Host "🧭 Creando permisos de GUIDES..." -ForegroundColor Cyan
$guidesCmd = @"
db.permission.insertMany([
  { url: '/api/v1/guides', method: 'GET', description: 'Listar guías', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/guides/available', method: 'GET', description: 'Guías disponibles', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/guides', method: 'POST', description: 'Crear guía', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/guides/:id', method: 'GET', description: 'Ver guía', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/guides/:id', method: 'PUT', description: 'Actualizar guía', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/guides/:id', method: 'DELETE', description: 'Eliminar guía', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/guides/:id/activities', method: 'GET', description: 'Actividades del guía', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/guides/:id/toggle-availability', method: 'PATCH', description: 'Cambiar disponibilidad', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $guidesCmd

# 4. ADMINISTRATORS
Write-Host "👔 Creando permisos de ADMINISTRATORS..." -ForegroundColor Cyan
$adminsCmd = @"
db.permission.insertMany([
  { url: '/api/v1/administrators', method: 'GET', description: 'Listar administradores', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/administrators', method: 'POST', description: 'Crear administrador', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/administrators/:id', method: 'GET', description: 'Ver administrador', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/administrators/:id', method: 'PUT', description: 'Actualizar administrador', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/administrators/:id', method: 'DELETE', description: 'Eliminar administrador', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/administrators/:id/permissions', method: 'PATCH', description: 'Actualizar permisos', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $adminsCmd

# 5. DRIVERS
Write-Host "🚗 Creando permisos de DRIVERS..." -ForegroundColor Cyan
$driversCmd = @"
db.permission.insertMany([
  { url: '/api/v1/drivers', method: 'GET', description: 'Listar conductores', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/drivers/stats', method: 'GET', description: 'Estadísticas de conductores', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/drivers', method: 'POST', description: 'Crear conductor', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/drivers/weather-alert', method: 'POST', description: 'Alerta meteorológica', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/drivers/:id', method: 'GET', description: 'Ver conductor', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/drivers/:id', method: 'PUT', description: 'Actualizar conductor', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/drivers/:id', method: 'DELETE', description: 'Eliminar conductor', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/drivers/:id/validate', method: 'GET', description: 'Validar conductor', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $driversCmd

# 6. VEHICLES
Write-Host "🚙 Creando permisos de VEHICLES..." -ForegroundColor Cyan
$vehiclesCmd = @"
db.permission.insertMany([
  { url: '/api/v1/vehicles', method: 'GET', description: 'Listar vehículos', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/vehicles', method: 'POST', description: 'Crear vehículo', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/vehicles/:id', method: 'GET', description: 'Ver vehículo', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/vehicles/:id', method: 'PUT', description: 'Actualizar vehículo', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/vehicles/:id', method: 'DELETE', description: 'Eliminar vehículo', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/vehicles/:id/drivers', method: 'GET', description: 'Conductores del vehículo', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/vehicles/:id/routes', method: 'GET', description: 'Rutas del vehículo', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/vehicles/:id/gps', method: 'GET', description: 'GPS del vehículo', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $vehiclesCmd

# 7. CARS
Write-Host "🚗 Creando permisos de CARS..." -ForegroundColor Cyan
$carsCmd = @"
db.permission.insertMany([
  { url: '/api/v1/cars', method: 'GET', description: 'Listar autos', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/cars', method: 'POST', description: 'Crear auto', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/cars/:id', method: 'GET', description: 'Ver auto', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/cars/:id', method: 'PUT', description: 'Actualizar auto', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/cars/:id', method: 'DELETE', description: 'Eliminar auto', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $carsCmd

# 8. AIRCRAFTS
Write-Host "✈️ Creando permisos de AIRCRAFTS..." -ForegroundColor Cyan
$aircraftsCmd = @"
db.permission.insertMany([
  { url: '/api/v1/aircrafts', method: 'GET', description: 'Listar aeronaves', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/aircrafts', method: 'POST', description: 'Crear aeronave', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/aircrafts/:id', method: 'GET', description: 'Ver aeronave', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/aircrafts/:id', method: 'PUT', description: 'Actualizar aeronave', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/aircrafts/:id', method: 'DELETE', description: 'Eliminar aeronave', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $aircraftsCmd

Write-Host "`n📊 Verificando permisos creados..." -ForegroundColor Yellow
$count = mongosh $mongoUri --quiet --eval "db.permission.countDocuments()"
Write-Host "✅ Total de permisos en MongoDB Atlas: $count" -ForegroundColor Green

Write-Host "`n🎉 ¡Script completado! Parte 1 de 3 (48 permisos)" -ForegroundColor Green
Write-Host "💡 Para continuar, ejecuta: .\crear-permisos-atlas-parte2.ps1" -ForegroundColor Cyan
