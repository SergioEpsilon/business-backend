# 🚀 Guía de Testing de Endpoints - Postman

## 📋 Configuración Inicial

**Base URL**: `http://localhost:3333/api/v1`

---

## 1️⃣ CLIENTES (Clients)

### 📌 GET - Listar Clientes
```
GET http://localhost:3333/api/v1/clients
```

### 📌 POST - Crear Cliente
```
POST http://localhost:3333/api/v1/clients
Content-Type: application/json

{
  "document": "1234567890",
  "phone": "3001234567",
  "address": "Calle 123 #45-67, Bogotá"
}
```

### 📌 GET - Obtener Cliente por ID
```
GET http://localhost:3333/api/v1/clients/1
```

### 📌 PUT - Actualizar Cliente
```
PUT http://localhost:3333/api/v1/clients/1
Content-Type: application/json

{
  "document": "1234567890",
  "phone": "3009876543",
  "address": "Carrera 50 #30-20, Medellín"
}
```

### 📌 DELETE - Eliminar Cliente
```
DELETE http://localhost:3333/api/v1/clients/1
```

### 📌 GET - Obtener Viajes de un Cliente
```
GET http://localhost:3333/api/v1/clients/1/trips
```

---

## 2️⃣ VIAJES (Trips)

### 📌 GET - Listar Viajes
```
GET http://localhost:3333/api/v1/trips
```

### 📌 POST - Crear Viaje
```
POST http://localhost:3333/api/v1/trips
Content-Type: application/json

{
  "destination": "Cartagena",
  "startDate": "2025-12-15",
  "endDate": "2025-12-20",
  "numPassengers": 4,
  "status": "confirmado"
}
```

### 📌 GET - Obtener Viaje por ID
```
GET http://localhost:3333/api/v1/trips/1
```

### 📌 PUT - Actualizar Viaje
```
PUT http://localhost:3333/api/v1/trips/1
Content-Type: application/json

{
  "destination": "Santa Marta",
  "startDate": "2025-12-15",
  "endDate": "2025-12-22",
  "numPassengers": 5,
  "status": "confirmado"
}
```

### 📌 DELETE - Eliminar Viaje
```
DELETE http://localhost:3333/api/v1/trips/1
```

### 📌 GET - Obtener Clientes de un Viaje
```
GET http://localhost:3333/api/v1/trips/1/clients
```

### 📌 POST - Asociar Cliente a Viaje
```
POST http://localhost:3333/api/v1/trips/1/clients/1
```

### 📌 DELETE - Desasociar Cliente de Viaje
```
DELETE http://localhost:3333/api/v1/trips/1/clients/1
```

---

## 3️⃣ PLANES (Plans)

### 📌 GET - Listar Planes
```
GET http://localhost:3333/api/v1/plans
```

### 📌 POST - Crear Plan
```
POST http://localhost:3333/api/v1/plans
Content-Type: application/json

{
  "name": "Plan Aventura Caribe",
  "description": "Plan turístico completo por la costa caribeña colombiana con actividades acuáticas",
  "price": 1500000,
  "duration": 7,
  "isActive": true
}
```

### 📌 GET - Obtener Plan por ID
```
GET http://localhost:3333/api/v1/plans/1
```

### 📌 PUT - Actualizar Plan
```
PUT http://localhost:3333/api/v1/plans/1
Content-Type: application/json

{
  "name": "Plan Aventura Caribe Premium",
  "description": "Plan turístico premium por la costa caribeña con todas las comodidades",
  "price": 2500000,
  "duration": 10,
  "isActive": true
}
```

### 📌 DELETE - Eliminar Plan
```
DELETE http://localhost:3333/api/v1/plans/1
```

### 📌 GET - Obtener Actividades de un Plan
```
GET http://localhost:3333/api/v1/plans/1/activities
```

### 📌 PATCH - Activar/Desactivar Plan
```
PATCH http://localhost:3333/api/v1/plans/1/toggle-active
```

---

## 4️⃣ HOTELES (Hotels)

### 📌 GET - Listar Hoteles
```
GET http://localhost:3333/api/v1/hotels
```

