# 📖 Ejemplos de Uso de la API - Travel Agency System

Este documento contiene ejemplos prácticos de cómo usar los endpoints de la API.

---

## 🔧 Configuración Inicial

**Base URL:** `http://localhost:3333/api/v1`

**Headers comunes:**

```
Content-Type: application/json
Accept: application/json
```

---

## 👤 GESTIÓN DE USUARIOS

### 1. Crear un Nuevo Cliente

```bash
POST /api/v1/clients
```

**Body:**

```json
{
  "username": "maria.lopez",
  "email": "maria.lopez@example.com",
  "password": "password123",
  "firstName": "María",
  "lastName": "López",
  "documentType": "CC",
  "documentNumber": "1098765432",
  "phone": "+573001234567",
  "birthDate": "1992-03-15",
  "address": "Calle 100 #50-25",
  "city": "Bogotá",
  "postalCode": "110111",
  "nationality": "Colombiana"
}
```

**Respuesta (201 Created):**

```json
{
  "message": "Cliente creado exitosamente",
  "data": {
    "id": 3,
    "userId": 5,
    "firstName": "María",
    "lastName": "López",
    "documentNumber": "1098765432",
    "email": "maria.lopez@example.com",
    "user": {
      "id": 5,
      "username": "maria.lopez",
      "email": "maria.lopez@example.com",
      "userType": "client",
      "isActive": true
    }
  }
}
```

### 2. Listar Todos los Clientes (con paginación)

```bash
GET /api/v1/clients?page=1&per_page=10
```

**Respuesta:**

```json
{
  "meta": {
    "total": 25,
    "per_page": 10,
    "current_page": 1,
    "last_page": 3,
    "first_page": 1
  },
  "data": [
    {
      "id": 1,
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan.perez@example.com",
      "user": {
        "username": "juan.perez",
        "isActive": true
      }
    }
    // ... más clientes
  ]
}
```

### 3. Ver Detalle de un Cliente

```bash
GET /api/v1/clients/1
```

**Respuesta:**

```json
{
  "id": 1,
  "userId": 1,
  "firstName": "Juan",
  "lastName": "Pérez",
  "documentType": "CC",
  "documentNumber": "1234567890",
  "phone": "+573001234567",
  "birthDate": "1990-05-15",
  "user": {
    "id": 1,
    "username": "juan.perez",
    "email": "juan.perez@example.com"
  },
  "trips": [
    {
      "id": 1,
      "tripCode": "TRIP-001",
      "destination": "Cartagena",
      "status": "confirmed",
      "plans": [...]
    }
  ],
  "bankCards": [
    {
      "id": 1,
      "cardType": "credit",
      "cardBrand": "Visa",
      "lastFourDigits": "4242"
    }
  ]
}
```

### 4. Crear un Guía

```bash
POST /api/v1/guides
```

**Body:**

```json
{
  "username": "carlos.tours",
  "email": "carlos@toursguide.com",
  "password": "guia123",
  "firstName": "Carlos",
  "lastName": "Rodríguez",
  "documentType": "CC",
  "documentNumber": "987654321",
  "phone": "+573109876543",
  "licenseNumber": "GUIDE-2024-001",
  "specialization": "Turismo ecológico y aventura",
  "languages": ["Español", "Inglés", "Francés"],
  "yearsOfExperience": 8,
  "isAvailable": true
}
```

---

## 🏖️ GESTIÓN DE DESTINOS Y ACTIVIDADES

### 1. Crear un Municipio

```bash
POST /api/v1/municipalities
```

**Body:**

```json
{
  "name": "Cartagena de Indias",
  "department": "Bolívar",
  "country": "Colombia",
  "population": 1028736,
  "area": 572,
  "latitude": 10.391,
  "longitude": -75.4794,
  "description": "Ciudad histórica patrimonio de la humanidad",
  "climate": "Tropical",
  "altitude": 2
}
```

### 2. Crear una Actividad Turística

```bash
POST /api/v1/tourist-activities
```

**Body:**

```json
{
  "guideId": 1,
  "municipalityId": 1,
  "name": "Tour por el Centro Histórico",
  "description": "Recorrido guiado por las murallas y calles coloniales de Cartagena",
  "type": "cultural",
  "duration": 180,
  "price": 80000,
  "difficulty": "easy",
  "minCapacity": 2,
  "maxCapacity": 15,
  "includesTransport": false,
  "includesMeals": false,
  "includesEquipment": false,
  "isActive": true
}
```

