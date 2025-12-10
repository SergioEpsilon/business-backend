# 🔐 Guía de Testing de Permisos con Postman

## 📋 Descripción del Sistema

El sistema utiliza **MS-SECURITY** para gestionar la autenticación y autorización mediante:

- **Roles**: Agrupación de permisos (ej: Admin, Manager, Cliente)
- **Permisos**: Control granular de acceso a endpoints específicos (método + URL)
- **JWT**: Token de autenticación que incluye roles y permisos del usuario

## 🔄 Flujo de Validación

```
1. Usuario hace login → MS-SECURITY (/api/public/security/login)
2. MS-SECURITY valida credenciales
3. MS-SECURITY busca roles del usuario
4. MS-SECURITY busca permisos de cada rol
5. MS-SECURITY genera JWT con: user_id, name, email, roles[], permissions[]
6. Usuario recibe token
7. Usuario hace petición a MS-BUSINESS con token
8. Middleware intercepta la petición
9. Middleware envía (url, method, token) a MS-SECURITY
10. MS-SECURITY valida token y verifica permisos
11. MS-SECURITY responde { hasPermission: true/false }
12. Middleware permite o bloquea acceso
```

## 🧪 Testing en Postman

### Paso 1: Login

**Endpoint**: `POST http://127.0.0.1:8080/api/public/security/login`

**Body** (JSON):

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Respuesta Esperada**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "675506cf66a8862dca0fc28b",
    "email": "admin@example.com",
    "name": "Admin User",
    "roles": [...]
  },
  "roles": ["Administrador", "Manager"],
  "permissions": [
    "GET:/api/v1/clients",
    "POST:/api/v1/clients",
    "GET:/api/v1/trips",
    ...
  ]
}
```

**Acción**: Copiar el valor del campo `token` para usar en las siguientes peticiones.

### Paso 2: Configurar Token en Postman

**Opción A - Por petición individual**:

1. En la pestaña "Authorization"
2. Type: "Bearer Token"
3. Token: `<pegar-token-aqui>`

**Opción B - Variable de colección** (Recomendado):

1. Crear una colección "Travel Agency API"
2. Variables → Add variable:
   - Name: `auth_token`
   - Value: `<pegar-token-aqui>`
3. En Authorization de la colección:
   - Type: "Bearer Token"
   - Token: `{{auth_token}}`
4. Todas las peticiones heredan el token automáticamente

### Paso 3: Probar Endpoints Protegidos

#### ✅ Ejemplo: Listar Clientes (Con Permiso)

**Endpoint**: `GET http://127.0.0.1:3333/api/v1/clients`

**Headers**:

```
Authorization: Bearer <tu-token>
```

**Respuesta Esperada** (Si tiene permiso):

```json
{
  "meta": {
    "total": 10,
    "per_page": 20,
    "current_page": 1
  },
  "data": [...]
}
```

**Log del Middleware**:

```
🔒 === [Security Middleware] Validando solicitud ===
📍 URL: /api/v1/clients
🔧 Método: GET
🔗 Validando permiso en: http://127.0.0.1:8080/api/public/security/permissions-validation
📥 Respuesta de ms-security: { hasPermission: true }
✅ PERMISO CONCEDIDO - Continuando con la solicitud
```

#### ❌ Ejemplo: Eliminar Cliente (Sin Permiso)

**Endpoint**: `DELETE http://127.0.0.1:3333/api/v1/clients/1`

**Respuesta Esperada** (Si NO tiene permiso):

```json
{
  "message": "No tienes permiso para acceder a este recurso",
  "detalle": {
    "hasPermission": false
  }
}
```

**Status Code**: `403 Forbidden`

### Paso 4: Crear Permisos en MS-SECURITY

Para otorgar permisos a un rol, usar:

**Endpoint**: `POST http://127.0.0.1:8080/api/permissions`

**Body**:

```json
{
  "url": "/api/v1/clients",
  "method": "GET",
  "description": "Listar clientes"
}
```

Luego asignar el permiso al rol:

**Endpoint**: `POST http://127.0.0.1:8080/api/roles/{roleId}/permissions/{permissionId}`

## 📊 Matriz de Permisos Sugerida

### Recursos del Sistema

