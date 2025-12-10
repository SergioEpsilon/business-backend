import { DateTime } from 'luxon'

/**
 * Servicio para simulación automática de GPS
 */
export default class GpsSimulatorService {
  private static interval: NodeJS.Timeout | null = null
  private static isRunning = false
  private static updateIntervalMs = 5000 // Actualizar cada 5 segundos

  /**
   * Lazy load de modelos para evitar problemas con IoC Container
   */
  private static async getModels() {
    const { default: VehicleGps } = await import('App/Models/VehicleGps')
    const { default: Vehicle } = await import('App/Models/Vehicle')
    return { VehicleGps, Vehicle }
  }

  /**
   * Iniciar simulación automática
   */
  public static start() {
    if (this.isRunning) {
      console.log('⚠️ GPS Simulator ya está corriendo')
      return
    }

    console.log('🛰️ Iniciando GPS Simulator...')
    this.isRunning = true

    this.interval = setInterval(async () => {
      await this.updateAllVehicles()
    }, this.updateIntervalMs)

    console.log(`✅ GPS Simulator iniciado (actualización cada ${this.updateIntervalMs / 1000}s)`)
  }

  /**
   * Detener simulación
   */
  public static stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
      this.isRunning = false
      console.log('🛑 GPS Simulator detenido')
    }
  }

  /**
   * Actualizar posiciones de todos los vehículos activos
   */
  private static async updateAllVehicles() {
    try {
      const { VehicleGps } = await this.getModels()

      // Obtener todos los GPS activos
      const activeGps = await VehicleGps.query()
        .where('is_active', true)
        .where('status', '!=', 'offline')

      for (const gps of activeGps) {
        await this.updateVehiclePosition(gps)
      }

      if (activeGps.length > 0) {
        console.log(`📍 GPS actualizado para ${activeGps.length} vehículo(s)`)
      }
    } catch (error) {
      console.error('❌ Error actualizando GPS:', error.message)
    }
  }

  /**
   * Actualizar posición de un vehículo individual
   */
  private static async updateVehiclePosition(gps: VehicleGps) {
    try {
      // Simular movimiento basado en el estado
      if (gps.status === 'moving') {
        // Calcular nueva posición (movimiento simulado)
        const speedKmH = gps.speed || 60
        const distanceKm = (speedKmH * this.updateIntervalMs) / (1000 * 3600) // Distancia en km

        // Convertir distancia a grados (aproximación)
        const latChange = (distanceKm / 111) * (Math.random() * 0.8 + 0.6) // ~111 km por grado de latitud
        const lonChange = (distanceKm / 111) * (Math.random() * 0.8 + 0.6)

        // Aplicar dirección basada en heading
        const headingRad = (gps.heading * Math.PI) / 180
        const newLat = gps.latitude + latChange * Math.cos(headingRad)
        const newLon = gps.longitude + lonChange * Math.sin(headingRad)

        // Actualizar posición
        gps.latitude = newLat
        gps.longitude = newLon

        // Variar ligeramente la velocidad y dirección
        gps.speed = Math.max(0, speedKmH + (Math.random() - 0.5) * 10)
        gps.heading = (gps.heading + (Math.random() - 0.5) * 15 + 360) % 360

        // Probabilidad de detenerse
        if (Math.random() < 0.05) {
          // 5% de probabilidad
          gps.status = 'stopped'
          gps.speed = 0
        }
      } else if (gps.status === 'stopped') {
        // Vehículo detenido, probabilidad de reanudar
        if (Math.random() < 0.1) {
          // 10% de probabilidad
          gps.status = 'moving'
          gps.speed = 40 + Math.random() * 40 // 40-80 km/h
        }
      } else if (gps.status === 'idle') {
        // Vehículo inactivo, probabilidad de iniciar movimiento
        if (Math.random() < 0.02) {
          // 2% de probabilidad
          gps.status = 'moving'
          gps.speed = 40 + Math.random() * 40
          gps.heading = Math.random() * 360
        }
      }

      // Actualizar timestamp
      gps.lastUpdate = DateTime.now()
      await gps.save()

      // TODO: Emitir evento WebSocket
      // Ws.io.emit('gps:update', { vehicleId: gps.vehicleId, ...gps.serialize() })
    } catch (error) {
      console.error(`❌ Error actualizando vehículo ${gps.vehicleId}:`, error.message)
    }
  }

  /**
   * Inicializar GPS para un vehículo con posición aleatoria
   */
  public static async initializeVehicleGps(vehicleId: number) {
    try {
      const { VehicleGps } = await this.getModels()

      // Verificar si ya existe GPS
      const existing = await VehicleGps.query().where('vehicle_id', vehicleId).first()
      if (existing) {
        console.log(`⚠️ GPS ya existe para vehículo ${vehicleId}`)
        return existing
      }

      // Generar posición inicial aleatoria (Colombia)
      // Bogotá: 4.7110, -74.0721
      const baseLat = 4.711
      const baseLon = -74.0721
      const randomLat = baseLat + (Math.random() - 0.5) * 5 // ±2.5 grados
      const randomLon = baseLon + (Math.random() - 0.5) * 5

      const gps = await VehicleGps.create({
        vehicleId,
        latitude: randomLat,
        longitude: randomLon,
        speed: 0,
        heading: Math.random() * 360,
        altitude: 2600 + Math.random() * 500, // Altitud de Bogotá
        accuracy: 5 + Math.random() * 10,
        isActive: true,
        status: 'idle',
        lastUpdate: DateTime.now(),
      })

      console.log(`✅ GPS inicializado para vehículo ${vehicleId}`)
      return gps
    } catch (error) {
      console.error(`❌ Error inicializando GPS para vehículo ${vehicleId}:`, error.message)
      throw error
    }
  }

  /**
   * Inicializar GPS para todos los vehículos sin GPS
   */
  public static async initializeAllVehicles() {
    try {
      const { Vehicle } = await this.getModels()

      const vehicles = await Vehicle.query().whereDoesntHave('gps')

      let initialized = 0
      for (const vehicle of vehicles) {
        await this.initializeVehicleGps(vehicle.id)
        initialized++
      }

      console.log(`✅ GPS inicializado para ${initialized} vehículo(s)`)
      return initialized
    } catch (error) {
      console.error('❌ Error inicializando GPS para vehículos:', error.message)
      throw error
    }
  }

  /**
   * Configurar intervalo de actualización
   */
  public static setUpdateInterval(milliseconds: number) {
    this.updateIntervalMs = milliseconds
    if (this.isRunning) {
      this.stop()
      this.start()
    }
    console.log(`⚙️ Intervalo de actualización GPS: ${milliseconds / 1000}s`)
  }

  /**
   * Obtener estado del simulador
   */
  public static getStatus() {
    return {
      isRunning: this.isRunning,
      updateIntervalMs: this.updateIntervalMs,
      updateIntervalSeconds: this.updateIntervalMs / 1000,
    }
  }
}
