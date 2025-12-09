# 🎓 GUÍA DE PRESENTACIÓN PARA EL DOCENTE

## 📋 ÍNDICE

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura)
3. [Demostración de CRUDs](#cruds)
4. [Demostración de Relaciones](#relaciones)
5. [Características Técnicas Implementadas](#características)
6. [Orden de Presentación Recomendado](#orden)

---

## 🎯 INTRODUCCIÓN

**Sistema:** API REST para Agencia de Viajes  
**Tecnología Backend:** AdonisJS 5.9.0 + TypeScript + MySQL  
**Base de Datos:** `airline` (53 migraciones)  
**Puerto:** http://localhost:3333  
**Documentación API:** POSTMAN_ENDPOINTS_TESTING.md

### ✅ **Lo que está funcionando:**

- **11 CRUDs completos** (CREATE, READ, UPDATE, DELETE)
- **4 tipos de relaciones** (Muchos a Muchos, Uno a Muchos)
- **Validaciones** de datos en español
- **Mapeos automáticos** (español → inglés para enums)
- **Auto-generación** de códigos (trip_code, plan_code, etc.)
- **Paginación** en todos los listados
- **Manejo de errores** robusto

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular 17+)                    │
│              http://localhost:4200 (por crear)               │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────┐
│                  BACKEND API (AdonisJS)                      │
│                  http://localhost:3333                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Controllers (11 entidades)                         │     │
│  │ - ClientsController                                │     │
│  │ - TripsController                                  │     │
│  │ - PlansController                                  │     │
│  │ - HotelsController                                 │     │
│  │ - RoomsController                                  │     │
│  │ - TouristActivitiesController                      │     │
│  │ - VehiclesController                               │     │
│  │ - RoutesController                                 │     │
│  │ - BankCardsController                              │     │
│  │ - ItineraryTransportsController                    │     │
│  │ - InstallmentsController                           │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Models (Lucid ORM)                                 │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Validators (Validaciones en español)               │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────┘
                           │ MySQL
┌──────────────────────────▼──────────────────────────────────┐
│              BASE DE DATOS MySQL (airline)                   │
│  - 53 tablas (migraciones ejecutadas)                       │
│  - Relaciones definidas (FK constraints)                    │
│  - Índices optimizados                                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 DEMOSTRACIÓN DE CRUDs

### **ORDEN SUGERIDO DE PRESENTACIÓN:**

#### **1. CLIENTES (Clients)** ⭐ Empezar aquí

**Demostrar:** Generación automática de IDs con CUID

```
✅ POST http://localhost:3333/api/v1/clients
{
  "document": "1234567890",
  "phone": "3001234567",
  "address": "Calle 123 #45-67, Bogotá"
}
Resultado: ID generado = svxzlwa98bvxwi87391fyw9z (24 caracteres únicos)

✅ GET http://localhost:3333/api/v1/clients
Resultado: Lista paginada de clientes

✅ GET http://localhost:3333/api/v1/clients/svxzlwa98bvxwi87391fyw9z
Resultado: Cliente específico

✅ PUT http://localhost:3333/api/v1/clients/svxzlwa98bvxwi87391fyw9z
{
  "phone": "3009999999",
  "address": "Nueva dirección"
}
Resultado: Cliente actualizado

✅ DELETE http://localhost:3333/api/v1/clients/svxzlwa98bvxwi87391fyw9z
Resultado: Cliente eliminado
```

**💡 Puntos a destacar:**

- CUID en lugar de auto-increment para IDs distribuidos
- Validación de campos requeridos
- Respuestas en español

---

#### **2. VIAJES (Trips)** ⭐ Mapeo de estados

**Demostrar:** Auto-generación de código y mapeo español→inglés

```
✅ POST http://localhost:3333/api/v1/trips
{
  "destination": "Cartagena",
  "startDate": "2025-12-15",
  "endDate": "2025-12-20",
  "numPassengers": 4,
  "status": "confirmado"
}
Resultado: trip_code = TRIP-1763484244022, status mapeado a "confirmed"

✅ GET http://localhost:3333/api/v1/trips
✅ GET http://localhost:3333/api/v1/trips/1
✅ PUT http://localhost:3333/api/v1/trips/1
{
  "status": "completado",
  "numPassengers": 5
}
✅ DELETE http://localhost:3333/api/v1/trips/1
```

**💡 Puntos a destacar:**

- Mapeo automático: confirmado→confirmed, pendiente→pending, etc.
- Código único generado con timestamp
- Campo numberOfPassengers mapeado automáticamente

---

#### **3. PLANES (Plans)** ⭐ Defaults inteligentes

**Demostrar:** Valores por defecto y categorización

```
✅ POST http://localhost:3333/api/v1/plans
{
  "name": "Plan Aventura Caribe",
  "description": "Plan turístico completo",
  "price": 1500000,
  "duration": 7
}
Resultado: plan_code generado, category="general", seasonType="all_year"

✅ GET, PUT, DELETE igual que entidades anteriores
```

**💡 Puntos a destacar:**

- Defaults automáticos para campos opcionales
- Generación de plan_code único
- Campo isActive por defecto true

---

#### **4. HOTELES (Hotels)** ⭐ Creación de dependencias

**Demostrar:** Auto-creación de Municipality si no existe

```
✅ POST http://localhost:3333/api/v1/hotels
{
  "name": "Hotel Caribe Plaza",
  "address": "Centro Histórico",
  "phone": "3001234567",
  "stars": 4
}
Resultado: Crea Municipality (Cartagena) automáticamente si no existe

✅ GET, PUT, DELETE funcionan normalmente
```

**💡 Puntos a destacar:**

- Crea relaciones automáticamente
- Manejo de foreign keys inteligente
- Valores por defecto para amenities

---

#### **5. HABITACIONES (Rooms)** ⭐ Enums traducidos

**Demostrar:** Mapeo de tipos en español

```
✅ POST http://localhost:3333/api/v1/rooms
{
  "hotelId": 1,
  "roomNumber": "101",
  "roomType": "doble",
  "bedType": "queen",
  "capacity": 2,
  "pricePerNight": 150000
}
Resultado: roomType="double", bedType="queen" (mapeados a inglés)

✅ GET, PUT, DELETE funcionan
```

**💡 Puntos a destacar:**

- Mapeo roomType: doble→double, individual→single, suite→suite
- Mapeo bedType: queen→queen, king→king, doble→double
- Validación de foreign key (hotelId debe existir)

---

#### **6. ACTIVIDADES TURÍSTICAS (Tourist Activities)** ⭐ Dificultad

**Demostrar:** Mapeo de dificultad

```
✅ POST http://localhost:3333/api/v1/tourist-activities
{
  "name": "Buceo en arrecifes",
  "activityType": "Acuática",
  "duration": 120,
  "difficulty": "moderada",
  "price": 200000
}
Resultado: difficulty="moderate" (mapeado)

✅ GET, PUT, DELETE funcionan
```

**💡 Puntos a destacar:**

- Mapeo difficulty: moderada→moderate, fácil→easy, difícil→hard
- municipalityId por defecto si no se especifica

---

#### **7. VEHÍCULOS (Vehicles)**

```
✅ POST http://localhost:3333/api/v1/vehicles
{
  "vehicleType": "bus",
  "licensePlate": "ABC123",
  "brand": "Mercedes Benz",
  "capacity": 20
}

✅ GET, PUT, DELETE funcionan
```

---

#### **8. RUTAS (Routes)** ⭐ Múltiples FK

**Demostrar:** Manejo de múltiples foreign keys

```
✅ POST http://localhost:3333/api/v1/routes
{
  "name": "Bogotá - Cartagena",
  "origin": "Bogotá",
  "destination": "Cartagena",
  "distance": 1050000,
  "estimatedDuration": 960
}
Resultado: originMunicipalityId y destinationMunicipalityId asignados automáticamente

✅ GET, PUT, DELETE funcionan
```

**💡 Puntos a destacar:**

- Mapeo de campos: distance→distanceKm, estimatedDuration→estimatedDurationMinutes
- Asignación automática de municipality IDs

---

#### **9. TARJETAS BANCARIAS (Bank Cards)** ⭐ Parsing de fechas

**Demostrar:** Procesamiento de expiryDate

```
✅ POST http://localhost:3333/api/v1/clients/svxzlwa98bvxwi87391fyw9z/bank-cards
{
  "cardNumber": "4532123456789012",
  "cardholderName": "Juan Perez",
  "expiryDate": "12/27",
  "cvv": "123",
  "cardType": "visa"
}
Resultado: expiryDate parseado a expiryMonth=12, expiryYear=2027

✅ GET, PUT, DELETE funcionan
```

**💡 Puntos a destacar:**

- Parsing de fecha MM/YY → Month/Year separados
- Mapeo cardType: credito→credit, debito→debit

---

#### **10. ITINERARIOS DE TRANSPORTE (Itinerary Transports)** ⭐ Auto-creación

**Demostrar:** Creación automática de TransportService

```
✅ POST http://localhost:3333/api/v1/itinerary-transports
{
  "tripId": 1,
  "routeId": 1,
  "dayNumber": 1,
  "orderInDay": 1,
  "numPassengers": 20,
  "totalCost": 500000
}
Resultado: Crea TransportService automáticamente si no existe

✅ GET, PUT, DELETE funcionan
```

**💡 Puntos a destacar:**

- Validador corregido (antes pedía campos incorrectos)
- Auto-creación de dependencias

---

#### **11. CUOTAS (Installments)** ⭐ Números secuenciales

**Demostrar:** Generación de números de cuota secuenciales

```
✅ POST http://localhost:3333/api/v1/installments
{
  "tripId": 1,
  "amount": 500000,
  "dueDate": "2025-12-01",
  "status": "pendiente"
}
Resultado: installmentNumber=1 (primera cuota), status="pending"

✅ GET, PUT, DELETE funcionan
```

**💡 Puntos a destacar:**

- Número de cuota secuencial por viaje (1, 2, 3...)
- Mapeo status: pendiente→pending, pagado→paid
- Auto-creación de Invoice si es necesario

---

## 🔗 DEMOSTRACIÓN DE RELACIONES

### **1. Cliente ↔ Viaje (Many to Many)**

```
📌 Asociar cliente a viaje:
POST http://localhost:3333/api/v1/clients/svxzlwa98bvxwi87391fyw9z/trips/1
Resultado: Cliente asociado al viaje

📌 Ver viajes de un cliente:
GET http://localhost:3333/api/v1/clients/svxzlwa98bvxwi87391fyw9z/trips
Resultado: Array con viajes del cliente

📌 Ver clientes de un viaje:
GET http://localhost:3333/api/v1/trips/1/clients
Resultado: Array con clientes del viaje

📌 Desasociar cliente de viaje:
DELETE http://localhost:3333/api/v1/clients/svxzlwa98bvxwi87391fyw9z/trips/1
Resultado: Relación eliminada
```

**💡 Puntos a destacar:**

- Relación N:M con tabla pivot `client_trip`
- Bidireccional (cliente→viajes y viaje→clientes)

---

### **2. Plan ↔ Actividades Turísticas (Many to Many)**

```
📌 Asociar actividades a plan:
POST http://localhost:3333/api/v1/plans/1/attach-activities
{
  "activityIds": [1]
}
Resultado: Actividad asociada al plan

📌 Ver actividades de un plan:
GET http://localhost:3333/api/v1/plans/1/activities
Resultado: Array con actividades del plan
```

**💡 Puntos a destacar:**

- Tabla pivot `plan_tourist_activities`
- Soporte para customData en el pivot

---

### **3. Vehículo ↔ Ruta (Many to Many)**

```
📌 Asociar vehículo a ruta:
POST http://localhost:3333/api/v1/routes/1/vehicles/1
Resultado: Vehículo asignado a la ruta

📌 Ver vehículos de una ruta:
GET http://localhost:3333/api/v1/routes/1/vehicles
Resultado: Array con vehículos de la ruta

📌 Ver rutas de un vehículo:
GET http://localhost:3333/api/v1/vehicles/1/routes
Resultado: Array con rutas del vehículo
```

**💡 Puntos a destacar:**

- Tabla pivot `route_vehicle`
- Útil para asignación de flota

---

### **4. Hotel → Habitaciones (One to Many)**

```
📌 Ver habitaciones de un hotel:
GET http://localhost:3333/api/v1/hotels/1/rooms
Resultado: Array con todas las habitaciones del hotel
```

**💡 Puntos a destacar:**

- Relación 1:N clásica
- Cascade en operaciones

---

## ⚙️ CARACTERÍSTICAS TÉCNICAS IMPLEMENTADAS

### **1. Mapeos Automáticos (Español → Inglés)**

```typescript
// Trip status
"confirmado" → "confirmed"
"pendiente" → "pending"
"completado" → "completed"

// Room types
"doble" → "double"
"individual" → "single"

// Difficulty
"moderada" → "moderate"
"fácil" → "easy"
```

### **2. Auto-generación de Códigos**

```typescript
trip_code: `TRIP-${Date.now()}` // TRIP-1763484244022
plan_code: `PLAN-${Date.now()}` // PLAN-1763484661721
invoice_number: `INV-${Date.now()}` // INV-1763488045626
```

### **3. Valores por Defecto Inteligentes**

```typescript
// Plan
category: 'general'
seasonType: 'all_year'

// Room
hasBathroom: true
hasAirConditioning: true

// Hotel
stars: 3
isActive: true
```

### **4. Creación de Dependencias Automática**

```typescript
// Si Municipality no existe, se crea automáticamente
if (!municipality) {
  municipality = await Municipality.create({
    name: 'Cartagena',
    department: 'Bolívar',
    country: 'Colombia',
  })
}
```

### **5. Paginación Uniforme**

```
GET /api/v1/clients?page=1&perPage=10
GET /api/v1/trips?page=2&perPage=20
```

### **6. Manejo de Errores Robusto**

```json
{
  "message": "Error descriptivo en español",
  "error": "Detalles técnicos del error"
}
```

---

## 🎬 ORDEN DE PRESENTACIÓN RECOMENDADO

### **PASO 1: Introducción (3 minutos)**

1. Mostrar arquitectura del sistema (diagrama)
2. Explicar tecnologías utilizadas
3. Mostrar estructura de carpetas del proyecto

### **PASO 2: CRUDs Básicos (10 minutos)**

1. **Clientes** (CUID generation)
2. **Viajes** (mapeo de estados)
3. **Planes** (defaults inteligentes)

**Demostrar en Postman:**

- Crear cada entidad
- Listar todas
- Ver una específica
- Actualizar
- Eliminar

### **PASO 3: CRUDs Avanzados (10 minutos)**

4. **Hoteles** (auto-creación de municipality)
5. **Habitaciones** (enums traducidos + FK)
6. **Actividades** (difficulty mapping)

**Destacar:**

- Manejo de foreign keys
- Validaciones
- Mapeos automáticos

### **PASO 4: CRUDs Complejos (8 minutos)**

7. **Vehículos**
8. **Rutas** (múltiples FK)
9. **Tarjetas** (parsing de fechas)
10. **Itinerarios** (auto-creación de TransportService)
11. **Cuotas** (números secuenciales + auto-Invoice)

### **PASO 5: Relaciones (5 minutos)**

1. **Cliente ↔ Viaje** (Many to Many)
2. **Plan ↔ Actividades** (Many to Many con customData)
3. **Vehículo ↔ Ruta** (Many to Many)
4. **Hotel → Habitaciones** (One to Many)

**Demostrar:**

- Asociar
- Listar relacionados
- Desasociar

### **PASO 6: Características Especiales (4 minutos)**

1. Mostrar paginación funcionando
2. Mostrar manejo de errores
3. Mostrar validaciones en español
4. Mostrar console logs de testing mode

---

## 📝 SCRIPT DE PRESENTACIÓN SUGERIDO

### **Apertura:**

> "Buenos días profesor. Voy a demostrar el sistema de API REST que desarrollé para una agencia de viajes. El sistema está construido con AdonisJS, TypeScript y MySQL, e implementa 11 CRUDs completos con múltiples relaciones."

### **Durante CRUDs:**

> "Voy a crear un cliente. Observe que el ID se genera automáticamente usando CUID, lo que permite IDs únicos distribuidos de 24 caracteres en lugar de auto-increment tradicional."

> "Ahora creo un viaje. Note que envío 'confirmado' en español, pero el sistema automáticamente lo mapea a 'confirmed' en inglés para la base de datos. También genera un código único con timestamp."

### **Durante Relaciones:**

> "Ahora voy a demostrar una relación muchos a muchos. Asocio este cliente al viaje que acabo de crear. Luego puedo consultar todos los viajes del cliente, o todos los clientes de un viaje. Es bidireccional."

### **Cierre:**

> "Como puede ver, el sistema implementa CRUD completo para 11 entidades principales, maneja 4 tipos diferentes de relaciones, incluye validaciones en español, mapeos automáticos, y características avanzadas como auto-generación de códigos y creación automática de dependencias."

---

## 🛠️ PREPARACIÓN PREVIA A LA PRESENTACIÓN

### **Checklist 15 minutos antes:**

✅ **1. Verificar servidor corriendo:**

```bash
cd c:\Users\USER\Desktop\Backend\business-backend
npm run dev
```

✅ **2. Verificar base de datos:**

```bash
# En MySQL Workbench o CLI
SHOW DATABASES;
USE airline;
SHOW TABLES;
```

✅ **3. Limpiar datos de prueba anteriores (opcional):**

```sql
DELETE FROM client_trip;
DELETE FROM clients;
DELETE FROM trips;
-- etc. según necesites
```

✅ **4. Abrir Postman con la colección:**

- Importar `Travel_Agency_API.postman_collection.json`
- Organizar tabs por orden de presentación
- Pre-crear JSONs en un archivo de texto para copy-paste rápido

✅ **5. Tener documentación abierta:**

- `POSTMAN_ENDPOINTS_TESTING.md`
- Esta guía (GUIA_PRESENTACION_DOCENTE.md)

✅ **6. Tener consola del servidor visible:**

- Para mostrar console.logs de testing mode

✅ **7. Preparar ejemplos de errores:**

- Un JSON con datos inválidos para mostrar validaciones

---

## 📊 DATOS DE EJEMPLO PREPARADOS

### **JSON pre-preparados para copy-paste rápido:**

```json
// CLIENTE
{
  "document": "1234567890",
  "phone": "3001234567",
  "address": "Calle 123 #45-67, Bogotá"
}

// VIAJE
{
  "destination": "Cartagena",
  "startDate": "2025-12-15",
  "endDate": "2025-12-20",
  "numPassengers": 4,
  "status": "confirmado"
}

// PLAN
{
  "name": "Plan Aventura Caribe",
  "description": "Plan turístico completo",
  "price": 1500000,
  "duration": 7
}

// HOTEL
{
  "name": "Hotel Caribe Plaza",
  "address": "Centro Histórico",
  "phone": "3001234567",
  "stars": 4
}

// HABITACIÓN
{
  "hotelId": 1,
  "roomNumber": "101",
  "roomType": "doble",
  "capacity": 2,
  "pricePerNight": 150000
}
```

---

## ❓ PREGUNTAS FRECUENTES DEL DOCENTE

### **"¿Por qué usan CUID en lugar de auto-increment?"**

> "CUID genera IDs únicos de 24 caracteres que son seguros para sistemas distribuidos, evitan colisiones, no revelan información sobre el número de registros, y son más seguros que UUIDs tradicionales."

### **"¿Cómo manejan las validaciones?"**

> "Usamos los validators de AdonisJS que validan datos antes de llegar a la base de datos. Los mensajes están en español para mejor UX. Además, mapeamos automáticamente valores en español a inglés para la DB."

### **"¿Qué pasa si falla una relación?"**

> "El sistema maneja foreign keys con constraints. Si intentas crear una habitación con hotelId que no existe, la base de datos rechaza la operación y retornamos un error descriptivo."

### **"¿Implementaron paginación?"**

> "Sí, todos los endpoints de listado soportan ?page=1&perPage=10. Retornamos metadata con información de paginación."

### **"¿Hay autenticación?"**

> "El sistema está diseñado para trabajar con un microservicio de seguridad (MS-SECURITY) mediante JWT. Para esta demostración, la autenticación está bypasseada para facilitar las pruebas."

---

## 🎯 RESUMEN EJECUTIVO

### **Números Clave:**

- ✅ **11 Entidades CRUD completas**
- ✅ **4 Tipos de relaciones** (N:M, 1:N)
- ✅ **53 Migraciones** ejecutadas
- ✅ **+70 Endpoints** documentados
- ✅ **100%** de operaciones CRUD funcionando
- ✅ **Validaciones** en español
- ✅ **Mapeos automáticos** español→inglés
- ✅ **Auto-generación** de códigos únicos
- ✅ **Manejo robusto** de errores

### **Tecnologías:**

- Backend: AdonisJS 5.9.0
- Lenguaje: TypeScript
- Base de datos: MySQL
- ORM: Lucid
- Validación: @adonisjs/validator
- IDs únicos: @paralleldrive/cuid2

---

## 📚 DOCUMENTACIÓN ADICIONAL

- **Endpoints completos:** `POSTMAN_ENDPOINTS_TESTING.md`
- **Colección Postman:** `Travel_Agency_API.postman_collection.json`
- **Migraciones:** `database/migrations/`
- **Modelos:** `app/Models/`
- **Controladores:** `app/Controllers/Http/`

---

**¡Éxito en tu presentación! 🚀✨**
