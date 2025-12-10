# 🧪 Guía Completa de Testing - Sistema de Permisos

## 📋 Estado del Sistema

✅ **130 permisos** creados en MongoDB Atlas  
✅ **6 roles** con permisos asignados  
✅ **205 relaciones** rolePermission configuradas  
✅ **Middleware Security** activado en todos los endpoints

---

## 🔥 Prueba Rápida - Flujo Completo

### PASO 1: Crear Usuario en MS-SECURITY

```http
POST http://127.0.0.1:8080/api/public/security/register
Content-Type: application/json

{
  "email": "admin.test@agencia.com",
  "password": "Admin123!"
}
```

**Respuesta esperada:**

```json
{
  "_id": "675abc123def456789...",
  "email": "admin.test@agencia.com"
}
```

**⚠️ IMPORTANTE:** Guarda el `_id` que retorna, lo usaremos como `user_id`.

---

### PASO 2: Asignar Rol ADMINISTRADOR al Usuario

Necesitas ejecutar esto en MongoDB (Compass o mongosh):

```javascript
// En MongoDB Atlas - db_security
use db_security;

// Obtener el ID del rol ADMINISTRADOR
var adminRole = db.role.findOne({ name: "ADMINISTRADOR" });
print("Rol ADMINISTRADOR ID:", adminRole._id);

// Asignar rol al usuario (reemplaza USER_ID con el _id del paso 1)
db.userRole.insertOne({
  user: ObjectId("USER_ID"),  // ← Reemplaza con el _id del usuario
  role: adminRole._id,
  _class: "sb.proyecto.Models.UserRole"
});

print("✓ Rol ADMINISTRADOR asignado al usuario");
```

**Comando PowerShell directo:**

```powershell
$userId = "675abc123def456789..."  # ← Tu user_id del PASO 1

mongosh "mongodb://SergioBedoya:Arcueid@ac-pev5y96-shard-00-00.g0vqckb.mongodb.net:27017,ac-pev5y96-shard-00-01.g0vqckb.mongodb.net:27017,ac-pev5y96-shard-00-02.g0vqckb.mongodb.net:27017/db_security?ssl=true&replicaSet=atlas-qhsr2b-shard-0&authSource=admin&retryWrites=true&w=majority" --quiet --eval "var adminRole = db.role.findOne({ name: 'ADMINISTRADOR' }); db.userRole.insertOne({ user: ObjectId('$userId'), role: adminRole._id, _class: 'sb.proyecto.Models.UserRole' }); print('Rol asignado');"
```

---

### PASO 3: Login para Obtener JWT

```http
POST http://127.0.0.1:8080/api/public/security/login
Content-Type: application/json

{
  "email": "admin.test@agencia.com",
  "password": "Admin123!"
}
```

**Respuesta esperada:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNjc1YWJjMTIzZGVmNDU2Nzg5Li4uIiwicm9sZXMiOlsiQURNSU5JU1RSQURPUiJdLCJwZXJtaXNzaW9ucyI6W3sidXJsIjoiL2FwaS92MS9jbGllbnRzIiwibWV0aG9kIjoiR0VUIn0sLi4uXSwiaWF0IjoxNzMzNjY3MjAwLCJleHAiOjE3MzM2NzA4MDB9.xyz...",
  "user_id": "675abc123def456789...",
  "roles": ["ADMINISTRADOR"],
  "permissions": [
    { "url": "/api/v1/clients", "method": "GET" },
    { "url": "/api/v1/clients", "method": "POST" },
    ...
  ]
}
```

**⚠️ IMPORTANTE:** Copia el `token` completo, lo necesitarás en todos los requests.

---

### PASO 4: Crear Cliente en MS-BUSSINESS (Endpoint Protegido)

```http
POST http://localhost:3333/api/v1/clients
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...  ← Tu token del PASO 3
Content-Type: application/json

{
  "id": "675abc123def456789...",  ← El user_id del PASO 1
  "name": "Juan Pérez",
  "email": "admin.test@agencia.com",
  "phone": "3001234567",
  "address": "Calle 123 #45-67, Bogotá"
}
```

**✅ Respuesta exitosa (200 OK):**

```json
{
  "id": "675abc123def456789...",
  "name": "Juan Pérez",
  "email": "admin.test@agencia.com",
  "phone": "3001234567",
  "address": "Calle 123 #45-67, Bogotá",
  "created_at": "2025-12-08T20:30:00.000Z",
  "updated_at": "2025-12-08T20:30:00.000Z"
}
```

**❌ Si NO tienes permisos (403 Forbidden):**

```json
{
  "errors": [
    {
      "message": "No tienes permisos para acceder a este recurso"
    }
  ]
}
```

---

### PASO 5: Listar Clientes (Verificar Permiso GET)

```http
GET http://localhost:3333/api/v1/clients
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Respuesta esperada:**

