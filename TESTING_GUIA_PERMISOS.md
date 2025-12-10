# GUÍA DE TESTING - Validación de Permisos del Rol GUIA

## Usuario de Prueba

- **Nombre**: Derrick White
- **Email**: derrickwhite@gmail.com
- **Password**: Arcueid
- **ID**: 6937279e1aef3361925aa618
- **Rol**: GUIA

---

## PASO 1: Login como GUIA

**POST** `http://localhost:8080/api/public/security/login`

**Body:**

```json
{
  "email": "derrickwhite@gmail.com",
  "password": "Arcueid"
}
```

**Resultado esperado:**

- Status: 200 OK
- Respuesta debe incluir:
  - `token`: JWT válido
  - `roles`: ["GUIA"]
  - `permissions`: Array con 8 permisos

**Acción:** Copia el `token` para usarlo en las siguientes pruebas.

---

## PASO 2: Probar Permisos QUE SÍ TIENE ✅

### 2.1 Ver su propio perfil de guía ✅

**GET** `http://localhost:3333/api/v1/guides/6937279e1aef3361925aa618`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Resultado esperado:**

- Status: 200 OK
- Debe retornar los datos del guía

---

### 2.2 Actualizar su propio perfil ✅

**PUT** `http://localhost:3333/api/v1/guides/6937279e1aef3361925aa618`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Body:**

```json
{
  "phone": "3009876543",
  "specialization": "Turismo de Aventura",
  "years_of_experience": 6
}
```

**Resultado esperado:**

- Status: 200 OK
- Datos del guía actualizados

---

### 2.3 Cambiar su disponibilidad ✅

**PATCH** `http://localhost:3333/api/v1/guides/6937279e1aef3361925aa618/toggle-availability`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Resultado esperado:**

- Status: 200 OK
- Campo `is_available` cambiado

---

### 2.4 Ver sus actividades turísticas ✅

**GET** `http://localhost:3333/api/v1/guides/6937279e1aef3361925aa618/activities`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Resultado esperado:**

- Status: 200 OK
- Lista de actividades del guía (puede estar vacía)

---

### 2.5 Listar actividades turísticas disponibles ✅

**GET** `http://localhost:3333/api/v1/tourist-activities`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Resultado esperado:**

- Status: 200 OK
- Lista de todas las actividades turísticas

---

### 2.6 Ver detalle de una actividad turística ✅

**GET** `http://localhost:3333/api/v1/tourist-activities/:id`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Nota:** Primero ejecuta el endpoint anterior para obtener un ID válido

**Resultado esperado:**

- Status: 200 OK
- Detalle de la actividad

---

### 2.7 Listar planes turísticos ✅

**GET** `http://localhost:3333/api/v1/plans`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Resultado esperado:**

- Status: 200 OK
- Lista de planes turísticos

---

### 2.8 Ver detalle de un plan ✅

**GET** `http://localhost:3333/api/v1/plans/:id`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Resultado esperado:**

- Status: 200 OK
- Detalle del plan

---

## PASO 3: Probar Permisos QUE NO TIENE ❌

### 3.1 Intentar crear un cliente ❌

**POST** `http://localhost:3333/api/v1/clients`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Body:**

```json
{
  "id": "test123456789",
  "document": "123456789",
  "phone": "3001111111",
  "address": "Test Address"
}
```

**Resultado esperado:**

- Status: 403 Forbidden
- Mensaje: "No tienes permiso para acceder a este recurso"

---

### 3.2 Intentar crear otro guía ❌

**POST** `http://localhost:3333/api/v1/guides`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Body:**

```json
{
  "id": "test987654321",
  "document": "987654321",
  "phone": "3002222222",
  "license_number": "TEST-001",
  "specialization": "Test",
  "languages": ["Español"],
  "years_of_experience": 1
}
```

**Resultado esperado:**

- Status: 403 Forbidden
- Mensaje: "No tienes permiso para acceder a este recurso"

---

### 3.3 Intentar listar todos los guías ❌

**GET** `http://localhost:3333/api/v1/guides`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Resultado esperado:**

- Status: 403 Forbidden
- Mensaje: "No tienes permiso para acceder a este recurso"

---

### 3.4 Intentar eliminar un guía ❌

**DELETE** `http://localhost:3333/api/v1/guides/6937279e1aef3361925aa618`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Resultado esperado:**

- Status: 403 Forbidden
- Mensaje: "No tienes permiso para acceder a este recurso"

---

### 3.5 Intentar crear una actividad turística ❌

**POST** `http://localhost:3333/api/v1/tourist-activities`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Body:**

```json
{
  "name": "Test Activity",
  "description": "Test",
  "municipality_id": 1
}
```

**Resultado esperado:**

- Status: 403 Forbidden
- Mensaje: "No tienes permiso para acceder a este recurso"

---

### 3.6 Intentar crear un plan turístico ❌

**POST** `http://localhost:3333/api/v1/plans`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Body:**

```json
{
  "name": "Test Plan",
  "description": "Test"
}
```

**Resultado esperado:**

- Status: 403 Forbidden
- Mensaje: "No tienes permiso para acceder a este recurso"

---

### 3.7 Intentar gestionar viajes ❌

**GET** `http://localhost:3333/api/v1/trips`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Resultado esperado:**

- Status: 403 Forbidden
- Mensaje: "No tienes permiso para acceder a este recurso"

---

### 3.8 Intentar acceder a facturación ❌

**GET** `http://localhost:3333/api/v1/invoices`

**Headers:**

```
Authorization: Bearer [TOKEN_DEL_GUIA]
```

**Resultado esperado:**

- Status: 403 Forbidden
- Mensaje: "No tienes permiso para acceder a este recurso"

---

## RESUMEN DE VALIDACIÓN

✅ **Permisos que SÍ debe tener (8):**

1. Ver su propio perfil
2. Actualizar su perfil
3. Cambiar disponibilidad
4. Ver sus actividades
5. Listar actividades turísticas
6. Ver detalle de actividades
7. Listar planes
8. Ver detalle de planes

❌ **Permisos que NO debe tener:**

- Crear/modificar otros guías
- Listar todos los guías
- Gestionar clientes
- Crear actividades/planes
- Gestionar viajes
- Acceder a facturación
- Gestionar hoteles/vehículos/rutas

---

## NOTAS IMPORTANTES

1. **Todos los endpoints con ✅** deben retornar `200 OK` o `201 Created`
2. **Todos los endpoints con ❌** deben retornar `403 Forbidden`
3. Si algún endpoint con ✅ retorna 403, hay un problema en los permisos
4. Si algún endpoint con ❌ retorna 200, hay una vulnerabilidad de seguridad

---

## SOLUCIÓN DE PROBLEMAS

### Si un permiso que SÍ tiene retorna 403:

1. Verifica que el token sea válido (hacer login nuevamente)
2. Verifica que el rol GUIA tenga el permiso en MongoDB
3. Revisa los logs de MS-SECURITY en la consola
4. Verifica que el Security Middleware esté funcionando

### Si un permiso que NO tiene retorna 200:

1. Verifica que el Security Middleware esté habilitado en la ruta
2. Revisa el archivo `start/routes.ts`
3. Verifica que el permiso NO esté en rolePermission para el rol GUIA
