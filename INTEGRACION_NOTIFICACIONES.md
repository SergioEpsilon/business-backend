# 📧 Integración Módulo de Notificaciones

## ✅ Estado: COMPLETADO

La integración del módulo de notificaciones con el módulo de negocio ha sido implementada exitosamente.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                   MS-BUSINESS (AdonisJS)                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            NotificationService.ts                     │  │
│  │  • sendEmail()                                        │  │
│  │  • sendSMS()                                          │  │
│  │  • sendBulkEmail()                                    │  │
│  │  • notifyTripCreated()                                │  │
│  │  • notifyTripStatusChange()                           │  │
│  │  • notifyInstallmentReminder()                        │  │
│  │  • notifyWeatherAlert()                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓ HTTP                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              MS-NOTIFICATIONS (Flask/Python)                 │
│                                                              │
│  • POST /send-email → Envía emails via SMTP                 │
│  • POST /send-sms → Envía SMS via Twilio                    │
│  • Running on http://127.0.0.1:5000                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Archivos Creados/Modificados

### ✅ Nuevos Archivos

1. **`app/Services/NotificationService.ts`**
   - Servicio centralizado para enviar notificaciones
   - Métodos para email, SMS, notificaciones masivas
   - Templates HTML para emails

2. **`app/Controllers/Http/NotificationsController.ts`**
   - Endpoints REST para notificaciones manuales
   - Test de conectividad con MS-Notifications
   - Alertas climáticas

3. **`commands/SendPaymentReminders.ts`**
   - Comando CLI para recordatorios automáticos
   - Ejecutable con cron jobs
   - Logs detallados

### 📝 Archivos Modificados

1. **`app/Controllers/Http/TripsController.ts`**
   - ✅ Notificación al crear viaje
   - ✅ Notificación al cambiar estado de viaje

2. **`app/Controllers/Http/InstallmentsController.ts`**
   - ✅ Recordatorios de pago individuales
   - ✅ Recordatorios de pago masivos

3. **`app/Controllers/Http/DriversController.ts`**
   - ✅ Alertas climáticas optimizadas con NotificationService

4. **`start/routes.ts`**
   - ✅ Rutas para notificaciones
   - ✅ Endpoints de recordatorios

---

## 🔌 Endpoints Creados

### Notificaciones Manuales

```
POST /api/v1/notifications/send-email
POST /api/v1/notifications/send-sms
POST /api/v1/notifications/send-bulk-email
POST /api/v1/notifications/weather-alert
GET  /api/v1/notifications/test
```

### Recordatorios de Pago

```
POST /api/v1/installments/send-reminders
POST /api/v1/installments/:id/send-reminder
```

### Integraciones Automáticas

```
POST /api/v1/trips → Notifica al crear viaje
PUT  /api/v1/trips/:id → Notifica cambio de estado
POST /api/v1/drivers/weather-alert → Alerta conductores
```

---

## 📚 Ejemplos de Uso

### 1. Crear Viaje con Notificación

```bash
POST /api/v1/trips
Content-Type: application/json
Authorization: Bearer <token>

{
  "destination": "Cartagena",
  "startDate": "2025-12-25",
  "endDate": "2025-12-30",
  "numPassengers": 4,
  "clientId": "675850a5c61e3c3ebe6b1234", // 🆕 Email automático
  "status": "confirmed"
}
```

**Resultado:** Email automático enviado al cliente con detalles del viaje.

---

### 2. Recordatorio de Pago Manual

```bash
POST /api/v1/installments/15/send-reminder
Authorization: Bearer <token>
```

**Resultado:** Email enviado a todos los clientes del viaje asociado.

---

### 3. Recordatorios Masivos (Próximos 7 días)

```bash
POST /api/v1/installments/send-reminders
Content-Type: application/json
Authorization: Bearer <token>

{
  "days_ahead": 7
}
```

**Respuesta:**
```json
{
  "message": "Recordatorios procesados",
  "sent": 12,
  "errors": 0,
  "total": 12
}
```

---

### 4. Alerta Climática a Conductores

```bash
POST /api/v1/drivers/weather-alert
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "Tormenta eléctrica en la ruta hacia Medellín. Evite conducir entre 14:00-18:00.",
  "severity": "ALTO"
}
```

---

### 5. Email Personalizado

```bash
POST /api/v1/notifications/send-email
Content-Type: application/json
Authorization: Bearer <token>

{
  "to": "cliente@example.com",
  "subject": "Actualización de tu Viaje",
  "message": "<h1>Hola Cliente</h1><p>Tu viaje ha sido confirmado...</p>",
  "sender": "no-reply@agenciaviajes.com"
}
```

---

## 🤖 Comando CLI para Recordatorios Automáticos

### Ejecución Manual

```bash
cd d:\Portillo\Backend\proyecto\ms-bussiness-backend
node ace reminders:send
```

**Salida:**
```
🔔 Iniciando envío de recordatorios de pago...
📧 Encontradas 5 cuotas por vencer
✅ Recordatorio enviado a: cliente1@example.com
✅ Recordatorio enviado a: cliente2@example.com
✅ Recordatorio enviado a: cliente3@example.com

📊 Resumen:
  ✅ Enviados: 5
  ❌ Errores: 0
  📧 Total procesados: 5
```

### Configurar Cron Job (Ejecución Diaria a las 8:00 AM)

**Linux/Mac:**
```bash
crontab -e
# Agregar:
0 8 * * * cd /path/to/ms-bussiness-backend && node ace reminders:send >> /var/log/reminders.log 2>&1
```

