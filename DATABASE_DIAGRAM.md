# 🗺️ DIAGRAMA DE RELACIONES DEL SISTEMA

## 📊 Diagrama Entidad-Relación Completo

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SISTEMA DE GESTIÓN DE VIAJES                            │
└─────────────────────────────────────────────────────────────────────────────────┘

╔════════════════════════════════════════════════════════════════════════════════╗
║                              MÓDULO DE USUARIOS                                 ║
╚════════════════════════════════════════════════════════════════════════════════╝

                              ┌──────────────┐
                              │     USER     │
                              ├──────────────┤
                              │ id (PK)      │
                              │ username     │
                              │ email        │
                              │ password     │
                              │ user_type    │
                              │ is_active    │
                              └───────┬──────┘
                                      │ 1:1
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
    ┌───────────────┐         ┌───────────────┐       ┌─────────────────┐
    │    CLIENT     │         │     GUIDE     │       │  ADMINISTRATOR  │
    ├───────────────┤         ├───────────────┤       ├─────────────────┤
    │ id (PK)       │         │ id (PK)       │       │ id (PK)         │
    │ user_id (FK)  │         │ user_id (FK)  │       │ user_id (FK)    │
    │ first_name    │         │ first_name    │       │ first_name      │
    │ last_name     │         │ last_name     │       │ last_name       │
    │ document_num  │         │ license_num   │       │ department      │
    │ phone         │         │ specialization│       │ access_level    │
    │ address       │         │ languages     │       │ can_manage_*    │
    │ birth_date    │         │ experience    │       └─────────────────┘
    └───────┬───────┘         └───────┬───────┘
            │ 1:n                     │ 1:n
            │                         │
            │                         │
            ▼                         ▼

╔════════════════════════════════════════════════════════════════════════════════╗
║                           MÓDULO DE DESTINOS Y ACTIVIDADES                      ║
╚════════════════════════════════════════════════════════════════════════════════╝

    ┌──────────────────┐                    ┌────────────────────────┐
    │   MUNICIPALITY   │                    │   TOURIST_ACTIVITY     │
    ├──────────────────┤                    ├────────────────────────┤
    │ id (PK)          │                    │ id (PK)                │
    │ name             │◄───────────────────┤ guide_id (FK)          │
    │ department       │       n:1          │ municipality_id (FK)   │
    │ country          │                    │ name                   │
    │ population       │                    │ description            │
    │ latitude         │                    │ activity_type          │
    │ longitude        │                    │ duration               │
    │ description      │                    │ price                  │
    │ climate          │                    │ max_capacity           │
    └──────────────────┘                    │ difficulty             │
            ▲                               │ includes_transport     │
            │ 1:n                           │ includes_meals         │
            │                               └───────────┬────────────┘
            │                                           │
            │                                           │ n:m
            │                                           │
            │                                           ▼

╔════════════════════════════════════════════════════════════════════════════════╗
║                           MÓDULO DE PLANES TURÍSTICOS                           ║
╚════════════════════════════════════════════════════════════════════════════════╝

                                        ┌──────────────────┐
                                        │      PLAN        │
                                        ├──────────────────┤
                                        │ id (PK)          │
                                        │ name             │
                                        │ plan_code        │
                                        │ duration         │
                                        │ base_price       │
                                        │ max_people       │
                                        │ includes_*       │
                                        │ category         │
                                        └────────┬─────────┘
                                                 │
                    ┌────────────────────────────┼────────────────────────────┐
                    │ n:m                        │                            │ n:m
                    │ (plan_tourist_activities)  │                            │ (trip_plan)
                    ▼                            │                            ▼
        ┌────────────────────────┐               │
        │   TOURIST_ACTIVITY     │               │
        │  (desde arriba)        │               │
        └────────────────────────┘               │

╔════════════════════════════════════════════════════════════════════════════════╗
║                              MÓDULO DE VIAJES                                   ║
╚════════════════════════════════════════════════════════════════════════════════╝

    ┌───────────────┐
    │    CLIENT     │
    │  (desde arriba)│
    └───────┬───────┘
            │ 1:n
            ▼
    ┌──────────────────┐
    │      TRIP        │
    ├──────────────────┤
    │ id (PK)          │
    │ client_id (FK)   │
    │ trip_code        │
    │ destination      │
    │ start_date       │
    │ end_date         │
    │ total_price      │
    │ num_passengers   │
    │ status           │
    │ payment_status   │
    └────────┬─────────┘
             │
             ├────────────────┐
             │ 1:n            │ 1:n
             ▼                ▼

