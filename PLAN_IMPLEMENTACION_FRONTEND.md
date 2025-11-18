# 🎯 PLAN DE IMPLEMENTACIÓN FRONTEND - INTEGRACIÓN ADONIS

**Fecha:** 18 de Noviembre de 2025  
**Alcance:** Integración de entidades de negocio AdonisJS en Angular 16  
**Estrategia:** Arquitectura Dual (MS-SECURITY + AdonisJS)

---

## 📊 ARQUITECTURA PROPUESTA

```
┌─────────────────────────────────────────────────┐
│         FRONTEND ANGULAR 16 (Puerto 4200)       │
│                                                 │
│  ┌──────────────────┐    ┌──────────────────┐  │
│  │  AUTH MODULE     │    │  BUSINESS MODULES│  │
│  │  (Existente)     │    │  (Nuevo)         │  │
│  │                  │    │                  │  │
│  │  - Login         │    │  - Clientes      │  │
│  │  - Register      │    │  - Viajes        │  │
│  │  - Users         │    │  - Planes        │  │
│  │  - Roles         │    │  - Habitaciones  │  │
│  │  - Permissions   │    │  - Actividades   │  │
│  │                  │    │  - Vehículos     │  │
│  │                  │    │  - Trayectos     │  │
│  │                  │    │  - Tarjetas      │  │
│  │                  │    │  - Cuotas        │  │
│  └────────┬─────────┘    └────────┬─────────┘  │
│           │                       │             │
└───────────┼───────────────────────┼─────────────┘
            │                       │
            ▼                       ▼
   ┌────────────────┐      ┌────────────────┐
   │  MS-SECURITY   │      │  ADONIS BACKEND│
   │  (Puerto 8080) │      │  (Puerto 3333) │
   │                │      │                │
   │  Java/Spring   │      │  AdonisJS 5    │
   │  MongoDB       │      │  MySQL         │
   └────────────────┘      └────────────────┘
```

---

## 🎯 ENTIDADES A IMPLEMENTAR

### ✅ **ENTIDADES SELECCIONADAS (10 clases del Backend AdonisJS)**

Basado en el modelo relacional y tu especificación:

| # | Entidad | Backend Endpoint | Prioridad | Componentes UI |
|---|---------|------------------|-----------|----------------|
| 1 | **Cliente** | `/api/v1/clients` | 🔴 Alta | Lista, Formulario, Detalle |
| 2 | **Viaje** | `/api/v1/trips` | 🔴 Alta | Lista, Formulario, Detalle |
| 3 | **Plan** | `/api/v1/plans` | 🔴 Alta | Lista, Formulario, Selector |
| 4 | **Habitación** | `/api/v1/rooms` | 🟡 Media | Lista, Formulario |
| 5 | **Actividad Turística** | `/api/v1/tourist-activities` | 🟡 Media | Lista, Formulario, Selector |
| 6 | **Cuota** | `/api/v1/installments` | 🟡 Media | Lista, Formulario |
| 7 | **Tarjeta Bancaria** | `/api/v1/bank-cards` | 🟡 Media | Lista, Formulario |
| 8 | **Vehículo** | `/api/v1/vehicles` | 🟢 Baja | Lista, Formulario |
| 9 | **Trayecto** | `/api/v1/routes` | 🟢 Baja | Lista, Formulario |
| 10 | **Itinerario Transporte** | `/api/v1/itinerary-transports` | 🟢 Baja | Vista detalle |

### ⚠️ **DECISIONES ARQUITECTÓNICAS:**

- ✅ **Usuario/Roles/Permisos:** Permanecen en MS-SECURITY (NO tocar módulos existentes)
- ✅ **Guía/Administrador:** NO se implementan UI (solo backend los usa internamente)
- ✅ **Servicio Transporte:** Tabla intermedia (no requiere módulo UI separado)
- ✅ **Relaciones Usuario-Cliente:** Se manejan por `document` (cédula) como vínculo

