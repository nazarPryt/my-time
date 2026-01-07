# Presentation Layer

**UI Components - React Components and State Management**

This layer handles all UI-related code, including React components, hooks, and Zustand store configuration.

## Structure

- **components/**: React UI components
- **hooks/**: Custom React hooks
- **pages/**: Page-level components
- **store/**: Zustand store slices and configuration

## Principles

- Depends on application layer (use cases)
- Uses Zustand for state management
- React components are presentational
- Business logic stays in domain/application layers

## State Management

Uses Zustand with multiple slices:

- TimerSlice
- SessionHistorySlice
- ReportsSlice
- SettingsSlice
- SyncSlice
