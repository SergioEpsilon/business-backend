# 📋 Datos de Prueba - API Travel Agency

Base URL: `http://127.0.0.1:3333/api/v1`

## 📑 Índice

- [Clientes](#clientes)
- [Viajes](#viajes)
- [Planes](#planes)
- [Hoteles](#hoteles)
- [Relaciones](#relaciones)

---

## 👥 Clientes

### Crear Cliente

**POST** `/clients`

#### Ejemplo 1 - Cliente Bogotá

```json
{
  "document": "1234567890",
  "phone": "+57 300 123 4567",
  "address": "Calle 10 #20-30, Bogotá"
}
```

#### Ejemplo 2 - Cliente Medellín

```json
{
  "document": "9876543210",
  "phone": "+57 301 987 6543",
  "address": "Carrera 15 #45-67, Medellín"
}
```

#### Ejemplo 3 - Cliente Cali

```json
{
  "document": "5555555555",
  "phone": "+57 320 555 5555",
  "address": "Avenida 68 #123-45, Cali"
}
```

#### Ejemplo 4 - Cliente Barranquilla

```json
{
  "document": "1111222233",
  "phone": "+57 315 111 2222",
  "address": "Calle 72 #54-32, Barranquilla"
}
```

### Otros Endpoints

- **GET** `/clients` - Listar todos los clientes (con paginación: `?page=1&per_page=10`)
- **GET** `/clients/:id` - Obtener un cliente específico
- **PUT** `/clients/:id` - Actualizar cliente
- **DELETE** `/clients/:id` - Eliminar cliente
- **GET** `/clients/:id/trips` - Obtener viajes del cliente

---

## ✈️ Viajes

### Crear Viaje

**POST** `/trips`

#### Ejemplo 1 - Viaje a Cartagena

```json
{
  "destination": "Cartagena",
  "startDate": "2025-12-15",
  "endDate": "2025-12-20",
  "numPassengers": 4,
  "status": "pending"
}
```

#### Ejemplo 2 - Viaje a San Andrés

```json
{
  "destination": "San Andrés",
  "startDate": "2025-12-25",
  "endDate": "2025-12-30",
  "numPassengers": 2,
  "status": "confirmed"
}
```

#### Ejemplo 3 - Viaje a Santa Marta

```json
{
  "destination": "Santa Marta",
  "startDate": "2026-01-10",
  "endDate": "2026-01-15",
  "numPassengers": 6,
  "status": "pending"
}
```

#### Ejemplo 4 - Viaje al Eje Cafetero

```json
{
  "destination": "Eje Cafetero",
  "startDate": "2026-02-05",
  "endDate": "2026-02-10",
  "numPassengers": 3,
  "status": "in_progress"
}
```

#### Ejemplo 5 - Viaje a Amazonas

```json
{
  "destination": "Amazonas",
  "startDate": "2026-03-01",
  "endDate": "2026-03-07",
  "numPassengers": 5,
  "status": "pending"
}
```

### Estados Válidos

- `pending` - Pendiente
- `confirmed` - Confirmado
- `in_progress` - En progreso
- `completed` - Completado
- `cancelled` - Cancelado

### Otros Endpoints

- **GET** `/trips` - Listar todos los viajes (con paginación: `?page=1&per_page=10`)
- **GET** `/trips/:id` - Obtener un viaje específico
- **PUT** `/trips/:id` - Actualizar viaje
- **DELETE** `/trips/:id` - Eliminar viaje
- **GET** `/trips/:id/clients` - Obtener clientes del viaje

---

## 🗺️ Planes

### Crear Plan

**POST** `/plans`

#### Ejemplo 1 - Plan Premium Caribe

```json
{
  "name": "Plan Caribe Todo Incluido",
  "description": "Disfruta del Caribe colombiano con todo incluido: hospedaje, comidas y actividades acuáticas",
  "duration": 5,
  "basePrice": 2500000,
  "maxPeople": 8,
  "minPeople": 2,
  "includesAccommodation": true,
  "includesTransport": true,
  "includesMeals": true,
  "mealPlan": "todo_incluido",
  "category": "premium",
  "seasonType": "alta"
}
```

#### Ejemplo 2 - Plan Estándar Eje Cafetero

```json
{
  "name": "Aventura en el Eje Cafetero",
  "description": "Recorre las mejores fincas cafeteras, disfruta del paisaje y conoce el proceso del café",
  "duration": 3,
  "basePrice": 1200000,
  "maxPeople": 10,
  "minPeople": 4,
  "includesAccommodation": true,
  "includesTransport": true,
  "includesMeals": true,
  "mealPlan": "pension_completa",
  "category": "estandar",
  "seasonType": "media"
}
```

#### Ejemplo 3 - Plan Lujo San Andrés

```json
{
  "name": "Escapada Romántica a San Andrés",
  "description": "Plan especial para parejas con cena romántica, spa y tour en lancha",
  "duration": 4,
  "basePrice": 3500000,
  "maxPeople": 2,
  "minPeople": 2,
  "includesAccommodation": true,
  "includesTransport": false,
  "includesMeals": true,
  "mealPlan": "media_pension",
  "category": "lujo",
  "seasonType": "alta"
}
```

#### Ejemplo 4 - Plan Económico Ciudad Perdida

```json
{
  "name": "Tour Económico Ciudad Perdida",
  "description": "Trek de 4 días a la Ciudad Perdida con guía, transporte y hospedaje básico",
  "duration": 4,
  "basePrice": 800000,
  "maxPeople": 15,
  "minPeople": 6,
  "includesAccommodation": true,
  "includesTransport": true,
  "includesMeals": true,
  "mealPlan": "pension_completa",
  "category": "economico",
  "seasonType": "baja"
}
```

#### Ejemplo 5 - Plan Aventura Tayrona

```json
{
  "name": "Aventura Parque Tayrona",
  "description": "Camping y senderismo en el parque nacional más hermoso de Colombia",
  "duration": 2,
  "basePrice": 450000,
  "maxPeople": 12,
  "minPeople": 4,
  "includesAccommodation": true,
  "includesTransport": true,
  "includesMeals": true,
  "mealPlan": "desayuno",
  "category": "economico",
  "seasonType": "media"
}
```

### Categorías

- `economico` - Económico
- `estandar` - Estándar
- `premium` - Premium
- `lujo` - Lujo

### Temporadas

- `baja` - Temporada Baja
- `media` - Temporada Media
- `alta` - Temporada Alta

### Planes de Comidas

- `desayuno` - Solo Desayuno
- `media_pension` - Media Pensión
- `pension_completa` - Pensión Completa
- `todo_incluido` - Todo Incluido

### Otros Endpoints

- **GET** `/plans` - Listar todos los planes (con paginación: `?page=1&per_page=10`)
- **GET** `/plans/:id` - Obtener un plan específico
- **PUT** `/plans/:id` - Actualizar plan
- **DELETE** `/plans/:id` - Eliminar plan
- **PATCH** `/plans/:id/toggle-active` - Activar/Desactivar plan
- **GET** `/plans/:id/activities` - Obtener actividades del plan

---

## 🏨 Hoteles

### Crear Hotel

**POST** `/hotels`

#### Ejemplo 1 - Hotel de Lujo Cartagena

```json
{
  "municipalityId": 1,
  "administratorId": 1,
  "name": "Hotel Caribe Plaza",
  "address": "Avenida del Mar #25-100, Cartagena",
  "phone": "+57 5 650 0000",
  "email": "reservas@caribeplaza.com",
  "website": "https://www.caribeplaza.com",
  "stars": 5,
  "description": "Hotel de lujo frente al mar Caribe con todas las comodidades",
  "amenities": "Spa, Sauna, Jacuzzi, Salón de eventos, Bar en la playa",
  "latitude": 10.3997,
  "longitude": -75.5144,
  "hasParking": true,
  "hasPool": true,
  "hasRestaurant": true,
  "hasWifi": true,
  "hasGym": true
}
```

#### Ejemplo 2 - Posada Eje Cafetero

```json
{
  "municipalityId": 1,
  "administratorId": 1,
  "name": "Posada La Montaña",
  "address": "Vereda El Paraíso, Salento, Quindío",
  "phone": "+57 6 759 3456",
  "email": "info@posadalamontana.com",
  "website": "https://www.posadalamontana.com",
  "stars": 3,
  "description": "Acogedora posada en el corazón del eje cafetero",
  "amenities": "Chimenea, Terrazas con vista, Tours de café",
  "latitude": 4.6389,
  "longitude": -75.5719,
  "hasParking": true,
  "hasPool": false,
  "hasRestaurant": true,
  "hasWifi": true,
  "hasGym": false
}
```

#### Ejemplo 3 - Hotel Boutique Santa Marta

```json
{
  "municipalityId": 1,
  "administratorId": 1,
  "name": "Hotel Boutique Santa Marta",
  "address": "Calle 19 #3-45, Centro Histórico, Santa Marta",
  "phone": "+57 5 421 8888",
  "email": "contacto@boutiquesantamarta.com",
  "website": "https://www.boutiquesantamarta.com",
  "stars": 4,
  "description": "Hotel boutique en edificio colonial restaurado",
  "amenities": "Roof top bar, Biblioteca, Servicio de conserjería",
  "latitude": 11.2408,
  "longitude": -74.2063,
  "hasParking": false,
  "hasPool": true,
  "hasRestaurant": true,
  "hasWifi": true,
  "hasGym": true
}
```

#### Ejemplo 4 - Hostal Económico Bogotá

```json
{
  "municipalityId": 1,
  "administratorId": 1,
  "name": "Hostal Viajeros",
  "address": "Carrera 7 #12-34, La Candelaria, Bogotá",
  "phone": "+57 1 341 2345",
  "email": "hola@hostalviajeros.com",
  "stars": 2,
  "description": "Hostal económico para mochileros en el centro histórico",
  "amenities": "Cocina compartida, Sala de juegos, Tours grupales",
  "latitude": 4.5981,
  "longitude": -74.0758,
  "hasParking": false,
  "hasPool": false,
  "hasRestaurant": false,
  "hasWifi": true,
  "hasGym": false
}
```

#### Ejemplo 5 - Hotel de Playa San Andrés

```json
{
  "municipalityId": 1,
  "administratorId": 1,
  "name": "Paradise Beach Resort",
  "address": "Sector San Luis, Km 5, San Andrés Isla",
  "phone": "+57 8 512 7777",
  "email": "info@paradisebeach.com",
  "website": "https://www.paradisebeach.com",
  "stars": 5,
  "description": "Resort todo incluido con playa privada y actividades acuáticas",
  "amenities": "Casino, Discoteca, Centro de buceo, Spa, Kids club",
  "latitude": 12.5847,
  "longitude": -81.7006,
  "hasParking": true,
  "hasPool": true,
  "hasRestaurant": true,
  "hasWifi": true,
  "hasGym": true
}
```

### Otros Endpoints

- **GET** `/hotels` - Listar todos los hoteles (con paginación: `?page=1&per_page=10`)
- **GET** `/hotels/:id` - Obtener un hotel específico
- **PUT** `/hotels/:id` - Actualizar hotel
- **DELETE** `/hotels/:id` - Eliminar hotel
- **PATCH** `/hotels/:id/toggle-active` - Activar/Desactivar hotel
- **GET** `/hotels/:id/rooms` - Obtener habitaciones del hotel

---

## 🔗 Relaciones

### Asignar Cliente a Viaje

**POST** `/trips/:tripId/clients/:clientId`

**Ejemplo:**

```
POST /trips/1/clients/01JCZQXXXXXXXXXXXXXX
```

_Body vacío_ (no necesita body)

**Nota:** El `clientId` es un CUID (string largo alfanumérico), debes obtenerlo del GET de clientes.

---

### Desasignar Cliente de Viaje

**DELETE** `/trips/:tripId/clients/:clientId`

**Ejemplo:**

```
DELETE /trips/1/clients/01JCZQXXXXXXXXXXXXXX
```

---

### Activar/Desactivar Plan

**PATCH** `/plans/:id/toggle-active`

**Ejemplo:**

```
PATCH /plans/3/toggle-active
```

**Body:**

```json
{}
```

---

### Activar/Desactivar Hotel

**PATCH** `/hotels/:id/toggle-active`

**Ejemplo:**

```
PATCH /hotels/2/toggle-active
```

**Body:**

```json
{}
```

---

## 📝 Notas Importantes

### Tipos de ID

- **Clientes:** Usan CUID (strings alfanuméricos largos como `01JCZQXXXXXXXXXXXXXX`)
- **Viajes, Planes, Hoteles:** Usan IDs numéricos (1, 2, 3, etc.)

### Formato de Fechas

Las fechas deben estar en formato **ISO 8601** o **YYYY-MM-DD**:

```json
{
  "startDate": "2025-12-15",
  "endDate": "2025-12-20"
}
```

### Paginación

Todos los endpoints de listado soportan paginación:

```
GET /clients?page=1&per_page=10
GET /trips?page=2&per_page=20
```

### Estados de Pago (Viajes)

- `pending` - Pendiente
- `partial` - Parcial
- `paid` - Pagado
- `refunded` - Reembolsado

---

## 🚀 Ejemplos de Uso con cURL

### Crear un cliente

```bash
curl -X POST http://127.0.0.1:3333/api/v1/clients \
  -H "Content-Type: application/json" \
  -d '{
    "document": "1234567890",
    "phone": "+57 300 123 4567",
    "address": "Calle 10 #20-30, Bogotá"
  }'
```

### Listar viajes con paginación

```bash
curl -X GET "http://127.0.0.1:3333/api/v1/trips?page=1&per_page=10"
```

### Asignar cliente a viaje

```bash
curl -X POST http://127.0.0.1:3333/api/v1/trips/1/clients/01JCZQXXXXXXXXXXXXXX
```

### Activar/Desactivar plan

```bash
curl -X PATCH http://127.0.0.1:3333/api/v1/plans/3/toggle-active \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## ✅ Estado de Implementación

- ✅ **Clientes** - CRUD completo + relaciones con viajes
- ✅ **Viajes** - CRUD completo + relaciones con clientes
- ✅ **Planes** - CRUD completo + toggle active + actividades
- ✅ **Hoteles** - CRUD completo + toggle active + habitaciones

**Total de entidades completadas:** 4 de 11

---

**Última actualización:** 18 de noviembre de 2025
