# 📚 Documentación del Sistema de Gestión de Agencia de Viajes

## 🎯 Descripción General

Sistema web integral para la gestión de una agencia de viajes asociada a una aerolínea, que permite administrar servicios turísticos, itinerarios de transporte, clientes y pagos.

---

## 📊 Modelo de Datos - Relaciones Principales

### 1️⃣ **Usuario – Cliente / Guía / Administrador (1–1)**

Cada usuario del sistema tiene un rol específico que determina sus permisos y acciones.

```
User (1) ──── (1) Client
User (1) ──── (1) Guide
User (1) ──── (1) Administrator
```

**Tablas:**

- `users` - Tabla principal de usuarios
- `clients` - Información de clientes
- `guides` - Información de guías turísticos
- `administrators` - Información de administradores

---

### 2️⃣ **Cliente – Viaje (1–n)**

Un cliente puede contratar múltiples viajes, pero cada viaje pertenece a un único cliente.

```
Client (1) ──── (n) Trip
```

**Relación:** `trips.client_id` → `clients.id`

---

### 3️⃣ **Guía – Actividad Turística (1–n)**

Cada guía puede dirigir múltiples actividades turísticas.

```
Guide (1) ──── (n) TouristActivity
```

**Relación:** `tourist_activities.guide_id` → `guides.id`

---

### 4️⃣ **Municipio – Actividad Turística (1–n)**

Las actividades turísticas se desarrollan en un municipio específico.

```
Municipality (1) ──── (n) TouristActivity
```

**Relación:** `tourist_activities.municipality_id` → `municipalities.id`

---

### 5️⃣ **Plan – Actividad Turística (n–m)**

Un plan turístico puede incluir varias actividades, y una actividad puede pertenecer a varios planes.

```
Plan (n) ──── (m) TouristActivity
```

**Tabla pivote:** `plan_tourist_activities`

- `plan_id` → `plans.id`
- `tourist_activity_id` → `tourist_activities.id`

**Campos adicionales:**

- `day_number` - Día del plan en que se realiza
- `order_in_day` - Orden en el día
- `is_optional` - Si la actividad es opcional
- `custom_price` - Precio personalizado

---

### 6️⃣ **Viaje – Plan (n–m)**

Un viaje puede incluir varios planes turísticos, y un plan puede estar en varios viajes.

```
Trip (n) ──── (m) Plan
```

**Tabla pivote:** `trip_plan`

- `trip_id` → `trips.id`
- `plan_id` → `plans.id`

**Campos adicionales:**

- `order_in_trip` - Orden del plan en el viaje
- `start_date` / `end_date` - Fechas específicas
- `custom_price` - Precio personalizado

---

### 7️⃣ **Viaje – Cuota (1–n)**

Cada viaje puede pagarse en varias cuotas (pagos parciales o mensuales).

```
Trip (1) ──── (n) Installment
```

**Relación:** `installments.trip_id` → `trips.id`

---

### 8️⃣ **Factura – Cuota (1–n)**

Cada factura puede tener varias cuotas asociadas.

```
Invoice (1) ──── (n) Installment
```

**Relación:** `installments.invoice_id` → `invoices.id`

---

### 9️⃣ **Cliente – Tarjeta Bancaria (1–n)**

Cada cliente puede registrar múltiples tarjetas bancarias.

```
Client (1) ──── (n) BankCard
```

**Relación:** `bank_cards.client_id` → `clients.id`

---

### 🔟 **Factura – Tarjeta Bancaria (n–1)**

Cada factura se paga con una tarjeta específica.

```
Invoice (n) ──── (1) BankCard
```

**Relación:** `invoices.bank_card_id` → `bank_cards.id`

---

### 1️⃣1️⃣ **Viaje – Factura (1–n)**

Cada viaje puede generar múltiples facturas.

```
Trip (1) ──── (n) Invoice
```

**Relación:** `invoices.trip_id` → `trips.id`

---

## 🗃️ Estructura de Tablas

### 👤 **users**

| Campo     | Tipo         | Descripción                        |
| --------- | ------------ | ---------------------------------- |
| id        | INTEGER      | PK                                 |
| username  | VARCHAR(100) | Nombre de usuario único            |
| email     | VARCHAR(255) | Email único                        |
| password  | VARCHAR(255) | Contraseña encriptada              |
| user_type | ENUM         | 'client', 'guide', 'administrator' |
| is_active | BOOLEAN      | Usuario activo                     |

---

### 👥 **clients**