---

## 📋 FASE 1: CONFIGURACIÓN INICIAL (1 hora)

### 1.1 Actualizar Environment Configuration

**Archivo:** `src/environments/environment.ts`

**Cambio:** Añadir URL del backend AdonisJS manteniendo MS-SECURITY

```typescript
export const environment = {
  production: false,
  
  // ✅ MS-SECURITY (Java/Spring Boot) - MANTENER INTACTO
  apiUrl: 'http://127.0.0.1:8080/api',
  authUrl: 'http://127.0.0.1:8080/api/auth',
  securityUrl: 'http://127.0.0.1:8080/api/public/security',
  
  // ✅ NUEVO: Backend AdonisJS para lógica de negocio
  businessApiUrl: 'http://127.0.0.1:3333/api/v1',

  recaptcha: {
    siteKey: '6Lc20OErAAAAAEPsH7g-4R_PjFYT0b1jPRDQGJMA' 
  },

  firebase: {
    apiKey: "AIzaSyC-RCDl-JRigVVGSGhupeEo_5Q-w6lapLY",
    authDomain: "ms--security.firebaseapp.com",
    projectId: "ms--security",
    storageBucket: "ms--security.firebasestorage.app",
    messagingSenderId: "1017318337411",
    appId: "1:1017318337411:web:fc6e8e9b1918073919a4b6",
    measurementId: "G-NG848YBX8C"
  }
};
```

---

### 1.2 Configurar CORS en Backend AdonisJS

**Archivo:** `business-backend/config/cors.ts`

```typescript
import { CorsConfig } from '@ioc:Adonis/Core/Cors'

const corsConfig: CorsConfig = {
  enabled: true,
  
  // ✅ Permitir peticiones desde Angular
  origin: [
    'http://localhost:4200',
    'http://127.0.0.1:4200'
  ],
  
  credentials: true,
  
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  
  headers: true,
  
  exposeHeaders: [
    'cache-control',
    'content-language',
    'content-type',
    'expires',
    'last-modified',
    'pragma',
  ],
  
  maxAge: 90,
}

export default corsConfig
```

---

## 📋 FASE 2: MODELOS DE DATOS (2 horas)

### 2.1 Crear Archivo de Modelos de Negocio

**Archivo:** `src/app/core/models/business.model.ts`

