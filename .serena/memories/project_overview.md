# Project Overview

## Purpose

A minimal React + TypeScript + Vite template for building modern web applications with Hot Module Replacement (HMR). This is a starter template that provides a clean foundation for React development.

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Linter**: ESLint 9.39.1
- **Package Manager**: Bun (bun.lock present)

## Project Structure

```
my-time/
├── src/                    # Source code
│   ├── main.tsx           # Application entry point
│   ├── App.tsx            # Main App component
│   ├── App.css            # App styles
│   ├── index.css          # Global styles
│   └── assets/            # Static assets (images, icons, etc.)
├── public/                # Public static files
├── dist/                  # Build output (generated, gitignored)
├── node_modules/          # Dependencies
├── package.json           # Project metadata and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript project references
├── tsconfig.app.json      # App TypeScript config
├── tsconfig.node.json     # Node TypeScript config
├── eslint.config.js       # ESLint configuration
└── index.html             # HTML entry point
```

## Key Features

- Hot Module Replacement (HMR) for fast development
- TypeScript strict mode enabled
- Modern React with hooks
- Vite for fast builds and development server
- ESLint with React-specific rules