### 3. Buscar Municipios

```bash
GET /api/v1/municipalities/search?query=carta
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "name": "Cartagena de Indias",
    "department": "Bolívar",
    "country": "Colombia"
  }
]
```

### 4. Listar Actividades por Tipo

```bash
GET /api/v1/tourist-activities/by-type?type=cultural
```

---

## 🎯 GESTIÓN DE PLANES TURÍSTICOS

### 1. Crear un Plan

```bash
POST /api/v1/plans
```

**Body:**

```json
{
  "planCode": "PLAN-CARIBE-2024",
  "name": "Escapada Caribeña 5 Días",
  "description": "Plan completo para disfrutar del Caribe colombiano",
  "duration": 5,
  "basePrice": 2500000,
  "category": "premium",
  "includesAccommodation": true,
  "includesTransport": true,
  "includesMeals": true,
  "includesInsurance": true,
  "maxPeople": 4,
  "isActive": true
}
```

### 2. Asociar Actividades a un Plan

```bash
POST /api/v1/plans/1/attach-activities
```

**Body:**

```json
{
  "activityIds": [1, 2, 3],
  "customData": {
    "1": {
      "day_number": 1,
      "order_in_day": 1,
      "is_optional": false,
      "custom_price": 80000
    },
    "2": {
      "day_number": 2,
      "order_in_day": 1,
      "is_optional": false,
      "custom_price": 150000
    },
    "3": {
      "day_number": 3,
      "order_in_day": 1,
      "is_optional": true,
      "custom_price": 200000
    }
  }
}
```

**Respuesta:**

```json
{
  "message": "Actividades asociadas exitosamente al plan",
  "data": {
    "id": 1,
    "planCode": "PLAN-CARIBE-2024",
    "name": "Escapada Caribeña 5 Días",
    "activities": [
      {
        "id": 1,
        "name": "Tour por el Centro Histórico",
        "pivot": {
          "day_number": 1,
          "order_in_day": 1,
          "is_optional": false,
          "custom_price": 80000
        }
      }
      // ... más actividades
    ]
  }
}
```

### 3. Listar Planes Activos

```bash
GET /api/v1/plans?is_active=true&category=premium
```

---

## ✈️ GESTIÓN DE VIAJES

### 1. Crear un Viaje

```bash
POST /api/v1/trips
```

**Body:**

```json
{
  "clientId": 1,
  "startDate": "2024-07-15",
  "endDate": "2024-07-20",
  "destination": "Cartagena de Indias",
  "numberOfPeople": 2,
  "status": "pending",
  "paymentStatus": "pending"
}
```

**Respuesta:**

```json
{
  "message": "Viaje creado exitosamente",
  "data": {
    "id": 1,
    "tripCode": "TRIP-20240615-001",
    "clientId": 1,
    "destination": "Cartagena de Indias",
    "startDate": "2024-07-15",
    "endDate": "2024-07-20",
    "status": "pending",
    "paymentStatus": "pending"
  }
}
```

### 2. Asociar Planes a un Viaje

```bash
POST /api/v1/trips/1/attach-plans
```

**Body:**

```json
{
  "planIds": [1, 2],
  "customData": {
    "1": {
      "order_in_trip": 1,
      "start_date": "2024-07-15",
      "end_date": "2024-07-19",
      "custom_price": 2300000,
      "notes": "Cliente solicitó habitación con vista al mar"
    },
    "2": {
      "order_in_trip": 2,
      "start_date": "2024-07-19",
      "end_date": "2024-07-20",
      "custom_price": 500000
    }
  }
}
```

### 3. Actualizar Estado de un Viaje

```bash
PATCH /api/v1/trips/1/update-status
```

**Body:**

```json
{
  "status": "confirmed"
}
```

Valores permitidos para `status`:

- `pending`
- `confirmed`
- `in_progress`
- `completed`
- `cancelled`

### 4. Ver Detalles Completos de un Viaje

```bash
GET /api/v1/trips/1
```

**Respuesta:**

