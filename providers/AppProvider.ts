import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
    console.log('🚀 Aplicación lista')

    // Importación dinámica para evitar problemas con IoC Container
    const { default: GpsSimulatorService } = await import('App/Services/GpsSimulatorService')

    // Inicializar GPS para todos los vehículos sin GPS
    try {
      const initialized = await GpsSimulatorService.initializeAllVehicles()
      if (initialized > 0) {
        console.log(`✅ ${initialized} vehículo(s) con GPS inicializado`)

        // Solo iniciar el simulador si hay vehículos con GPS
        GpsSimulatorService.start()
      } else {
        console.log(
          'ℹ️ No hay vehículos para inicializar GPS. El simulador se iniciará cuando haya vehículos.'
        )
      }
    } catch (error) {
      console.error('⚠️ Error inicializando GPS:', error.message)
    }
  }

  public async shutdown() {
    // Cleanup, since app is going down
    console.log('🛑 Deteniendo aplicación...')

    // Importación dinámica también en shutdown
    const { default: GpsSimulatorService } = await import('App/Services/GpsSimulatorService')
    GpsSimulatorService.stop()
  }
}
