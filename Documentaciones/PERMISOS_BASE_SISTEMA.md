# 🔑 Script de Permisos Base para MS-SECURITY

## 📋 Descripción

Este documento contiene los permisos básicos que deben crearse en MongoDB para el sistema de agencia de viajes.

## 🛠️ Método 1: Crear Permisos via API REST

### Endpoint Base
```
POST http://127.0.0.1:8080/api/permissions
Content-Type: application/json
Authorization: Bearer <admin-token>
```

### Permisos a Crear

#### 👥 CLIENTS (Clientes)
```json
[
  { "url": "/api/v1/clients", "method": "GET", "description": "Listar clientes" },
  { "url": "/api/v1/clients", "method": "POST", "description": "Crear cliente" },
  { "url": "/api/v1/clients/:id", "method": "GET", "description": "Ver detalle de cliente" },
  { "url": "/api/v1/clients/:id", "method": "PUT", "description": "Actualizar cliente" },
  { "url": "/api/v1/clients/:id", "method": "DELETE", "description": "Eliminar cliente" },
  { "url": "/api/v1/clients/:id/trips", "method": "GET", "description": "Ver viajes de cliente" },
  { "url": "/api/v1/clients/:id/trips/:tripId", "method": "POST", "description": "Asignar viaje a cliente" },
  { "url": "/api/v1/clients/:id/trips/:tripId", "method": "DELETE", "description": "Desasignar viaje de cliente" }
]
```

#### 🧭 GUIDES (Guías)
```json
[
  { "url": "/api/v1/guides", "method": "GET", "description": "Listar guías" },
  { "url": "/api/v1/guides/available", "method": "GET", "description": "Listar guías disponibles" },
  { "url": "/api/v1/guides", "method": "POST", "description": "Crear guía" },
  { "url": "/api/v1/guides/:id", "method": "GET", "description": "Ver detalle de guía" },
  { "url": "/api/v1/guides/:id", "method": "PUT", "description": "Actualizar guía" },
  { "url": "/api/v1/guides/:id", "method": "DELETE", "description": "Eliminar guía" },
  { "url": "/api/v1/guides/:id/activities", "method": "GET", "description": "Ver actividades de guía" },
  { "url": "/api/v1/guides/:id/toggle-availability", "method": "PATCH", "description": "Cambiar disponibilidad de guía" }
]
```

#### 👔 ADMINISTRATORS (Administradores)
```json
[
  { "url": "/api/v1/administrators", "method": "GET", "description": "Listar administradores" },
  { "url": "/api/v1/administrators", "method": "POST", "description": "Crear administrador" },
  { "url": "/api/v1/administrators/:id", "method": "GET", "description": "Ver detalle de administrador" },
  { "url": "/api/v1/administrators/:id", "method": "PUT", "description": "Actualizar administrador" },
  { "url": "/api/v1/administrators/:id", "method": "DELETE", "description": "Eliminar administrador" },
  { "url": "/api/v1/administrators/:id/permissions", "method": "PATCH", "description": "Actualizar permisos de administrador" }
]
```

#### 🚗 DRIVERS (Conductores)
```json
[
  { "url": "/api/v1/drivers", "method": "GET", "description": "Listar conductores" },
  { "url": "/api/v1/drivers/stats", "method": "GET", "description": "Ver estadísticas de conductores" },
  { "url": "/api/v1/drivers", "method": "POST", "description": "Crear conductor" },
  { "url": "/api/v1/drivers/weather-alert", "method": "POST", "description": "Enviar alerta meteorológica" },
  { "url": "/api/v1/drivers/:id", "method": "GET", "description": "Ver detalle de conductor" },
  { "url": "/api/v1/drivers/:id", "method": "PUT", "description": "Actualizar conductor" },
  { "url": "/api/v1/drivers/:id", "method": "DELETE", "description": "Eliminar conductor" },
  { "url": "/api/v1/drivers/:id/validate", "method": "GET", "description": "Validar conductor" }
]
```

#### 🚙 VEHICLES (Vehículos)
```json
[
  { "url": "/api/v1/vehicles", "method": "GET", "description": "Listar vehículos" },
  { "url": "/api/v1/vehicles", "method": "POST", "description": "Crear vehículo" },
  { "url": "/api/v1/vehicles/:id", "method": "GET", "description": "Ver detalle de vehículo" },
  { "url": "/api/v1/vehicles/:id", "method": "PUT", "description": "Actualizar vehículo" },
  { "url": "/api/v1/vehicles/:id", "method": "DELETE", "description": "Eliminar vehículo" },
  { "url": "/api/v1/vehicles/:id/drivers", "method": "GET", "description": "Ver conductores del vehículo" },
  { "url": "/api/v1/vehicles/:id/routes", "method": "GET", "description": "Ver rutas del vehículo" },
  { "url": "/api/v1/vehicles/:id/gps", "method": "GET", "description": "Ver GPS del vehículo" }
]
```