| Campo           | Tipo         | Descripción                  |
| --------------- | ------------ | ---------------------------- |
| id              | INTEGER      | PK                           |
| user_id         | INTEGER      | FK → users.id (UNIQUE)       |
| first_name      | VARCHAR(100) | Nombre                       |
| last_name       | VARCHAR(100) | Apellido                     |
| document_type   | VARCHAR(50)  | Tipo de documento            |
| document_number | VARCHAR(50)  | Número de documento (UNIQUE) |
| phone           | VARCHAR(20)  | Teléfono                     |
| address         | VARCHAR(255) | Dirección                    |
| city            | VARCHAR(100) | Ciudad                       |
| country         | VARCHAR(100) | País                         |
| birth_date      | DATE         | Fecha de nacimiento          |

---

### 🎒 **guides**

| Campo               | Tipo         | Descripción                  |
| ------------------- | ------------ | ---------------------------- |
| id                  | INTEGER      | PK                           |
| user_id             | INTEGER      | FK → users.id (UNIQUE)       |
| first_name          | VARCHAR(100) | Nombre                       |
| last_name           | VARCHAR(100) | Apellido                     |
| document_type       | VARCHAR(50)  | Tipo de documento            |
| document_number     | VARCHAR(50)  | Número de documento (UNIQUE) |
| phone               | VARCHAR(20)  | Teléfono                     |
| license_number      | VARCHAR(50)  | Número de licencia (UNIQUE)  |
| specialization      | VARCHAR(100) | Especialización              |
| languages           | TEXT         | Idiomas (JSON array)         |
| years_of_experience | INTEGER      | Años de experiencia          |
| is_available        | BOOLEAN      | Disponible                   |

---

### 👔 **administrators**

| Campo               | Tipo         | Descripción                  |
| ------------------- | ------------ | ---------------------------- |
| id                  | INTEGER      | PK                           |
| user_id             | INTEGER      | FK → users.id (UNIQUE)       |
| first_name          | VARCHAR(100) | Nombre                       |
| last_name           | VARCHAR(100) | Apellido                     |
| document_type       | VARCHAR(50)  | Tipo de documento            |
| document_number     | VARCHAR(50)  | Número de documento (UNIQUE) |
| phone               | VARCHAR(20)  | Teléfono                     |
| department          | VARCHAR(100) | Departamento                 |
| access_level        | INTEGER      | Nivel de acceso (1-3)        |
| can_manage_users    | BOOLEAN      | Puede gestionar usuarios     |
| can_manage_trips    | BOOLEAN      | Puede gestionar viajes       |
| can_manage_invoices | BOOLEAN      | Puede gestionar facturas     |

---

### 🏙️ **municipalities**

| Campo       | Tipo          | Descripción       |
| ----------- | ------------- | ----------------- |
| id          | INTEGER       | PK                |
| name        | VARCHAR(100)  | Nombre            |
| department  | VARCHAR(100)  | Departamento      |
| country     | VARCHAR(100)  | País              |
| population  | INTEGER       | Población         |
| area        | DECIMAL(10,2) | Área en km²       |
| latitude    | DECIMAL(10,7) | Latitud           |
| longitude   | DECIMAL(10,7) | Longitud          |
| description | TEXT          | Descripción       |
| climate     | VARCHAR(100)  | Clima             |
| altitude    | INTEGER       | Altitud en metros |

---

### 🎭 **tourist_activities**

| Campo              | Tipo          | Descripción                |
| ------------------ | ------------- | -------------------------- |
| id                 | INTEGER       | PK                         |
| guide_id           | INTEGER       | FK → guides.id             |
| municipality_id    | INTEGER       | FK → municipalities.id     |
| name               | VARCHAR(200)  | Nombre                     |
| description        | TEXT          | Descripción                |
| activity_type      | VARCHAR(100)  | Tipo de actividad          |
| duration           | INTEGER       | Duración en horas          |
| price              | DECIMAL(10,2) | Precio                     |
| max_capacity       | INTEGER       | Capacidad máxima           |
| min_capacity       | INTEGER       | Capacidad mínima           |
| difficulty         | ENUM          | 'easy', 'moderate', 'hard' |
| includes_transport | BOOLEAN       | Incluye transporte         |
| includes_meals     | BOOLEAN       | Incluye comidas            |
| requirements       | TEXT          | Requisitos especiales      |
| is_active          | BOOLEAN       | Activo                     |

---

### 📋 **plans**