| Recurso                  | GET (List)                     | GET (Show)                         | POST                           | PUT                                | DELETE                             | Métodos Especiales                                                                               |
| ------------------------ | ------------------------------ | ---------------------------------- | ------------------------------ | ---------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Clients**              | `/api/v1/clients`              | `/api/v1/clients/:id`              | `/api/v1/clients`              | `/api/v1/clients/:id`              | `/api/v1/clients/:id`              | GET `/api/v1/clients/:id/trips`<br>POST `/api/v1/clients/:id/trips/:tripId`                      |
| **Guides**               | `/api/v1/guides`               | `/api/v1/guides/:id`               | `/api/v1/guides`               | `/api/v1/guides/:id`               | `/api/v1/guides/:id`               | GET `/api/v1/guides/available`<br>PATCH `/api/v1/guides/:id/toggle-availability`                 |
| **Administrators**       | `/api/v1/administrators`       | `/api/v1/administrators/:id`       | `/api/v1/administrators`       | `/api/v1/administrators/:id`       | `/api/v1/administrators/:id`       | PATCH `/api/v1/administrators/:id/permissions`                                                   |
| **Drivers**              | `/api/v1/drivers`              | `/api/v1/drivers/:id`              | `/api/v1/drivers`              | `/api/v1/drivers/:id`              | `/api/v1/drivers/:id`              | GET `/api/v1/drivers/stats`<br>POST `/api/v1/drivers/weather-alert`                              |
| **Vehicles**             | `/api/v1/vehicles`             | `/api/v1/vehicles/:id`             | `/api/v1/vehicles`             | `/api/v1/vehicles/:id`             | `/api/v1/vehicles/:id`             | GET `/api/v1/vehicles/:id/drivers`<br>GET `/api/v1/vehicles/:id/gps`                             |
| **Cars**                 | `/api/v1/cars`                 | `/api/v1/cars/:id`                 | `/api/v1/cars`                 | `/api/v1/cars/:id`                 | `/api/v1/cars/:id`                 | -                                                                                                |
| **Aircrafts**            | `/api/v1/aircrafts`            | `/api/v1/aircrafts/:id`            | `/api/v1/aircrafts`            | `/api/v1/aircrafts/:id`            | `/api/v1/aircrafts/:id`            | -                                                                                                |
| **Shifts**               | `/api/v1/shifts`               | `/api/v1/shifts/:id`               | `/api/v1/shifts`               | `/api/v1/shifts/:id`               | `/api/v1/shifts/:id`               | PATCH `/api/v1/shifts/:id/start`<br>PATCH `/api/v1/shifts/:id/complete`                          |
| **Municipalities**       | `/api/v1/municipalities`       | `/api/v1/municipalities/:id`       | `/api/v1/municipalities`       | `/api/v1/municipalities/:id`       | `/api/v1/municipalities/:id`       | GET `/api/v1/municipalities/search`                                                              |
| **Tourist Activities**   | `/api/v1/tourist-activities`   | `/api/v1/tourist-activities/:id`   | `/api/v1/tourist-activities`   | `/api/v1/tourist-activities/:id`   | `/api/v1/tourist-activities/:id`   | GET `/api/v1/tourist-activities/by-type`<br>PATCH `/api/v1/tourist-activities/:id/toggle-active` |
| **Plans**                | `/api/v1/plans`                | `/api/v1/plans/:id`                | `/api/v1/plans`                | `/api/v1/plans/:id`                | `/api/v1/plans/:id`                | POST `/api/v1/plans/:id/attach-activities`<br>PATCH `/api/v1/plans/:id/toggle-active`            |
| **Trips**                | `/api/v1/trips`                | `/api/v1/trips/:id`                | `/api/v1/trips`                | `/api/v1/trips/:id`                | `/api/v1/trips/:id`                | POST `/api/v1/trips/:id/clients/:clientId`<br>POST `/api/v1/trips/:id/routes/:routeId`           |
| **Routes**               | `/api/v1/routes`               | `/api/v1/routes/:id`               | `/api/v1/routes`               | `/api/v1/routes/:id`               | `/api/v1/routes/:id`               | POST `/api/v1/routes/:id/vehicles/:vehicleId`                                                    |
| **Invoices**             | `/api/v1/invoices`             | `/api/v1/invoices/:id`             | `/api/v1/invoices`             | `/api/v1/invoices/:id`             | `/api/v1/invoices/:id`             | POST `/api/v1/invoices/:id/register-payment`                                                     |
| **Installments**         | `/api/v1/installments`         | `/api/v1/installments/:id`         | `/api/v1/installments`         | `/api/v1/installments/:id`         | `/api/v1/installments/:id`         | GET `/api/v1/installments/overdue`<br>POST `/api/v1/installments/:id/pay`                        |
| **Hotels**               | `/api/v1/hotels`               | `/api/v1/hotels/:id`               | `/api/v1/hotels`               | `/api/v1/hotels/:id`               | `/api/v1/hotels/:id`               | GET `/api/v1/hotels/:id/rooms`                                                                   |
| **Rooms**                | `/api/v1/rooms`                | `/api/v1/rooms/:id`                | `/api/v1/rooms`                | `/api/v1/rooms/:id`                | `/api/v1/rooms/:id`                | GET `/api/v1/rooms/hotel/:hotelId`                                                               |
| **Itinerary Transports** | `/api/v1/itinerary-transports` | `/api/v1/itinerary-transports/:id` | `/api/v1/itinerary-transports` | `/api/v1/itinerary-transports/:id` | `/api/v1/itinerary-transports/:id` | -                                                                                                |

