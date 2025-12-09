# Script PowerShell para crear permisos en MongoDB ATLAS - PARTE 3 (FINAL)
# Ejecutar: .\crear-permisos-atlas-parte3.ps1

$mongoUri = "mongodb://SergioBedoya:Arcueid@ac-pev5y96-shard-00-00.g0vqckb.mongodb.net:27017,ac-pev5y96-shard-00-01.g0vqckb.mongodb.net:27017,ac-pev5y96-shard-00-02.g0vqckb.mongodb.net:27017/db_security?ssl=true&replicaSet=atlas-qhsr2b-shard-0&authSource=admin&retryWrites=true&w=majority"

Write-Host "🚀 Finalizando creación de permisos - PARTE 3..." -ForegroundColor Cyan
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

# 15. INVOICES
Write-Host "💰 Creando permisos de INVOICES..." -ForegroundColor Cyan
$invoicesCmd = @"
db.permission.insertMany([
  { url: '/api/v1/invoices', method: 'GET', description: 'Listar facturas', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/invoices/reports', method: 'GET', description: 'Reportes de facturas', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/invoices', method: 'POST', description: 'Crear factura', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/invoices/:id', method: 'GET', description: 'Ver factura', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/invoices/:id', method: 'PUT', description: 'Actualizar factura', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/invoices/:id', method: 'DELETE', description: 'Eliminar factura', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/invoices/:id/installments', method: 'GET', description: 'Cuotas de la factura', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/invoices/:id/email', method: 'POST', description: 'Enviar factura por email', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $invoicesCmd

# 16. INSTALLMENTS
Write-Host "💳 Creando permisos de INSTALLMENTS..." -ForegroundColor Cyan
$installmentsCmd = @"
db.permission.insertMany([
  { url: '/api/v1/installments', method: 'GET', description: 'Listar cuotas', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/installments', method: 'POST', description: 'Crear cuota', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/installments/:id', method: 'GET', description: 'Ver cuota', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/installments/:id', method: 'PUT', description: 'Actualizar cuota', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/installments/:id', method: 'DELETE', description: 'Eliminar cuota', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/installments/:id/pay', method: 'POST', description: 'Pagar cuota', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/installments/:id/late-fee', method: 'POST', description: 'Agregar mora', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $installmentsCmd

# 17. BANK CARDS
Write-Host "💳 Creando permisos de BANK CARDS..." -ForegroundColor Cyan
$cardsCmd = @"
db.permission.insertMany([
  { url: '/api/v1/bank-cards', method: 'GET', description: 'Listar tarjetas', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/bank-cards', method: 'POST', description: 'Crear tarjeta', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/bank-cards/:id', method: 'GET', description: 'Ver tarjeta', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/bank-cards/:id', method: 'PUT', description: 'Actualizar tarjeta', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/bank-cards/:id', method: 'DELETE', description: 'Eliminar tarjeta', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/bank-cards/:id/verify', method: 'POST', description: 'Verificar tarjeta', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $cardsCmd

# 18. HOTELS
Write-Host "🏨 Creando permisos de HOTELS..." -ForegroundColor Cyan
$hotelsCmd = @"
db.permission.insertMany([
  { url: '/api/v1/hotels', method: 'GET', description: 'Listar hoteles', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/hotels', method: 'POST', description: 'Crear hotel', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/hotels/:id', method: 'GET', description: 'Ver hotel', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/hotels/:id', method: 'PUT', description: 'Actualizar hotel', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/hotels/:id', method: 'DELETE', description: 'Eliminar hotel', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/hotels/:id/rooms', method: 'GET', description: 'Habitaciones del hotel', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $hotelsCmd

# 19. ROOMS
Write-Host "🛏️ Creando permisos de ROOMS..." -ForegroundColor Cyan
$roomsCmd = @"
db.permission.insertMany([
  { url: '/api/v1/rooms', method: 'GET', description: 'Listar habitaciones', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/rooms', method: 'POST', description: 'Crear habitación', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/rooms/:id', method: 'GET', description: 'Ver habitación', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/rooms/:id', method: 'PUT', description: 'Actualizar habitación', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/rooms/:id', method: 'DELETE', description: 'Eliminar habitación', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $roomsCmd

# 20. ITINERARY TRANSPORTS
Write-Host "🚌 Creando permisos de ITINERARY TRANSPORTS..." -ForegroundColor Cyan
$itineraryCmd = @"
db.permission.insertMany([
  { url: '/api/v1/itinerary-transports', method: 'GET', description: 'Listar transportes de itinerario', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/itinerary-transports', method: 'POST', description: 'Crear transporte de itinerario', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/itinerary-transports/:id', method: 'GET', description: 'Ver transporte de itinerario', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/itinerary-transports/:id', method: 'PUT', description: 'Actualizar transporte de itinerario', _class: 'sb.proyecto.Models.Permission' },
  { url: '/api/v1/itinerary-transports/:id', method: 'DELETE', description: 'Eliminar transporte de itinerario', _class: 'sb.proyecto.Models.Permission' }
])
"@
Invoke-MongoCommand $itineraryCmd

Write-Host "`n📊 Verificando permisos totales..." -ForegroundColor Yellow
$count = mongosh $mongoUri --quiet --eval "db.permission.countDocuments()"
Write-Host "✅ Total de permisos en MongoDB Atlas: $count" -ForegroundColor Green

# VERIFICACIÓN DETALLADA
Write-Host "`n🔍 Verificación detallada por módulo:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

$modules = @(
    "CLIENTS:/api/v1/clients",
    "GUIDES:/api/v1/guides",
    "ADMINISTRATORS:/api/v1/administrators",
    "DRIVERS:/api/v1/drivers",
    "VEHICLES:/api/v1/vehicles",
    "CARS:/api/v1/cars",
    "AIRCRAFTS:/api/v1/aircrafts",
    "SHIFTS:/api/v1/shifts",
    "MUNICIPALITIES:/api/v1/municipalities",
    "TOURIST ACTIVITIES:/api/v1/tourist-activities",
    "PLANS:/api/v1/plans",
    "TRIPS:/api/v1/trips",
    "ROUTES:/api/v1/routes",
    "INVOICES:/api/v1/invoices",
    "INSTALLMENTS:/api/v1/installments",
    "BANK CARDS:/api/v1/bank-cards",
    "HOTELS:/api/v1/hotels",
    "ROOMS:/api/v1/rooms",
    "ITINERARY TRANSPORTS:/api/v1/itinerary-transports"
)

foreach ($module in $modules) {
    $parts = $module -split ':'
    $name = $parts[0]
    $pattern = $parts[1]
    $countCmd = "db.permission.countDocuments({ url: { `$regex: '^$pattern' } })"
    $moduleCount = mongosh $mongoUri --quiet --eval $countCmd
    $color = if ($moduleCount -gt 0) { "Green" } else { "Red" }
    Write-Host "$name : $moduleCount permisos" -ForegroundColor $color
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "🎉 ¡TODOS LOS PERMISOS CREADOS EN MONGODB ATLAS!" -ForegroundColor Green
Write-Host "`n📝 Próximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Verifica en MongoDB Compass con la URL de Atlas" -ForegroundColor Cyan
Write-Host "  2. Conecta a: db_security (no ms-security)" -ForegroundColor Cyan
Write-Host "  3. Revisa la colección 'permission'" -ForegroundColor Cyan
Write-Host "  4. Crea roles en MS-SECURITY" -ForegroundColor Cyan
Write-Host "  5. Asigna permisos a roles" -ForegroundColor Cyan
Write-Host "  6. Prueba con Postman" -ForegroundColor Cyan
Write-Host ""