╔════════════════════════════════════════════════════════════════════════════════╗
║                          MÓDULO DE FACTURACIÓN Y PAGOS                          ║
╚════════════════════════════════════════════════════════════════════════════════╝

    ┌──────────────────┐              ┌──────────────────┐
    │   INSTALLMENT    │              │     INVOICE      │
    ├──────────────────┤              ├──────────────────┤
    │ id (PK)          │              │ id (PK)          │
    │ trip_id (FK)     │◄─────────────┤ trip_id (FK)     │
    │ invoice_id (FK)  │   1:n        │ bank_card_id(FK) │
    │ installment_num  │              │ invoice_number   │
    │ amount           │              │ issue_date       │
    │ due_date         │              │ due_date         │
    │ paid_date        │              │ subtotal         │
    │ status           │              │ tax              │
    │ payment_method   │              │ discount         │
    │ transaction_ref  │              │ total_amount     │
    └──────────────────┘              │ paid_amount      │
                                      │ balance          │
                                      │ status           │
                                      └─────────┬────────┘
                                                │ n:1
                                                ▼
                                      ┌──────────────────┐
                                      │    BANK_CARD     │
                                      ├──────────────────┤
                                      │ id (PK)          │
    ┌───────────────┐                 │ client_id (FK)   │
    │    CLIENT     │◄────────────────┤ card_holder_name │
    │  (desde arriba)│      1:n       │ card_number      │
    └───────────────┘                 │ card_type        │
                                      │ card_brand       │
                                      │ expiry_month     │
                                      │ expiry_year      │
                                      │ cvv              │
                                      │ billing_*        │
                                      │ is_default       │
                                      └──────────────────┘

╔════════════════════════════════════════════════════════════════════════════════╗
║                         TABLAS PIVOTE (RELACIONES N:M)                          ║
╚════════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│   PLAN_TOURIST_ACTIVITIES       │       │         TRIP_PLAN               │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id (PK)                         │       │ id (PK)                         │
│ plan_id (FK) → plans            │       │ trip_id (FK) → trips            │
│ tourist_activity_id (FK)        │       │ plan_id (FK) → plans            │
│ day_number                      │       │ order_in_trip                   │
│ order_in_day                    │       │ start_date                      │
│ is_optional                     │       │ end_date                        │
│ custom_price                    │       │ custom_price                    │
└─────────────────────────────────┘       └─────────────────────────────────┘

```

---

## 🔗 RESUMEN DE RELACIONES

### Relaciones 1:1 (Uno a Uno)

| Modelo Origen | Relación  | Modelo Destino |
| ------------- | --------- | -------------- |
| User          | hasOne    | Client         |
| User          | hasOne    | Guide          |
| User          | hasOne    | Administrator  |
| Client        | belongsTo | User           |
| Guide         | belongsTo | User           |
| Administrator | belongsTo | User           |

### Relaciones 1:n (Uno a Muchos)

| Modelo Origen | Relación | Modelo Destino  |
| ------------- | -------- | --------------- |
| Client        | hasMany  | Trip            |
| Client        | hasMany  | BankCard        |
| Guide         | hasMany  | TouristActivity |
| Municipality  | hasMany  | TouristActivity |
| Trip          | hasMany  | Invoice         |
| Trip          | hasMany  | Installment     |
| BankCard      | hasMany  | Invoice         |
| Invoice       | hasMany  | Installment     |

### Relaciones n:1 (Muchos a Uno)

| Modelo Origen   | Relación  | Modelo Destino |
| --------------- | --------- | -------------- |
| Trip            | belongsTo | Client         |
| TouristActivity | belongsTo | Guide          |
| TouristActivity | belongsTo | Municipality   |
| Invoice         | belongsTo | Trip           |
| Invoice         | belongsTo | BankCard       |
| Installment     | belongsTo | Trip           |
| Installment     | belongsTo | Invoice        |
| BankCard        | belongsTo | Client         |

### Relaciones n:m (Muchos a Muchos)

| Modelo A | Tabla Pivote            | Modelo B        | Campos Extra                                        |
| -------- | ----------------------- | --------------- | --------------------------------------------------- |
| Plan     | plan_tourist_activities | TouristActivity | day_number, order_in_day, is_optional, custom_price |
| Trip     | trip_plan               | Plan            | order_in_trip, start_date, end_date, custom_price   |

---

## 📈 FLUJO DE DATOS PRINCIPAL

```
1. Usuario se registra
   └─> Crea User → Crea Client/Guide/Administrator