#### 🚗 CARS (Autos)
```json
[
  { "url": "/api/v1/cars", "method": "GET", "description": "Listar autos" },
  { "url": "/api/v1/cars", "method": "POST", "description": "Crear auto" },
  { "url": "/api/v1/cars/:id", "method": "GET", "description": "Ver detalle de auto" },
  { "url": "/api/v1/cars/:id", "method": "PUT", "description": "Actualizar auto" },
  { "url": "/api/v1/cars/:id", "method": "DELETE", "description": "Eliminar auto" }
]
```

#### ✈️ AIRCRAFTS (Aeronaves)
```json
[
  { "url": "/api/v1/aircrafts", "method": "GET", "description": "Listar aeronaves" },
  { "url": "/api/v1/aircrafts", "method": "POST", "description": "Crear aeronave" },
  { "url": "/api/v1/aircrafts/:id", "method": "GET", "description": "Ver detalle de aeronave" },
  { "url": "/api/v1/aircrafts/:id", "method": "PUT", "description": "Actualizar aeronave" },
  { "url": "/api/v1/aircrafts/:id", "method": "DELETE", "description": "Eliminar aeronave" }
]
```

#### ⏰ SHIFTS (Turnos)
```json
[
  { "url": "/api/v1/shifts", "method": "GET", "description": "Listar turnos" },
  { "url": "/api/v1/shifts", "method": "POST", "description": "Crear turno" },
  { "url": "/api/v1/shifts/:id", "method": "GET", "description": "Ver detalle de turno" },
  { "url": "/api/v1/shifts/:id", "method": "PUT", "description": "Actualizar turno" },
  { "url": "/api/v1/shifts/:id", "method": "DELETE", "description": "Eliminar turno" },
  { "url": "/api/v1/shifts/:id/start", "method": "PATCH", "description": "Iniciar turno" },
  { "url": "/api/v1/shifts/:id/complete", "method": "PATCH", "description": "Completar turno" }
]
```

#### 🏙️ MUNICIPALITIES (Municipios)
```json
[
  { "url": "/api/v1/municipalities", "method": "GET", "description": "Listar municipios" },
  { "url": "/api/v1/municipalities/search", "method": "GET", "description": "Buscar municipios" },
  { "url": "/api/v1/municipalities", "method": "POST", "description": "Crear municipio" },
  { "url": "/api/v1/municipalities/:id", "method": "GET", "description": "Ver detalle de municipio" },
  { "url": "/api/v1/municipalities/:id", "method": "PUT", "description": "Actualizar municipio" },
  { "url": "/api/v1/municipalities/:id", "method": "DELETE", "description": "Eliminar municipio" },
  { "url": "/api/v1/municipalities/:id/activities", "method": "GET", "description": "Ver actividades del municipio" }
]
```

#### 🎯 TOURIST ACTIVITIES (Actividades Turísticas)
```json
[
  { "url": "/api/v1/tourist-activities", "method": "GET", "description": "Listar actividades turísticas" },
  { "url": "/api/v1/tourist-activities/by-type", "method": "GET", "description": "Listar actividades por tipo" },
  { "url": "/api/v1/tourist-activities", "method": "POST", "description": "Crear actividad turística" },
  { "url": "/api/v1/tourist-activities/:id", "method": "GET", "description": "Ver detalle de actividad" },
  { "url": "/api/v1/tourist-activities/:id", "method": "PUT", "description": "Actualizar actividad" },
  { "url": "/api/v1/tourist-activities/:id", "method": "DELETE", "description": "Eliminar actividad" },
  { "url": "/api/v1/tourist-activities/:id/toggle-active", "method": "PATCH", "description": "Activar/Desactivar actividad" },
  { "url": "/api/v1/tourist-activities/:id/plans", "method": "GET", "description": "Ver planes de la actividad" },
  { "url": "/api/v1/tourist-activities/:id/guides", "method": "GET", "description": "Ver guías de la actividad" },
  { "url": "/api/v1/tourist-activities/:id/guides/:guideId", "method": "POST", "description": "Asignar guía a actividad" },
  { "url": "/api/v1/tourist-activities/:id/guides/:guideId", "method": "DELETE", "description": "Desasignar guía de actividad" }
]
```