```json
[
  {
    "id": "675abc123def456789...",
    "name": "Juan Pérez",
    "email": "admin.test@agencia.com",
    "phone": "3001234567",
    "address": "Calle 123 #45-67, Bogotá",
    "created_at": "2025-12-08T20:30:00.000Z"
  }
]
```

---

## 🔐 Flujo Técnico del Middleware

```
1. Request → POST /api/v1/clients
   Headers: Authorization: Bearer eyJ...

2. Middleware Security (app/middleware/Security.ts)
   ├─ Extrae token del header
   ├─ Extrae URL: "/api/v1/clients"
   ├─ Extrae método: "POST"
   └─ Envía a MS-SECURITY

3. MS-SECURITY (localhost:8080)
   POST /api/public/security/permissions-validation
   Body: {
     "url": "/api/v1/clients",
     "method": "POST",
     "token": "eyJ..."
   }

4. MS-SECURITY valida:
   ├─ Decodifica JWT → obtiene user_id y roles
   ├─ Busca en userRole → roles del usuario
   ├─ Busca en rolePermission → permisos de esos roles
   ├─ Verifica si tiene permiso para URL + método
   └─ Retorna: { "valid": true } o { "valid": false }

5. Middleware decide:
   ├─ Si valid=true → ctx.next() (continúa al controlador)
   └─ Si valid=false → return 403 Forbidden
```

---

## 👥 Crear Usuarios con Diferentes Roles

### Usuario CLIENTE (Permisos Limitados)

**1. Crear usuario:**

```http
POST http://127.0.0.1:8080/api/public/security/register
Content-Type: application/json

{
  "email": "cliente.test@gmail.com",
  "password": "Cliente123!"
}
```

**2. Asignar rol CLIENTE:**

```javascript
// MongoDB
var clienteRole = db.role.findOne({ name: 'CLIENTE' })
db.userRole.insertOne({
  user: ObjectId('USER_ID_DEL_CLIENTE'),
  role: clienteRole._id,
  _class: 'sb.proyecto.Models.UserRole',
})
```

**3. Crear entidad en MS-BUSSINESS:**

```http
POST http://localhost:3333/api/v1/clients
Authorization: Bearer TOKEN_DE_ADMIN
Content-Type: application/json

{
  "id": "USER_ID_DEL_CLIENTE",
  "name": "María González",
  "email": "cliente.test@gmail.com",
  "phone": "3009876543",
  "address": "Carrera 7 #12-34"
}
```

**4. Login como cliente:**

```http
POST http://127.0.0.1:8080/api/public/security/login
Content-Type: application/json

{
  "email": "cliente.test@gmail.com",
  "password": "Cliente123!"
}
```

**5. Probar permisos limitados:**

✅ **PUEDE hacer esto:**

```http
GET http://localhost:3333/api/v1/clients/USER_ID_DEL_CLIENTE
Authorization: Bearer TOKEN_DEL_CLIENTE
```

❌ **NO PUEDE hacer esto:**

```http
GET http://localhost:3333/api/v1/clients
Authorization: Bearer TOKEN_DEL_CLIENTE
```

**Respuesta:** `403 Forbidden` (no tiene permiso para listar todos los clientes)

---

### Usuario GUIA

**1. Crear y asignar rol:**

```javascript
var guiaRole = db.role.findOne({ name: 'GUIA' })
db.userRole.insertOne({
  user: ObjectId('USER_ID_DEL_GUIA'),
  role: guiaRole._id,
  _class: 'sb.proyecto.Models.UserRole',
})
```

**2. Crear entidad guía:**

```http
POST http://localhost:3333/api/v1/guides
Authorization: Bearer TOKEN_DE_ADMIN
Content-Type: application/json

{
  "id": "USER_ID_DEL_GUIA",
  "name": "Carlos Martínez",
  "email": "guia.test@agencia.com",
  "phone": "3007654321",
  "languages": ["Español", "Inglés"],
  "experience_years": 5,
  "is_available": true
}
```

**3. Permisos del GUIA:**

- ✅ Ver/editar su propio perfil
- ✅ Ver actividades turísticas
- ✅ Cambiar su disponibilidad
- ❌ Ver otros guías
- ❌ Crear/eliminar actividades

---

## 🧪 Tests de Validación

### Test 1: Token Inválido

