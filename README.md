# Contact Manager – Angular

Aplicación CRUD desarrollada con Angular 17+, utilizando Standalone Components y Signals para la gestión de estado reactiva.
Se integra con una API REST construida en Laravel.

## Funcionalidades

### Crear contacto

### Editar contacto

### Eliminar contacto (individual y múltiple)

### Búsqueda en tiempo real

### Formularios reactivos con validaciones

### Confirmaciones antes de eliminar

## Arquitectura

El proyecto implementa una separación clara de responsabilidades:

Component (UI)
   ↓
Manager (State Container con Signals)
   ↓
Service (HTTP Layer)
🔹 Service

Encargado exclusivamente de las peticiones HTTP.

🔹 Manager

Administra el estado global usando signal() y computed().

🔹 Component

Controla la interacción del usuario y la presentación.

Esto permite:

Estado centralizado

Mutaciones inmutables

Componentes desacoplados

Mayor escalabilidad

## Tecnologías Utilizadas

Angular 17+

Angular Signals

Standalone Components

Reactive Forms

PrimeNG

RxJS

TypeScript

Laravel (API REST)

## Estructura del Proyecto
src/
 ├── contactos/
 │    ├── contactos.component.ts
 │    ├── contacto-manager.ts
 │    ├── contacto.service.ts
 │    └── form-contactos.component.ts
🔌 Endpoints Consumidos

GET /contactos

POST /contactos

PUT /contactos/{id}

DELETE /contactos/{id}

Eliminación múltiple personalizada

## Enfoque Técnico

Gestión de estado moderna con Angular Signals

Reutilización de formulario para crear y editar

Manejo correcto de fechas (Angular ↔ MySQL)

Eliminación múltiple optimizada

Confirmaciones con PrimeNG

## Autor

Julian Alvarez Valencia
Frontend & Backend Developer (Angular + Laravel)