#### 📋 PLANS (Planes)
```json
[
  { "url": "/api/v1/plans", "method": "GET", "description": "Listar planes" },
  { "url": "/api/v1/plans", "method": "POST", "description": "Crear plan" },
  { "url": "/api/v1/plans/:id", "method": "GET", "description": "Ver detalle de plan" },
  { "url": "/api/v1/plans/:id", "method": "PUT", "description": "Actualizar plan" },
  { "url": "/api/v1/plans/:id", "method": "DELETE", "description": "Eliminar plan" },
  { "url": "/api/v1/plans/:id/attach-activities", "method": "POST", "description": "Agregar actividades al plan" },
  { "url": "/api/v1/plans/:id/detach-activities", "method": "POST", "description": "Quitar actividades del plan" },
  { "url": "/api/v1/plans/:id/toggle-active", "method": "PATCH", "description": "Activar/Desactivar plan" },
  { "url": "/api/v1/plans/:id/activities", "method": "GET", "description": "Ver actividades del plan" }
]
```

#### ✈️ TRIPS (Viajes)
```json
[
  { "url": "/api/v1/trips", "method": "GET", "description": "Listar viajes" },
  { "url": "/api/v1/trips", "method": "POST", "description": "Crear viaje" },
  { "url": "/api/v1/trips/:id", "method": "GET", "description": "Ver detalle de viaje" },
  { "url": "/api/v1/trips/:id", "method": "PUT", "description": "Actualizar viaje" },
  { "url": "/api/v1/trips/:id", "method": "DELETE", "description": "Eliminar viaje" },
  { "url": "/api/v1/trips/:id/clients", "method": "GET", "description": "Ver clientes del viaje" },
  { "url": "/api/v1/trips/:id/clients/:clientId", "method": "POST", "description": "Asignar cliente a viaje" },
  { "url": "/api/v1/trips/:id/clients/:clientId", "method": "DELETE", "description": "Desasignar cliente de viaje" },
  { "url": "/api/v1/trips/:id/routes", "method": "GET", "description": "Ver rutas del viaje" },
  { "url": "/api/v1/trips/:id/routes/:routeId", "method": "POST", "description": "Asignar ruta a viaje" },
  { "url": "/api/v1/trips/:id/routes/:routeId", "method": "DELETE", "description": "Desasignar ruta de viaje" }
]
```

#### 🗺️ ROUTES (Rutas)
```json
[
  { "url": "/api/v1/routes", "method": "GET", "description": "Listar rutas" },
  { "url": "/api/v1/routes", "method": "POST", "description": "Crear ruta" },
  { "url": "/api/v1/routes/:id", "method": "GET", "description": "Ver detalle de ruta" },
  { "url": "/api/v1/routes/:id", "method": "PUT", "description": "Actualizar ruta" },
  { "url": "/api/v1/routes/:id", "method": "DELETE", "description": "Eliminar ruta" },
  { "url": "/api/v1/routes/:id/trips", "method": "GET", "description": "Ver viajes de la ruta" },
  { "url": "/api/v1/routes/:id/vehicles", "method": "GET", "description": "Ver vehículos de la ruta" },
  { "url": "/api/v1/routes/:id/vehicles/:vehicleId", "method": "POST", "description": "Asignar vehículo a ruta" },
  { "url": "/api/v1/routes/:id/vehicles/:vehicleId", "method": "DELETE", "description": "Desasignar vehículo de ruta" }
]
```

#### 🧾 INVOICES (Facturas)
```json
[
  { "url": "/api/v1/invoices", "method": "GET", "description": "Listar facturas" },
  { "url": "/api/v1/invoices", "method": "POST", "description": "Crear factura" },
  { "url": "/api/v1/invoices/:id", "method": "GET", "description": "Ver detalle de factura" },
  { "url": "/api/v1/invoices/:id", "method": "PUT", "description": "Actualizar factura" },
  { "url": "/api/v1/invoices/:id", "method": "DELETE", "description": "Eliminar factura" },
  { "url": "/api/v1/invoices/:id/register-payment", "method": "POST", "description": "Registrar pago de factura" },
  { "url": "/api/v1/invoices/:id/mark-overdue", "method": "PATCH", "description": "Marcar factura como vencida" },
  { "url": "/api/v1/invoices/:id/installments", "method": "GET", "description": "Ver cuotas de factura" }
]
```

#### 💰 INSTALLMENTS (Cuotas)
```json
[
  { "url": "/api/v1/installments", "method": "GET", "description": "Listar cuotas" },
  { "url": "/api/v1/installments/overdue", "method": "GET", "description": "Listar cuotas vencidas" },
  { "url": "/api/v1/installments/mark-overdue", "method": "PATCH", "description": "Marcar cuotas como vencidas" },
  { "url": "/api/v1/installments", "method": "POST", "description": "Crear cuota" },
  { "url": "/api/v1/installments/:id", "method": "GET", "description": "Ver detalle de cuota" },
  { "url": "/api/v1/installments/:id", "method": "PUT", "description": "Actualizar cuota" },
  { "url": "/api/v1/installments/:id", "method": "DELETE", "description": "Eliminar cuota" },
  { "url": "/api/v1/installments/:id/pay", "method": "POST", "description": "Pagar cuota" }
]
```

