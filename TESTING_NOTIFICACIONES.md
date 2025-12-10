# 🧪 GUÍA DE PRUEBAS - MÓDULO DE NOTIFICACIONES

## 📋 Pre-requisitos

### 1. Servicios que deben estar corriendo:

```bash
✅ MS-Security (Java/Spring Boot) → Puerto 8080
✅ MS-Business (AdonisJS) → Puerto 3333
✅ MS-Notifications (Python/Flask) → Puerto 5000
```

---

## 🚀 PASO 1: Iniciar MS-Notifications

### Opción A: Si tienes el microservicio de notificaciones

```bash
cd /path/to/ms-notifications
python app.py
# Debe mostrar: * Running on http://127.0.0.1:5000
```

### Opción B: Mock rápido con PowerShell (SOLO PARA TESTING)

Crea un archivo `mock-notifications.ps1`:

```powershell
# Mock simple de MS-Notifications para testing
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:5000/")
$listener.Start()

Write-Host "🚀 Mock MS-Notifications corriendo en http://127.0.0.1:5000" -ForegroundColor Green

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $body = '{"status": "success", "message": "Email enviado (MOCK)"}'
    
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($body)
    $response.ContentLength64 = $buffer.Length
    $response.ContentType = "application/json"
    $response.StatusCode = 200
    $response.OutputStream.Write($buffer, 0, $buffer.Length)
    $response.OutputStream.Close()
    
    Write-Host "✅ Request recibido: $($request.HttpMethod) $($request.Url)" -ForegroundColor Cyan
}
```

Ejecutar:
```bash
powershell -File mock-notifications.ps1
```

---

## 🧪 PASO 2: Probar Endpoints con Postman/cURL

### A. Test de Conectividad

```bash
GET http://127.0.0.1:3333/api/v1/notifications/test
Authorization: Bearer <tu_token_jwt>
```

**Respuesta Esperada:**
```json
{
  "message": "Test completado",
  "success": true,
  "details": {
    "success": true,
    "message": "Email enviado correctamente"
  }
}
```

---

### B. Enviar Email Personalizado

```bash
POST http://127.0.0.1:3333/api/v1/notifications/send-email
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "to": "cliente@example.com",
  "subject": "Prueba de Notificación",
  "message": "<h1>Hola</h1><p>Este es un email de prueba</p>",
  "sender": "test@agenciaviajes.com"
}
```

**Respuesta Esperada:**
```json
{
  "message": "Email enviado correctamente",
  "data": {
    "status": "success"
  }
}
```

---

### C. Crear Viaje con Notificación Automática

**IMPORTANTE:** Primero necesitas obtener un `clientId` válido.

#### C.1. Obtener Token de Autenticación

```bash
POST http://127.0.0.1:8080/api/auth/login
Content-Type: application/json

{
  "email": "tu_email@example.com",
  "password": "tu_password"
}
```

#### C.2. Crear Viaje (notifica automáticamente)

```bash
POST http://127.0.0.1:3333/api/v1/trips
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "destination": "Cartagena",
  "startDate": "2025-12-25",
  "endDate": "2025-12-30",
  "numPassengers": 4,
  "clientId": "675850a5c61e3c3ebe6b1234",
  "status": "confirmed"
}
```

**Logs del Backend (deberías ver):**
```
📧 Enviando email a: cliente@example.com
📝 Asunto: ✅ Confirmación de Viaje - Agencia de Viajes
✅ Email enviado exitosamente
✅ Notificación de viaje enviada a: cliente@example.com
```

---

### D. Enviar Recordatorio de Pago

```bash
POST http://127.0.0.1:3333/api/v1/installments/send-reminders
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "days_ahead": 7
}
```

**Respuesta Esperada:**
```json
{
  "message": "Recordatorios procesados",
  "sent": 3,
  "errors": 0,
  "total": 3
}
```

---

### E. Alerta Climática a Conductores

```bash
POST http://127.0.0.1:3333/api/v1/drivers/weather-alert
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "message": "Tormenta eléctrica en la ruta hacia Medellín. Evite conducir entre 14:00-18:00.",
  "severity": "ALTO"
}
```

---

## 🔧 PASO 3: Pruebas desde Código TypeScript

### Archivo de prueba: `test-notifications.ts`

```typescript
import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:3333/api/v1'
const TOKEN = 'tu_token_aqui'

async function testNotifications() {
  console.log('🧪 Iniciando pruebas de notificaciones...\n')

  // 1. Test de conectividad
  console.log('1️⃣ Test de conectividad')
  try {
    const response = await axios.get(`${BASE_URL}/notifications/test`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    })
    console.log('✅', response.data)
  } catch (error) {
    console.error('❌', error.message)
  }

  // 2. Enviar email personalizado
  console.log('\n2️⃣ Enviar email personalizado')
  try {
    const response = await axios.post(
      `${BASE_URL}/notifications/send-email`,
      {
        to: 'test@example.com',
        subject: 'Test Email',
        message: '<h1>Hola</h1><p>Email de prueba</p>'
      },
      {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }
    )
    console.log('✅', response.data)
  } catch (error) {
    console.error('❌', error.response?.data || error.message)
  }

  // 3. Enviar recordatorios
  console.log('\n3️⃣ Enviar recordatorios de pago')
  try {
    const response = await axios.post(
      `${BASE_URL}/installments/send-reminders`,
      { days_ahead: 7 },
      {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }
    )
    console.log('✅', response.data)
  } catch (error) {
    console.error('❌', error.response?.data || error.message)
  }

  console.log('\n✅ Pruebas completadas!')
}

testNotifications()
```

