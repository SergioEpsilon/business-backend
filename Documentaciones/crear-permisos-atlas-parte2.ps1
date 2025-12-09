# Script PowerShell para crear permisos en MongoDB ATLAS - PARTE 2
# Ejecutar: .\crear-permisos-atlas-parte2.ps1

$mongoUri = "mongodb://SergioBedoya:Arcueid@ac-pev5y96-shard-00-00.g0vqckb.mongodb.net:27017,ac-pev5y96-shard-00-01.g0vqckb.mongodb.net:27017,ac-pev5y96-shard-00-02.g0vqckb.mongodb.net:27017/db_security?ssl=true&replicaSet=atlas-qhsr2b-shard-0&authSource=admin&retryWrites=true&w=majority"

Write-Host "🚀 Continuando creación de permisos - PARTE 2..." -ForegroundColor Cyan
Write-Host ""

function Invoke-MongoCommand {
    param([string]$Command)
    $result = mongosh $mongoUri --quiet --eval $Command 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error: $result" -ForegroundColor Red
        return $false
    }
    return $true
}

# 9. SHIFTS
Write-Host "⏰ Creando permisos de SHIFTS..." -ForegroundColor Cyan
$shiftsCmd = @"
db.permission.insertMany([
  { url: '/api/v1/shifts', method: 'GET', description: 'Listar turnos', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/shifts', method: 'POST', description: 'Crear turno', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/shifts/:id', method: 'GET', description: 'Ver turno', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/shifts/:id', method: 'PUT', description: 'Actualizar turno', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/shifts/:id', method: 'DELETE', description: 'Eliminar turno', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/shifts/:id/drivers', method: 'GET', description: 'Conductores del turno', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/shifts/:id/drivers/:driverId', method: 'POST', description: 'Asignar conductor', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/shifts/:id/drivers/:driverId', method: 'DELETE', description: 'Desasignar conductor', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $shiftsCmd

# 10. MUNICIPALITIES
Write-Host "🏙️ Creando permisos de MUNICIPALITIES..." -ForegroundColor Cyan
$municipalitiesCmd = @"
db.permission.insertMany([
  { url: '/api/v1/municipalities', method: 'GET', description: 'Listar municipios', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/municipalities', method: 'POST', description: 'Crear municipio', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/municipalities/:id', method: 'GET', description: 'Ver municipio', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/municipalities/:id', method: 'PUT', description: 'Actualizar municipio', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/municipalities/:id', method: 'DELETE', description: 'Eliminar municipio', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $municipalitiesCmd

# 11. TOURIST ACTIVITIES
Write-Host "🎭 Creando permisos de TOURIST ACTIVITIES..." -ForegroundColor Cyan
$activitiesCmd = @"
db.permission.insertMany([
  { url: '/api/v1/tourist-activities', method: 'GET', description: 'Listar actividades', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/tourist-activities', method: 'POST', description: 'Crear actividad', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/tourist-activities/:id', method: 'GET', description: 'Ver actividad', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/tourist-activities/:id', method: 'PUT', description: 'Actualizar actividad', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/tourist-activities/:id', method: 'DELETE', description: 'Eliminar actividad', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/tourist-activities/:id/guides', method: 'GET', description: 'Guías de la actividad', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/tourist-activities/:id/guides/:guideId', method: 'POST', description: 'Asignar guía', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/tourist-activities/:id/guides/:guideId', method: 'DELETE', description: 'Desasignar guía', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $activitiesCmd

# 12. PLANS
Write-Host "📋 Creando permisos de PLANS..." -ForegroundColor Cyan
$plansCmd = @"
db.permission.insertMany([
  { url: '/api/v1/plans', method: 'GET', description: 'Listar planes', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/plans', method: 'POST', description: 'Crear plan', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/plans/:id', method: 'GET', description: 'Ver plan', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/plans/:id', method: 'PUT', description: 'Actualizar plan', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/plans/:id', method: 'DELETE', description: 'Eliminar plan', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/plans/:id/tourist-activities', method: 'GET', description: 'Actividades del plan', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/plans/:id/tourist-activities/:activityId', method: 'POST', description: 'Asignar actividad', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/plans/:id/tourist-activities/:activityId', method: 'DELETE', description: 'Desasignar actividad', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $plansCmd

# 13. TRIPS
Write-Host "🧳 Creando permisos de TRIPS..." -ForegroundColor Cyan
$tripsCmd = @"
db.permission.insertMany([
  { url: '/api/v1/trips', method: 'GET', description: 'Listar viajes', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/trips', method: 'POST', description: 'Crear viaje', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/trips/:id', method: 'GET', description: 'Ver viaje', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/trips/:id', method: 'PUT', description: 'Actualizar viaje', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/trips/:id', method: 'DELETE', description: 'Eliminar viaje', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/trips/:id/plans', method: 'GET', description: 'Planes del viaje', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/trips/:id/plans/:planId', method: 'POST', description: 'Asignar plan', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/trips/:id/plans/:planId', method: 'DELETE', description: 'Desasignar plan', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $tripsCmd

# 14. ROUTES
Write-Host "🗺️ Creando permisos de ROUTES..." -ForegroundColor Cyan
$routesCmd = @"
db.permission.insertMany([
  { url: '/api/v1/routes', method: 'GET', description: 'Listar rutas', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/routes', method: 'POST', description: 'Crear ruta', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/routes/:id', method: 'GET', description: 'Ver ruta', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/routes/:id', method: 'PUT', description: 'Actualizar ruta', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/routes/:id', method: 'DELETE', description: 'Eliminar ruta', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/routes/:id/vehicles', method: 'GET', description: 'Vehículos de la ruta', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/routes/:id/vehicles/:vehicleId', method: 'POST', description: 'Asignar vehículo', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/routes/:id/vehicles/:vehicleId', method: 'DELETE', description: 'Desasignar vehículo', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $routesCmd

Write-Host "`n📊 Verificando permisos creados..." -ForegroundColor Yellow
$count = mongosh $mongoUri --quiet --eval "db.permission.countDocuments()"
Write-Host "✅ Total de permisos en MongoDB Atlas: $count" -ForegroundColor Green

Write-Host "`n🎉 ¡Parte 2 completada! (93 permisos totales)" -ForegroundColor Green
Write-Host "💡 Para finalizar, ejecuta: .\crear-permisos-atlas-parte3.ps1" -ForegroundColor Cyan
