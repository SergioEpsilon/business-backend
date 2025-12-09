# Script para crear roles de lógica de negocios con sus permisos
# Ejecutar: .\crear-roles-negocio.ps1

$mongoUri = "mongodb://SergioBedoya:Arcueid@ac-pev5y96-shard-00-00.g0vqckb.mongodb.net:27017,ac-pev5y96-shard-00-01.g0vqckb.mongodb.net:27017,ac-pev5y96-shard-00-02.g0vqckb.mongodb.net:27017/db_security?ssl=true&replicaSet=atlas-qhsr2b-shard-0&authSource=admin&retryWrites=true&w=majority"

Write-Host "🚀 Creando roles de lógica de negocios..." -ForegroundColor Cyan
Write-Host ""

# Función para ejecutar comando MongoDB
function Invoke-MongoCommand {
    param([string]$Command)
    $result = mongosh $mongoUri --quiet --eval $Command 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error: $result" -ForegroundColor Red
        return $null
    }
    return $result
}

Write-Host "📋 Obteniendo IDs de permisos..." -ForegroundColor Yellow

# 1. ROLE: CLIENTE
# Permisos: Ver y actualizar sus propios datos, ver sus viajes, ver facturas e installments
Write-Host "`n👤 Creando rol: CLIENTE..." -ForegroundColor Cyan

$clientPerms = @"
var perms = db.permission.find({
  `$or: [
    { url: '/api/v1/clients/:id', method: 'GET' },
    { url: '/api/v1/clients/:id', method: 'PUT' },
    { url: '/api/v1/clients/:id/trips', method: 'GET' },
    { url: '/api/v1/trips/:id', method: 'GET' },
    { url: '/api/v1/invoices/:id', method: 'GET' },
    { url: '/api/v1/installments', method: 'GET' },
    { url: '/api/v1/installments/:id', method: 'GET' },
    { url: '/api/v1/installments/:id/pay', method: 'POST' },
    { url: '/api/v1/bank-cards', method: 'GET' },
    { url: '/api/v1/bank-cards', method: 'POST' },
    { url: '/api/v1/bank-cards/:id', method: 'GET' },
    { url: '/api/v1/bank-cards/:id', method: 'PUT' },
    { url: '/api/v1/bank-cards/:id', method: 'DELETE' }
  ]
}).toArray();
var permIds = perms.map(p => p._id);
var existingRole = db.role.findOne({ name: 'CLIENTE' });
if (existingRole) {
  db.role.updateOne(
    { name: 'CLIENTE' },
    { `$set: { permissions: permIds } }
  );
  print('✓ Rol CLIENTE actualizado');
} else {
  db.role.insertOne({
    name: 'CLIENTE',
    identification: 'Cliente - Ver sus datos, viajes, facturas y gestionar tarjetas',
    permissions: permIds,
    _class: 'sb.proyecto.Models.Role'
  });
  print('✓ Rol CLIENTE creado');
}
print('Permisos asignados: ' + permIds.length);
"@

Invoke-MongoCommand $clientPerms

# 2. ROLE: GUIA
# Permisos: Ver y actualizar su perfil, ver actividades turísticas, gestionar disponibilidad
Write-Host "`n🧭 Creando rol: GUIA..." -ForegroundColor Cyan

$guidePerms = @"
var perms = db.permission.find({
  `$or: [
    { url: '/api/v1/guides/:id', method: 'GET' },
    { url: '/api/v1/guides/:id', method: 'PUT' },
    { url: '/api/v1/guides/:id/activities', method: 'GET' },
    { url: '/api/v1/guides/:id/toggle-availability', method: 'PATCH' },
    { url: '/api/v1/tourist-activities', method: 'GET' },
    { url: '/api/v1/tourist-activities/:id', method: 'GET' },
    { url: '/api/v1/plans', method: 'GET' },
    { url: '/api/v1/plans/:id', method: 'GET' }
  ]
}).toArray();
var permIds = perms.map(p => p._id);
var existingRole = db.role.findOne({ name: 'GUIA' });
if (existingRole) {
  db.role.updateOne(
    { name: 'GUIA' },
    { `$set: { permissions: permIds } }
  );
  print('✓ Rol GUIA actualizado');
} else {
  db.role.insertOne({
    name: 'GUIA',
    identification: 'Guía turístico - Gestionar disponibilidad y ver actividades',
    permissions: permIds,
    _class: 'sb.proyecto.Models.Role'
  });
  print('✓ Rol GUIA creado');
}
print('Permisos asignados: ' + permIds.length);
"@

Invoke-MongoCommand $guidePerms

# 3. ROLE: CONDUCTOR
# Permisos: Ver su perfil, ver vehículos asignados, rutas, turnos
Write-Host "`n🚗 Creando rol: CONDUCTOR..." -ForegroundColor Cyan

$driverPerms = @"
var perms = db.permission.find({
  `$or: [
    { url: '/api/v1/drivers/:id', method: 'GET' },
    { url: '/api/v1/drivers/:id', method: 'PUT' },
    { url: '/api/v1/drivers/:id/validate', method: 'GET' },
    { url: '/api/v1/vehicles', method: 'GET' },
    { url: '/api/v1/vehicles/:id', method: 'GET' },
    { url: '/api/v1/vehicles/:id/routes', method: 'GET' },
    { url: '/api/v1/routes', method: 'GET' },
    { url: '/api/v1/routes/:id', method: 'GET' },
    { url: '/api/v1/shifts', method: 'GET' },
    { url: '/api/v1/shifts/:id', method: 'GET' },
    { url: '/api/v1/shifts/:id/drivers', method: 'GET' }
  ]
}).toArray();
var permIds = perms.map(p => p._id);
var existingRole = db.role.findOne({ name: 'CONDUCTOR' });
if (existingRole) {
  db.role.updateOne(
    { name: 'CONDUCTOR' },
    { `$set: { permissions: permIds } }
  );
  print('✓ Rol CONDUCTOR actualizado');
} else {
  db.role.insertOne({
    name: 'CONDUCTOR',
    identification: 'Conductor - Ver vehículos, rutas y turnos asignados',
    permissions: permIds,
    _class: 'sb.proyecto.Models.Role'
  });
  print('✓ Rol CONDUCTOR creado');
}
print('Permisos asignados: ' + permIds.length);
"@