### 📌 POST - Crear Hotel
```
POST http://localhost:3333/api/v1/hotels
Content-Type: application/json

{
  "name": "Hotel Caribe Plaza",
  "address": "Calle del Arsenal #8B-137, Centro Histórico",
  "phone": "3001234567",
  "email": "info@hotelcaribeplaza.com",
  "website": "https://hotelcaribeplaza.com",
  "stars": 4,
  "description": "Hotel boutique en el corazón del centro histórico de Cartagena",
  "amenities": "WiFi gratuito, Desayuno incluido, Piscina en azotea, Bar, Terraza",
  "hasParking": true,
  "hasPool": true,
  "hasRestaurant": true,
  "hasWifi": true,
  "hasGym": false,
  "isActive": true
}
```

### 📌 GET - Obtener Hotel por ID
```
GET http://localhost:3333/api/v1/hotels/1
```

### 📌 GET - Obtener Habitaciones de un Hotel
```
GET http://localhost:3333/api/v1/hotels/1/rooms
```

---

## 5️⃣ HABITACIONES (Rooms)

### 📌 GET - Listar Habitaciones
```
GET http://localhost:3333/api/v1/rooms
```

### 📌 POST - Crear Habitación
```
POST http://localhost:3333/api/v1/rooms
Content-Type: application/json

{
  "hotelId": 1,
  "roomNumber": "101",
  "roomType": "doble",
  "capacity": 2,
  "pricePerNight": 150000,
  "isAvailable": true,
  "floor": 1,
  "hasBalcony": true,
  "hasKitchen": false,
  "hasAirConditioning": true,
  "description": "Habitación doble con vista al mar",
  "amenities": "TV, WiFi, Minibar, Caja fuerte"
}
```

### 📌 GET - Obtener Habitación por ID
```
GET http://localhost:3333/api/v1/rooms/1
```

### 📌 GET - Obtener Habitaciones por Hotel
```
GET http://localhost:3333/api/v1/rooms/hotel/1
```

### 📌 PUT - Actualizar Habitación
```
PUT http://localhost:3333/api/v1/rooms/1
Content-Type: application/json

{
  "hotelId": 1,
  "roomNumber": "101",
  "roomType": "suite",
  "capacity": 3,
  "pricePerNight": 250000,
  "isAvailable": true,
  "floor": 1,
  "hasBalcony": true,
  "hasKitchen": true,
  "hasAirConditioning": true,
  "description": "Suite ejecutiva con vista panorámica al mar",
  "amenities": "TV Smart, WiFi, Minibar, Caja fuerte, Jacuzzi"
}
```

### 📌 DELETE - Eliminar Habitación
```
DELETE http://localhost:3333/api/v1/rooms/1
```

---

## 6️⃣ ACTIVIDADES TURÍSTICAS (Tourist Activities)

### 📌 GET - Listar Actividades
```
GET http://localhost:3333/api/v1/tourist-activities
```

### 📌 POST - Crear Actividad
```
POST http://localhost:3333/api/v1/tourist-activities
Content-Type: application/json

{
  "municipalityId": 1,
  "name": "Buceo en arrecifes",
  "description": "Inmersión guiada en los arrecifes coralinos del Caribe",
  "activityType": "Acuática",
  "duration": 120,
  "difficulty": "moderada",
  "price": 200000,
  "isActive": true,
  "maxCapacity": 10,
  "minAge": 14,
  "requirements": "Certificado de buceo o curso previo"
}
```

### 📌 GET - Obtener Actividad por ID
```
GET http://localhost:3333/api/v1/tourist-activities/1
```

### 📌 PUT - Actualizar Actividad
```
PUT http://localhost:3333/api/v1/tourist-activities/1
Content-Type: application/json

{
  "municipalityId": 1,
  "name": "Buceo en arrecifes con fotografía",
  "description": "Inmersión guiada con sesión fotográfica profesional",
  "activityType": "Acuática",
  "duration": 180,
  "difficulty": "moderada",
  "price": 300000,
  "isActive": true,
  "maxCapacity": 8,
  "minAge": 16,
  "requirements": "Certificado de buceo avanzado"
}
```

### 📌 DELETE - Eliminar Actividad
```
DELETE http://localhost:3333/api/v1/tourist-activities/1
```

### 📌 PATCH - Activar/Desactivar Actividad
```
PATCH http://localhost:3333/api/v1/tourist-activities/1/toggle-active
```

### 📌 GET - Obtener Actividades por Tipo
```
GET http://localhost:3333/api/v1/tourist-activities/by-type?type=Acuática
```

---

## 7️⃣ CUOTAS (Installments)

### 📌 GET - Listar Cuotas
```
GET http://localhost:3333/api/v1/installments
```