```typescript
// ====================================
// MODELOS DE NEGOCIO - ADONIS BACKEND
// ====================================

/**
 * Cliente de la agencia de viajes
 * Vinculado a Usuario por document (cédula)
 */
export interface Client {
  id: string;
  document: string;      // Cédula (vínculo con Usuario en MS-SECURITY)
  phone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  trips?: Trip[];
  bankCards?: BankCard[];
}

/**
 * Viaje contratado por un cliente
 */
export interface Trip {
  id: number;
  destination: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  price: number;
  capacity: number;
  clientId: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  client?: Client;
  plans?: Plan[];
  installments?: Installment[];
  routes?: Route[];
}

/**
 * Plan turístico (paquete de actividades)
 */
export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;        // Días
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  touristActivities?: TouristActivity[];
  trips?: Trip[];
}

/**
 * Habitación de hotel
 */
export interface Room {
  id: number;
  roomNumber: string;
  type: string;            // 'single' | 'double' | 'suite' | 'family'
  pricePerNight: number;
  capacity: number;
  hasBalcony: boolean;
  hotelId: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  hotel?: Hotel;
}

/**
 * Hotel (para contexto de habitaciones)
 */
export interface Hotel {
  id: number;
  name: string;
  address: string;
  stars: number;
  phone: string;
  administratorId: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  rooms?: Room[];
}

/**
 * Actividad turística dentro de un municipio
 */
export interface TouristActivity {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;        // Horas
  difficulty: string;      // 'easy' | 'medium' | 'hard'
  municipalityId: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  municipality?: Municipality;
  plans?: Plan[];
  guides?: Guide[];
}

/**
 * Municipio donde se realizan actividades
 */
export interface Municipality {
  id: number;
  name: string;
  department: string;
  postalCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  touristActivities?: TouristActivity[];
}

/**
 * Guía turístico (solo para referencia, no UI)
 */
export interface Guide {
  id: string;
  document: string;
  specialization: string;
  isAvailable: boolean;
  experienceYears?: number;
}

/**
 * Cuota de pago de un viaje
 */
export interface Installment {
  id: number;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: string;          // 'pending' | 'paid' | 'overdue'
  tripId: number;
  invoiceId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  trip?: Trip;
  invoice?: Invoice;
}

/**
 * Factura de pago
 */
export interface Invoice {
  id: number;
  totalAmount: number;
  issueDate: Date;
  dueDate: Date;
  status: string;          // 'pending' | 'paid' | 'cancelled'
  administratorId: string;
  bankCardId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  installments?: Installment[];
  bankCard?: BankCard;
}

/**
 * Tarjeta bancaria de cliente
 */
export interface BankCard {
  id: number;
  cardNumber: string;      // Encriptado o últimos 4 dígitos
  cardholderName: string;
  expiryDate: string;      // MM/YY
  cardType: string;        // 'visa' | 'mastercard' | 'amex'
  clientId: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  client?: Client;
  invoices?: Invoice[];
}

/**
 * Vehículo (base para carro/aeronave)
 */
export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  capacity: number;
  type: string;            // 'car' | 'aircraft'
  status: string;          // 'available' | 'in_use' | 'maintenance'
  gpsId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  gps?: GPS;
  routes?: Route[];
}

/**
 * GPS del vehículo
 */
export interface GPS {
  id: number;
  serialNumber: string;
  brand: string;
  model: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  vehicle?: Vehicle;
}

/**
 * Trayecto (ruta de transporte)
 */
export interface Route {
  id: number;
  origin: string;
  destination: string;
  distance: number;        // Km
  estimatedDuration: number; // Minutos
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  vehicles?: Vehicle[];
  trips?: Trip[];
  itineraries?: ItineraryTransport[];
}

/**
 * Itinerario de transporte (tabla intermedia vehículo-trayecto)
 */
export interface ItineraryTransport {
  id: number;
  departureTime: Date;
  arrivalTime: Date;
  sequence: number;        // Orden en el itinerario
  vehicleId: number;
  routeId: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  vehicle?: Vehicle;
  route?: Route;
}

/**
 * Servicio de transporte (tabla intermedia trayecto-viaje)
 * No requiere UI separada, se gestiona desde Trip o Route
 */
export interface TransportService {
  id: number;
  startDate: Date;
  endDate: Date;
  flightNumber?: string;   // Para vuelos
  cost: number;
  tripId: number;
  routeId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ====================================
// DTOs PARA FORMULARIOS
// ====================================

export interface ClientCreateDto {
  document: string;
  phone: string;
  address: string;
}

export interface TripCreateDto {
  destination: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  price: number;
  capacity: number;
  clientId: string;
  planIds?: number[];      // IDs de planes a asociar
}

export interface PlanCreateDto {
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  touristActivityIds?: number[];
}

export interface RoomCreateDto {
  roomNumber: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  hasBalcony: boolean;
  hotelId: number;
}

export interface BankCardCreateDto {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cardType: string;
  clientId: string;
}

// ====================================
// RESPUESTAS DE API
// ====================================

export interface ApiResponse<T> {
  meta: {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
  data: T;
}

export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
}
```

---

## 📋 FASE 3: SERVICIOS HTTP (3-4 horas)

### 3.1 Crear Servicios para cada Entidad

