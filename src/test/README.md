# Test Utilities

This directory contains test utilities, helpers, and configurations.

## Structure

- **setup.ts**: Global test setup (runs before all tests)
- **helpers/**: Test helper functions
- **factories/**: Test data factories (for creating test entities)
- **mocks/**: Mock implementations of repositories and services

## Testing Strategy

### Unit Tests

- Domain layer: Test entities, value objects, state machine
- Application layer: Test use cases with mocked repositories
- Pure functions and utilities

### Integration Tests

- Test repositories with real database (test database)
- Test complete flows through multiple layers

### E2E Tests

- Use Playwright for end-to-end testing
- Test complete user workflows
- Located in `/e2e` directory (root level)

## Coverage Goals

- Domain Layer: 100%
- Application Layer: 100%
- Infrastructure Layer: 90%
- Presentation Layer: 80%
- Overall: >85%