### 📌 POST - Crear Cuota
```
POST http://localhost:3333/api/v1/installments
Content-Type: application/json

{
  "invoiceId": 1,
  "tripId": 1,
  "amount": 500000,
  "dueDate": "2025-12-01",
  "status": "pendiente",
  "notes": "Primera cuota del viaje"
}
```

### 📌 GET - Obtener Cuota por ID
```
GET http://localhost:3333/api/v1/installments/1
```

### 📌 PUT - Actualizar Cuota
```
PUT http://localhost:3333/api/v1/installments/1
Content-Type: application/json

{
  "invoiceId": 1,
  "tripId": 1,
  "amount": 550000,
  "dueDate": "2025-12-05",
  "status": "pendiente",
  "notes": "Primera cuota del viaje - Monto ajustado"
}
```

### 📌 DELETE - Eliminar Cuota
```
DELETE http://localhost:3333/api/v1/installments/1
```

### 📌 POST - Pagar Cuota
```
POST http://localhost:3333/api/v1/installments/1/pay
```

### 📌 GET - Listar Cuotas Vencidas
```
GET http://localhost:3333/api/v1/installments/overdue
```

---

## 8️⃣ TARJETAS BANCARIAS (Bank Cards)

### 📌 GET - Listar Tarjetas de un Cliente
```
GET http://localhost:3333/api/v1/clients/1/bank-cards
```

### 📌 POST - Crear Tarjeta
```
POST http://localhost:3333/api/v1/clients/1/bank-cards
Content-Type: application/json

{
  "clientId": 1,
  "cardNumber": "4532123456789012",
  "cardholderName": "Juan Perez Garcia",
  "expiryDate": "12/27",
  "cvv": "123",
  "cardType": "visa",
  "isDefault": true
}
```

### 📌 GET - Obtener Tarjeta por ID
```
GET http://localhost:3333/api/v1/bank-cards/1
```

### 📌 PUT - Actualizar Tarjeta
```
PUT http://localhost:3333/api/v1/bank-cards/1
Content-Type: application/json

{
  "clientId": 1,
  "cardNumber": "4532123456789012",
  "cardholderName": "Juan Alberto Perez Garcia",
  "expiryDate": "12/27",
  "cvv": "123",
  "cardType": "visa",
  "isDefault": true
}
```

### 📌 DELETE - Eliminar Tarjeta
```
DELETE http://localhost:3333/api/v1/bank-cards/1
```

### 📌 PATCH - Establecer como Predeterminada
```
PATCH http://localhost:3333/api/v1/bank-cards/1/set-default
```

---

## 9️⃣ VEHÍCULOS (Vehicles)

### 📌 GET - Listar Vehículos
```
GET http://localhost:3333/api/v1/vehicles
```

### 📌 POST - Crear Vehículo
```
POST http://localhost:3333/api/v1/vehicles
Content-Type: application/json

{
  "vehicleType": "bus",
  "licensePlate": "ABC123",
  "brand": "Mercedes Benz",
  "model": "Sprinter",
  "year": 2023,
  "capacity": 20,
  "features": "Aire acondicionado, WiFi, TV, Asientos reclinables",
  "isAvailable": true
}
```

### 📌 GET - Obtener Vehículo por ID
```
GET http://localhost:3333/api/v1/vehicles/1
```

### 📌 PUT - Actualizar Vehículo
```
PUT http://localhost:3333/api/v1/vehicles/1
Content-Type: application/json

{
  "vehicleType": "bus",
  "licensePlate": "ABC123",
  "brand": "Mercedes Benz",
  "model": "Sprinter Premium",
  "year": 2023,
  "capacity": 24,
  "features": "Aire acondicionado, WiFi de alta velocidad, TV Smart, Asientos reclinables, USB en cada asiento",
  "isAvailable": true
}
```

### 📌 DELETE - Eliminar Vehículo
```
DELETE http://localhost:3333/api/v1/vehicles/1
```

### 📌 GET - Obtener Rutas de un Vehículo
```
GET http://localhost:3333/api/v1/vehicles/1/routes
```

### 📌 GET - Obtener GPS de un Vehículo
```
GET http://localhost:3333/api/v1/vehicles/1/gps
```

---

## 🔟 RUTAS (Routes)

### 📌 GET - Listar Rutas
```
GET http://localhost:3333/api/v1/routes
```

