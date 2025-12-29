# Code Style and Conventions

## TypeScript Configuration

The project uses strict TypeScript settings defined in `tsconfig.app.json`:

- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx (new JSX transform - no need to import React in every file)
- **Strict Mode**: Enabled
- **No Unused Locals**: Enabled
- **No Unused Parameters**: Enabled
- **No Fallthrough Cases in Switch**: Enabled

## React Conventions

Based on the existing code (`src/App.tsx`):

- **Component Style**: Functional components (not class components)
- **State Management**: React Hooks (useState, useEffect, etc.)
- **Naming**: PascalCase for components (e.g., `App`, `MyComponent`)
- **File Extensions**: `.tsx` for React components, `.ts` for utilities
- **Exports**: Default exports for components

## ESLint Rules

Configured in `eslint.config.js`:

- **Base**: JavaScript recommended rules
- **TypeScript**: typescript-eslint recommended config
- **React Hooks**: eslint-plugin-react-hooks (ensures correct hooks usage)
- **React Refresh**: eslint-plugin-react-refresh (for Vite HMR)
- **Target Files**: `**/*.{ts,tsx}`
- **ECMAScript Version**: 2020
- **Environment**: Browser globals
- **Ignored Paths**: `dist/` directory

## General Conventions

- Use modern ES6+ features
- Prefer const/let over var
- Use arrow functions where appropriate
- Follow React Hooks rules (rules of hooks)
- No unused variables or parameters allowed