| Campo                  | Tipo          | Descripción         |
| ---------------------- | ------------- | ------------------- |
| id                     | INTEGER       | PK                  |
| name                   | VARCHAR(200)  | Nombre              |
| description            | TEXT          | Descripción         |
| plan_code              | VARCHAR(50)   | Código único        |
| duration               | INTEGER       | Duración en días    |
| base_price             | DECIMAL(10,2) | Precio base         |
| max_people             | INTEGER       | Máximo de personas  |
| min_people             | INTEGER       | Mínimo de personas  |
| includes_accommodation | BOOLEAN       | Incluye alojamiento |
| includes_transport     | BOOLEAN       | Incluye transporte  |
| includes_meals         | BOOLEAN       | Incluye comidas     |
| meal_plan              | VARCHAR(100)  | Plan de comidas     |
| category               | VARCHAR(50)   | Categoría           |
| season_type            | VARCHAR(50)   | Tipo de temporada   |
| is_active              | BOOLEAN       | Activo              |

---

### ✈️ **trips**

| Campo                | Tipo          | Descripción                                                     |
| -------------------- | ------------- | --------------------------------------------------------------- |
| id                   | INTEGER       | PK                                                              |
| client_id            | INTEGER       | FK → clients.id                                                 |
| trip_code            | VARCHAR(50)   | Código único                                                    |
| destination          | VARCHAR(200)  | Destino                                                         |
| description          | TEXT          | Descripción                                                     |
| start_date           | DATE          | Fecha inicio                                                    |
| end_date             | DATE          | Fecha fin                                                       |
| total_price          | DECIMAL(10,2) | Precio total                                                    |
| number_of_passengers | INTEGER       | Número de pasajeros                                             |
| status               | ENUM          | 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled' |
| payment_status       | ENUM          | 'pending', 'partial', 'paid'                                    |
| notes                | TEXT          | Notas                                                           |

---

### 🧾 **invoices**

| Campo          | Tipo          | Descripción                                          |
| -------------- | ------------- | ---------------------------------------------------- |
| id             | INTEGER       | PK                                                   |
| trip_id        | INTEGER       | FK → trips.id                                        |
| bank_card_id   | INTEGER       | FK → bank_cards.id (nullable)                        |
| invoice_number | VARCHAR(50)   | Número de factura (UNIQUE)                           |
| issue_date     | DATE          | Fecha de emisión                                     |
| due_date       | DATE          | Fecha de vencimiento                                 |
| subtotal       | DECIMAL(10,2) | Subtotal                                             |
| tax            | DECIMAL(10,2) | Impuestos                                            |
| discount       | DECIMAL(10,2) | Descuento                                            |
| total_amount   | DECIMAL(10,2) | Total                                                |
| paid_amount    | DECIMAL(10,2) | Monto pagado                                         |
| balance        | DECIMAL(10,2) | Saldo                                                |
| status         | ENUM          | 'pending', 'partial', 'paid', 'overdue', 'cancelled' |
| payment_method | ENUM          | 'credit_card', 'debit_card', 'bank_transfer', 'cash' |
| notes          | TEXT          | Notas                                                |

---

### 💰 **installments**

| Campo                 | Tipo          | Descripción                                          |
| --------------------- | ------------- | ---------------------------------------------------- |
| id                    | INTEGER       | PK                                                   |
| trip_id               | INTEGER       | FK → trips.id                                        |
| invoice_id            | INTEGER       | FK → invoices.id (nullable)                          |
| installment_number    | INTEGER       | Número de cuota                                      |
| amount                | DECIMAL(10,2) | Monto                                                |
| due_date              | DATE          | Fecha de vencimiento                                 |
| paid_date             | DATE          | Fecha de pago (nullable)                             |
| status                | ENUM          | 'pending', 'paid', 'overdue', 'cancelled'            |
| payment_method        | ENUM          | 'credit_card', 'debit_card', 'bank_transfer', 'cash' |
| transaction_reference | VARCHAR(100)  | Referencia de transacción                            |
| notes                 | TEXT          | Notas                                                |

---

### 💳 **bank_cards**

| Campo            | Tipo         | Descripción              |
| ---------------- | ------------ | ------------------------ |
| id               | INTEGER      | PK                       |
| client_id        | INTEGER      | FK → clients.id          |
| card_holder_name | VARCHAR(200) | Titular                  |
| card_number      | VARCHAR(255) | Número (ENCRIPTADO)      |
| card_type        | ENUM         | 'credit', 'debit'        |
| card_brand       | VARCHAR(50)  | Marca                    |
| expiry_month     | INTEGER      | Mes de vencimiento       |
| expiry_year      | INTEGER      | Año de vencimiento       |
| cvv              | VARCHAR(255) | CVV (ENCRIPTADO)         |
| billing_address  | VARCHAR(255) | Dirección de facturación |
| billing_city     | VARCHAR(100) | Ciudad                   |
| billing_country  | VARCHAR(100) | País                     |
| billing_zip_code | VARCHAR(20)  | Código postal            |
| is_default       | BOOLEAN      | Tarjeta por defecto      |
| is_active        | BOOLEAN      | Activa                   |