### 📌 POST - Crear Ruta
```
POST http://localhost:3333/api/v1/routes
Content-Type: application/json

{
  "name": "Bogotá - Cartagena",
  "origin": "Bogotá",
  "destination": "Cartagena",
  "distance": 1050000,
  "estimatedDuration": 960,
  "description": "Ruta turística por la costa norte colombiana",
  "stops": "Medellín, Montería"
}
```

### 📌 GET - Obtener Ruta por ID
```
GET http://localhost:3333/api/v1/routes/1
```

### 📌 PUT - Actualizar Ruta
```
PUT http://localhost:3333/api/v1/routes/1
Content-Type: application/json

{
  "name": "Bogotá - Cartagena Express",
  "origin": "Bogotá",
  "destination": "Cartagena",
  "distance": 1050000,
  "estimatedDuration": 900,
  "description": "Ruta turística directa por autopista",
  "stops": "Medellín"
}
```

### 📌 DELETE - Eliminar Ruta
```
DELETE http://localhost:3333/api/v1/routes/1
```

### 📌 GET - Obtener Viajes de una Ruta
```
GET http://localhost:3333/api/v1/routes/1/trips
```

### 📌 POST - Asociar Vehículo a Ruta
```
POST http://localhost:3333/api/v1/routes/1/vehicles/1
```

---

## 1️⃣1️⃣ ITINERARIOS DE TRANSPORTE (Itinerary Transports)

### 📌 GET - Listar Itinerarios
```
GET http://localhost:3333/api/v1/itinerary-transports
```

### 📌 POST - Crear Itinerario
```
POST http://localhost:3333/api/v1/itinerary-transports
Content-Type: application/json

{
  "tripId": 1,
  "routeId": 1,
  "transportServiceId": 1,
  "dayNumber": 1,
  "orderInDay": 1,
  "numPassengers": 20,
  "totalCost": 500000,
  "notes": "Salida temprano en la mañana"
}
```

### 📌 GET - Obtener Itinerario por ID
```
GET http://localhost:3333/api/v1/itinerary-transports/1
```

### 📌 PUT - Actualizar Itinerario
```
PUT http://localhost:3333/api/v1/itinerary-transports/1
Content-Type: application/json

{
  "tripId": 1,
  "routeId": 1,
  "transportServiceId": 1,
  "dayNumber": 1,
  "orderInDay": 2,
  "numPassengers": 22,
  "totalCost": 550000,
  "notes": "Salida modificada a medio día"
}
```

### 📌 DELETE - Eliminar Itinerario
```
DELETE http://localhost:3333/api/v1/itinerary-transports/1
```

---

## 1️⃣2️⃣ MUNICIPIOS (Municipalities)

### 📌 GET - Listar Municipios
```
GET http://localhost:3333/api/v1/municipalities
```

### 📌 GET - Buscar Municipios
```
GET http://localhost:3333/api/v1/municipalities/search?name=Cartagena
```

### 📌 GET - Obtener Municipio por ID
```
GET http://localhost:3333/api/v1/municipalities/1
```

### 📌 GET - Obtener Actividades de un Municipio
```
GET http://localhost:3333/api/v1/municipalities/1/activities
```

---

## 🧪 PRUEBAS DE VALIDACIÓN (Deben FALLAR)

### ❌ Room - Tipo inválido
```
POST http://localhost:3333/api/v1/rooms
Content-Type: application/json

{
  "hotelId": 1,
  "roomNumber": "101",
  "roomType": "presidencial",
  "capacity": 2,
  "pricePerNight": 150000,
  "isAvailable": true
}
```
**Resultado esperado**: Error - "roomType debe ser individual, doble, suite o familiar"

### ❌ Room - Campo requerido faltante
```
POST http://localhost:3333/api/v1/rooms
Content-Type: application/json

{
  "roomNumber": "101",
  "roomType": "doble",
  "capacity": 2,
  "pricePerNight": 150000,
  "isAvailable": true
}
```
**Resultado esperado**: Error - "hotelId es requerido"

### ❌ BankCard - Número de tarjeta inválido
```
POST http://localhost:3333/api/v1/clients/1/bank-cards
Content-Type: application/json

{
  "clientId": 1,
  "cardNumber": "123",
  "cardholderName": "Juan Perez",
  "expiryDate": "12/27",
  "cvv": "123",
  "cardType": "visa",
  "isDefault": false
}
```
**Resultado esperado**: Error - "El número de tarjeta debe tener entre 13 y 19 dígitos"