```json
{
  "id": 1,
  "tripCode": "TRIP-20240615-001",
  "destination": "Cartagena de Indias",
  "client": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "user": {
      "email": "juan.perez@example.com"
    }
  },
  "plans": [
    {
      "id": 1,
      "name": "Escapada Caribeña 5 Días",
      "basePrice": 2500000,
      "pivot": {
        "order_in_trip": 1,
        "custom_price": 2300000
      },
      "activities": [
        {
          "name": "Tour por el Centro Histórico",
          "guide": {
            "firstName": "Carlos",
            "lastName": "Rodríguez"
          }
        }
      ]
    }
  ],
  "invoices": [
    {
      "invoiceNumber": "INV-2024-001",
      "total": 2800000,
      "status": "pending"
    }
  ]
}
```

---

## 💳 GESTIÓN DE TARJETAS BANCARIAS

### 1. Registrar una Tarjeta

```bash
POST /api/v1/clients/1/bank-cards
```

**Body:**

```json
{
  "cardHolderName": "JUAN PEREZ",
  "cardNumber": "4242424242424242",
  "cardType": "credit",
  "cardBrand": "Visa",
  "expiryMonth": 12,
  "expiryYear": 2026,
  "cvv": "123",
  "billingAddress": "Calle 123 #45-67",
  "billingCity": "Bogotá",
  "billingCountry": "Colombia",
  "billingZipCode": "110111",
  "isDefault": true
}
```

**Nota de Seguridad:** Los campos `cardNumber` y `cvv` están configurados con `serializeAs: null` en el modelo, por lo que NO se devuelven en las respuestas de la API.

### 2. Listar Tarjetas de un Cliente

```bash
GET /api/v1/clients/1/bank-cards?is_active=true
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "cardHolderName": "JUAN PEREZ",
    "cardType": "credit",
    "cardBrand": "Visa",
    "expiryMonth": 12,
    "expiryYear": 2026,
    "isDefault": true,
    "isActive": true
    // cardNumber y cvv NO aparecen por seguridad
  }
]
```

### 3. Marcar Tarjeta como Predeterminada

```bash
PATCH /api/v1/bank-cards/1/set-default
```

---

## 💰 GESTIÓN DE FACTURAS Y PAGOS

### 1. Crear una Factura con Cuotas Automáticas

```bash
POST /api/v1/invoices
```

**Body:**

```json
{
  "tripId": 1,
  "bankCardId": 1,
  "subtotal": 2500000,
  "tax": 475000,
  "discount": 200000,
  "createInstallments": true,
  "numberOfInstallments": 3,
  "firstInstallmentDate": "2024-07-01"
}
```

**Respuesta:**

```json
{
  "message": "Factura creada exitosamente con 3 cuota(s)",
  "data": {
    "id": 1,
    "invoiceNumber": "INV-20240615-001",
    "tripId": 1,
    "subtotal": 2500000,
    "tax": 475000,
    "discount": 200000,
    "total": 2775000,
    "amountPaid": 0,
    "balance": 2775000,
    "status": "pending",
    "installments": [
      {
        "installmentNumber": 1,
        "amount": 925000,
        "dueDate": "2024-07-01",
        "status": "pending"
      },
      {
        "installmentNumber": 2,
        "amount": 925000,
        "dueDate": "2024-08-01",
        "status": "pending"
      },
      {
        "installmentNumber": 3,
        "amount": 925000,
        "dueDate": "2024-09-01",
        "status": "pending"
      }
    ]
  }
}
```

### 2. Registrar un Pago Incremental

```bash
POST /api/v1/invoices/1/register-payment
```

**Body:**

```json
{
  "amount": 1000000,
  "paymentMethod": "credit_card",
  "transactionReference": "TXN-202406-12345"
}
```

**Respuesta:**

```json
{
  "message": "Pago registrado exitosamente",
  "data": {
    "id": 1,
    "invoiceNumber": "INV-20240615-001",
    "total": 2775000,
    "amountPaid": 1000000,
    "balance": 1775000,
    "status": "partially_paid"
  }
}
```

### 3. Pagar una Cuota Específica

```bash
POST /api/v1/installments/1/pay
```

**Body:**

```json
{
  "paymentMethod": "bank_transfer",
  "transactionReference": "TRANSFER-2024-67890"
}
```

### 4. Ver Cuotas Vencidas

```bash
GET /api/v1/installments/overdue
```

**Respuesta:**

