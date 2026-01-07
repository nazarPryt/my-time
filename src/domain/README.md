# Domain Layer

**Pure Business Logic - No External Dependencies**

This layer contains the core business logic of the Pomodoro application. It has zero dependencies on frameworks, databases, or UI.

## Structure

- **entities/**: Domain entities (Session, UserSettings, DailyReport, etc.)
- **value-objects/**: Immutable value objects (Duration, SessionType, SessionStatus)
- **services/**: Domain services (TimerStateMachine, SessionCalculator)
- **interfaces/**: Repository interfaces that outer layers must implement

## Principles

- No framework dependencies
- No database dependencies
- No UI dependencies
- Pure TypeScript/JavaScript
- 100% unit testable
- Contains business rules and validation logic

## Dependencies

This layer should ONLY depend on:

- TypeScript standard library
- Zod (for schema validation)
- No other dependencies allowed
