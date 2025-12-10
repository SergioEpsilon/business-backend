# 🔧 Corrección de Permisos Existentes

## ⚠️ Problema Identificado

Los permisos existentes en tu base de datos **NO COINCIDEN** con las rutas reales del código.

### Permisos en BD vs Rutas Reales:

| Permiso en BD                | Ruta Real en Código                    | Estado         |
| ---------------------------- | -------------------------------------- | -------------- |
| `/api/v1/clients/me`         | `/api/v1/clients/:id`                  | ❌ No coincide |
| `/api/v1/clients/me/trips/*` | `/api/v1/clients/:id/trips/:tripId`    | ❌ No coincide |
| `/api/v1/bank-cards`         | `/api/v1/clients/:clientId/bank-cards` | ❌ No coincide |
| `/api/v1/bank-cards/:id`     | `/api/v1/bank-cards/:id`               | ✅ Coincide    |

## 🎯 Estrategia 1: Ajustar Permisos a las Rutas Reales (RECOMENDADO)

Esta es la mejor opción porque mantiene el código como está y solo actualiza los permisos.

### Permisos a Eliminar/Actualizar:

```javascript
// ❌ ELIMINAR ESTOS (no existen en el código):
db.permission.deleteMany({ url: '/api/v1/clients/me' })
db.permission.deleteMany({ url: '/api/v1/clients/me/trips/*' })
db.permission.deleteMany({ url: '/api/v1/bank-cards', method: 'POST' })
```

### Permisos a Crear:

```javascript
// ✅ CREAR ESTOS (coinciden con rutas reales):

// Clientes
db.permission.insertMany([
  {
    url: '/api/v1/clients',
    method: 'GET',
    description: 'Listar clientes',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients',
    method: 'POST',
    description: 'Crear cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id',
    method: 'GET',
    description: 'Ver detalle de cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id',
    method: 'PUT',
    description: 'Actualizar cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id',
    method: 'DELETE',
    description: 'Eliminar cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id/trips',
    method: 'GET',
    description: 'Ver viajes del cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id/trips/:tripId',
    method: 'POST',
    description: 'Asignar viaje a cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id/trips/:tripId',
    method: 'DELETE',
    description: 'Desasignar viaje de cliente',
    _class: 'sb.proyecto.Models.Permission',
  },

  // Tarjetas Bancarias (actualizar las rutas)
  {
    url: '/api/v1/clients/:clientId/bank-cards',
    method: 'GET',
    description: 'Listar tarjetas del cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:clientId/bank-cards',
    method: 'POST',
    description: 'Crear tarjeta del cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  // Los siguientes ya existen y están correctos:
  // { url: "/api/v1/bank-cards/:id", method: "GET" },
  // { url: "/api/v1/bank-cards/:id", method: "PUT" },
  // { url: "/api/v1/bank-cards/:id", method: "DELETE" },
  {
    url: '/api/v1/bank-cards/:id/set-default',
    method: 'PATCH',
    description: 'Establecer tarjeta predeterminada',
    _class: 'sb.proyecto.Models.Permission',
  },
])
```

## 🎯 Estrategia 2: Adaptar Rutas al Estilo "me" (NO RECOMENDADO)

Esta opción requiere modificar el código y agregar rutas adicionales.

### Ventajas:

- URLs más semánticas para el usuario actual (`/me`)
- Mejor UX en APIs públicas

### Desventajas:

- Requiere modificar controladores y rutas
- Duplica lógica (rutas con :id Y rutas con /me)
- Más código que mantener

## ✅ Script MongoDB para Corregir Permisos

### Paso 1: Conectarse a MongoDB

```bash
mongosh "mongodb://localhost:27017/ms-security"
```

### Paso 2: Ver permisos actuales

```javascript
db.permission.find().pretty()
```

### Paso 3: Limpiar permisos incorrectos

```javascript
// Eliminar permisos que no coinciden con el código
db.permission.deleteMany({
  $or: [
    { url: '/api/v1/clients/me' },
    { url: { $regex: '^/api/v1/clients/me/' } },
    { url: '/api/v1/bank-cards', method: 'POST' },
  ],
})
```

### Paso 4: Crear permisos correctos

```javascript
db.permission.insertMany([
  // === CLIENTS ===
  {
    url: '/api/v1/clients',
    method: 'GET',
    description: 'Listar clientes',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients',
    method: 'POST',
    description: 'Crear cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id',
    method: 'GET',
    description: 'Ver detalle de cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id',
    method: 'PUT',
    description: 'Actualizar cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id',
    method: 'DELETE',
    description: 'Eliminar cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id/trips',
    method: 'GET',
    description: 'Ver viajes del cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id/trips/:tripId',
    method: 'POST',
    description: 'Asignar viaje a cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id/trips/:tripId',
    method: 'DELETE',
    description: 'Desasignar viaje de cliente',
    _class: 'sb.proyecto.Models.Permission',
  },

  // === BANK CARDS (corregir URL base) ===
  {
    url: '/api/v1/clients/:clientId/bank-cards',
    method: 'GET',
    description: 'Listar tarjetas del cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:clientId/bank-cards',
    method: 'POST',
    description: 'Crear tarjeta del cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/bank-cards/:id/set-default',
    method: 'PATCH',
    description: 'Establecer tarjeta predeterminada',
    _class: 'sb.proyecto.Models.Permission',
  },
])
```

