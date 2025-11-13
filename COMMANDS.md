# 🛠️ GUÍA DE COMANDOS - Sistema de Gestión de Viajes

## 📦 INSTALACIÓN Y CONFIGURACIÓN

### Instalación inicial
```powershell
# Instalar dependencias
npm install

# O con yarn
yarn install
```

### Configurar base de datos
```powershell
# Crear archivo .env (copiar de .env.example si existe)
Copy-Item .env.example .env

# Editar .env con tus credenciales
notepad .env
```

### Generar APP_KEY
```powershell
node ace generate:key
```

---

## 🗄️ BASE DE DATOS

### Crear base de datos en MySQL
```sql
CREATE DATABASE travel_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Migraciones

#### Ejecutar todas las migraciones
```powershell
node ace migration:run
```

#### Ver estado de las migraciones
```powershell
node ace migration:status
```

#### Revertir última migración
```powershell
node ace migration:rollback
```

#### Revertir todas las migraciones
```powershell
node ace migration:rollback --batch=0
```

#### Refrescar base de datos (rollback + run)
```powershell
node ace migration:refresh
```

#### Refrescar y ejecutar seeders
```powershell
node ace migration:refresh --seed
```

### Seeders

#### Ejecutar todos los seeders
```powershell
node ace db:seed
```

#### Ejecutar un seeder específico
```powershell
node ace db:seed --files "database/seeders/MainSeeder.ts"
```

---

## 🏃 EJECUTAR EL PROYECTO

### Modo desarrollo (con hot reload)
```powershell
npm run dev
```

### Modo producción
```powershell
# Compilar
npm run build

# Ejecutar
npm start
```

### Ver en el navegador
```
http://localhost:3333
```

---

## 🔧 GENERADORES DE CÓDIGO

### Crear un nuevo modelo
```powershell
node ace make:model NombreModelo
```

### Crear modelo con migración
```powershell
node ace make:model NombreModelo -m
```

### Crear modelo con migración y controlador
```powershell
node ace make:model NombreModelo -mc
```

### Crear migración
```powershell
node ace make:migration nombre_tabla
```

### Crear controlador
```powershell
node ace make:controller NombreController
```

### Crear validador
```powershell
node ace make:validator NombreValidator
```

### Crear seeder
```powershell
node ace make:seeder NombreSeeder
```

### Crear middleware
```powershell
node ace make:middleware NombreMiddleware
```

### Crear exception
```powershell
node ace make:exception NombreException
```

---

## 📝 COMANDOS DE DESARROLLO

### Ver todas las rutas registradas
```powershell
node ace list:routes
```

### Ver rutas en formato JSON
```powershell
node ace list:routes --json
```

### Limpiar cache
```powershell
node ace cache:clear
```

### Ver todos los comandos disponibles
```powershell
node ace list
```

### REPL (consola interactiva)
```powershell
node ace repl
```

#### Ejemplos en REPL:
```javascript
// Cargar modelo
await loadModels()

// Obtener todos los clientes
const clients = await models.Client.all()

// Crear un cliente
const client = await models.Client.create({
  userId: 1,
  firstName: 'Test',
  lastName: 'User',
  // ...
})
```

---

## 🧪 TESTING

### Ejecutar tests
```powershell
npm test
```

### Ejecutar tests con coverage
```powershell
npm run test:coverage
```

---

## 🔍 CONSULTAS ÚTILES EN LA BASE DE DATOS

### Conectar a MySQL
```powershell
mysql -u root -p
```

### Ver todas las tablas
```sql
USE travel_agency;
SHOW TABLES;
```

### Ver estructura de una tabla
```sql
DESCRIBE users;
DESCRIBE clients;
DESCRIBE trips;
```

### Ver datos de ejemplo
```sql
SELECT * FROM users LIMIT 5;
SELECT * FROM clients LIMIT 5;
SELECT * FROM trips LIMIT 5;
```

### Consultas con JOINs
```sql
-- Ver clientes con sus usuarios
SELECT 
  u.username, u.email,
  c.first_name, c.last_name, c.phone
FROM users u
INNER JOIN clients c ON u.id = c.user_id;

-- Ver viajes con información del cliente
SELECT 
  t.trip_code, t.destination, t.start_date, t.total_price,
  c.first_name, c.last_name, c.phone
FROM trips t
INNER JOIN clients c ON t.client_id = c.id;

-- Ver actividades con guía y municipio
SELECT 
  ta.name AS actividad,
  CONCAT(g.first_name, ' ', g.last_name) AS guia,
  m.name AS municipio
FROM tourist_activities ta
INNER JOIN guides g ON ta.guide_id = g.id
INNER JOIN municipalities m ON ta.municipality_id = m.id;
```

---

## 📊 EJEMPLOS DE USO EN EL CÓDIGO

### Crear un nuevo cliente
```typescript
import User from 'App/Models/User'
import Client from 'App/Models/Client'
import { DateTime } from 'luxon'

// Crear usuario
const user = await User.create({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'hashed-password',
  userType: 'client',
  isActive: true
})

// Crear cliente
const client = await Client.create({
  userId: user.id,
  firstName: 'John',
  lastName: 'Doe',
  documentType: 'CC',
  documentNumber: '123456789',
  phone: '+57 300 1234567',
  address: 'Calle 123',
  city: 'Bogotá',
  country: 'Colombia',
  birthDate: DateTime.fromISO('1990-01-01')
})
```

### Crear un viaje con planes
```typescript
import Trip from 'App/Models/Trip'
import { DateTime } from 'luxon'

