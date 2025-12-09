/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return {
    message: 'Travel Agency Management API',
    version: '1.0.0',
    endpoints: '/api/v1',
  }
})

// API v1 Routes
Route.group(() => {
  // ==================== USER ROUTES ====================
  // Las rutas de usuarios se manejan en MS-SECURITY

  // ==================== CLIENT ROUTES ====================
  Route.group(() => {
    Route.get('/', 'ClientsController.index')
    Route.post('/', 'ClientsController.store')
    Route.get('/:id', 'ClientsController.show')
    Route.put('/:id', 'ClientsController.update')
    Route.delete('/:id', 'ClientsController.destroy')
    Route.get('/:id/trips', 'ClientsController.trips')
    Route.post('/:id/trips/:tripId', 'ClientsController.attachTrip')
    Route.delete('/:id/trips/:tripId', 'ClientsController.detachTrip')
  })
    .prefix('/clients')
    .middleware('security')

  // ==================== GUIDE ROUTES ====================
  Route.group(() => {
    Route.get('/', 'GuidesController.index')
    Route.get('/available', 'GuidesController.available')
    Route.post('/', 'GuidesController.store')
    Route.get('/:id', 'GuidesController.show')
    Route.put('/:id', 'GuidesController.update')
    Route.delete('/:id', 'GuidesController.destroy')
    Route.get('/:id/activities', 'GuidesController.activities')
    Route.patch('/:id/toggle-availability', 'GuidesController.toggleAvailability')
  })
    .prefix('/guides')
    .middleware('security')

  // ==================== ADMINISTRATOR ROUTES ====================
  Route.group(() => {
    Route.get('/', 'AdministratorsController.index')
    Route.post('/', 'AdministratorsController.store')
    Route.get('/:id', 'AdministratorsController.show')
    Route.put('/:id', 'AdministratorsController.update')
    Route.delete('/:id', 'AdministratorsController.destroy')
    Route.patch('/:id/permissions', 'AdministratorsController.updatePermissions')
  })
    .prefix('/administrators')
    .middleware('security')

  // ==================== DRIVER ROUTES ====================
  Route.group(() => {
    Route.get('/', 'DriversController.index')
    Route.get('/stats', 'DriversController.stats')
    Route.post('/', 'DriversController.store')
    Route.post('/weather-alert', 'DriversController.sendWeatherAlert')
    Route.get('/:id', 'DriversController.show')
    Route.put('/:id', 'DriversController.update')
    Route.delete('/:id', 'DriversController.destroy')
    Route.get('/:id/validate', 'DriversController.validate')
  })
    .prefix('/drivers')
    .middleware('security')

  // ==================== VEHICLE ROUTES ====================
  Route.group(() => {
    Route.get('/', 'VehiclesController.index')
    Route.post('/', 'VehiclesController.store')
    Route.get('/:id', 'VehiclesController.show')
    Route.put('/:id', 'VehiclesController.update')
    Route.delete('/:id', 'VehiclesController.destroy')
    Route.get('/:id/drivers', 'VehiclesController.drivers')
    Route.get('/:id/routes', 'VehiclesController.routes')
    Route.get('/:id/gps', 'VehiclesController.gps')
  })
    .prefix('/vehicles')
    .middleware('security')

  // ==================== CAR ROUTES ====================
  Route.group(() => {
    Route.get('/', 'CarsController.index')
    Route.post('/', 'CarsController.store')
    Route.get('/:id', 'CarsController.show')
    Route.put('/:id', 'CarsController.update')
    Route.delete('/:id', 'CarsController.destroy')
  })
    .prefix('/cars')
    .middleware('security')

  // ==================== AIRCRAFT ROUTES ====================
  Route.group(() => {
    Route.get('/', 'AircraftsController.index')
    Route.post('/', 'AircraftsController.store')
    Route.get('/:id', 'AircraftsController.show')
    Route.put('/:id', 'AircraftsController.update')
    Route.delete('/:id', 'AircraftsController.destroy')
  })
    .prefix('/aircrafts')
    .middleware('security')

  // ==================== SHIFT ROUTES ====================
  Route.group(() => {
    Route.get('/', 'ShiftsController.index')
    Route.post('/', 'ShiftsController.store')
    Route.get('/:id', 'ShiftsController.show')
    Route.put('/:id', 'ShiftsController.update')
    Route.delete('/:id', 'ShiftsController.destroy')
    Route.patch('/:id/start', 'ShiftsController.start')
    Route.patch('/:id/complete', 'ShiftsController.complete')
  })
    .prefix('/shifts')
    .middleware('security')

  // ==================== MUNICIPALITY ROUTES ====================
  Route.group(() => {
    Route.get('/', 'MunicipalitiesController.index')
    Route.get('/search', 'MunicipalitiesController.search')
    Route.post('/', 'MunicipalitiesController.store')
    Route.get('/:id', 'MunicipalitiesController.show')
    Route.put('/:id', 'MunicipalitiesController.update')
    Route.delete('/:id', 'MunicipalitiesController.destroy')
    Route.get('/:id/activities', 'MunicipalitiesController.activities')
  })
    .prefix('/municipalities')
    .middleware('security')

  // ==================== TOURIST ACTIVITY ROUTES ====================
  Route.group(() => {
    Route.get('/', 'TouristActivitiesController.index')
    Route.get('/by-type', 'TouristActivitiesController.byType')
    Route.post('/', 'TouristActivitiesController.store')
    Route.get('/:id', 'TouristActivitiesController.show')
    Route.put('/:id', 'TouristActivitiesController.update')
    Route.delete('/:id', 'TouristActivitiesController.destroy')
    Route.patch('/:id/toggle-active', 'TouristActivitiesController.toggleActive')
    Route.get('/:id/plans', 'TouristActivitiesController.plans')
    Route.get('/:id/guides', 'TouristActivitiesController.guides')
    Route.post('/:id/guides/:guideId', 'TouristActivitiesController.attachGuide')
    Route.delete('/:id/guides/:guideId', 'TouristActivitiesController.detachGuide')
  })
    .prefix('/tourist-activities')
    .middleware('security')

  // ==================== PLAN ROUTES ====================
  Route.group(() => {
    Route.get('/', 'PlansController.index')
    Route.post('/', 'PlansController.store')
    Route.get('/:id', 'PlansController.show')
    Route.put('/:id', 'PlansController.update')
    Route.delete('/:id', 'PlansController.destroy')
    Route.post('/:id/attach-activities', 'PlansController.attachActivities')
    Route.post('/:id/detach-activities', 'PlansController.detachActivities')
    Route.patch('/:id/toggle-active', 'PlansController.toggleActive')
    Route.get('/:id/activities', 'PlansController.activities')
  })
    .prefix('/plans')
    .middleware('security')

  // ==================== TRIP ROUTES ====================
  Route.group(() => {
    Route.get('/', 'TripsController.index')
    Route.post('/', 'TripsController.store')
    Route.get('/:id', 'TripsController.show')
    Route.put('/:id', 'TripsController.update')
    Route.delete('/:id', 'TripsController.destroy')
    Route.get('/:id/clients', 'TripsController.clients')
    Route.post('/:id/clients/:clientId', 'TripsController.attachClient')
    Route.delete('/:id/clients/:clientId', 'TripsController.detachClient')
    Route.get('/:id/routes', 'TripsController.routes')
    Route.post('/:id/routes/:routeId', 'TripsController.attachRoute')
    Route.delete('/:id/routes/:routeId', 'TripsController.detachRoute')
  })
    .prefix('/trips')
    .middleware('security')

  // ==================== ROUTE ROUTES ====================
  Route.group(() => {
    Route.get('/', 'RoutesController.index')
    Route.post('/', 'RoutesController.store')
    Route.get('/:id', 'RoutesController.show')
    Route.put('/:id', 'RoutesController.update')
    Route.delete('/:id', 'RoutesController.destroy')
    Route.get('/:id/trips', 'RoutesController.trips')
    Route.get('/:id/vehicles', 'RoutesController.vehicles')
    Route.post('/:id/vehicles/:vehicleId', 'RoutesController.attachVehicle')
    Route.delete('/:id/vehicles/:vehicleId', 'RoutesController.detachVehicle')
  })
    .prefix('/routes')
    .middleware('security')

  // ==================== INVOICE ROUTES ====================
  Route.group(() => {
    Route.get('/', 'InvoicesController.index')
    Route.post('/', 'InvoicesController.store')
    Route.get('/:id', 'InvoicesController.show')
    Route.put('/:id', 'InvoicesController.update')
    Route.delete('/:id', 'InvoicesController.destroy')
    Route.post('/:id/register-payment', 'InvoicesController.registerPayment')
    Route.patch('/:id/mark-overdue', 'InvoicesController.markOverdue')
    Route.get('/:id/installments', 'InvoicesController.installments')
  })
    .prefix('/invoices')
    .middleware('security')

  // ==================== INSTALLMENT ROUTES ====================
  Route.group(() => {
    Route.get('/', 'InstallmentsController.index')
    Route.get('/overdue', 'InstallmentsController.overdue')
    Route.patch('/mark-overdue', 'InstallmentsController.markOverdue')
    Route.post('/', 'InstallmentsController.store')
    Route.get('/:id', 'InstallmentsController.show')
    Route.put('/:id', 'InstallmentsController.update')
    Route.delete('/:id', 'InstallmentsController.destroy')
    Route.post('/:id/pay', 'InstallmentsController.pay')
  })
    .prefix('/installments')
    .middleware('security')

  // ==================== BANK CARD ROUTES ====================
  Route.group(() => {
    Route.get('/clients/:clientId/bank-cards', 'BankCardsController.index')
    Route.post('/clients/:clientId/bank-cards', 'BankCardsController.store')
    Route.get('/bank-cards/:id', 'BankCardsController.show')
    Route.put('/bank-cards/:id', 'BankCardsController.update')
    Route.delete('/bank-cards/:id', 'BankCardsController.destroy')
    Route.patch('/bank-cards/:id/set-default', 'BankCardsController.setDefault')
  }).middleware('security')

  // ==================== HOTEL ROUTES ====================
  Route.group(() => {
    Route.get('/', 'HotelsController.index')
    Route.post('/', 'HotelsController.store')
    Route.get('/:id', 'HotelsController.show')
    Route.put('/:id', 'HotelsController.update')
    Route.delete('/:id', 'HotelsController.destroy')
    Route.get('/:id/rooms', 'HotelsController.rooms')
  })
    .prefix('/hotels')
    .middleware('security')

  // ==================== ROOM ROUTES ====================
  Route.group(() => {
    Route.get('/', 'RoomsController.index')
    Route.post('/', 'RoomsController.store')
    Route.get('/hotel/:hotelId', 'RoomsController.byHotel')
    Route.get('/:id', 'RoomsController.show')
    Route.put('/:id', 'RoomsController.update')
    Route.delete('/:id', 'RoomsController.destroy')
  })
    .prefix('/rooms')
    .middleware('security')

  // ==================== ITINERARY TRANSPORT ROUTES ====================
  Route.group(() => {
    Route.get('/', 'ItineraryTransportsController.index')
    Route.post('/', 'ItineraryTransportsController.store')
    Route.get('/:id', 'ItineraryTransportsController.show')
    Route.put('/:id', 'ItineraryTransportsController.update')
    Route.delete('/:id', 'ItineraryTransportsController.destroy')
  })
    .prefix('/itinerary-transports')
    .middleware('security')
}).prefix('/api/v1')