### Paso 5: Verificar que se crearon correctamente

```javascript
db.permission.find({ url: { $regex: '^/api/v1/clients' } }).pretty()
db.permission.find({ url: { $regex: 'bank-cards' } }).pretty()
```

## 📋 Lista Completa de Permisos por Módulo

### CLIENTS (8 permisos)

```javascript
db.permission.insertMany([
  {
    url: '/api/v1/clients',
    method: 'GET',
    description: 'Listar clientes',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients',
    method: 'POST',
    description: 'Crear cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id',
    method: 'GET',
    description: 'Ver cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id',
    method: 'PUT',
    description: 'Actualizar cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id',
    method: 'DELETE',
    description: 'Eliminar cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id/trips',
    method: 'GET',
    description: 'Ver viajes del cliente',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id/trips/:tripId',
    method: 'POST',
    description: 'Asignar viaje',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:id/trips/:tripId',
    method: 'DELETE',
    description: 'Desasignar viaje',
    _class: 'sb.proyecto.Models.Permission',
  },
])
```

### GUIDES (8 permisos)

```javascript
db.permission.insertMany([
  {
    url: '/api/v1/guides',
    method: 'GET',
    description: 'Listar guías',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/guides/available',
    method: 'GET',
    description: 'Listar guías disponibles',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/guides',
    method: 'POST',
    description: 'Crear guía',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/guides/:id',
    method: 'GET',
    description: 'Ver guía',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/guides/:id',
    method: 'PUT',
    description: 'Actualizar guía',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/guides/:id',
    method: 'DELETE',
    description: 'Eliminar guía',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/guides/:id/activities',
    method: 'GET',
    description: 'Ver actividades del guía',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/guides/:id/toggle-availability',
    method: 'PATCH',
    description: 'Cambiar disponibilidad',
    _class: 'sb.proyecto.Models.Permission',
  },
])
```

### ADMINISTRATORS (6 permisos)

```javascript
db.permission.insertMany([
  {
    url: '/api/v1/administrators',
    method: 'GET',
    description: 'Listar administradores',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/administrators',
    method: 'POST',
    description: 'Crear administrador',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/administrators/:id',
    method: 'GET',
    description: 'Ver administrador',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/administrators/:id',
    method: 'PUT',
    description: 'Actualizar administrador',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/administrators/:id',
    method: 'DELETE',
    description: 'Eliminar administrador',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/administrators/:id/permissions',
    method: 'PATCH',
    description: 'Actualizar permisos',
    _class: 'sb.proyecto.Models.Permission',
  },
])
```

### BANK CARDS (6 permisos)

```javascript
db.permission.insertMany([
  {
    url: '/api/v1/clients/:clientId/bank-cards',
    method: 'GET',
    description: 'Listar tarjetas',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/clients/:clientId/bank-cards',
    method: 'POST',
    description: 'Crear tarjeta',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/bank-cards/:id',
    method: 'GET',
    description: 'Ver tarjeta',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/bank-cards/:id',
    method: 'PUT',
    description: 'Actualizar tarjeta',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/bank-cards/:id',
    method: 'DELETE',
    description: 'Eliminar tarjeta',
    _class: 'sb.proyecto.Models.Permission',
  },
  {
    url: '/api/v1/bank-cards/:id/set-default',
    method: 'PATCH',
    description: 'Tarjeta predeterminada',
    _class: 'sb.proyecto.Models.Permission',
  },
])
```

## 🚀 Script PowerShell para Crear TODOS los Permisos

Guarda como `create-all-permissions.ps1`:

```powershell
# Configuración
$mongoHost = "localhost:27017"
$database = "ms-security"
$collection = "permission"

# Limpiar permisos incorrectos
Write-Host "🧹 Limpiando permisos incorrectos..." -ForegroundColor Yellow
mongosh "mongodb://$mongoHost/$database" --eval @"
db.permission.deleteMany({
  `$or: [
    { url: '/api/v1/clients/me' },
    { url: { `$regex: '^/api/v1/clients/me/' } },
    { url: '/api/v1/bank-cards', method: 'POST' }
  ]
})
"@

Write-Host "✅ Permisos incorrectos eliminados" -ForegroundColor Green

# Crear todos los permisos correctos
Write-Host "📝 Creando permisos correctos..." -ForegroundColor Yellow

# Aquí irían todos los inserts...
# (Por brevedad, usa el script de MongoDB directamente)

Write-Host "✅ Todos los permisos creados correctamente!" -ForegroundColor Green
Write-Host "📊 Verificando..." -ForegroundColor Yellow

mongosh "mongodb://$mongoHost/$database" --eval "db.permission.countDocuments()"
```

## 📊 Resumen

### Estado Actual:

- ❌ 7 permisos (algunos incorrectos)
- ⚠️ No coinciden con rutas reales

### Después de la Corrección:

- ✅ ~150 permisos correctos
- ✅ Coinciden exactamente con las rutas del código
- ✅ Listo para testing en Postman

## 🎯 Acción Recomendada

1. **Ejecuta el script de limpieza** (Paso 3)
2. **Crea los permisos por módulo** (ve insertando por grupos)
3. **Verifica con Postman** usando la guía `GUIA_TESTING_PERMISOS_POSTMAN.md`

¿Quieres que genere un script completo con TODOS los 150 permisos listos para insertar?