// Crear viaje
const trip = await Trip.create({
  clientId: 1,
  tripCode: 'TRIP-2025-001',
  destination: 'Cartagena',
  startDate: DateTime.fromISO('2025-12-20'),
  endDate: DateTime.fromISO('2025-12-27'),
  totalPrice: 2500000,
  numberOfPassengers: 2,
  status: 'pending',
  paymentStatus: 'pending'
})

// Asociar planes
await trip.related('plans').attach([1, 2])
```

### Consultar con relaciones
```typescript
// Obtener viaje con todas sus relaciones
const trip = await Trip.query()
  .where('id', 1)
  .preload('client', (clientQuery) => {
    clientQuery.preload('user')
    clientQuery.preload('bankCards')
  })
  .preload('plans', (planQuery) => {
    planQuery.preload('touristActivities', (activityQuery) => {
      activityQuery.preload('guide')
      activityQuery.preload('municipality')
    })
  })
  .preload('invoices')
  .preload('installments')
  .firstOrFail()
```

### Actualizar estado de viaje
```typescript
const trip = await Trip.findOrFail(1)
trip.status = 'confirmed'
trip.paymentStatus = 'partial'
await trip.save()
```

### Crear factura con cuotas
```typescript
import Invoice from 'App/Models/Invoice'
import Installment from 'App/Models/Installment'

// Crear factura
const invoice = await Invoice.create({
  tripId: 1,
  bankCardId: 1,
  invoiceNumber: 'INV-2025-001',
  issueDate: DateTime.now(),
  dueDate: DateTime.now().plus({ days: 30 }),
  subtotal: 2500000,
  tax: 475000,
  discount: 0,
  totalAmount: 2975000,
  paidAmount: 0,
  balance: 2975000,
  status: 'pending'
})

// Crear cuotas (3 cuotas)
const installmentAmount = 991667 // 2975000 / 3
for (let i = 1; i <= 3; i++) {
  await Installment.create({
    tripId: 1,
    invoiceId: invoice.id,
    installmentNumber: i,
    amount: installmentAmount,
    dueDate: DateTime.now().plus({ months: i }),
    status: 'pending'
  })
}
```

---

## 🔐 SEGURIDAD

### Hashear contraseñas
```typescript
import Hash from '@ioc:Adonis/Core/Hash'

const hashedPassword = await Hash.make('password123')

// Verificar contraseña
const isValid = await Hash.verify(hashedPassword, 'password123')
```

---

## 🐛 DEBUGGING

### Habilitar SQL queries en consola
```typescript
// En config/database.ts
mysql: {
  client: 'mysql2',
  connection: { /* ... */ },
  debug: true, // 👈 Activar aquí
}
```

### Ver consultas SQL
```typescript
import Database from '@ioc:Adonis/Lucid/Database'

Database.on('query', (query) => {
  console.log(query)
})
```

---

## 📦 GESTIÓN DE DEPENDENCIAS

### Instalar nueva dependencia
```powershell
npm install nombre-paquete
```

### Instalar dependencia de desarrollo
```powershell
npm install --save-dev nombre-paquete
```

### Actualizar dependencias
```powershell
npm update
```

### Ver dependencias desactualizadas
```powershell
npm outdated
```

---

## 🚀 DEPLOYMENT

### Build para producción
```powershell
npm run build
```

### Configurar variables de entorno en producción
```env
NODE_ENV=production
APP_KEY=your-production-key
DB_CONNECTION=mysql
MYSQL_HOST=your-production-host
MYSQL_PORT=3306
MYSQL_USER=your-user
MYSQL_PASSWORD=your-password
MYSQL_DB_NAME=travel_agency
```

### Ejecutar migraciones en producción
```powershell
node ace migration:run --force
```

---

## 📝 LOGS

### Ver logs en desarrollo
Los logs aparecen directamente en la consola

### Ver logs en producción
```powershell
# Si usas PM2
pm2 logs

# Ver logs del sistema
Get-Content -Path "logs/application.log" -Wait
```

---

## 🔄 GIT WORKFLOW

### Inicializar repositorio
```powershell
git init
git add .
git commit -m "Initial commit"
```

### Crear branch para nueva feature
```powershell
git checkout -b feature/nombre-feature
```

### Commit de cambios
```powershell
git add .
git commit -m "Descripción del cambio"
```

### Push a repositorio
```powershell
git push origin main
```

---

## ⚡ ATAJOS ÚTILES

### Reiniciar base de datos completa
```powershell
node ace migration:refresh --seed
```

### Ver estructura completa del proyecto
```powershell
tree /F
```

### Buscar en archivos
```powershell
Get-ChildItem -Recurse -Filter "*.ts" | Select-String "texto-a-buscar"
```

---

## 📞 SOLUCIÓN DE PROBLEMAS

### Error: "Migration table not found"
```powershell
# Crear manualmente la tabla de migraciones
node ace migration:run
```

### Error: "Port already in use"
```powershell
# Cambiar puerto en .env
PORT=3334
```

### Error: "Cannot connect to database"
```powershell
# Verificar credenciales en .env
# Verificar que MySQL esté corriendo
net start MySQL80
```

### Limpiar y reinstalar
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

**💡 TIP:** Guarda este archivo como referencia rápida para comandos comunes del proyecto