```json
[
  {
    "id": 5,
    "installmentNumber": 1,
    "amount": 500000,
    "dueDate": "2024-05-15",
    "status": "overdue",
    "trip": {
      "tripCode": "TRIP-20240315-002",
      "client": {
        "firstName": "María",
        "lastName": "García",
        "phone": "+573002345678"
      }
    }
  }
]
```

### 5. Marcar Cuotas Vencidas Masivamente

```bash
PATCH /api/v1/installments/mark-overdue
```

**Respuesta:**

```json
{
  "message": "5 cuota(s) marcada(s) como vencida(s)",
  "count": 5
}
```

---

## 📊 CONSULTAS AVANZADAS

### 1. Estadísticas de Usuarios

```bash
GET /api/v1/users/stats
```

**Respuesta:**

```json
{
  "total": 50,
  "active": 45,
  "byType": {
    "clients": 35,
    "guides": 10,
    "administrators": 5
  }
}
```

### 2. Perfil Completo de un Usuario

```bash
GET /api/v1/users/1/profile
```

**Respuesta (si es cliente):**

```json
{
  "user": {
    "id": 1,
    "username": "juan.perez",
    "email": "juan.perez@example.com",
    "userType": "client"
  },
  "profile": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "trips": [
      {
        "tripCode": "TRIP-001",
        "destination": "Cartagena",
        "plans": [...]
      }
    ],
    "bankCards": [...]
  }
}
```

### 3. Guías Disponibles

```bash
GET /api/v1/guides/available
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "firstName": "Carlos",
    "lastName": "Rodríguez",
    "specialization": "Turismo ecológico",
    "yearsOfExperience": 8,
    "languages": ["Español", "Inglés", "Francés"],
    "isAvailable": true
  }
]
```

### 4. Actividades de un Municipio

```bash
GET /api/v1/municipalities/1/activities
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "name": "Tour por el Centro Histórico",
    "type": "cultural",
    "price": 80000,
    "guide": {
      "firstName": "Carlos",
      "lastName": "Rodríguez"
    }
  }
]
```

---

## 🔍 FILTROS Y BÚSQUEDAS

### 1. Filtrar Viajes por Estado y Cliente

```bash
GET /api/v1/trips?status=confirmed&client_id=1&page=1&per_page=20
```

### 2. Filtrar Planes por Categoría

```bash
GET /api/v1/plans?category=premium&is_active=true
```

### 3. Filtrar Actividades por Múltiples Criterios

```bash
GET /api/v1/tourist-activities?municipality_id=1&guide_id=2&type=cultural&is_active=true
```

### 4. Filtrar Facturas por Estado

```bash
GET /api/v1/invoices?status=pending&trip_id=1
```

---

## 🔄 OPERACIONES DE ACTUALIZACIÓN

### 1. Actualizar Cliente

```bash
PUT /api/v1/clients/1
```

**Body (parcial):**

```json
{
  "phone": "+573009999999",
  "address": "Nueva dirección 123",
  "city": "Medellín"
}
```

### 2. Cambiar Disponibilidad de un Guía

```bash
PATCH /api/v1/guides/1/toggle-availability
```

**Respuesta:**

```json
{
  "message": "Guía no disponible",
  "data": {
    "id": 1,
    "isAvailable": false
  }
}
```

### 3. Activar/Desactivar Plan

```bash
PATCH /api/v1/plans/1/toggle-active
```

### 4. Actualizar Permisos de Administrador

```bash
PATCH /api/v1/administrators/1/permissions
```

**Body:**

```json
{
  "accessLevel": 3,
  "canManageUsers": true,
  "canManageTrips": true,
  "canManageInvoices": true
}
```

---

## ❌ OPERACIONES DE ELIMINACIÓN

### 1. Eliminar Cliente (con Usuario en cascada)

```bash
DELETE /api/v1/clients/1
```

**Respuesta:**

```json
{
  "message": "Cliente eliminado exitosamente"
}
```

### 2. Desactivar Tarjeta (Soft Delete)

```bash
DELETE /api/v1/bank-cards/1
```

**Nota:** Las tarjetas NO se eliminan físicamente, solo se desactivan.

### 3. Desasociar Planes de un Viaje

```bash
POST /api/v1/trips/1/detach-plans
```

**Body:**

```json
{
  "planIds": [1, 2]
}
```

---

## 🧪 CASOS DE USO COMPLETOS

