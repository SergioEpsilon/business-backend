import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Client from 'App/Models/Client'
import Guide from 'App/Models/Guide'
import Administrator from 'App/Models/Administrator'
import Municipality from 'App/Models/Municipality'
import TouristActivity from 'App/Models/TouristActivity'
import Plan from 'App/Models/Plan'
import Trip from 'App/Models/Trip'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    // ==========================================
    // 1. CREAR USUARIOS Y CLIENTES
    // ==========================================
    console.log('🔄 Creando usuarios y clientes...')

    const clientUser1 = await User.create({
      username: 'maria.garcia',
      email: 'maria.garcia@example.com',
      password: 'password123', // En producción usar Hash.make()
      userType: 'client',
      isActive: true,
    })

    await Client.create({
      userId: clientUser1.id,
      firstName: 'María',
      lastName: 'García',
      documentType: 'CC',
      documentNumber: '1234567890',
      phone: '+57 300 1234567',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      country: 'Colombia',
      birthDate: DateTime.fromISO('1985-05-15'),
    })

    const clientUser2 = await User.create({
      username: 'carlos.lopez',
      email: 'carlos.lopez@example.com',
      password: 'password123',
      userType: 'client',
      isActive: true,
    })

    await Client.create({
      userId: clientUser2.id,
      firstName: 'Carlos',
      lastName: 'López',
      documentType: 'CC',
      documentNumber: '9876543210',
      phone: '+57 310 9876543',
      address: 'Carrera 50 #20-30',
      city: 'Medellín',
      country: 'Colombia',
      birthDate: DateTime.fromISO('1990-08-20'),
    })

    // ==========================================
    // 2. CREAR GUÍAS TURÍSTICOS
    // ==========================================
    console.log('🔄 Creando guías turísticos...')

    const guideUser1 = await User.create({
      username: 'pedro.martinez',
      email: 'pedro.martinez@example.com',
      password: 'password123',
      userType: 'guide',
      isActive: true,
    })

    const guide1 = await Guide.create({
      userId: guideUser1.id,
      firstName: 'Pedro',
      lastName: 'Martínez',
      documentType: 'CC',
      documentNumber: '5555555555',
      phone: '+57 320 5555555',
      licenseNumber: 'GT-2020-001',
      specialization: 'Ecoturismo',
      languages: JSON.stringify(['Español', 'Inglés', 'Francés']),
      yearsOfExperience: 8,
      isAvailable: true,
    })

    const guideUser2 = await User.create({
      username: 'ana.rodriguez',
      email: 'ana.rodriguez@example.com',
      password: 'password123',
      userType: 'guide',
      isActive: true,
    })

    const guide2 = await Guide.create({
      userId: guideUser2.id,
      firstName: 'Ana',
      lastName: 'Rodríguez',
      documentType: 'CC',
      documentNumber: '6666666666',
      phone: '+57 315 6666666',
      licenseNumber: 'GT-2019-045',
      specialization: 'Turismo Cultural',
      languages: JSON.stringify(['Español', 'Inglés']),
      yearsOfExperience: 5,
      isAvailable: true,
    })

    // ==========================================
    // 3. CREAR ADMINISTRADOR
    // ==========================================
    console.log('🔄 Creando administrador...')

    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@travelagency.com',
      password: 'admin123',
      userType: 'administrator',
      isActive: true,
    })

    await Administrator.create({
      userId: adminUser.id,
      firstName: 'Admin',
      lastName: 'Principal',
      documentType: 'CC',
      documentNumber: '1111111111',
      phone: '+57 301 1111111',
      department: 'Gerencia',
      accessLevel: 3,
      canManageUsers: true,
      canManageTrips: true,
      canManageInvoices: true,
    })

    // ==========================================
    // 4. CREAR MUNICIPIOS
    // ==========================================
    console.log('🔄 Creando municipios...')

    const cartagena = await Municipality.create({
      name: 'Cartagena de Indias',
      department: 'Bolívar',
      country: 'Colombia',
      population: 1028736,
      area: 572.0,
      latitude: 10.39972,
      longitude: -75.51444,
      description:
        'Ciudad histórica y puerto marítimo en la costa caribeña de Colombia, conocida por su arquitectura colonial.',
      climate: 'Tropical',
      altitude: 2,
    })

    const santaMarta = await Municipality.create({
      name: 'Santa Marta',
      department: 'Magdalena',
      country: 'Colombia',
      population: 499192,
      area: 2381.0,
      latitude: 11.24079,
      longitude: -74.19904,
      description:
        'Ciudad turística en la costa caribeña, puerta de entrada al Parque Nacional Natural Tayrona.',
      climate: 'Tropical seco',
      altitude: 2,
    })

    const sanAndres = await Municipality.create({
      name: 'San Andrés',
      department: 'Archipiélago de San Andrés, Providencia y Santa Catalina',
      country: 'Colombia',
      population: 76442,
      area: 26.0,
      latitude: 12.58447,
      longitude: -81.70047,
      description: 'Isla paradisíaca en el Caribe colombiano, famosa por su mar de siete colores.',
      climate: 'Tropical',
      altitude: 1,
    })

    // ==========================================
    // 5. CREAR ACTIVIDADES TURÍSTICAS
    // ==========================================
    console.log('🔄 Creando actividades turísticas...')

    const activity1 = await TouristActivity.create({
      guideId: guide1.id,
      municipalityId: cartagena.id,
      name: 'Tour por la Ciudad Amurallada',
      description:
        'Recorrido histórico por las calles coloniales, castillos y murallas de Cartagena.',
      activityType: 'Cultural',
      duration: 4,
      price: 80000,
      maxCapacity: 20,
      minCapacity: 2,
      difficulty: 'easy',
      includesTransport: false,
      includesMeals: false,
      requirements: 'Calzado cómodo, protector solar, hidratación',
      isActive: true,
    })

    const activity2 = await TouristActivity.create({
      guideId: guide1.id,
      municipalityId: cartagena.id,
      name: 'Paseo en Lancha a Islas del Rosario',
      description: 'Excursión marítima a las hermosas Islas del Rosario con snorkeling incluido.',
      activityType: 'Naturaleza',
      duration: 8,
      price: 150000,
      maxCapacity: 15,
      minCapacity: 4,
      difficulty: 'moderate',
      includesTransport: true,
      includesMeals: true,
      requirements: 'Traje de baño, toalla, protector solar',
      isActive: true,
    })

    const activity3 = await TouristActivity.create({
      guideId: guide2.id,
      municipalityId: santaMarta.id,
      name: 'Trekking Parque Tayrona',
      description: 'Caminata ecológica por los senderos del Parque Nacional Natural Tayrona.',
      activityType: 'Aventura',
      duration: 10,
      price: 120000,
      maxCapacity: 12,
      minCapacity: 3,
      difficulty: 'hard',
      includesTransport: true,
      includesMeals: true,
      requirements: 'Excelente condición física, zapatos para trekking',
      isActive: true,
    })

    const activity4 = await TouristActivity.create({
      guideId: guide2.id,
      municipalityId: sanAndres.id,
      name: 'Tour Acuático Mar de 7 Colores',
      description: 'Recorrido en lancha por los lugares más emblemáticos de San Andrés.',
      activityType: 'Naturaleza',
      duration: 6,
      price: 180000,
      maxCapacity: 10,
      minCapacity: 2,
      difficulty: 'easy',
      includesTransport: true,
      includesMeals: true,
      requirements: 'Traje de baño, protector solar',
      isActive: true,
    })

    // ==========================================
    // 6. CREAR PLANES TURÍSTICOS
    // ==========================================
    console.log('🔄 Creando planes turísticos...')

    const plan1 = await Plan.create({
      name: 'Cartagena Colonial',
      description: 'Experiencia completa en la ciudad histórica de Cartagena',
      planCode: 'PLAN-CTG-001',
      duration: 3,
      basePrice: 850000,
      maxPeople: 4,
      minPeople: 1,
      includesAccommodation: true,
      includesTransport: true,
      includesMeals: false,
      mealPlan: 'Desayuno',
      category: 'Estándar',
      seasonType: 'Media',
      isActive: true,
    })

    const plan2 = await Plan.create({
      name: 'Aventura en Santa Marta',
      description: 'Paquete de aventura y naturaleza en Santa Marta y Tayrona',
      planCode: 'PLAN-SMA-001',
      duration: 4,
      basePrice: 1200000,
      maxPeople: 6,
      minPeople: 2,
      includesAccommodation: true,
      includesTransport: true,
      includesMeals: true,
      mealPlan: 'Pensión completa',
      category: 'Premium',
      seasonType: 'Alta',
      isActive: true,
    })

    const plan3 = await Plan.create({
      name: 'San Andrés Paradise',
      description: 'Escapada tropical a la isla de San Andrés',
      planCode: 'PLAN-SAI-001',
      duration: 5,
      basePrice: 2500000,
      maxPeople: 2,
      minPeople: 1,
      includesAccommodation: true,
      includesTransport: true,
      includesMeals: true,
      mealPlan: 'Todo incluido',
      category: 'Lujo',
      seasonType: 'Alta',
      isActive: true,
    })

    // ==========================================
    // 7. ASOCIAR ACTIVIDADES A PLANES
    // ==========================================
    console.log('🔄 Asociando actividades a planes...')

    // Plan Cartagena Colonial
    await plan1.related('touristActivities').attach({
      [activity1.id]: {
        day_number: 1,
        order_in_day: 1,
        is_optional: false,
      },
      [activity2.id]: {
        day_number: 2,
        order_in_day: 1,
        is_optional: false,
      },
    })

    // Plan Aventura Santa Marta
    await plan2.related('touristActivities').attach({
      [activity3.id]: {
        day_number: 2,
        order_in_day: 1,
        is_optional: false,
      },
    })

    // Plan San Andrés Paradise
    await plan3.related('touristActivities').attach({
      [activity4.id]: {
        day_number: 3,
        order_in_day: 1,
        is_optional: false,
      },
    })

    // ==========================================
    // 8. CREAR VIAJES
    // ==========================================
    console.log('🔄 Creando viajes...')

    const trip1 = await Trip.create({
      clientId: 1, // María García
      tripCode: 'TRIP-2025-001',
      destination: 'Cartagena de Indias',
      description: 'Viaje romántico de aniversario',
      startDate: DateTime.fromISO('2025-12-20'),
      endDate: DateTime.fromISO('2025-12-23'),
      totalPrice: 1700000,
      numberOfPassengers: 2,
      status: 'confirmed',
      paymentStatus: 'partial',
      notes: 'Cliente solicita habitación con vista al mar',
    })

    const trip2 = await Trip.create({
      clientId: 2, // Carlos López
      tripCode: 'TRIP-2025-002',
      destination: 'Santa Marta y Tayrona',
      startDate: DateTime.fromISO('2026-01-10'),
      endDate: DateTime.fromISO('2026-01-14'),
      totalPrice: 2400000,
      numberOfPassengers: 2,
      status: 'pending',
      paymentStatus: 'pending',
      notes: '',
    })

    // ==========================================
    // 9. ASOCIAR PLANES A VIAJES
    // ==========================================
    console.log('🔄 Asociando planes a viajes...')

    await trip1.related('plans').attach({
      [plan1.id]: {
        order_in_trip: 1,
        start_date: DateTime.fromISO('2025-12-20'),
        end_date: DateTime.fromISO('2025-12-23'),
      },
    })

    await trip2.related('plans').attach({
      [plan2.id]: {
        order_in_trip: 1,
        start_date: DateTime.fromISO('2026-01-10'),
        end_date: DateTime.fromISO('2026-01-14'),
      },
    })

    console.log('✅ Seeder completado exitosamente!')
    console.log('📊 Datos creados:')
    console.log('   - 3 Usuarios (2 clientes, 1 admin)')
    console.log('   - 2 Clientes')
    console.log('   - 2 Guías')
    console.log('   - 1 Administrador')
    console.log('   - 3 Municipios')
    console.log('   - 4 Actividades turísticas')
    console.log('   - 3 Planes turísticos')
    console.log('   - 2 Viajes')
  }
}
