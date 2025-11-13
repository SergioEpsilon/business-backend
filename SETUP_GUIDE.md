# 🚀 Guía de Ejecución - Travel Agency Management System

## 📋 Prerrequisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- ✅ **Node.js** v14 o superior
- ✅ **MySQL** v5.7 o superior
- ✅ **npm** o **yarn**

---

## 🔧 Instalación

### 1. Instalar Dependencias

```powershell
npm install
```

O con yarn:

```powershell
yarn install
```

---

## 🗄️ Configuración de Base de Datos

### 1. Crear la Base de Datos

Conéctate a MySQL y ejecuta:

```sql
CREATE DATABASE travel_agency_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar Variables de Entorno

Edita el archivo `.env` en la raíz del proyecto:

```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=tu_app_key_aqui_generada_con_node_ace_generate_key

# Database
DB_CONNECTION=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=tu_usuario
MYSQL_PASSWORD=tu_password
MYSQL_DB_NAME=travel_agency_db
```

### 3. Generar APP_KEY (si no existe)

```powershell
node ace generate:key
```

Copia el key generado y pégalo en `.env` en la variable `APP_KEY`.

---

## 📦 Migraciones y Seeders

### 1. Ejecutar Migraciones

Esto creará todas las tablas en la base de datos:

```powershell
node ace migration:run
```

**Salida esperada:**
```
❯ Migrated database/migrations/1763054937318_users in 156 ms
❯ Migrated database/migrations/1699851600000_clients in 89 ms
❯ Migrated database/migrations/1763054952842_guides in 76 ms
...
✔ Completed in 1.2s
```

### 2. Ejecutar Seeders (Datos de Prueba)

```powershell
node ace db:seed
```

**Esto creará:**
- 2 clientes (Juan Pérez, María García)
- 2 guías (Carlos Rodríguez, Ana Martínez)
- 1 administrador (Admin Master)
- 3 municipios (Cartagena, Santa Marta, San Andrés)
- 4 actividades turísticas
- 3 planes turísticos
- 2 viajes de ejemplo

---

## ▶️ Ejecutar el Servidor

### Modo Desarrollo (con watch)

```powershell
node ace serve --watch
```

**Salida esperada:**
```
[ info ]  building... (1212 ms)
[ info ]  starting http server...
[ info ]  watching filesystem for changes
[ info ]  AdonisJS v5 server started on http://127.0.0.1:3333
```

### Modo Producción

```powershell
npm run build
node build/server.js
```

---

## 🧪 Probar la API

### 1. Verificar que el servidor está funcionando

Abre tu navegador o usa curl/Postman:

```powershell
curl http://localhost:3333/
```

**Respuesta esperada:**
```json
{
  "message": "Travel Agency Management API",
  "version": "1.0.0",
  "endpoints": "/api/v1"
}
```

### 2. Listar Clientes

```powershell
curl http://localhost:3333/api/v1/clients
```

### 3. Obtener un Cliente Específico

```powershell
curl http://localhost:3333/api/v1/clients/1
```

### 4. Crear un Nuevo Cliente

```powershell
curl -X POST http://localhost:3333/api/v1/clients `
  -H "Content-Type: application/json" `
  -d '{
    "username": "pedro.gomez",
    "email": "pedro@example.com",
    "password": "password123",
    "firstName": "Pedro",
    "lastName": "Gómez",
    "documentType": "CC",
    "documentNumber": "9876543210",
    "phone": "+573009876543",
    "birthDate": "1985-05-20",
    "address": "Carrera 45 #67-89",
    "city": "Medellín"
  }'
```

---

## 📚 Endpoints Disponibles

### Usuarios
- `GET /api/v1/users` - Listar usuarios
- `GET /api/v1/users/stats` - Estadísticas
- `GET /api/v1/users/:id` - Ver usuario
- `GET /api/v1/users/:id/profile` - Perfil completo
- `PUT /api/v1/users/:id` - Actualizar usuario
- `PATCH /api/v1/users/:id/toggle-status` - Activar/desactivar
- `PATCH /api/v1/users/:id/change-password` - Cambiar contraseña

### Clientes
- `GET /api/v1/clients` - Listar clientes
- `POST /api/v1/clients` - Crear cliente
- `GET /api/v1/clients/:id` - Ver cliente
- `PUT /api/v1/clients/:id` - Actualizar cliente
- `DELETE /api/v1/clients/:id` - Eliminar cliente
- `GET /api/v1/clients/:id/trips` - Viajes del cliente
- `GET /api/v1/clients/:id/bank-cards` - Tarjetas del cliente

