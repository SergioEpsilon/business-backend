# 🚀 Instrucciones: Ejecutar Script de Permisos

## 📦 Requisitos Previos

1. ✅ MongoDB instalado y corriendo
2. ✅ MS-SECURITY corriendo en puerto 8080
3. ✅ Base de datos `ms-security` creada

## 🎯 Método 1: Ejecutar desde MongoDB Shell (RECOMENDADO)

### Paso 1: Abrir PowerShell/Terminal

```powershell
cd d:\Portillo\Backend\proyecto\ms-bussiness-backend\Documentaciones
```

### Paso 2: Ejecutar el script

```powershell
mongosh "mongodb://localhost:27017/ms-security" --file crear-todos-permisos.js
```

### Salida Esperada:

```
🧹 Limpiando permisos incorrectos...
✅ Permisos incorrectos eliminados

📝 Creando permisos del sistema...

👥 Creando permisos de CLIENTS...
🧭 Creando permisos de GUIDES...
👔 Creando permisos de ADMINISTRATORS...
🚗 Creando permisos de DRIVERS...
🚙 Creando permisos de VEHICLES...
🚗 Creando permisos de CARS...
✈️ Creando permisos de AIRCRAFTS...
⏰ Creando permisos de SHIFTS...
🏙️ Creando permisos de MUNICIPALITIES...
🎯 Creando permisos de TOURIST ACTIVITIES...
📋 Creando permisos de PLANS...
✈️ Creando permisos de TRIPS...
🗺️ Creando permisos de ROUTES...
🧾 Creando permisos de INVOICES...
💰 Creando permisos de INSTALLMENTS...
💳 Creando permisos de BANK CARDS...
🏨 Creando permisos de HOTELS...
🛏️ Creando permisos de ROOMS...
🚌 Creando permisos de ITINERARY TRANSPORTS...

📊 Verificación de permisos creados:
=====================================
✅ Total de permisos en la base de datos: 147

📈 Permisos por módulo:
Clients: 8
Guides: 8
Administrators: 6
Drivers: 8
Vehicles: 8
Cars: 5
Aircrafts: 5
Shifts: 7
Municipalities: 7
Tourist Activities: 11
Plans: 9
Trips: 11
Routes: 9
Invoices: 8
Installments: 8
Bank Cards: 6
Hotels: 6
Rooms: 6
Itinerary Transports: 5

🎉 ¡Script completado exitosamente!
=====================================

💡 Siguiente paso:
1. Crear roles en MS-SECURITY
2. Asignar permisos a roles
3. Asignar roles a usuarios
4. Probar en Postman
```

## 🎯 Método 2: Ejecutar desde MongoDB Compass

### Paso 1: Abrir MongoDB Compass

1. Conectarse a `mongodb://localhost:27017`
2. Seleccionar base de datos `ms-security`

### Paso 2: Abrir Shell (\_MONGOSH)

1. En la parte inferior de Compass, clic en `_MONGOSH` tab
2. Pegar el contenido del archivo `crear-todos-permisos.js`
3. Presionar Enter

## 🎯 Método 3: Copiar y Pegar Manualmente

### Paso 1: Abrir MongoDB Shell

```powershell
mongosh "mongodb://localhost:27017/ms-security"
```

### Paso 2: Copiar todo el contenido de `crear-todos-permisos.js`

### Paso 3: Pegar en el shell y presionar Enter

## ✅ Verificación Post-Ejecución

### 1. Verificar conteo total

```javascript
db.permission.countDocuments()
// Debería devolver: 147 (o más si ya tenías algunos)
```

### 2. Ver algunos permisos

```javascript
db.permission.find().limit(5).pretty()
```

### 3. Buscar permisos de un módulo específico

```javascript
// Ver todos los permisos de clientes
db.permission.find({ url: { $regex: '^/api/v1/clients' } }).pretty()

// Ver todos los permisos de viajes
db.permission.find({ url: { $regex: '^/api/v1/trips' } }).pretty()
```

## 🔧 Troubleshooting

### Error: "connection refused"

**Problema**: MongoDB no está corriendo

**Solución**:

```powershell
# Iniciar MongoDB
net start MongoDB

# O si usas MongoDB Community
mongod
```

### Error: "authentication failed"

**Problema**: Necesitas autenticación

**Solución**:

```powershell
mongosh "mongodb://usuario:password@localhost:27017/ms-security"
```

### Error: "database ms-security does not exist"

**Problema**: La base de datos no existe

**Solución**:

```javascript
use ms-security
// La base de datos se creará automáticamente al insertar datos
```

### Los permisos no aparecen

**Verificar conexión**:

```javascript
// En mongosh
show dbs
use ms-security
show collections
```

## 📋 Siguiente Paso: Crear Roles

Una vez creados los permisos, necesitas crear roles y asignarles permisos.

### Ejemplo: Crear rol "Admin" con TODOS los permisos

```javascript
use ms-security

// 1. Crear el rol
db.role.insertOne({
  name: "Administrador",
  description: "Acceso total al sistema",
  _class: "sb.proyecto.Models.Role"
})

// 2. Obtener el ID del rol
const adminRole = db.role.findOne({ name: "Administrador" })
print("ID del rol Admin: " + adminRole._id)

// 3. Obtener todos los permisos
const allPermissions = db.permission.find().toArray()
print("Total de permisos: " + allPermissions.length)

// 4. Crear RolePermission para cada permiso
allPermissions.forEach(permission => {
  db.rolePermission.insertOne({
    role: DBRef("role", adminRole._id),
    permission: DBRef("permission", permission._id),
    _class: "sb.proyecto.Models.RolePermission"
  })
})

print("✅ Rol Admin creado con " + allPermissions.length + " permisos")
```

## 🧪 Probar en Postman

1. **Login**:

   ```
   POST http://127.0.0.1:8080/api/public/security/login
   Body: { "email": "tu@email.com", "password": "password" }
   ```

2. **Copiar token** de la respuesta

3. **Probar endpoint protegido**:

   ```
   GET http://127.0.0.1:3333/api/v1/clients
   Authorization: Bearer <tu-token>
   ```

4. **Verificar logs** en ambos microservicios

## 📚 Documentación Relacionada

- `GUIA_TESTING_PERMISOS_POSTMAN.md` - Guía completa de testing
- `PERMISOS_BASE_SISTEMA.md` - Referencia de todos los permisos
- `CORRECCION_PERMISOS_EXISTENTES.md` - Análisis de permisos anteriores

---

**¿Listo para ejecutar?** 🚀

Simplemente copia y pega este comando:

```powershell
cd d:\Portillo\Backend\proyecto\ms-bussiness-backend\Documentaciones
mongosh "mongodb://localhost:27017/ms-security" --file crear-todos-permisos.js
```