#### 💳 BANK CARDS (Tarjetas Bancarias)
```json
[
  { "url": "/api/v1/clients/:clientId/bank-cards", "method": "GET", "description": "Listar tarjetas de cliente" },
  { "url": "/api/v1/clients/:clientId/bank-cards", "method": "POST", "description": "Crear tarjeta de cliente" },
  { "url": "/api/v1/bank-cards/:id", "method": "GET", "description": "Ver detalle de tarjeta" },
  { "url": "/api/v1/bank-cards/:id", "method": "PUT", "description": "Actualizar tarjeta" },
  { "url": "/api/v1/bank-cards/:id", "method": "DELETE", "description": "Eliminar tarjeta" },
  { "url": "/api/v1/bank-cards/:id/set-default", "method": "PATCH", "description": "Establecer tarjeta predeterminada" }
]
```

#### 🏨 HOTELS (Hoteles)
```json
[
  { "url": "/api/v1/hotels", "method": "GET", "description": "Listar hoteles" },
  { "url": "/api/v1/hotels", "method": "POST", "description": "Crear hotel" },
  { "url": "/api/v1/hotels/:id", "method": "GET", "description": "Ver detalle de hotel" },
  { "url": "/api/v1/hotels/:id", "method": "PUT", "description": "Actualizar hotel" },
  { "url": "/api/v1/hotels/:id", "method": "DELETE", "description": "Eliminar hotel" },
  { "url": "/api/v1/hotels/:id/rooms", "method": "GET", "description": "Ver habitaciones del hotel" }
]
```

#### 🛏️ ROOMS (Habitaciones)
```json
[
  { "url": "/api/v1/rooms", "method": "GET", "description": "Listar habitaciones" },
  { "url": "/api/v1/rooms", "method": "POST", "description": "Crear habitación" },
  { "url": "/api/v1/rooms/hotel/:hotelId", "method": "GET", "description": "Listar habitaciones por hotel" },
  { "url": "/api/v1/rooms/:id", "method": "GET", "description": "Ver detalle de habitación" },
  { "url": "/api/v1/rooms/:id", "method": "PUT", "description": "Actualizar habitación" },
  { "url": "/api/v1/rooms/:id", "method": "DELETE", "description": "Eliminar habitación" }
]
```

#### 🚌 ITINERARY TRANSPORTS (Itinerarios de Transporte)
```json
[
  { "url": "/api/v1/itinerary-transports", "method": "GET", "description": "Listar itinerarios de transporte" },
  { "url": "/api/v1/itinerary-transports", "method": "POST", "description": "Crear itinerario de transporte" },
  { "url": "/api/v1/itinerary-transports/:id", "method": "GET", "description": "Ver detalle de itinerario" },
  { "url": "/api/v1/itinerary-transports/:id", "method": "PUT", "description": "Actualizar itinerario" },
  { "url": "/api/v1/itinerary-transports/:id", "method": "DELETE", "description": "Eliminar itinerario" }
]
```

## 🛠️ Método 2: Script PowerShell para Crear Permisos

Guarda este script como `create-permissions.ps1`:

```powershell
$baseUrl = "http://127.0.0.1:8080/api/permissions"
$token = "TU_TOKEN_DE_ADMIN_AQUI"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$permissions = @(
    # Clients
    @{ url = "/api/v1/clients"; method = "GET"; description = "Listar clientes" },
    @{ url = "/api/v1/clients"; method = "POST"; description = "Crear cliente" },
    # ... (agregar todos los permisos aquí)
)

foreach ($permission in $permissions) {
    $body = $permission | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Headers $headers -Body $body
        Write-Host "✅ Creado: $($permission.method) $($permission.url)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error: $($permission.method) $($permission.url) - $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 100
}
```

## 📊 Resumen de Permisos

- **Total de Endpoints**: ~150 permisos
- **Módulos**: 18 (Clients, Guides, Administrators, etc.)
- **Métodos HTTP**: GET, POST, PUT, DELETE, PATCH

## 🎯 Próximos Pasos

1. ✅ Crear estos permisos en MS-SECURITY
2. ✅ Crear roles (Admin, Manager, Operador, Cliente)
3. ✅ Asignar permisos a roles
4. ✅ Asignar roles a usuarios
5. ✅ Probar en Postman siguiendo la guía `GUIA_TESTING_PERMISOS_POSTMAN.md`