**Comando PowerShell:**
```powershell
cd "c:\Users\USER\Desktop\Backend\Proyectico Frontend"

# Crear todos los servicios
ng generate service core/services/client --skip-tests
ng generate service core/services/trip --skip-tests
ng generate service core/services/plan --skip-tests
ng generate service core/services/room --skip-tests
ng generate service core/services/tourist-activity --skip-tests
ng generate service core/services/installment --skip-tests
ng generate service core/services/bank-card --skip-tests
ng generate service core/services/vehicle --skip-tests
ng generate service core/services/route --skip-tests
ng generate service core/services/itinerary-transport --skip-tests
ng generate service core/services/municipality --skip-tests
```

---

### 3.2 Implementación de Servicios

#### **ClientService** (Ejemplo completo)

**Archivo:** `src/app/core/services/client.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientCreateDto, ApiResponse } from '../models/business.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.businessApiUrl}/clients`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los clientes (con paginación)
   */
  getAll(page: number = 1, perPage: number = 10): Observable<ApiResponse<Client[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    
    return this.http.get<ApiResponse<Client[]>>(this.apiUrl, { params });
  }

  /**
   * Obtener cliente por ID
   */
  getById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar cliente por documento (cédula)
   */
  getByDocument(document: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/document/${document}`);
  }

  /**
   * Crear nuevo cliente
   */
  create(client: ClientCreateDto): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  /**
   * Actualizar cliente existente
   */
  update(id: string, client: Partial<ClientCreateDto>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  /**
   * Eliminar cliente
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener viajes de un cliente
   */
  getTrips(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/trips`);
  }

  /**
   * Obtener tarjetas bancarias de un cliente
   */
  getBankCards(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/bank-cards`);
  }
}
```

---

#### **TripService** (Ejemplo completo)

**Archivo:** `src/app/core/services/trip.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Trip, TripCreateDto, ApiResponse } from '../models/business.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = `${environment.businessApiUrl}/trips`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, perPage: number = 10): Observable<ApiResponse<Trip[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    
    return this.http.get<ApiResponse<Trip[]>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  create(trip: TripCreateDto): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  update(id: number, trip: Partial<TripCreateDto>): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, trip);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Asociar plan a viaje
   */
  addPlan(tripId: number, planId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${tripId}/plans/${planId}`, {});
  }

  /**
   * Obtener planes asociados al viaje
   */
  getPlans(tripId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${tripId}/plans`);
  }

  /**
   * Obtener trayectos del viaje
   */
  getRoutes(tripId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${tripId}/routes`);
  }
}
```

---

#### **PlanService**

**Archivo:** `src/app/core/services/plan.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Plan, PlanCreateDto, ApiResponse } from '../models/business.model';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = `${environment.businessApiUrl}/plans`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, perPage: number = 10): Observable<ApiResponse<Plan[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    
    return this.http.get<ApiResponse<Plan[]>>(this.apiUrl, { params });
  }

  getActive(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.apiUrl}/active`);
  }

  getById(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.apiUrl}/${id}`);
  }

  create(plan: PlanCreateDto): Observable<Plan> {
    return this.http.post<Plan>(this.apiUrl, plan);
  }

  update(id: number, plan: Partial<PlanCreateDto>): Observable<Plan> {
    return this.http.put<Plan>(`${this.apiUrl}/${id}`, plan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTouristActivities(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/tourist-activities`);
  }
}
```

---

### 3.3 Servicios Restantes (Templates básicos)

**RoomService, TouristActivityService, InstallmentService, BankCardService, VehicleService, RouteService, ItineraryTransportService**

Todos siguen el mismo patrón:
- `getAll()` con paginación
- `getById()`
- `create()`
- `update()`
- `delete()`
- Métodos específicos de relaciones

---

## 📋 FASE 4: MÓDULOS Y COMPONENTES UI (5-7 días)

### 4.1 Estructura de Módulos

```
src/app/features/business/
├── clients/
│   ├── clients.module.ts
│   ├── clients-routing.module.ts
│   ├── client-list/
│   │   ├── client-list.component.ts
│   │   ├── client-list.component.html
│   │   └── client-list.component.scss
│   ├── client-form/
│   │   ├── client-form.component.ts
│   │   ├── client-form.component.html
│   │   └── client-form.component.scss
│   └── client-detail/
│       ├── client-detail.component.ts
│       ├── client-detail.component.html
│       └── client-detail.component.scss
├── trips/
│   ├── trips.module.ts
│   ├── trips-routing.module.ts
│   ├── trip-list/
│   ├── trip-form/
│   └── trip-detail/
├── plans/
│   ├── plans.module.ts
│   ├── plans-routing.module.ts
│   ├── plan-list/
│   └── plan-form/
├── rooms/
│   ├── rooms.module.ts
│   ├── rooms-routing.module.ts
│   ├── room-list/
│   └── room-form/
├── activities/
│   ├── activities.module.ts
│   ├── activities-routing.module.ts
│   ├── activity-list/
│   └── activity-form/
├── installments/
│   ├── installments.module.ts
│   ├── installments-routing.module.ts
│   └── installment-list/
├── bank-cards/
│   ├── bank-cards.module.ts
│   ├── bank-cards-routing.module.ts
│   ├── bank-card-list/
│   └── bank-card-form/
├── vehicles/
│   ├── vehicles.module.ts
│   ├── vehicles-routing.module.ts
│   ├── vehicle-list/
│   └── vehicle-form/
└── routes/
    ├── routes.module.ts
    ├── routes-routing.module.ts
    ├── route-list/
    └── route-form/
```

---

### 4.2 Comandos de Generación

```powershell
cd "c:\Users\USER\Desktop\Backend\Proyectico Frontend"

# ========== CLIENTES ==========
ng generate module features/business/clients --routing
ng generate component features/business/clients/client-list
ng generate component features/business/clients/client-form
ng generate component features/business/clients/client-detail

# ========== VIAJES ==========
ng generate module features/business/trips --routing
ng generate component features/business/trips/trip-list
ng generate component features/business/trips/trip-form
ng generate component features/business/trips/trip-detail

# ========== PLANES ==========
ng generate module features/business/plans --routing
ng generate component features/business/plans/plan-list
ng generate component features/business/plans/plan-form

# ========== HABITACIONES ==========
ng generate module features/business/rooms --routing
ng generate component features/business/rooms/room-list
ng generate component features/business/rooms/room-form

# ========== ACTIVIDADES TURÍSTICAS ==========
ng generate module features/business/activities --routing
ng generate component features/business/activities/activity-list
ng generate component features/business/activities/activity-form

# ========== CUOTAS ==========
ng generate module features/business/installments --routing
ng generate component features/business/installments/installment-list

# ========== TARJETAS BANCARIAS ==========
ng generate module features/business/bank-cards --routing
ng generate component features/business/bank-cards/bank-card-list
ng generate component features/business/bank-cards/bank-card-form

# ========== VEHÍCULOS ==========
ng generate module features/business/vehicles --routing
ng generate component features/business/vehicles/vehicle-list
ng generate component features/business/vehicles/vehicle-form

# ========== TRAYECTOS ==========
ng generate module features/business/routes --routing
ng generate component features/business/routes/route-list
ng generate component features/business/routes/route-form
```

---

### 4.3 Ejemplo de Componente: ClientListComponent

**Archivo:** `client-list.component.ts`

```typescript
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/business.model';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'document', 'phone', 'address', 'actions'];
  dataSource: MatTableDataSource<Client>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  isLoading = false;
  totalClients = 0;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Client>([]);
  }

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getAll().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalClients = response.meta.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewClient(client: Client): void {
    this.router.navigate(['/clients', client.id]);
  }

  editClient(client: Client): void {
    this.router.navigate(['/clients/edit', client.id]);
  }

  deleteClient(client: Client): void {
    if (confirm(`¿Eliminar cliente ${client.document}?`)) {
      this.clientService.delete(client.id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error) => {
          console.error('Error deleting client:', error);
        }
      });
    }
  }

  addClient(): void {
    this.router.navigate(['/clients/new']);
  }
}
```

**Archivo:** `client-list.component.html`

```html
<div class="container">
  <div class="header">
    <h1>Clientes</h1>
    <button mat-raised-button color="primary" (click)="addClient()">
      <mat-icon>add</mat-icon>
      Nuevo Cliente
    </button>
  </div>

  <mat-form-field class="filter">
    <mat-label>Buscar</mat-label>
    <input matInput (keyup)="applyFilter($event)" placeholder="Documento, teléfono...">
    <mat-icon matSuffix>search</mat-icon>
  </mat-form-field>

  <div class="table-container">
    <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z2">
      
      <!-- ID Column -->
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
        <td mat-cell *matCellDef="let client"> {{client.id}} </td>
      </ng-container>

      <!-- Document Column -->
      <ng-container matColumnDef="document">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Documento </th>
        <td mat-cell *matCellDef="let client"> {{client.document}} </td>
      </ng-container>

      <!-- Phone Column -->
      <ng-container matColumnDef="phone">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Teléfono </th>
        <td mat-cell *matCellDef="let client"> {{client.phone}} </td>
      </ng-container>

      <!-- Address Column -->
      <ng-container matColumnDef="address">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Dirección </th>
        <td mat-cell *matCellDef="let client"> {{client.address}} </td>
      </ng-container>

      <!-- Actions Column -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Acciones </th>
        <td mat-cell *matCellDef="let client">
          <button mat-icon-button color="primary" (click)="viewClient(client)" matTooltip="Ver detalle">
            <mat-icon>visibility</mat-icon>
          </button>
          <button mat-icon-button color="accent" (click)="editClient(client)" matTooltip="Editar">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteClient(client)" matTooltip="Eliminar">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      
      <!-- Row shown when there is no matching data -->
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="5">
          <div class="no-data" *ngIf="!isLoading">
            No se encontraron clientes.
          </div>
          <div class="loading" *ngIf="isLoading">
            <mat-spinner diameter="50"></mat-spinner>
            Cargando...
          </div>
        </td>
      </tr>
    </table>

    <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" 
                   [pageSize]="10"
                   [length]="totalClients"
                   showFirstLastButtons>
    </mat-paginator>
  </div>
</div>
```

---

## 📋 FASE 5: ROUTING (1 hora)

### 5.1 Actualizar App Routing

**Archivo:** `src/app/app-routing.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  // Auth routes (existentes)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  
  // Main application routes
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      
      // ========================================
      // MÓDULOS DE MS-SECURITY (MANTENER INTACTOS)
      // ========================================
      {
        path: 'users',
        loadChildren: () => import('./features/user-management/user-management.module').then(m => m.UserManagementModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'roles',
        loadChildren: () => import('./features/roles/roles.module').then(m => m.RolesModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'permissions',
        loadChildren: () => import('./features/permissions/permissions.module').then(m => m.PermissionsModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      
      // ========================================
      // NUEVOS MÓDULOS DE NEGOCIO (ADONIS BACKEND)
      // ========================================
      {
        path: 'clients',
        loadChildren: () => import('./features/business/clients/clients.module').then(m => m.ClientsModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER', 'AGENT'] }
      },
      {
        path: 'trips',
        loadChildren: () => import('./features/business/trips/trips.module').then(m => m.TripsModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER', 'AGENT'] }
      },
      {
        path: 'plans',
        loadChildren: () => import('./features/business/plans/plans.module').then(m => m.PlansModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'rooms',
        loadChildren: () => import('./features/business/rooms/rooms.module').then(m => m.RoomsModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'activities',
        loadChildren: () => import('./features/business/activities/activities.module').then(m => m.ActivitiesModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'installments',
        loadChildren: () => import('./features/business/installments/installments.module').then(m => m.InstallmentsModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER', 'FINANCE'] }
      },
      {
        path: 'bank-cards',
        loadChildren: () => import('./features/business/bank-cards/bank-cards.module').then(m => m.BankCardsModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER', 'AGENT'] }
      },
      {
        path: 'vehicles',
        loadChildren: () => import('./features/business/vehicles/vehicles.module').then(m => m.VehiclesModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER', 'LOGISTICS'] }
      },
      {
        path: 'routes',
        loadChildren: () => import('./features/business/routes/routes.module').then(m => m.RoutesModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER', 'LOGISTICS'] }
      },
      
      // Redirect
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  
  // Wildcard route
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

---

## 📋 FASE 6: ACTUALIZAR SIDEBAR (1 hora)

### 6.1 Añadir Nuevas Opciones de Menú

**Archivo:** `src/app/shared/layout/sidebar/sidebar.component.ts` (o similar)

```typescript
export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  roles?: string[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard'
  },
  
  // ========================================
  // ADMINISTRACIÓN (MS-SECURITY)
  // ========================================
  {
    label: 'Administración',
    icon: 'admin_panel_settings',
    children: [
      {
        label: 'Usuarios',
        icon: 'people',
        route: '/users',
        roles: ['ADMIN', 'MANAGER']
      },
      {
        label: 'Roles',
        icon: 'verified_user',
        route: '/roles',
        roles: ['ADMIN']
      },
      {
        label: 'Permisos',
        icon: 'lock',
        route: '/permissions',
        roles: ['ADMIN']
      }
    ]
  },
  
  // ========================================
  // GESTIÓN DE NEGOCIO (ADONIS)
  // ========================================
  {
    label: 'Clientes y Viajes',
    icon: 'flight_takeoff',
    children: [
      {
        label: 'Clientes',
        icon: 'person',
        route: '/clients',
        roles: ['ADMIN', 'MANAGER', 'AGENT']
      },
      {
        label: 'Viajes',
        icon: 'luggage',
        route: '/trips',
        roles: ['ADMIN', 'MANAGER', 'AGENT']
      },
      {
        label: 'Planes Turísticos',
        icon: 'map',
        route: '/plans',
        roles: ['ADMIN', 'MANAGER']
      },
      {
        label: 'Actividades',
        icon: 'local_activity',
        route: '/activities',
        roles: ['ADMIN', 'MANAGER']
      }
    ]
  },
  
  {
    label: 'Alojamiento',
    icon: 'hotel',
    children: [
      {
        label: 'Habitaciones',
        icon: 'meeting_room',
        route: '/rooms',
        roles: ['ADMIN', 'MANAGER']
      }
    ]
  },
  
  {
    label: 'Transporte',
    icon: 'directions_car',
    children: [
      {
        label: 'Vehículos',
        icon: 'directions_bus',
        route: '/vehicles',
        roles: ['ADMIN', 'MANAGER', 'LOGISTICS']
      },
      {
        label: 'Trayectos',
        icon: 'alt_route',
        route: '/routes',
        roles: ['ADMIN', 'MANAGER', 'LOGISTICS']
      }
    ]
  },
  
  {
    label: 'Finanzas',
    icon: 'account_balance',
    children: [
      {
        label: 'Cuotas',
        icon: 'payment',
        route: '/installments',
        roles: ['ADMIN', 'MANAGER', 'FINANCE']
      },
      {
        label: 'Tarjetas',
        icon: 'credit_card',
        route: '/bank-cards',
        roles: ['ADMIN', 'MANAGER', 'AGENT']
      }
    ]
  }
];
```

---

## 📋 FASE 7: TESTING (2-3 días)

### 7.1 Checklist de Pruebas

```
[ ] Backend AdonisJS corriendo en puerto 3333
[ ] MS-SECURITY corriendo en puerto 8080
[ ] Frontend Angular corriendo en puerto 4200
[ ] CORS configurado correctamente
[ ] Tokens JWT se envían correctamente
[ ] Login funciona (MS-SECURITY)
[ ] Dashboard carga correctamente

Módulo Clientes:
[ ] Listar clientes desde Adonis
[ ] Crear nuevo cliente
[ ] Editar cliente existente
[ ] Eliminar cliente
[ ] Ver detalle con viajes asociados

Módulo Viajes:
[ ] Listar viajes desde Adonis
[ ] Crear nuevo viaje
[ ] Asociar cliente a viaje
[ ] Asociar planes a viaje
[ ] Ver itinerario de transporte

Módulo Planes:
[ ] Listar planes turísticos
[ ] Crear nuevo plan
[ ] Asociar actividades turísticas
[ ] Activar/desactivar plan

Módulo Habitaciones:
[ ] Listar habitaciones por hotel
[ ] Crear nueva habitación
[ ] Editar habitación existente

Módulo Actividades:
[ ] Listar actividades por municipio
[ ] Crear nueva actividad
[ ] Asignar guía (backend)

Módulo Cuotas:
[ ] Listar cuotas de un viaje
[ ] Registrar pago de cuota
[ ] Ver estado de factura

Módulo Tarjetas:
[ ] Listar tarjetas de cliente
[ ] Registrar nueva tarjeta (encriptada)
[ ] Eliminar tarjeta

Módulo Vehículos:
[ ] Listar vehículos disponibles
[ ] Crear nuevo vehículo
[ ] Asociar GPS
[ ] Ver trayectos asignados

Módulo Trayectos:
[ ] Listar trayectos
[ ] Crear nueva ruta
[ ] Asociar vehículos
[ ] Ver itinerario completo
```

---

## 🚀 COMANDOS DE INICIO

```powershell
# Terminal 1: MS-SECURITY (Java)
cd ms-security
./mvnw spring-boot:run
# O: java -jar target/ms-security-0.0.1-SNAPSHOT.jar

# Terminal 2: Backend AdonisJS
cd business-backend
node ace serve --watch

# Terminal 3: Frontend Angular
cd "Proyectico Frontend"
ng serve

# Abrir navegador: http://localhost:4200
```

---

## 📊 CRONOGRAMA ESTIMADO

| Fase | Duración | Tareas |
|------|----------|--------|
| **Fase 1: Configuración** | 1 hora | Environment.ts, CORS |
| **Fase 2: Modelos** | 2 horas | business.model.ts completo |
| **Fase 3: Servicios** | 3-4 horas | 10 servicios HTTP |
| **Fase 4: Componentes UI** | 5-7 días | 25+ componentes |
| **Fase 5: Routing** | 1 hora | App routing, lazy loading |
| **Fase 6: Sidebar** | 1 hora | Menú de navegación |
| **Fase 7: Testing** | 2-3 días | Pruebas exhaustivas |
| **TOTAL** | **8-12 días** | Integración completa |

---

## ✅ CONCLUSIÓN

Este plan cubre la integración completa de las 10 entidades seleccionadas del backend AdonisJS en el frontend Angular, manteniendo intacto el sistema de autenticación y permisos de MS-SECURITY.

**Ventajas de esta arquitectura:**
- ✅ Sin duplicación de funcionalidad (auth en MS-SECURITY, negocio en Adonis)
- ✅ Separación de responsabilidades clara
- ✅ Escalabilidad independiente de cada backend
- ✅ Módulos de frontend aislados (fácil mantenimiento)

**Próximo paso:** ¿Quieres que comience con la implementación automática (actualizar environment.ts y crear servicios)?

---

**Documento generado por:** GitHub Copilot  
**Fecha:** 18 de Noviembre de 2025

### 1.1 Actualizar Environment Configuration

<function_calls>
<invoke name="read_file">
<parameter name="filePath">c:\Users\USER\Desktop\Backend\Proyectico Frontend\src\environments\environment.ts