### ❌ BankCard - Formato de expiración inválido
```
POST http://localhost:3333/api/v1/clients/1/bank-cards
Content-Type: application/json

{
  "clientId": 1,
  "cardNumber": "4532123456789012",
  "cardholderName": "Juan Perez",
  "expiryDate": "2027-12",
  "cvv": "123",
  "cardType": "visa",
  "isDefault": false
}
```
**Resultado esperado**: Error - "El formato debe ser MM/YY"

### ❌ TouristActivity - Dificultad inválida
```
POST http://localhost:3333/api/v1/tourist-activities
Content-Type: application/json

{
  "municipalityId": 1,
  "name": "Parapente",
  "activityType": "Aventura",
  "duration": 60,
  "difficulty": "imposible",
  "price": 150000,
  "isActive": true
}
```
**Resultado esperado**: Error - "difficulty debe ser fácil, moderada, difícil o extrema"

### ❌ Plan - Precio fuera de rango
```
POST http://localhost:3333/api/v1/plans
Content-Type: application/json

{
  "name": "Plan Luxury",
  "description": "Plan de lujo extremo",
  "price": -100000,
  "duration": 5,
  "isActive": true
}
```
**Resultado esperado**: Error - "El precio debe ser un número positivo"

### ❌ Vehicle - Tipo inválido
```
POST http://localhost:3333/api/v1/vehicles
Content-Type: application/json

{
  "vehicleType": "helicopter",
  "licensePlate": "ABC123",
  "brand": "Bell",
  "model": "206",
  "year": 2023,
  "capacity": 5,
  "isAvailable": true
}
```
**Resultado esperado**: Error - "vehicleType debe ser bus, minibus, van, car o suv"

---

## 📊 PRUEBAS DE PAGINACIÓN

### Con parámetros personalizados
```
GET http://localhost:3333/api/v1/clients?page=1&perPage=5
GET http://localhost:3333/api/v1/trips?page=2&perPage=10
GET http://localhost:3333/api/v1/rooms?page=1&perPage=20
```

---

## 🔍 TIPS PARA POSTMAN

### 1. Crear Colección
- Crea una colección llamada "Travel Agency API"
- Organiza los endpoints por carpetas (Clients, Trips, Plans, etc.)

### 2. Variables de Entorno
Crea un Environment con:
- `base_url`: `http://localhost:3333/api/v1`
- `client_id`: `1` (actualiza después de crear un cliente)
- `trip_id`: `1` (actualiza después de crear un viaje)
- `hotel_id`: `1`
- `room_id`: `1`

### 3. Orden de Pruebas Recomendado

1. **Crear datos base:**
   - ✅ Crear Cliente
   - ✅ Crear Viaje
   - ✅ Crear Plan
   - ✅ Verificar que existe Hotel (ya viene en BD)
   - ✅ Crear Habitación
   - ✅ Crear Actividad Turística
   - ✅ Crear Vehículo
   - ✅ Crear Ruta

2. **Probar relaciones:**
   - ✅ Asociar Cliente a Viaje
   - ✅ Obtener viajes de un cliente
   - ✅ Obtener habitaciones de un hotel
   - ✅ Crear Itinerario de Transporte

3. **Probar validaciones:**
   - ❌ Intentar crear con datos inválidos
   - ❌ Verificar mensajes de error en español

4. **Probar paginación:**
   - ✅ Listar con diferentes valores de page y perPage

5. **Probar actualizaciones:**
   - ✅ Actualizar entidades existentes

6. **Probar eliminaciones:**
   - ✅ Eliminar entidades (cuidado con las relaciones)

---

## ⚡ ATAJOS DE POSTMAN

- `Ctrl + Enter` = Enviar request
- `Ctrl + S` = Guardar request
- `Ctrl + K` = Buscar en colección
- `Ctrl + E` = Cambiar environment

---

## 📝 NOTAS IMPORTANTES

1. **Orden de creación**: Siempre crear las entidades padre antes de las hijas
   - Ejemplo: Crear Hotel antes de Habitación
   - Ejemplo: Crear Trip antes de Installment

2. **IDs**: Los IDs son auto-incrementales, ajusta según lo que hayas creado

3. **Validaciones**: Todos los endpoints POST/PUT tienen validación de datos

4. **Relaciones**: Los GET individuales traen las relaciones precargadas con `preload()`

5. **Paginación**: Todos los endpoints de listado soportan `?page=X&perPage=Y`

6. **Estados**: Los estados deben usar exactamente los valores del enum (pendiente, pagada, confirmado, etc.)

---

¡Listo para probar! 🚀