### Guías
- `GET /api/v1/guides` - Listar guías
- `GET /api/v1/guides/available` - Guías disponibles
- `POST /api/v1/guides` - Crear guía
- `GET /api/v1/guides/:id` - Ver guía
- `PUT /api/v1/guides/:id` - Actualizar guía
- `DELETE /api/v1/guides/:id` - Eliminar guía
- `GET /api/v1/guides/:id/activities` - Actividades del guía
- `PATCH /api/v1/guides/:id/toggle-availability` - Cambiar disponibilidad

### Administradores
- `GET /api/v1/administrators` - Listar administradores
- `POST /api/v1/administrators` - Crear administrador
- `GET /api/v1/administrators/:id` - Ver administrador
- `PUT /api/v1/administrators/:id` - Actualizar administrador
- `DELETE /api/v1/administrators/:id` - Eliminar administrador
- `PATCH /api/v1/administrators/:id/permissions` - Actualizar permisos

### Municipios
- `GET /api/v1/municipalities` - Listar municipios
- `GET /api/v1/municipalities/search?query=cart` - Buscar municipios
- `POST /api/v1/municipalities` - Crear municipio
- `GET /api/v1/municipalities/:id` - Ver municipio
- `PUT /api/v1/municipalities/:id` - Actualizar municipio
- `DELETE /api/v1/municipalities/:id` - Eliminar municipio
- `GET /api/v1/municipalities/:id/activities` - Actividades del municipio

### Actividades Turísticas
- `GET /api/v1/tourist-activities` - Listar actividades
- `GET /api/v1/tourist-activities/by-type?type=cultural` - Por tipo
- `POST /api/v1/tourist-activities` - Crear actividad
- `GET /api/v1/tourist-activities/:id` - Ver actividad
- `PUT /api/v1/tourist-activities/:id` - Actualizar actividad
- `DELETE /api/v1/tourist-activities/:id` - Eliminar actividad
- `PATCH /api/v1/tourist-activities/:id/toggle-active` - Activar/desactivar
- `GET /api/v1/tourist-activities/:id/plans` - Planes que incluyen la actividad

### Planes
- `GET /api/v1/plans` - Listar planes
- `POST /api/v1/plans` - Crear plan
- `GET /api/v1/plans/:id` - Ver plan
- `PUT /api/v1/plans/:id` - Actualizar plan
- `DELETE /api/v1/plans/:id` - Eliminar plan
- `POST /api/v1/plans/:id/attach-activities` - Asociar actividades
- `POST /api/v1/plans/:id/detach-activities` - Desasociar actividades
- `PATCH /api/v1/plans/:id/toggle-active` - Activar/desactivar
- `GET /api/v1/plans/:id/activities` - Actividades del plan

### Viajes
- `GET /api/v1/trips` - Listar viajes
- `POST /api/v1/trips` - Crear viaje
- `GET /api/v1/trips/:id` - Ver viaje
- `PUT /api/v1/trips/:id` - Actualizar viaje
- `DELETE /api/v1/trips/:id` - Eliminar viaje
- `POST /api/v1/trips/:id/attach-plans` - Asociar planes
- `POST /api/v1/trips/:id/detach-plans` - Desasociar planes
- `PATCH /api/v1/trips/:id/update-status` - Actualizar estado
- `GET /api/v1/trips/:id/plans` - Planes del viaje
- `GET /api/v1/trips/:id/invoices` - Facturas del viaje

### Facturas
- `GET /api/v1/invoices` - Listar facturas
- `POST /api/v1/invoices` - Crear factura
- `GET /api/v1/invoices/:id` - Ver factura
- `PUT /api/v1/invoices/:id` - Actualizar factura
- `DELETE /api/v1/invoices/:id` - Eliminar factura
- `POST /api/v1/invoices/:id/register-payment` - Registrar pago
- `PATCH /api/v1/invoices/:id/mark-overdue` - Marcar como vencida
- `GET /api/v1/invoices/:id/installments` - Cuotas de la factura

### Cuotas
- `GET /api/v1/installments` - Listar cuotas
- `GET /api/v1/installments/overdue` - Cuotas vencidas
- `PATCH /api/v1/installments/mark-overdue` - Marcar vencidas
- `POST /api/v1/installments` - Crear cuota
- `GET /api/v1/installments/:id` - Ver cuota
- `PUT /api/v1/installments/:id` - Actualizar cuota
- `DELETE /api/v1/installments/:id` - Eliminar cuota
- `POST /api/v1/installments/:id/pay` - Pagar cuota

### Tarjetas Bancarias
- `GET /api/v1/clients/:clientId/bank-cards` - Listar tarjetas
- `POST /api/v1/clients/:clientId/bank-cards` - Crear tarjeta
- `GET /api/v1/bank-cards/:id` - Ver tarjeta
- `PUT /api/v1/bank-cards/:id` - Actualizar tarjeta
- `DELETE /api/v1/bank-cards/:id` - Desactivar tarjeta
- `PATCH /api/v1/bank-cards/:id/set-default` - Marcar como predeterminada

---

## 🛠️ Comandos Útiles de Ace