2. Administrador crea contenido
   └─> Crea Municipalities
       └─> Guías crean TouristActivities
           └─> Se crean Plans con actividades

3. Cliente reserva viaje
   └─> Cliente navega Plans
       └─> Selecciona Plan(s)
           └─> Crea Trip
               └─> Asocia Plans a Trip (trip_plan)

4. Proceso de pago
   └─> Cliente registra BankCard
       └─> Sistema genera Invoice
           └─> Cliente puede pagar:
               ├─> Total (Invoice completa)
               └─> Parcial (Installments)

5. Seguimiento
   └─> Trip actualiza status
       └─> Invoices actualiza status
           └─> Installments actualiza status
```

---

## 🎯 CARDINALIDADES EXPLICADAS

### Cliente → Viajes (1:n)

- **Un** cliente puede hacer **múltiples** viajes
- **Cada** viaje pertenece a **un solo** cliente
- **Ejemplo:** María García tiene 3 viajes reservados

### Viaje → Planes (n:m)

- **Un** viaje puede incluir **varios** planes
- **Un** plan puede estar en **varios** viajes
- **Ejemplo:** Viaje a Cartagena incluye "Plan Colonial" + "Plan Playa"

### Plan → Actividades (n:m)

- **Un** plan incluye **múltiples** actividades
- **Una** actividad puede estar en **varios** planes
- **Ejemplo:** "Tour Ciudad Amurallada" está en 3 planes diferentes

### Guía → Actividades (1:n)

- **Un** guía dirige **múltiples** actividades
- **Cada** actividad tiene **un** guía asignado
- **Ejemplo:** Pedro Martínez guía 5 actividades diferentes

---

## 🔐 CAMPOS SENSIBLES (SEGURIDAD)

### 🚨 DEBEN SER ENCRIPTADOS:

#### User

- `password` → Bcrypt/Argon2

#### BankCard

- `card_number` → AES-256
- `cvv` → AES-256

### 🔒 NO DEBEN SERIALIZARSE:

- `user.password` → `serializeAs: null`
- `bank_card.card_number` → `serializeAs: null` (en producción)
- `bank_card.cvv` → `serializeAs: null`

---

## 📊 ÍNDICES RECOMENDADOS

```sql
-- Usuarios
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_type ON users(user_type);

-- Clientes
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_document ON clients(document_number);

-- Viajes
CREATE INDEX idx_trips_client ON trips(client_id);
CREATE INDEX idx_trips_code ON trips(trip_code);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);

-- Facturas
CREATE INDEX idx_invoices_trip ON invoices(trip_id);
CREATE INDEX idx_invoices_card ON invoices(bank_card_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Actividades
CREATE INDEX idx_activities_guide ON tourist_activities(guide_id);
CREATE INDEX idx_activities_municipality ON tourist_activities(municipality_id);
```

---

## 🎨 ESTADOS Y ENUMERACIONES

### Trip Status

- `pending` - Pendiente de confirmación
- `confirmed` - Confirmado
- `in_progress` - En curso
- `completed` - Completado
- `cancelled` - Cancelado

### Payment Status

- `pending` - Sin pagar
- `partial` - Pago parcial
- `paid` - Pagado completo

### Invoice Status

- `pending` - Pendiente
- `partial` - Pago parcial
- `paid` - Pagada
- `overdue` - Vencida
- `cancelled` - Cancelada

### Installment Status

- `pending` - Pendiente
- `paid` - Pagada
- `overdue` - Vencida
- `cancelled` - Cancelada

### Difficulty Levels

- `easy` - Fácil
- `moderate` - Moderado
- `hard` - Difícil

### Card Types

- `credit` - Crédito
- `debit` - Débito

### Payment Methods

- `credit_card` - Tarjeta de crédito
- `debit_card` - Tarjeta débito
- `bank_transfer` - Transferencia
- `cash` - Efectivo

---

**🗺️ Diagrama creado para visualizar la arquitectura completa del sistema**