Ejecutar:
```bash
npx ts-node test-notifications.ts
```

---

## 📊 PASO 4: Verificar Logs

### Logs de MS-Business (AdonisJS)

```bash
# Ver logs en tiempo real
cd d:\Portillo\Backend\proyecto\ms-bussiness-backend
node ace serve --watch

# Buscar en logs
📧 Enviando email a: ...
✅ Email enviado exitosamente
✅ Notificación de viaje enviada a: ...
```

### Logs de MS-Notifications (Python)

```bash
# Si usas Flask con debug=True
127.0.0.1 - - [10/Dec/2025 14:30:00] "POST /send-email HTTP/1.1" 200 -
📧 Email enviado a: cliente@example.com
```

---

## 🎯 PASO 5: Probar Comando CLI

```bash
cd d:\Portillo\Backend\proyecto\ms-bussiness-backend
node ace reminders:send
```

**Salida Esperada:**
```
🔔 Iniciando envío de recordatorios de pago...
📧 Encontradas 5 cuotas por vencer
✅ Recordatorio enviado a: cliente1@example.com
✅ Recordatorio enviado a: cliente2@example.com

📊 Resumen:
  ✅ Enviados: 2
  ❌ Errores: 0
  📧 Total procesados: 2

✅ Proceso completado
```

---

## 🔍 Troubleshooting

### Error: "MS-Notifications no responde"

**Verificar:**
```bash
# PowerShell
Test-NetConnection -ComputerName 127.0.0.1 -Port 5000

# O con curl
curl http://127.0.0.1:5000/health
```

**Solución:**
1. Iniciar MS-Notifications
2. Usar el mock de PowerShell temporalmente
3. Verificar puerto no esté ocupado: `netstat -ano | findstr :5000`

---

### Error: "No se encontró email del usuario"

**Causa:** El cliente/usuario no existe en MS-Security o no tiene email

**Solución:**
```bash
# Verificar usuario existe
GET http://127.0.0.1:8080/api/users/675850a5c61e3c3ebe6b1234
Authorization: Bearer <token>

# Debe devolver:
{
  "_id": "675850a5c61e3c3ebe6b1234",
  "name": "Juan Pérez",
  "email": "juan@example.com"  # ← Debe tener email
}
```

---

### Error 401: "Unauthorized"

**Causa:** Token inválido o expirado

**Solución:**
```bash
# Obtener nuevo token
POST http://127.0.0.1:8080/api/auth/login
{
  "email": "tu_email",
  "password": "tu_password"
}
```

---

## 📝 Checklist de Pruebas

- [ ] MS-Security corriendo (puerto 8080)
- [ ] MS-Business corriendo (puerto 3333)
- [ ] MS-Notifications corriendo (puerto 5000)
- [ ] Token JWT válido obtenido
- [ ] Endpoint `/notifications/test` responde OK
- [ ] Email personalizado se envía correctamente
- [ ] Crear viaje envía notificación automática
- [ ] Recordatorios de pago funcionan
- [ ] Alerta climática funciona
- [ ] Comando CLI `reminders:send` ejecuta correctamente
- [ ] Logs muestran emails siendo enviados

---

## 🎥 Video de Demostración (Pasos)

1. **Iniciar servicios:**
   ```bash
   # Terminal 1: MS-Security
   cd ms--security
   mvn spring-boot:run

   # Terminal 2: MS-Business
   cd ms-bussiness-backend
   node ace serve --watch

   # Terminal 3: MS-Notifications
   cd ms-notifications
   python app.py
   ```

2. **Abrir Postman** → Importar colección de endpoints

3. **Login** → Obtener token

4. **Crear viaje** → Ver email en logs

5. **Enviar recordatorio** → Ver resultado en response

---

## 📧 Emails de Ejemplo que Deberías Ver

Si todo funciona correctamente, los emails tendrán este formato:

### Email de Viaje Creado:
```
Asunto: ✅ Confirmación de Viaje - Agencia de Viajes

🎉 ¡Tu Viaje ha sido Confirmado!

📍 Destino: Cartagena
📅 Fecha de inicio: 25/12/2025
📅 Fecha de fin: 30/12/2025
💰 Monto total: COP $1,500,000
```

### Email de Recordatorio:
```
Asunto: 💰 Recordatorio de Pago - Cuota de Viaje

💳 Recordatorio de Pago

💰 Monto: COP $500,000
📅 Fecha de vencimiento: 15/12/2025
📊 Cuota: 2 de 4
```

---

¡Listo! Ahora puedes probar todas las funcionalidades de notificaciones 🎉
