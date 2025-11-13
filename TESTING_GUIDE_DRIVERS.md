# 🧪 GUÍA DE PRUEBAS - INTEGRACIÓN MS-BUSINESS ↔️ MS-SECURITY

## 📋 Pre-requisitos

1. ✅ **MS-Security** corriendo en `http://127.0.0.1:8080` (MongoDB)
2. ✅ **MS-Business** corriendo en `http://localhost:3333` (MySQL)
3. ✅ Postman instalado

---

## 🔐 PASO 1: Preparar Usuario en MS-Security (MongoDB)

### 1.1 Crear o Login para obtener Token
**Endpoint:** `POST http://127.0.0.1:8080/api/auth/login`

```json
{
  "email": "driver@test.com",
  "password": "password123"
}
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "673abc123def456789",
    "email": "driver@test.com",
    "userType": "driver",
    "isActive": true
  }
}
```

📝 **Guardar:** 
- `token` → Para usar en Authorization Bearer
- `_id` → Es el `userId` que usaremos en MS-Business

---

## 🚗 PASO 2: Crear Driver en MS-Business (MySQL)

### 2.1 Crear Driver con validación contra MS-Security
**Endpoint:** `POST http://localhost:3333/api/v1/drivers`

**Headers:**
```
Authorization: Bearer {TOKEN_DE_MS_SECURITY}
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "673abc123def456789",
  "firstName": "Juan",
  "lastName": "Pérez",
  "documentType": "CC",
  "documentNumber": "1234567890",
  "phone": "+57 300 1234567",
  "licenseNumber": "LIC-2024-001",
  "licenseType": "C2",
  "licenseExpiryDate": "2026-12-31",
  "yearsOfExperience": 5,
  "vehicleId": null
}
```

**Lo que hace internamente:**
1. Recibe la petición con el token
2. Extrae el `userId` del body
3. **Valida contra MS-Security:** `GET http://127.0.0.1:8080/api/users/{userId}`
4. Verifica que el usuario exista y sea tipo "driver"
5. Si todo está OK, crea el registro en MySQL

**Respuesta exitosa:**
```json
{
  "message": "Conductor registrado exitosamente",
  "data": {
    "id": 1,
    "userId": "673abc123def456789",
    "firstName": "Juan",
    "lastName": "Pérez",
    "documentType": "CC",
    "documentNumber": "1234567890",
    "phone": "+57 300 1234567",
    "licenseNumber": "LIC-2024-001",
    "licenseType": "C2",
    "licenseExpiryDate": "2026-12-31T00:00:00.000-05:00",
    "yearsOfExperience": 5,
    "vehicleId": null,
    "isAvailable": true,
    "createdAt": "2025-11-13T14:30:00.000-05:00",
    "updatedAt": "2025-11-13T14:30:00.000-05:00"
  }
}
```

**Posibles errores:**

❌ Si el usuario no existe en MS-Security:
```json
{
  "message": "Error al validar usuario en el microservicio de seguridad",
  "error": "Request failed with status code 404"
}
```

❌ Si el usuario existe pero no es tipo "driver":
```json
{
  "message": "El usuario no existe o no es de tipo conductor"
}
```

---

## ✅ PASO 3: Validar la Integración

### 3.1 Endpoint de Validación
**Endpoint:** `GET http://localhost:3333/api/v1/drivers/{driverId}/validate`

**Headers:**
```
Authorization: Bearer {TOKEN_DE_MS_SECURITY}
```

**Ejemplo:** `GET http://localhost:3333/api/v1/drivers/1/validate`

**Respuesta esperada:**
```json
{
  "driver": {
    "id": 1,
    "userId": "673abc123def456789",
    "firstName": "Juan",
    "lastName": "Pérez",
    "licenseNumber": "LIC-2024-001",
    "isAvailable": true
    // ... demás campos
  },
  "user": {
    "_id": "673abc123def456789",
    "email": "driver@test.com",
    "username": "juanperez",
    "userType": "driver",
    "isActive": true
    // ... datos del usuario de MS-Security (MongoDB)
  },
  "isValid": true
}
```

