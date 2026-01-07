# Infrastructure Layer

**External Systems - Implementation of Domain Interfaces**

This layer implements the interfaces defined by the domain layer and handles communication with external systems.

## Structure

- **database/**: PostgreSQL repositories, migrations, and schemas
  - **repositories/**: Concrete implementations of repository interfaces
  - **migrations/**: Drizzle migrations
  - **schemas/**: Drizzle table schemas
- **storage/**: Chrome storage adapters
- **timer/**: Timer engine (Web Worker implementation)

## Principles

- Implements domain interfaces
- Handles external dependencies (database, storage, workers)
- Framework-specific code lives here
- Integration tested with real dependencies

## Technologies

- Drizzle ORM for database access
- PostgreSQL for data persistence
- Chrome Storage API
- Web Workers for timer