### Migraciones

```powershell
# Ver estado de migraciones
node ace migration:status

# Revertir última migración
node ace migration:rollback

# Revertir todas las migraciones
node ace migration:rollback --batch=0

# Refrescar base de datos (rollback + run)
node ace migration:refresh

# Refrescar y ejecutar seeders
node ace migration:refresh --seed
```

### Seeders

```powershell
# Ejecutar todos los seeders
node ace db:seed

# Ejecutar seeder específico
node ace db:seed --files="./database/seeders/MainSeeder.ts"
```

### Generadores

```powershell
# Crear un nuevo controlador
node ace make:controller NombreController

# Crear un nuevo modelo
node ace make:model NombreModelo

# Crear una nueva migración
node ace make:migration nombre_tabla

# Crear un nuevo middleware
node ace make:middleware NombreMiddleware

# Crear un nuevo validador
node ace make:validator NombreValidator
```

### Base de Datos

```powershell
# Abrir REPL de base de datos
node ace repl

# En el REPL, puedes ejecutar:
# > await User.all()
# > await Client.query().preload('user').first()
```

---

## 🐛 Solución de Problemas

### Error: "Port 3333 is already in use"

**Solución:** Cambia el puerto en `.env` o mata el proceso:

```powershell
# Encontrar el proceso
netstat -ano | findstr :3333

# Matar el proceso (reemplaza <PID> con el número que aparece)
taskkill /PID <PID> /F
```

### Error: "connect ECONNREFUSED 127.0.0.1:3306"

**Solución:** Verifica que MySQL esté corriendo:

```powershell
# Iniciar servicio MySQL
net start MySQL80
```

### Error: "ER_ACCESS_DENIED_ERROR"

**Solución:** Verifica las credenciales en `.env`:

```env
MYSQL_USER=tu_usuario_correcto
MYSQL_PASSWORD=tu_password_correcto
```

### Error: "ER_NOT_SUPPORTED_AUTH_MODE"

**Solución:** Configura MySQL para usar el plugin de autenticación correcto:

```sql
ALTER USER 'tu_usuario'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_password';
FLUSH PRIVILEGES;
```

---

## 📊 Verificar Datos de Prueba

Después de ejecutar los seeders, puedes verificar los datos:

```sql
-- Conectarse a MySQL
mysql -u root -p

-- Usar la base de datos
USE travel_agency_db;

-- Ver usuarios creados
SELECT id, username, email, user_type FROM users;

-- Ver clientes
SELECT c.id, c.first_name, c.last_name, u.email 
FROM clients c 
JOIN users u ON c.user_id = u.id;

-- Ver viajes
SELECT t.id, t.trip_code, t.destination, c.first_name, c.last_name, t.status
FROM trips t
JOIN clients c ON t.client_id = c.id;

-- Ver planes
SELECT id, plan_code, name, category, base_price, is_active FROM plans;
```

---

## 🚢 Despliegue a Producción

### 1. Compilar el Proyecto

```powershell
npm run build
```

### 2. Configurar Variables de Entorno de Producción

Crea un archivo `.env.production`:

```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=production
APP_KEY=tu_production_app_key

DB_CONNECTION=mysql
MYSQL_HOST=tu_servidor_mysql
MYSQL_PORT=3306
MYSQL_USER=usuario_produccion
MYSQL_PASSWORD=password_seguro
MYSQL_DB_NAME=travel_agency_prod
```

### 3. Ejecutar Migraciones en Producción

```powershell
node ace migration:run --force
```

### 4. Iniciar el Servidor

```powershell
node build/server.js
```

O con PM2:

```powershell
npm install -g pm2
pm2 start build/server.js --name "travel-agency-api"
pm2 save
pm2 startup
```

---

## 📝 Notas Importantes

1. **Seguridad:**
   - Cambia el `APP_KEY` en producción
   - Usa contraseñas fuertes para MySQL
   - Implementa autenticación JWT
   - Añade rate limiting

2. **Performance:**
   - Activa cache de consultas
   - Usa índices en columnas frecuentemente consultadas
   - Considera usar Redis para sesiones

3. **Mantenimiento:**
   - Haz backups regulares de la base de datos
   - Monitorea logs con PM2
   - Usa herramientas como Sentry para tracking de errores

---

## 🎯 Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Crear validadores para todos los endpoints
- [ ] Agregar tests unitarios e integración
- [ ] Documentar API con Swagger
- [ ] Implementar rate limiting
- [ ] Configurar CORS apropiadamente
- [ ] Agregar logging avanzado

---

**¿Problemas o dudas?** Revisa la documentación completa en:
- `DOCUMENTATION.md` - Documentación técnica
- `README.md` - Guía general del proyecto
- `CONTROLLERS_SUMMARY.md` - Referencia de controladores

**¡Buena suerte con tu proyecto!** 🚀
