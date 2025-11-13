# 🌍 Sistema de Gestión de Agencia de Viajes

> Sistema backend completo para la gestión de una agencia de viajes con asociación aérea, desarrollado con AdonisJS v5 y MySQL.

[![AdonisJS](https://img.shields.io/badge/AdonisJS-v5-5a45ff?style=flat&logo=adonisjs)](https://adonisjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479a1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación Rápida](#-instalación-rápida)
- [Documentación](#-documentación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Modelos de Datos](#-modelos-de-datos)
- [Uso](#-uso)
- [Pruebas](#-pruebas)

---

## ✨ Características

### 🎯 Funcionalidades Principales
- ✅ **Gestión de Usuarios** - Sistema multi-rol (clientes, guías, administradores)
- ✅ **Gestión de Viajes** - Creación, seguimiento y facturación de viajes
- ✅ **Planes Turísticos** - Paquetes personalizables con actividades
- ✅ **Sistema de Pagos** - Facturas, cuotas y pagos incrementales
- ✅ **Actividades Turísticas** - Catálogo de actividades por municipio
- ✅ **Tarjetas Bancarias** - Gestión segura de métodos de pago

### 🔧 Características Técnicas
- 🏗️ **Arquitectura MVC** - Código organizado y mantenible
- 🔗 **Relaciones ORM** - 1:1, 1:n, n:m con Lucid ORM
- 🔒 **Transacciones Atómicas** - Integridad de datos garantizada
- 📄 **Paginación** - En todos los endpoints de listado
- 🔍 **Filtrado Dinámico** - Query parameters flexibles
- 📊 **API RESTful** - 75+ endpoints bien documentados

### 📈 Estadísticas del Proyecto
- **11 Modelos** con relaciones completas
- **13 Migraciones** con constraints e índices
- **11 Controladores** con operaciones CRUD
- **75+ Endpoints** API RESTful
- **3,600+ líneas** de documentación

---

## 📋 Requisitos

- **Node.js** >= 14.x
- **MySQL** >= 5.7
- **npm** o **yarn**
- **Git** (opcional, para clonar el repositorio)

---

## 🚀 Instalación Rápida

### 1️⃣ Clonar el repositorio

```bash
git clone <repository-url>
cd ms-bussiness-backend
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=tu_app_key_aqui

# Database Configuration
DB_CONNECTION=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tu_password
MYSQL_DB_NAME=travel_agency_db
```

### 4️⃣ Generar APP_KEY

```bash
node ace generate:key
```

Copia el key generado y pégalo en `.env`.

### 5️⃣ Crear base de datos

```sql
CREATE DATABASE travel_agency_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6️⃣ Ejecutar migraciones

```bash
node ace migration:run
```

### 7️⃣ Cargar datos de prueba (opcional)

```bash
node ace db:seed
```

### 8️⃣ Iniciar el servidor

```bash
node ace serve --watch
```

🎉 **¡Listo!** El servidor está corriendo en `http://localhost:3333`

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | 👈 **¡Empieza aquí!** Guía completa de instalación y configuración |
| **[CONTROLLERS_SUMMARY.md](./CONTROLLERS_SUMMARY.md)** | Referencia completa de todos los controladores y endpoints |
| **[API_EXAMPLES.md](./API_EXAMPLES.md)** | Ejemplos prácticos de uso de la API |
| **[DOCUMENTATION.md](./DOCUMENTATION.md)** | Documentación técnica completa del sistema |
| **[DATABASE_DIAGRAM.md](./DATABASE_DIAGRAM.md)** | Diagramas de la base de datos |
| **[RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md)** | Resumen ejecutivo del proyecto |

### 📦 Colección de Postman

Importa la colección de Postman para probar la API fácilmente:
- **Archivo:** `Travel_Agency_API.postman_collection.json`
- **Contiene:** 75+ requests organizados por módulos

---

## 🏗️ Estructura del Proyecto

```
ms-bussiness-backend/
├── app/
│   ├── Controllers/Http/
│   │   ├── UsersController.ts
│   │   ├── ClientsController.ts
│   │   ├── GuidesController.ts
│   │   ├── AdministratorsController.ts
│   │   ├── TripsController.ts
│   │   ├── PlansController.ts
│   │   ├── TouristActivitiesController.ts
│   │   ├── MunicipalitiesController.ts
│   │   ├── InvoicesController.ts
│   │   ├── InstallmentsController.ts
│   │   └── BankCardsController.ts
│   ├── Models/
│   │   ├── User.ts
│   │   ├── Client.ts
│   │   ├── Guide.ts
│   │   ├── Administrator.ts
│   │   ├── Municipality.ts
│   │   ├── TouristActivity.ts
│   │   ├── Plan.ts
│   │   ├── Trip.ts
│   │   ├── Invoice.ts
│   │   ├── Installment.ts
│   │   └── BankCard.ts
│   ├── Validators/
│   │   ├── ClientValidator.ts
│   │   └── TripValidator.ts
│   └── Exceptions/
│       ├── Handler.ts
│       ├── ClientNotFoundException.ts
│       ├── TripNotFoundException.ts
│       └── InvalidDataException.ts
├── database/
│   ├── migrations/
│   │   ├── 1763054937318_users.ts
│   │   ├── 1699851600000_clients.ts
│   │   ├── 1763054952842_guides.ts
│   │   ├── ... (13 migraciones en total)
│   │   └── 1699851800000_trip_plan.ts
│   └── seeders/
│       └── MainSeeder.ts
├── config/
│   ├── app.ts
│   ├── database.ts
│   └── bodyparser.ts
├── start/
│   ├── routes.ts
│   └── kernel.ts
├── DOCUMENTATION.md
├── SETUP_GUIDE.md
├── API_EXAMPLES.md
└── README.md
```

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:3333/api/v1`

### 👤 Usuarios
```
GET    /users                      Lista usuarios
GET    /users/stats                Estadísticas
GET    /users/:id                  Ver usuario
GET    /users/:id/profile          Perfil completo
PUT    /users/:id                  Actualizar usuario
PATCH  /users/:id/toggle-status    Activar/desactivar
PATCH  /users/:id/change-password  Cambiar contraseña
```

### 👥 Clientes
```
GET    /clients                Lista clientes
POST   /clients                Crear cliente
GET    /clients/:id            Ver cliente
PUT    /clients/:id            Actualizar cliente
DELETE /clients/:id            Eliminar cliente
GET    /clients/:id/trips      Viajes del cliente
GET    /clients/:id/bank-cards Tarjetas del cliente
```

### ✈️ Viajes
```
GET    /trips                      Lista viajes
POST   /trips                      Crear viaje
GET    /trips/:id                  Ver viaje
PUT    /trips/:id                  Actualizar viaje
POST   /trips/:id/attach-plans     Asociar planes
POST   /trips/:id/detach-plans     Desasociar planes
PATCH  /trips/:id/update-status    Actualizar estado
GET    /trips/:id/plans            Planes del viaje
GET    /trips/:id/invoices         Facturas del viaje
```

### 📋 Planes
```
GET    /plans                          Lista planes
POST   /plans                          Crear plan
GET    /plans/:id                      Ver plan
PUT    /plans/:id                      Actualizar plan
POST   /plans/:id/attach-activities    Asociar actividades
POST   /plans/:id/detach-activities    Desasociar actividades
PATCH  /plans/:id/toggle-active        Activar/desactivar
GET    /plans/:id/activities           Actividades del plan
```

### 💰 Facturas
```
GET    /invoices                       Lista facturas
POST   /invoices                       Crear factura
GET    /invoices/:id                   Ver factura
PUT    /invoices/:id                   Actualizar factura
POST   /invoices/:id/register-payment  Registrar pago
GET    /invoices/:id/installments      Cuotas de la factura
PATCH  /invoices/:id/mark-overdue      Marcar vencida
```

**Ver documentación completa de endpoints en [CONTROLLERS_SUMMARY.md](./CONTROLLERS_SUMMARY.md)**

---

## 🗄️ Modelos de Datos

### Relaciones Principales

```
User (1:1) → Client/Guide/Administrator
Client (1:n) → Trip
Client (1:n) → BankCard
Guide (1:n) → TouristActivity
Municipality (1:n) → TouristActivity
Plan (n:m) → TouristActivity
Trip (n:m) → Plan
Trip (1:n) → Invoice
Trip (1:n) → Installment
Invoice (n:1) → BankCard
Invoice (1:n) → Installment
```

### Diagrama Simplificado

```
┌──────┐     1:1      ┌────────┐
│ User │─────────────►│ Client │
└──────┘              └────┬───┘
   │                       │ 1:n
   │ 1:1                   ▼
   │                  ┌──────┐     n:m     ┌──────┐
   ├─────────────────►│ Trip │◄───────────►│ Plan │
   │                  └───┬──┘             └───┬──┘
   │ 1:1                  │ 1:n                │ n:m
   │                      ▼                    ▼
   │                  ┌─────────┐     ┌──────────────────┐
   └─────────────────►│ Invoice │     │ TouristActivity  │
                      └─────────┘     └──────────────────┘
```

**Ver diagramas completos en [DATABASE_DIAGRAM.md](./DATABASE_DIAGRAM.md)**

---

## � Uso

### Ejemplo: Crear un Cliente

```bash
curl -X POST http://localhost:3333/api/v1/clients \
  -H "Content-Type: application/json" \
  -d '{
    "username": "maria.lopez",
    "email": "maria@example.com",
    "password": "password123",
    "firstName": "María",
    "lastName": "López",
    "documentType": "CC",
    "documentNumber": "1098765432",
    "phone": "+573001234567",
    "birthDate": "1992-03-15",
    "address": "Calle 100 #50-25",
    "city": "Bogotá"
  }'
```

### Ejemplo: Crear Viaje con Planes

```bash
# 1. Crear viaje
curl -X POST http://localhost:3333/api/v1/trips \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "startDate": "2024-07-15",
    "endDate": "2024-07-20",
    "destination": "Cartagena",
    "numberOfPeople": 2
  }'

# 2. Asociar planes
curl -X POST http://localhost:3333/api/v1/trips/1/attach-plans \
  -H "Content-Type: application/json" \
  -d '{
    "planIds": [1, 2],
    "customData": {
      "1": {
        "order_in_trip": 1,
        "custom_price": 2300000
      }
    }
  }'
```

**Ver más ejemplos en [API_EXAMPLES.md](./API_EXAMPLES.md)**

---

## 🧪 Pruebas

### Usando Postman
1. Importar `Travel_Agency_API.postman_collection.json`
2. Configurar variable `baseUrl` a `http://localhost:3333/api/v1`
3. Ejecutar requests

### Verificar Instalación

```bash
# Verificar servidor
curl http://localhost:3333/

# Listar clientes
curl http://localhost:3333/api/v1/clients

# Estadísticas de usuarios
curl http://localhost:3333/api/v1/users/stats
```

---

## 🛠️ Comandos Útiles

### Migraciones

```bash
# Ver estado
node ace migration:status

# Ejecutar migraciones
node ace migration:run

# Revertir última migración
node ace migration:rollback

# Refrescar base de datos
node ace migration:refresh

# Refrescar con seeders
node ace migration:refresh --seed
```

### Seeders

```bash
# Ejecutar todos los seeders
node ace db:seed

# Ejecutar seeder específico
node ace db:seed --files="./database/seeders/MainSeeder.ts"
```

### Generadores

```bash
# Crear controlador
node ace make:controller NombreController

# Crear modelo
node ace make:model NombreModelo

# Crear migración
node ace make:migration nombre_tabla

# Crear validador
node ace make:validator NombreValidator
```

### Desarrollo

```bash
# Iniciar servidor (modo watch)
node ace serve --watch

# Compilar para producción
npm run build

# Ejecutar en producción
node build/server.js
```

---

## 🔐 Seguridad

⚠️ **IMPORTANTE:** Antes de pasar a producción, implementar:

### ✅ Pendientes de Seguridad

- [ ] **Hash de Passwords** - Usar `Hash.make()` y `Hash.verify()`
- [ ] **Autenticación JWT** - Implementar tokens de acceso
- [ ] **Autorización** - Middleware basado en roles
- [ ] **Validadores** - Crear 11 validadores para todos los endpoints
- [ ] **Rate Limiting** - Prevenir abuso de API
- [ ] **HTTPS** - Usar certificados SSL en producción
- [ ] **Sanitización** - Limpiar inputs del usuario
- [ ] **CORS** - Configurar orígenes permitidos

### 🔒 Implementado

- ✅ Datos sensibles ocultos (`cardNumber`, `cvv` con `serializeAs: null`)
- ✅ Transacciones atómicas
- ✅ Validación de enums
- ✅ Soft delete para tarjetas bancarias

---

## 📊 Estado del Proyecto

**Progreso General:** ████████░░ **75%**

| Componente | Estado |
|------------|--------|
| Modelos | ✅ 100% (11/11) |
| Migraciones | ✅ 100% (13/13) |
| Controladores | ✅ 100% (11/11) |
| Rutas | ✅ 100% (1/1) |
| Seeders | ✅ 100% (1/1) |
| Documentación | ✅ 100% (7/7) |
| Validadores | ❌ 0% (0/11) |
| Autenticación | ❌ 0% |
| Tests | ❌ 0% |

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📄 Licencia

Este proyecto es privado y confidencial.

---

## 👥 Equipo

- **Desarrolladores:** Equipo de Desarrollo Backend
- **Framework:** AdonisJS v5
- **Database:** MySQL 5.7+

---

## 📞 Soporte

Para soporte técnico:
- 📧 Email: [support@example.com](mailto:support@example.com)
- 📖 Documentación: Ver archivos `.md` en la raíz del proyecto

---

## 🎉 Inicio Rápido

```bash
# 1. Instalar
npm install

# 2. Configurar .env

# 3. Migrar
node ace migration:run

# 4. Seeders (opcional)
node ace db:seed

# 5. Ejecutar
node ace serve --watch

# 6. Probar
curl http://localhost:3333/api/v1/users/stats
```

**¡El sistema está listo para desarrollo!** 🚀

---

**Documentación generada:** 2024  
**Versión:** 1.0.0  
**Framework:** AdonisJS v5 + Lucid ORM  
**Base de Datos:** MySQL 5.7+