### Caso 1: Reservar un Viaje Completo

**1. Crear el cliente:**

```bash
POST /api/v1/clients
{ ... datos del cliente ... }
# Retorna: clientId = 5
```

**2. Crear el viaje:**

```bash
POST /api/v1/trips
{
  "clientId": 5,
  "startDate": "2024-08-01",
  "endDate": "2024-08-05",
  "destination": "San Andrés",
  "numberOfPeople": 2
}
# Retorna: tripId = 10
```

**3. Asociar planes al viaje:**

```bash
POST /api/v1/trips/10/attach-plans
{
  "planIds": [3],
  "customData": {
    "3": { "order_in_trip": 1, "custom_price": 3000000 }
  }
}
```

**4. Registrar tarjeta de pago:**

```bash
POST /api/v1/clients/5/bank-cards
{ ... datos de la tarjeta ... }
# Retorna: bankCardId = 8
```

**5. Crear factura con cuotas:**

```bash
POST /api/v1/invoices
{
  "tripId": 10,
  "bankCardId": 8,
  "subtotal": 3000000,
  "tax": 570000,
  "createInstallments": true,
  "numberOfInstallments": 2
}
# Retorna: invoiceId = 15
```

**6. Pagar primera cuota:**

```bash
POST /api/v1/installments/25/pay
{
  "paymentMethod": "credit_card",
  "transactionReference": "TXN-2024-XXXX"
}
```

**7. Confirmar viaje:**

```bash
PATCH /api/v1/trips/10/update-status
{ "status": "confirmed" }
```

### Caso 2: Crear un Plan Turístico Completo

**1. Crear municipio (si no existe):**

```bash
POST /api/v1/municipalities
{ ... datos del municipio ... }
# Retorna: municipalityId = 4
```

**2. Crear actividades:**

```bash
POST /api/v1/tourist-activities
{
  "municipalityId": 4,
  "guideId": 2,
  "name": "Snorkeling en arrecifes",
  "type": "adventure",
  "price": 150000,
  ...
}
# Repetir para cada actividad
# Retorna: activityIds = [10, 11, 12]
```

**3. Crear el plan:**

```bash
POST /api/v1/plans
{
  "planCode": "PLAN-SNORKEL-2024",
  "name": "Aventura Submarina 3 Días",
  "basePrice": 1200000,
  ...
}
# Retorna: planId = 8
```

**4. Asociar actividades al plan:**

```bash
POST /api/v1/plans/8/attach-activities
{
  "activityIds": [10, 11, 12],
  "customData": {
    "10": { "day_number": 1, "order_in_day": 1 },
    "11": { "day_number": 2, "order_in_day": 1 },
    "12": { "day_number": 3, "order_in_day": 1 }
  }
}
```

---

## 🛡️ MANEJO DE ERRORES

### Ejemplo de Error 404 (No encontrado)

**Request:**

```bash
GET /api/v1/clients/999
```

**Respuesta (404):**

```json
{
  "message": "Cliente no encontrado",
  "error": "Row not found"
}
```

### Ejemplo de Error 400 (Datos inválidos)

**Request:**

```bash
PATCH /api/v1/trips/1/update-status
{ "status": "invalid_status" }
```

**Respuesta (400):**

```json
{
  "message": "Estado no válido",
  "validStatuses": ["pending", "confirmed", "in_progress", "completed", "cancelled"]
}
```

---

## 📌 NOTAS IMPORTANTES

1. **Paginación:** Todos los endpoints de listado soportan `?page=1&per_page=20`

2. **Filtrado:** Usa query parameters para filtrar resultados

3. **Relaciones:** Los endpoints `show` cargan relaciones automáticamente

4. **Seguridad:** Datos sensibles como `cardNumber` y `cvv` nunca se devuelven en respuestas

5. **Estados válidos:**
   - Trip status: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`
   - Payment status: `pending`, `partially_paid`, `paid`
   - Invoice status: `pending`, `paid`, `overdue`, `cancelled`
   - Installment status: `pending`, `paid`, `overdue`

---

**Para más detalles, consulta:**

- `CONTROLLERS_SUMMARY.md` - Documentación completa de endpoints
- `SETUP_GUIDE.md` - Guía de instalación y ejecución
- `DOCUMENTATION.md` - Documentación técnica del sistema