---

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Los siguientes campos DEBEN ser encriptados en producción:

- `bank_cards.card_number`
- `bank_cards.cvv`
- `users.password`

Se recomienda usar:

- **Bcrypt** o **Argon2** para contraseñas
- **AES-256** para datos de tarjetas
- Implementar **tokenización** para información sensible

---

## 🚀 Próximos Pasos

### 1. Ejecutar Migraciones

```bash
node ace migration:run
```

### 2. Crear Seeders (Datos de Prueba)

```bash
node ace make:seeder User
node ace make:seeder Client
node ace make:seeder Municipality
```

### 3. Implementar Controladores

- ClientsController ✅
- TripsController ✅
- PlansController
- InvoicesController
- TouristActivitiesController

### 4. Implementar Validaciones

- ClientValidator ✅
- TripValidator ✅
- PlanValidator
- InvoiceValidator

### 5. Implementar Autenticación

- JWT o Sessions
- Middleware de autorización por roles

---

## 📝 Notas de Implementación

### Relaciones en AdonisJS

Todas las relaciones están implementadas usando los decoradores de Lucid ORM:

- **@belongsTo()** - Relación n-1
- **@hasOne()** - Relación 1-1
- **@hasMany()** - Relación 1-n
- **@manyToMany()** - Relación n-m

### Ejemplo de Uso

```typescript
// Obtener un viaje con su cliente y planes
const trip = await Trip.query()
  .where('id', 1)
  .preload('client', (clientQuery) => {
    clientQuery.preload('user')
  })
  .preload('plans', (planQuery) => {
    planQuery.preload('touristActivities')
  })
  .firstOrFail()

// Crear un nuevo viaje
const trip = await Trip.create({
  clientId: 1,
  tripCode: 'TRIP-2025-001',
  destination: 'Cartagena',
  startDate: DateTime.now().plus({ days: 30 }),
  endDate: DateTime.now().plus({ days: 37 }),
  totalPrice: 2500000,
  numberOfPassengers: 2,
  status: 'pending',
  paymentStatus: 'pending',
})

// Asociar planes al viaje
await trip.related('plans').attach([1, 2, 3])
```

---

## 📊 Diagrama ER (Texto)

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ 1:1
   ┌───┴────┬────────┬────────────┐
   │        │        │            │
   ▼        ▼        ▼            ▼
┌────────┐ ┌──────┐ ┌──────────────┐
│ Client │ │Guide │ │Administrator │
└───┬────┘ └──┬───┘ └──────────────┘
    │         │
    │1:n      │1:n
    ▼         ▼
┌─────────┐ ┌──────────────────┐
│  Trip   │ │TouristActivity   │
└────┬────┘ └─────────┬────────┘
     │ 1:n            │ n:1
     │                ▼
     │         ┌─────────────┐
     │         │Municipality │
     │         └─────────────┘
     │
     │ n:m (trip_plan)
     ▼
  ┌──────┐ n:m (plan_tourist_activities)
  │ Plan ├────────────────────────────────┐
  └──────┘                                 │
                                           ▼
                                  ┌──────────────────┐
                                  │TouristActivity   │
                                  └──────────────────┘

┌─────────────┐ 1:n  ┌────────────┐
│    Trip     ├──────►  Invoice   │
└──────┬──────┘      └─────┬──────┘
       │ 1:n               │ n:1
       ▼                   ▼
┌────────────┐      ┌────────────┐
│Installment │      │ BankCard   │
└────────────┘      └─────┬──────┘
                          │ n:1
                          ▼
                    ┌──────────┐
                    │  Client  │
                    └──────────┘
```

---

## ✅ Modelos Implementados

- ✅ User
- ✅ Client
- ✅ Guide
- ✅ Administrator
- ✅ Municipality
- ✅ TouristActivity
- ✅ Plan
- ✅ Trip
- ✅ Invoice
- ✅ Installment
- ✅ BankCard

---

**Fecha de creación:** 13 de noviembre de 2025  
**Framework:** AdonisJS v5 + Lucid ORM  
**Base de datos:** MySQL
