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
  Route.group(() => {
    Route.get('/', 'UsersController.index')
    Route.get('/stats', 'UsersController.stats')
    Route.get('/:id', 'UsersController.show')
    Route.put('/:id', 'UsersController.update')
    Route.patch('/:id/toggle-status', 'UsersController.toggleStatus')
    Route.patch('/:id/change-password', 'UsersController.changePassword')
    Route.get('/:id/profile', 'UsersController.profile')
  }).prefix('/users')

  // ==================== CLIENT ROUTES ====================
  Route.group(() => {
    Route.get('/', 'ClientsController.index')
    Route.post('/', 'ClientsController.store')
    Route.get('/:id', 'ClientsController.show')
    Route.put('/:id', 'ClientsController.update')
    Route.delete('/:id', 'ClientsController.destroy')
    Route.get('/:id/trips', 'ClientsController.trips')
    Route.get('/:id/bank-cards', 'ClientsController.bankCards')
  }).prefix('/clients')

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
  }).prefix('/guides')

  // ==================== ADMINISTRATOR ROUTES ====================
  Route.group(() => {
    Route.get('/', 'AdministratorsController.index')
    Route.post('/', 'AdministratorsController.store')
    Route.get('/:id', 'AdministratorsController.show')
    Route.put('/:id', 'AdministratorsController.update')
    Route.delete('/:id', 'AdministratorsController.destroy')
    Route.patch('/:id/permissions', 'AdministratorsController.updatePermissions')
  }).prefix('/administrators')

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
  }).prefix('/drivers')

  // ==================== VEHICLE ROUTES ====================
  Route.group(() => {
    Route.get('/', 'VehiclesController.index')
    Route.post('/', 'VehiclesController.store')
    Route.get('/:id', 'VehiclesController.show')
    Route.put('/:id', 'VehiclesController.update')
    Route.delete('/:id', 'VehiclesController.destroy')
    Route.get('/:id/drivers', 'VehiclesController.drivers')
  }).prefix('/vehicles')

  // ==================== SHIFT ROUTES ====================
  Route.group(() => {
    Route.get('/', 'ShiftsController.index')
    Route.post('/', 'ShiftsController.store')
    Route.get('/:id', 'ShiftsController.show')
    Route.put('/:id', 'ShiftsController.update')
    Route.delete('/:id', 'ShiftsController.destroy')
    Route.patch('/:id/start', 'ShiftsController.start')
    Route.patch('/:id/complete', 'ShiftsController.complete')
  }).prefix('/shifts')

  // ==================== MUNICIPALITY ROUTES ====================
  Route.group(() => {
    Route.get('/', 'MunicipalitiesController.index')
    Route.get('/search', 'MunicipalitiesController.search')
    Route.post('/', 'MunicipalitiesController.store')
    Route.get('/:id', 'MunicipalitiesController.show')
    Route.put('/:id', 'MunicipalitiesController.update')
    Route.delete('/:id', 'MunicipalitiesController.destroy')
    Route.get('/:id/activities', 'MunicipalitiesController.activities')
  }).prefix('/municipalities')

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
  }).prefix('/tourist-activities')

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
  }).prefix('/plans')

  // ==================== TRIP ROUTES ====================
  Route.group(() => {
    Route.get('/', 'TripsController.index')
    Route.post('/', 'TripsController.store')
    Route.get('/:id', 'TripsController.show')
    Route.put('/:id', 'TripsController.update')
    Route.delete('/:id', 'TripsController.destroy')
    Route.post('/:id/attach-plans', 'TripsController.attachPlans')
    Route.post('/:id/detach-plans', 'TripsController.detachPlans')
    Route.patch('/:id/update-status', 'TripsController.updateStatus')
    Route.get('/:id/plans', 'TripsController.plans')
    Route.get('/:id/invoices', 'TripsController.invoices')
  }).prefix('/trips')

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
  }).prefix('/invoices')

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
  }).prefix('/installments')

  // ==================== BANK CARD ROUTES ====================
  Route.group(() => {
    Route.get('/clients/:clientId/bank-cards', 'BankCardsController.index')
    Route.post('/clients/:clientId/bank-cards', 'BankCardsController.store')
    Route.get('/bank-cards/:id', 'BankCardsController.show')
    Route.put('/bank-cards/:id', 'BankCardsController.update')
    Route.delete('/bank-cards/:id', 'BankCardsController.destroy')
    Route.patch('/bank-cards/:id/set-default', 'BankCardsController.setDefault')
  })
}).prefix('/api/v1')