## 🎭 Roles Sugeridos

### 1. **Super Admin**

- Acceso total a todos los recursos
- CRUD completo en todos los endpoints

### 2. **Manager**

- Lectura de todos los recursos
- Escritura en: Clientes, Viajes, Planes, Actividades
- Sin acceso a: Administradores, Permisos

### 3. **Operador**

- Lectura de: Clientes, Viajes, Planes, Rutas
- Escritura en: Turnos, Itinerarios de Transporte
- Sin acceso a: Facturas, Cuotas

### 4. **Cliente**

- Lectura de: Sus propios viajes, Planes disponibles, Actividades
- Escritura en: Sus datos personales
- Sin acceso a: Recursos administrativos

## 🧑‍💻 Scripts de Testing Automatizado

### Script Postman para Auto-Login

En la colección, ir a "Tests" y agregar:

```javascript
// Script para guardar token automáticamente después del login
if (pm.response.code === 200) {
  const jsonData = pm.response.json()
  if (jsonData.token) {
    pm.collectionVariables.set('auth_token', jsonData.token)
    console.log('✅ Token guardado:', jsonData.token)
    console.log('🎭 Roles:', jsonData.roles)
    console.log('🔑 Permisos:', jsonData.permissions)
  }
}
```

### Script para Validar Respuesta de Permisos

```javascript
// Test para verificar acceso denegado
pm.test('Permiso denegado correctamente', function () {
  pm.expect(pm.response.code).to.be.oneOf([401, 403])
})

// Test para verificar acceso permitido
pm.test('Permiso concedido', function () {
  pm.expect(pm.response.code).to.equal(200)
})
```

## 🐛 Troubleshooting

### Error: "No autenticado: Se requiere token de autorización"

**Solución**: Verificar que el header `Authorization: Bearer <token>` esté presente.

### Error: "No tienes permiso para acceder a este recurso"

**Solución**:

1. Verificar que el permiso (método + URL exacta) exista en la BD
2. Verificar que el rol del usuario tenga ese permiso asignado
3. Hacer login nuevamente para obtener token actualizado

### Error: "Error al validar permiso"

**Solución**: Verificar que MS-SECURITY esté corriendo en `http://127.0.0.1:8080`

### El middleware no se ejecuta

**Solución**: Verificar que la ruta tenga `.middleware('security')` aplicado

## 📝 Notas Importantes

1. **URLs deben coincidir exactamente**: `/api/v1/clients` ≠ `/api/v1/clients/`
2. **Métodos deben coincidir**: `GET` ≠ `get`
3. **Parámetros dinámicos** (`:id`) se validan con el patrón de la ruta
4. **Tokens expiran**: Necesitas hacer login nuevamente si el token expira
5. **Logs detallados**: Revisa la consola de ambos microservicios para debugging

## 🚀 Siguiente Paso

Una vez validado el sistema de permisos:

1. Crear roles en MS-SECURITY
2. Crear permisos para cada endpoint
3. Asignar permisos a roles
4. Crear usuarios y asignarles roles
5. Probar cada combinación de rol-endpoint en Postman