**Windows (Task Scheduler):**
```powershell
schtasks /create /tn "PaymentReminders" /tr "node ace reminders:send" /sc daily /st 08:00
```

---

## 🎨 Templates de Email

### Viaje Creado

```html
<h2>🎉 ¡Tu Viaje ha sido Confirmado!</h2>
📍 Destino: Cartagena
📅 Fecha de inicio: 25/12/2025
📅 Fecha de fin: 30/12/2025
💰 Monto total: COP $1,500,000
```

### Cambio de Estado

```html
<h2>Actualización de tu Viaje</h2>
📍 Destino: Medellín
🔄 Nuevo estado: En progreso
📝 Mensaje: Tu viaje ha iniciado. ¡Disfruta!
```

### Recordatorio de Pago

```html
<h2>💳 Recordatorio de Pago</h2>
💰 Monto: COP $500,000
📅 Fecha de vencimiento: 15/12/2025
📊 Cuota: 2 de 4
```

### Alerta Climática

```html
<h2>⚠️ Alerta Climática</h2>
Tormenta eléctrica en la ruta hacia Medellín.
Nivel de alerta: ALTO
Fecha: 10/12/2025 14:30:00
```

---

## ⚙️ Configuración Requerida

### .env Variables

```env
# MS-Notifications URL
MS_NOTIFICATIONS=http://127.0.0.1:5000

# MS-Security URL (para obtener datos de usuarios)
MS_SECURITY=http://127.0.0.1:8080
```

### Verificar MS-Notifications está corriendo

```bash
curl http://127.0.0.1:5000/health
# Respuesta esperada: {"status": "healthy"}
```

---

## 🧪 Testing

### Test de Conectividad

```bash
GET /api/v1/notifications/test
Authorization: Bearer <token>
```

**Respuesta:**
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

## 📊 Flujos Implementados

### 1. Creación de Viaje
```
Usuario crea viaje → TripsController.store()
                    ↓
            ¿Tiene clientId?
                    ↓ Sí
          UserService.getUserInfo()
                    ↓
      NotificationService.notifyTripCreated()
                    ↓
              MS-Notifications
                    ↓
            Email enviado ✅
```

### 2. Actualización de Estado
```
Usuario actualiza viaje → TripsController.update()
                         ↓
                ¿Cambió el status?
                         ↓ Sí
           Obtener clientes del viaje
                         ↓
      NotificationService.notifyTripStatusChange()
                         ↓
                 Email a cada cliente ✅
```

### 3. Recordatorio de Pago Automático
```
Cron Job (8:00 AM) → node ace reminders:send
                    ↓
        Buscar cuotas que vencen en 7 días
                    ↓
          Obtener clientes de cada viaje
                    ↓
    NotificationService.notifyInstallmentReminder()
                    ↓
           Emails enviados ✅
```

### 4. Alerta Climática
```
Admin envía alerta → DriversController.sendWeatherAlert()
                    ↓
         Obtener conductores activos
                    ↓
        UserService.getUserInfo() (emails)
                    ↓
     NotificationService.notifyWeatherAlert()
                    ↓
          Emails masivos enviados ✅
```

---

## 🔐 Seguridad

- ✅ Todos los endpoints requieren autenticación (middleware 'security')
- ✅ Validación de inputs
- ✅ Manejo de errores sin exponer información sensible
- ✅ Logs detallados para auditoría
- ✅ Timeout de 10 segundos para llamadas HTTP

---

## 📈 Mejoras Futuras

1. **Notificaciones Push** (Firebase Cloud Messaging)
2. **Webhooks** para eventos del sistema
3. **Plantillas dinámicas** con variables personalizables
4. **Dashboard de estadísticas** de notificaciones enviadas
5. **Retry automático** para emails fallidos
6. **Rate limiting** para prevenir spam
7. **Notificaciones WhatsApp** via Twilio API

---

## 🐛 Troubleshooting

### Error: "MS-Notifications no responde"

**Solución:**
```bash
# Verificar que MS-Notifications esté corriendo
curl http://127.0.0.1:5000/health

# Iniciar MS-Notifications si no está activo
cd /path/to/ms-notifications
python app.py
```

### Error: "No se encontró email del usuario"

**Solución:**
- Verificar que el usuario exista en MS-Security
- Verificar que el token de autorización sea válido
- El usuario debe tener email registrado

### Notificaciones no se envían

**Checklist:**
- ✅ MS-Notifications corriendo en puerto 5000
- ✅ Variable `MS_NOTIFICATIONS` en `.env` configurada
- ✅ Usuario tiene email válido
- ✅ Token de autorización incluido en headers

---

## 📞 Soporte

Para reportar problemas o sugerir mejoras:
- 📧 Email: dev@agenciaviajes.com
- 📝 Logs: `d:\Portillo\Backend\proyecto\ms-bussiness-backend\tmp\adonis.log`

---

## ✅ Checklist de Implementación

- [x] NotificationService.ts creado
- [x] NotificationsController.ts creado
- [x] Integración en TripsController
- [x] Integración en InstallmentsController
- [x] Integración en DriversController
- [x] Rutas configuradas
- [x] Comando CLI para recordatorios
- [x] Templates HTML para emails
- [x] Documentación completa
- [x] Configuración .env
- [x] Manejo de errores
- [x] Logs detallados

---

**🎉 ¡Integración del Módulo de Notificaciones COMPLETADA!**

*Última actualización: 10 de diciembre de 2025*
