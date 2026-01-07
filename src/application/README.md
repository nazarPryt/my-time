# Application Layer

**Use Cases - Application-Specific Business Rules**

This layer orchestrates domain objects to perform specific application tasks. It depends only on the domain layer.

## Structure

- **use-cases/**: Application use cases (StartWorkUseCase, PauseTimerUseCase, etc.)
- **dto/**: Data Transfer Objects for communication between layers

## Principles

- Depends only on domain layer
- Orchestrates domain entities and services
- Defines application-specific workflows
- Independent of UI and database
- 100% unit testable with mocked repositories

## Example Use Cases

- StartWorkUseCase
- PauseTimerUseCase
- CompleteSessionUseCase
- GetDailyReportUseCase
- UpdateSettingsUseCase