**¿Qué valida?**
- ✅ Driver existe en MS-Business (MySQL)
- ✅ Usuario existe en MS-Security (MongoDB)
- ✅ El userId coincide entre ambos sistemas
- ✅ El usuario es de tipo "driver" y está activo

---

## 📚 PASO 4: Otros Endpoints Disponibles

### 4.1 Listar Drivers
```
GET http://localhost:3333/api/v1/drivers?page=1&per_page=10&is_available=true
Authorization: Bearer {TOKEN}
```

### 4.2 Obtener Driver por ID
```
GET http://localhost:3333/api/v1/drivers/1
Authorization: Bearer {TOKEN}
```

### 4.3 Actualizar Driver
```
PUT http://localhost:3333/api/v1/drivers/1
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "phone": "+57 300 9999999",
  "yearsOfExperience": 6,
  "isAvailable": true
}
```

### 4.4 Estadísticas
```
GET http://localhost:3333/api/v1/drivers/stats
Authorization: Bearer {TOKEN}
```

**Respuesta:**
```json
{
  "total": 10,
  "available": 8,
  "unavailable": 2
}
```

### 4.5 Desactivar Driver
```
DELETE http://localhost:3333/api/v1/drivers/1
Authorization: Bearer {TOKEN}
```

---

## 🔍 Verificación de la Integración

### Flujo completo probado:
1. ✅ Usuario existe en MS-Security (MongoDB) como tipo "driver"
2. ✅ MS-Business valida el usuario antes de crear el driver
3. ✅ Driver se crea en MS-Business (MySQL) con referencia al userId
4. ✅ Endpoint `/validate` consulta ambos sistemas simultáneamente
5. ✅ Ambos microservicios se comunican correctamente

### Base de datos:
- **MS-Security (MongoDB):** Tabla `users` con `_id`, `userType: "driver"`
- **MS-Business (MySQL):** Tabla `drivers` con `user_id` (sin FK, solo referencia)

---

## 🎯 Colección de Postman

Importa esta colección para tener todas las pruebas listas:

```json
{
  "info": {
    "name": "MS-Business - Drivers Integration Test",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "ms_business_url",
      "value": "http://localhost:3333/api/v1"
    },
    {
      "key": "ms_security_url",
      "value": "http://127.0.0.1:8080/api"
    },
    {
      "key": "token",
      "value": "YOUR_TOKEN_HERE"
    },
    {
      "key": "userId",
      "value": "YOUR_USER_ID_HERE"
    }
  ],
  "item": [
    {
      "name": "1. Login MS-Security",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"driver@test.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": "{{ms_security_url}}/auth/login"
      }
    },
    {
      "name": "2. Create Driver",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"firstName\": \"Juan\",\n  \"lastName\": \"Pérez\",\n  \"documentType\": \"CC\",\n  \"documentNumber\": \"1234567890\",\n  \"phone\": \"+57 300 1234567\",\n  \"licenseNumber\": \"LIC-2024-001\",\n  \"licenseType\": \"C2\",\n  \"licenseExpiryDate\": \"2026-12-31\",\n  \"yearsOfExperience\": 5\n}"
        },
        "url": "{{ms_business_url}}/drivers"
      }
    },
    {
      "name": "3. Validate Driver",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": "{{ms_business_url}}/drivers/1/validate"
      }
    },
    {
      "name": "4. List Drivers",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": "{{ms_business_url}}/drivers"
      }
    },
    {
      "name": "5. Get Driver Stats",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": "{{ms_business_url}}/drivers/stats"
      }
    }
  ]
}
```

---

## 🚨 Troubleshooting

### Error: "ECONNREFUSED"
- Verifica que MS-Security esté corriendo en el puerto 8080
- Revisa la variable `MS_SECURITY` en el archivo `.env`

### Error: "Unknown column 'birth_date'"
- Ya está resuelto, las migraciones fueron ejecutadas correctamente

### Error: Token inválido
- Genera un nuevo token en MS-Security
- Verifica que el middleware de seguridad esté funcionando

---

¿Listo para empezar las pruebas? 🚀