```http
GET http://localhost:3333/api/v1/clients
Authorization: Bearer token_falso_123
```

**Esperado:** `401 Unauthorized`

### Test 2: Sin Token

```http
GET http://localhost:3333/api/v1/clients
```

**Esperado:** `401 Unauthorized`

### Test 3: Token Expirado

Espera 1 hora (o modifica `jwt.expiration=3600` a `60` en application.properties) y reintenta.
**Esperado:** `401 Unauthorized - Token expired`

### Test 4: Permiso Inexistente

```http
POST http://localhost:3333/api/v1/clientes
Authorization: Bearer TOKEN_VALIDO
```

(Nota: URL incorrecta `/clientes` vs `/clients`)
**Esperado:** `404 Not Found` (antes de validar permisos)

### Test 5: Método No Permitido

```http
DELETE http://localhost:3333/api/v1/clients
Authorization: Bearer TOKEN_DE_CLIENTE
```

**Esperado:** `403 Forbidden` (CLIENTE no tiene permiso DELETE)

---

## 📊 Verificar Logs

### En MS-SECURITY (Terminal Java):

```
2025-12-08 20:30:15 DEBUG SecurityController - Validating permission: /api/v1/clients POST
2025-12-08 20:30:15 DEBUG SecurityController - User ID from token: 675abc123def456789
2025-12-08 20:30:15 DEBUG SecurityController - User roles: [ADMINISTRADOR]
2025-12-08 20:30:15 DEBUG SecurityController - Permission found: true
2025-12-08 20:30:15 INFO  SecurityController - Permission validation result: GRANTED
```

### En MS-BUSSINESS (Terminal Node):

```
[2025-12-08 20:30:15] INFO: POST /api/v1/clients - Middleware Security intercepted
[2025-12-08 20:30:15] DEBUG: Validating with MS-SECURITY: {"url":"/api/v1/clients","method":"POST"}
[2025-12-08 20:30:15] INFO: Permission validation: GRANTED - Proceeding to controller
[2025-12-08 20:30:15] INFO: ClientsController.store() - Creating client
```

---

## 🎯 Checklist de Validación

- [ ] Usuario ADMINISTRADOR puede acceder a todos los endpoints
- [ ] Usuario CLIENTE solo puede ver/editar sus propios datos
- [ ] Usuario GUIA puede gestionar su disponibilidad
- [ ] Usuario CONDUCTOR puede ver vehículos y rutas
- [ ] Token inválido retorna 401
- [ ] Sin token retorna 401
- [ ] Sin permisos retorna 403
- [ ] Logs muestran validación correcta en ambos servicios

---

## 🚀 Colección de Postman Lista

Importa esta colección en Postman:

```json
{
  "info": {
    "name": "Travel Agency - Permission System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "ms_security_url",
      "value": "http://127.0.0.1:8080"
    },
    {
      "key": "ms_business_url",
      "value": "http://localhost:3333"
    },
    {
      "key": "admin_token",
      "value": ""
    },
    {
      "key": "user_id",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "1. Register Admin User",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "url": "{{ms_security_url}}/api/public/security/register",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"admin.test@agencia.com\",\n  \"password\": \"Admin123!\"\n}"
        }
      }
    },
    {
      "name": "2. Login Admin",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "url": "{{ms_security_url}}/api/public/security/login",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"admin.test@agencia.com\",\n  \"password\": \"Admin123!\"\n}"
        }
      }
    },
    {
      "name": "3. Create Client (Protected)",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" },
          { "key": "Authorization", "value": "Bearer {{admin_token}}" }
        ],
        "url": "{{ms_business_url}}/api/v1/clients",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"id\": \"{{user_id}}\",\n  \"name\": \"Juan Pérez\",\n  \"email\": \"admin.test@agencia.com\",\n  \"phone\": \"3001234567\",\n  \"address\": \"Calle 123\"\n}"
        }
      }
    },
    {
      "name": "4. List Clients (Protected)",
      "request": {
        "method": "GET",
        "header": [{ "key": "Authorization", "value": "Bearer {{admin_token}}" }],
        "url": "{{ms_business_url}}/api/v1/clients"
      }
    }
  ]
}
```

---

## 🎓 ¿Listo para Probar?

**Empieza con estos comandos:**

```powershell
# 1. Crear usuario admin
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/public/security/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"admin.test@agencia.com","password":"Admin123!"}'
$userId = $response._id
Write-Host "User ID: $userId"

# 2. Asignar rol ADMINISTRADOR (guarda el user_id para el siguiente paso)
```

**¡Ahora sí estamos listos! 🚀**
