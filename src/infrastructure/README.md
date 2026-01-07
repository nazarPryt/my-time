# Infrastructure Layer

**External Systems - Implementation of Domain Interfaces**

This layer implements the interfaces defined by the domain layer and handles communication with external systems.

## Structure

### Database (`database/`)

PostgreSQL persistence layer using Drizzle ORM.

- **connection.ts**: Database connection pool configuration
- **schemas/**: Drizzle table schemas
  - `sessions.schema.ts`: Sessions and enums
  - `daily-aggregates.schema.ts`: Pre-computed daily statistics
  - `user-settings.schema.ts`: User preferences
- **repositories/**: Concrete implementations of repository interfaces
  - `PostgreSQLSessionRepository.ts`: Session CRUD operations
  - `PostgreSQLSettingsRepository.ts`: Settings management
  - **report/**: Report generation (split by responsibility)
    - `DailyReportGenerator.ts`: Daily statistics calculation
    - `WeeklyReportGenerator.ts`: Weekly aggregation
    - `MonthlyReportGenerator.ts`: Monthly aggregation
    - `DailyAggregateService.ts`: Caching layer
    - `PostgreSQLReportRepository.ts`: Report orchestration
- **migrations/**: Drizzle migration files (auto-generated)

### Storage (`storage/`)

Chrome extension storage layer for offline support.

- **ChromeStorageAdapter.ts**: Wrapper for chrome.storage.local API
  - Quota management
  - Data validation with Zod
  - Version migration support
  - Export/import functionality

### Timer (`timer/`)

Timestamp-based timer engine with Web Worker support.

- **TimerWorker.ts**: Web Worker for accurate timing
- **TimerService.ts**: Timer state management
  - Timestamp-based calculations (prevents drift)
  - Pause/resume support
  - Event-based architecture
  - Fallback to main thread if worker fails

## Implementation Details

### Database Repositories

All repositories:

- Implement domain interfaces from `@/domain/interfaces`
- Use Zod schemas for runtime validation
- Handle database errors gracefully
- Return domain entities, not raw database rows

**Session Repository**:

- CRUD operations for sessions
- Date range queries
- Tag-based filtering
- Status and type counting

**Settings Repository**:

- Auto-creates default settings on first access
- Partial updates supported
- Reset to defaults functionality

**Report Repository**:

- Generates reports from session data
- Caches daily aggregates for performance
- Supports daily, weekly, and monthly views
- Calculates advanced metrics (focus score, consistency, trends)

### Storage Adapter

The ChromeStorageAdapter provides:

- Type-safe storage operations
- Automatic quota management
- Corrupted data recovery
- Storage usage monitoring
- Version migration support

### Timer Service

The TimerService implements:

- **Timestamp-based calculations**: Prevents drift even with irregular ticks
- **Web Worker support**: Runs in background thread for accuracy
- **Pause handling**: Correctly tracks paused duration
- **Event system**: Observable pattern for state changes
- **Automatic completion**: Triggers complete event when timer expires

## Database Setup

See [DATABASE_SETUP.md](../../../DATABASE_SETUP.md) for detailed instructions on:

- Creating a Supabase project
- Configuring environment variables
- Running migrations
- Verifying setup

## Principles

- Implements domain interfaces (Dependency Inversion)
- Handles external dependencies (database, storage, workers)
- Framework-specific code lives here
- Single Responsibility - each file has one clear purpose
- Integration tested with real dependencies

## Technologies

- **Drizzle ORM** for type-safe database access
- **PostgreSQL** via Supabase for data persistence
- **Chrome Storage API** for offline support
- **Web Workers** for accurate timer
- **Zod** for runtime validation
- **date-fns** for date manipulation