Invoke-MongoCommand $driverPerms

# 4. ROLE: ADMINISTRADOR_HOTEL
# Permisos: Gestionar hoteles y habitaciones
Write-Host "`n🏨 Creando rol: ADMINISTRADOR_HOTEL..." -ForegroundColor Cyan

$hotelAdminPerms = @"
var perms = db.permission.find({
  `$or: [
    { url: '/api/v1/hotels', method: 'GET' },
    { url: '/api/v1/hotels/:id', method: 'GET' },
    { url: '/api/v1/hotels/:id', method: 'PUT' },
    { url: '/api/v1/hotels/:id/rooms', method: 'GET' },
    { url: '/api/v1/rooms', method: 'GET' },
    { url: '/api/v1/rooms', method: 'POST' },
    { url: '/api/v1/rooms/:id', method: 'GET' },
    { url: '/api/v1/rooms/:id', method: 'PUT' },
    { url: '/api/v1/rooms/:id', method: 'DELETE' }
  ]
}).toArray();
var permIds = perms.map(p => p._id);
var existingRole = db.role.findOne({ name: 'ADMINISTRADOR_HOTEL' });
if (existingRole) {
  db.role.updateOne(
    { name: 'ADMINISTRADOR_HOTEL' },
    { `$set: { permissions: permIds } }
  );
  print('✓ Rol ADMINISTRADOR_HOTEL actualizado');
} else {
  db.role.insertOne({
    name: 'ADMINISTRADOR_HOTEL',
    identification: 'Administrador de Hotel - Gestionar hoteles y habitaciones',
    permissions: permIds,
    _class: 'sb.proyecto.Models.Role'
  });
  print('✓ Rol ADMINISTRADOR_HOTEL creado');
}
print('Permisos asignados: ' + permIds.length);
"@

Invoke-MongoCommand $hotelAdminPerms

# 5. ROLE: GERENTE_OPERACIONES
# Permisos: Ver reportes, gestionar viajes, rutas, vehículos (operaciones generales)
Write-Host "`n📊 Creando rol: GERENTE_OPERACIONES..." -ForegroundColor Cyan

$managerPerms = @"
var perms = db.permission.find({
  `$or: [
    { url: '/api/v1/clients', method: 'GET' },
    { url: '/api/v1/guides', method: 'GET' },
    { url: '/api/v1/guides/available', method: 'GET' },
    { url: '/api/v1/drivers', method: 'GET' },
    { url: '/api/v1/drivers/stats', method: 'GET' },
    { url: '/api/v1/vehicles', method: 'GET' },
    { url: '/api/v1/trips', method: 'GET' },
    { url: '/api/v1/trips', method: 'POST' },
    { url: '/api/v1/trips/:id', method: 'GET' },
    { url: '/api/v1/trips/:id', method: 'PUT' },
    { url: '/api/v1/routes', method: 'GET' },
    { url: '/api/v1/routes', method: 'POST' },
    { url: '/api/v1/routes/:id', method: 'GET' },
    { url: '/api/v1/routes/:id', method: 'PUT' },
    { url: '/api/v1/invoices', method: 'GET' },
    { url: '/api/v1/invoices/reports', method: 'GET' },
    { url: '/api/v1/invoices/:id', method: 'GET' },
    { url: '/api/v1/shifts', method: 'GET' },
    { url: '/api/v1/shifts', method: 'POST' },
    { url: '/api/v1/shifts/:id', method: 'GET' },
    { url: '/api/v1/shifts/:id', method: 'PUT' }
  ]
}).toArray();
var permIds = perms.map(p => p._id);
var existingRole = db.role.findOne({ name: 'GERENTE_OPERACIONES' });
if (existingRole) {
  db.role.updateOne(
    { name: 'GERENTE_OPERACIONES' },
    { `$set: { permissions: permIds } }
  );
  print('✓ Rol GERENTE_OPERACIONES actualizado');
} else {
  db.role.insertOne({
    name: 'GERENTE_OPERACIONES',
    identification: 'Gerente de Operaciones - Gestionar viajes, rutas y ver reportes',
    permissions: permIds,
    _class: 'sb.proyecto.Models.Role'
  });
  print('✓ Rol GERENTE_OPERACIONES creado');
}
print('Permisos asignados: ' + permIds.length);
"@

Invoke-MongoCommand $managerPerms

Write-Host "`n============================================" -ForegroundColor DarkGray
Write-Host "Roles de negocio creados exitosamente" -ForegroundColor Green
Write-Host "`nResumen de roles:" -ForegroundColor Yellow

$summary = "db.role.find({}, {name: 1, _id: 0}).forEach(function(r) { print(r.name); }); print('Total: ' + db.role.countDocuments());"
Invoke-MongoCommand $summary

Write-Host "`nCompletado!" -ForegroundColor Green
Write-Host "`nProximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Verifica en MongoDB Compass los roles creados" -ForegroundColor Cyan
Write-Host "  2. Asigna roles a usuarios en MS-SECURITY" -ForegroundColor Cyan
Write-Host "  3. Prueba con Postman el flujo completo" -ForegroundColor Cyan
Write-Host ""
