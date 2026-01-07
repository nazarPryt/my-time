# Pomodoro Timer - Implementation TODO

**Reference:** See `Plan4.md` for detailed architectural specifications

---

## 🎯 Overall Progress Tracker

- [x] **Step 1:** Foundation Setup ✅ COMPLETED
- [ ] **Step 2:** Domain Layer 👈 NEXT
- [ ] **Step 3:** Infrastructure Layer
- [ ] **Step 4:** Application Layer
- [ ] **Step 5:** Basic Timer UI
- [ ] **Step 6:** Chrome Extension Setup
- [ ] **Step 7:** Reporting System
- [ ] **Step 8:** Polish & Optimization
- [ ] **Step 9:** Testing & Production Ready

---

## Step 1: Foundation Setup 🔧

### 1.1 Dependencies Installation ✅

- [x] Install Zustand for state management
- [x] Install Zod for validation
- [x] Install PostgreSQL client (pg)
- [x] Install Drizzle ORM (used instead of Kysely)
- [x] Install Vitest for testing
- [x] Install React Testing Library
- [x] Install date-fns for date handling
- [x] Verify all dependencies in package.json

### 1.2 Folder Structure (Clean Architecture)

Create the following folder structure:

```
src/
├── domain/              # Core business logic (no dependencies)
│   ├── entities/        # Domain entities
│   ├── value-objects/   # Value objects
│   ├── services/        # Domain services
│   └── interfaces/      # Repository interfaces
├── application/         # Use cases (depends on domain)
│   ├── use-cases/       # Application use cases
│   └── dto/             # Data transfer objects
├── infrastructure/      # External systems (implements domain interfaces)
│   ├── database/        # Database repositories
│   │   ├── repositories/
│   │   ├── migrations/
│   │   └── connection.ts
│   ├── storage/         # Chrome storage adapters
│   └── timer/           # Timer engine (Web Worker)
├── presentation/        # UI layer (React components)
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page components
│   └── store/           # Zustand store configuration
├── shared/              # Shared utilities
│   ├── schemas/         # Zod schemas
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── constants/       # Constants
└── extension/           # Chrome extension specific
    ├── background/      # Service worker
    ├── popup/           # Popup entry
    └── options/         # Options page entry
```

- [x] Create all directories
- [x] Add index.ts files where needed
- [x] Create README.md in each layer explaining its purpose

### 1.3 TypeScript Configuration ✅

- [x] Enable strict mode in tsconfig.json
- [x] Add path aliases for clean imports (`@domain`, `@app`, `@infra`, etc.)
- [x] Configure separate tsconfig for tests (Vitest browser mode)

### 1.4 Testing Setup ✅

- [x] Configure Vitest (vitest.config.ts)
- [x] Set up test utilities
- [x] Configure coverage thresholds (>85%)
- [x] Create test helpers and factories directories
- [x] Set up Playwright for E2E tests

### 1.5 Development Tools ✅

- [x] ESLint already configured
- [x] Prettier already configured
- [x] Husky pre-commit hooks already set up
- [x] Add useful npm scripts (test, test:watch, test:coverage, test:e2e)

---

## Step 2: Domain Layer 🧠

### 2.1 Zod Schemas (src/shared/schemas/)

- [ ] Create `SessionTypeSchema` (work, short_break, long_break)
- [ ] Create `SessionStatusSchema` (completed, abandoned, interrupted)
- [ ] Create `SessionSchema` with all fields
- [ ] Create `UserSettingsSchema`
- [ ] Create `DailyReportSchema`
- [ ] Create `WeeklyReportSchema`
- [ ] Create `MonthlyReportSchema`
- [ ] Infer TypeScript types from schemas

### 2.2 Domain Entities (src/domain/entities/)

- [ ] Create `Session` entity
- [ ] Create `UserSettings` entity
- [ ] Create `DailyReport` entity
- [ ] Add entity methods (calculateRemainingTime, etc.)
- [ ] Write unit tests for entities

### 2.3 Value Objects (src/domain/value-objects/)

- [ ] Create `Duration` value object
- [ ] Create `SessionType` value object
- [ ] Create `SessionStatus` value object
- [ ] Ensure immutability
- [ ] Write unit tests for value objects

### 2.4 State Machine (src/domain/services/)

- [ ] Define all timer states (IDLE, WORK_ACTIVE, WORK_PAUSED, etc.)
- [ ] Define all events/commands
- [ ] Create transition map
- [ ] Implement guard conditions
- [ ] Implement side effects (onEnter, onExit)
- [ ] Write comprehensive state machine tests
- [ ] Test all valid transitions
- [ ] Test all invalid transitions (should error)

### 2.5 Repository Interfaces (src/domain/interfaces/)

- [ ] Create `ISessionRepository` interface
- [ ] Create `IReportRepository` interface
- [ ] Create `ISettingsRepository` interface
- [ ] Document method signatures and contracts

---

## Step 3: Infrastructure Layer 💾

### 3.1 Database Setup

- [ ] Create PostgreSQL database schema (see Plan4.md)
- [ ] Set up connection pooling with pg
- [ ] Configure Kysely for query building
- [ ] Create migration system

### 3.2 Database Migrations (src/infrastructure/database/migrations/)

- [ ] Migration: Create `sessions` table
- [ ] Migration: Create `daily_aggregates` table
- [ ] Migration: Create `user_settings` table
- [ ] Migration: Add indexes
- [ ] Migration: Add constraints and triggers
- [ ] Test migrations (up and down)

### 3.3 Repository Implementations (src/infrastructure/database/repositories/)

- [ ] Implement `PostgreSQLSessionRepository`
  - [ ] save() method
  - [ ] update() method
  - [ ] findById() method
  - [ ] findByUserAndDate() method
  - [ ] findByUserAndDateRange() method
  - [ ] delete() method
- [ ] Implement `PostgreSQLReportRepository`
  - [ ] getDailyReport() method
  - [ ] getWeeklyReport() method
  - [ ] getMonthlyReport() method
  - [ ] regenerateDailyAggregate() method
- [ ] Implement `PostgreSQLSettingsRepository`
  - [ ] getSettings() method
  - [ ] updateSettings() method
  - [ ] resetToDefaults() method
- [ ] Write integration tests for all repositories

### 3.4 Chrome Storage Adapter (src/infrastructure/storage/)

- [ ] Create ChromeStorageAdapter class
- [ ] Implement save/load methods
- [ ] Handle storage quota limits
- [ ] Add version migration support
- [ ] Write tests for storage adapter

### 3.5 Timer Engine (src/infrastructure/timer/)

- [ ] Create Web Worker for timer ticking
- [ ] Implement TimerService
- [ ] Implement timestamp-based calculations
- [ ] Handle pause/resume logic
- [ ] Detect time jumps (system sleep)
- [ ] Write timer engine tests

---

## Step 4: Application Layer 🎬

### 4.1 Use Cases (src/application/use-cases/)

- [ ] Create `StartWorkUseCase`
- [ ] Create `StartShortBreakUseCase`
- [ ] Create `StartLongBreakUseCase`
- [ ] Create `PauseTimerUseCase`
- [ ] Create `ResumeTimerUseCase`
- [ ] Create `CompleteSessionUseCase`
- [ ] Create `AbandonSessionUseCase`
- [ ] Create `GetDailyReportUseCase`
- [ ] Create `GetWeeklyReportUseCase`
- [ ] Create `GetMonthlyReportUseCase`
- [ ] Create `UpdateSettingsUseCase`
- [ ] Write unit tests for all use cases (with mocked repos)

### 4.2 Zustand Store Setup (src/presentation/store/)

- [ ] Create store factory function
- [ ] Configure middleware (immer, persist, devtools)
- [ ] Create `TimerSlice`
  - [ ] State: currentSession, state, remainingTime, etc.
  - [ ] Actions: startWork, pause, resume, complete, tick
- [ ] Create `SessionHistorySlice`
  - [ ] State: todaySessions, recentSessions
  - [ ] Actions: loadTodaySessions, addSession, updateSession
- [ ] Create `ReportsSlice`
  - [ ] State: dailyReport, weeklyReport, monthlyReport
  - [ ] Actions: loadDailyReport, loadWeeklyReport, invalidateCache
- [ ] Create `SettingsSlice`
  - [ ] State: all user settings
  - [ ] Actions: loadSettings, updateSettings, resetToDefaults
- [ ] Create `SyncSlice`
  - [ ] State: isSyncing, lastSyncAt, pendingOperations
  - [ ] Actions: queueOperation, processSyncQueue

### 4.3 Selectors (src/presentation/store/selectors/)

- [ ] Create basic selectors (selectTimerState, selectRemainingTime, etc.)
- [ ] Create computed selectors with memoization
  - [ ] selectProgress
  - [ ] selectTodayWorkTime
  - [ ] selectTodayPomodoroCount
  - [ ] selectIsLongBreakDue
  - [ ] selectCompletionRate
- [ ] Write tests for selectors

### 4.4 Dependency Injection (src/main.ts or composition root)

- [ ] Create composition root
- [ ] Initialize database connection
- [ ] Create repository instances
- [ ] Create use case instances
- [ ] Create and configure Zustand store
- [ ] Wire everything together

---

## Step 5: Basic Timer UI 🎨

### 5.1 Core Components (src/presentation/components/)

- [ ] Create `Timer` component (countdown display)
- [ ] Create `TimerControls` component (start/pause/resume buttons)
- [ ] Create `SessionInfo` component (current session type, pomodoro count)
- [ ] Create `Progress` component (visual progress bar/circle)
- [ ] Style components with Tailwind CSS

### 5.2 Hooks (src/presentation/hooks/)

- [ ] Create `useTimer` hook (connect to Zustand store)
- [ ] Create `useTimerControls` hook
- [ ] Create `useSettings` hook
- [ ] Create `useTodaySessions` hook

### 5.3 Main App Layout

- [ ] Update `App.tsx` with timer layout
- [ ] Add today's session summary widget
- [ ] Add basic navigation (if needed)
- [ ] Make responsive

### 5.4 Integration

- [ ] Connect components to Zustand store
- [ ] Test timer flow (start, tick, pause, resume, complete)
- [ ] Verify data persists to database
- [ ] Test with real timer (25-minute session, accelerated for testing)

---

## Step 6: Chrome Extension Setup 🔌

### 6.1 Extension Configuration

- [ ] Create `manifest.json` (Manifest V3)
  - [ ] Set name, version, description
  - [ ] Add icons (16px, 48px, 128px)
  - [ ] Configure permissions (storage, alarms, notifications)
  - [ ] Define action (popup)
  - [ ] Define background (service worker)
- [ ] Create extension icons
- [ ] Update Vite config for extension build

### 6.2 Service Worker (src/extension/background/)

- [ ] Create background service worker
- [ ] Initialize timer state management
- [ ] Set up chrome.alarms for timer
- [ ] Implement badge updates (show remaining time)
- [ ] Handle state persistence to chrome.storage
- [ ] Restore state on service worker wake
- [ ] Set up message listeners

### 6.3 Popup (src/extension/popup/)

- [ ] Create popup HTML entry point
- [ ] Create popup React app
- [ ] Implement message passing to service worker
- [ ] Subscribe to state updates
- [ ] Display timer UI in popup
- [ ] Keep popup lightweight (<500KB)

### 6.4 Options Page (src/extension/options/)

- [ ] Create options HTML entry point
- [ ] Create options React app
- [ ] Build settings form
  - [ ] Work duration input
  - [ ] Short/long break duration inputs
  - [ ] Auto-start toggles
  - [ ] Notification settings
  - [ ] Daily goal input
- [ ] Save/load settings via service worker

### 6.5 Message Passing

- [ ] Define message types and schemas
- [ ] Implement command messages (START_WORK, PAUSE, etc.)
- [ ] Implement query messages (GET_STATE, etc.)
- [ ] Implement event messages (STATE_CHANGED, etc.)
- [ ] Add message validation with Zod

### 6.6 Notifications

- [ ] Implement chrome.notifications for session complete
- [ ] Add notification sounds (configurable)
- [ ] Test notifications work in background

### 6.7 Testing

- [ ] Test extension loads in Chrome
- [ ] Test timer runs in background
- [ ] Test state persists across browser restart
- [ ] Test popup opens and controls work
- [ ] Test settings page saves changes

---

## Step 7: Reporting System 📊

### 7.1 Report Generation Backend

- [ ] Implement daily aggregate calculation
- [ ] Create background job for daily aggregates (runs at midnight)
- [ ] Implement caching layer for reports
- [ ] Optimize aggregation queries

### 7.2 Report Components (src/presentation/components/reports/)

- [ ] Create `DailyReportView` component
  - [ ] Total work time display
  - [ ] Completed pomodoros count
  - [ ] Focus score gauge
  - [ ] Hourly distribution chart
  - [ ] Session timeline
- [ ] Create `WeeklyReportView` component
  - [ ] Weekly total display
  - [ ] Daily breakdown chart
  - [ ] Week-over-week comparison
  - [ ] Consistency score
- [ ] Create `MonthlyReportView` component
  - [ ] Monthly total display
  - [ ] Calendar heatmap
  - [ ] Weekly trend line
  - [ ] Hour-of-day heatmap
  - [ ] Day-of-week chart

### 7.3 Charts and Visualizations

- [ ] Choose lightweight chart library (Recharts or similar)
- [ ] Implement bar charts
- [ ] Implement line charts
- [ ] Implement heatmap
- [ ] Make responsive

### 7.4 Insights Generation

- [ ] Create insight generation rules
- [ ] Implement automated insights
- [ ] Display insights in reports

### 7.5 Data Export

- [ ] Implement CSV export for sessions
- [ ] Implement JSON export for all data
- [ ] Add export button to reports page

---

## Step 8: Polish & Optimization ✨

### 8.1 Performance Optimization

- [ ] Analyze bundle size (target: <500KB)
- [ ] Implement code splitting
- [ ] Optimize React re-renders (memo, useMemo, useCallback)
- [ ] Add indexes to database queries
- [ ] Optimize chrome.storage writes (debounce)
- [ ] Run Lighthouse audit and fix issues

### 8.2 UX Enhancements

- [ ] Add smooth animations/transitions
- [ ] Implement keyboard shortcuts
- [ ] Create onboarding flow for first-time users
- [ ] Add tooltips and help text
- [ ] Polish visual design
- [ ] Add theme support (light/dark mode)

### 8.3 Error Handling

- [ ] Implement global error boundary
- [ ] Add user-friendly error messages
- [ ] Set up error tracking (Sentry)
- [ ] Handle offline mode gracefully
- [ ] Add retry mechanisms

### 8.4 Accessibility

- [ ] Test with screen readers
- [ ] Add ARIA labels
- [ ] Ensure keyboard navigation works
- [ ] Check color contrast ratios
- [ ] Test with accessibility tools

---

## Step 9: Testing & Production Ready 🚀

### 9.1 Testing

- [ ] Write unit tests for all domain logic (target: 100% coverage)
- [ ] Write unit tests for use cases (target: 100% coverage)
- [ ] Write integration tests for repositories (target: 90% coverage)
- [ ] Write component tests (target: 80% coverage)
- [ ] Write E2E tests with Playwright
  - [ ] Complete pomodoro cycle
  - [ ] Settings persistence
  - [ ] Report accuracy
  - [ ] Extension lifecycle
- [ ] Verify overall coverage >85%

### 9.2 Security Audit

- [ ] Review CSP configuration
- [ ] Verify input validation everywhere
- [ ] Check for SQL injection vulnerabilities
- [ ] Verify no XSS vulnerabilities
- [ ] Review permission usage
- [ ] Audit third-party dependencies

### 9.3 Documentation

- [ ] Write comprehensive README
- [ ] Create user guide
- [ ] Write privacy policy
- [ ] Document architecture
- [ ] Add inline code documentation
- [ ] Create CHANGELOG

### 9.4 Chrome Web Store Preparation

- [ ] Create extension icons (all sizes)
- [ ] Create promotional images (1280x800)
- [ ] Take screenshots (1280x800 or 640x400)
- [ ] Write store listing description
- [ ] Set up privacy policy URL
- [ ] Set up support email/URL

### 9.5 Production Checklist

- [ ] All tests passing
- [ ] No linting errors
- [ ] Performance targets met
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] Chrome Web Store assets ready
- [ ] Error tracking configured
- [ ] Database migrations tested
- [ ] Backup strategy in place

### 9.6 Launch

- [ ] Submit to Chrome Web Store
- [ ] Monitor for approval
- [ ] Respond to reviewer feedback
- [ ] Announce launch
- [ ] Monitor error rates
- [ ] Monitor user feedback

---

## Step 10: Post-Launch (Future) 🌟

### Potential Future Features

- [ ] Multi-device sync (cloud backend)
- [ ] Team/shared pomodoros
- [ ] Integration with task management tools
- [ ] Website blocking during work sessions
- [ ] Advanced analytics
- [ ] Custom pomodoro templates
- [ ] Gamification (achievements, streaks)
- [ ] Mobile apps (React Native)

---

## 📝 Session Notes

### Session 1: 2026-01-07 ✅

- **Completed:** Step 1 - Foundation Setup (100%)
  - ✅ Installed all dependencies (Zustand, Zod, pg, Drizzle, Vitest, Playwright, etc.)
  - ✅ Created complete clean architecture folder structure
  - ✅ Configured TypeScript strict mode + path aliases
  - ✅ Set up Vitest with browser mode (Playwright)
  - ✅ Set up Playwright for E2E tests
  - ✅ Added test scripts to package.json
  - ✅ Created README files documenting each layer
  - ✅ Created example tests to verify setup
- **Blockers:** None
- **Next Session Plan:** Start Step 2 - Domain Layer (Zod schemas, entities, state machine)
- **Notes:**
  - Used Drizzle ORM instead of Kysely (user preference)
  - Used Vitest browser mode with Playwright for better component testing
  - All test infrastructure ready to go

### Session 2: [Date]

- Completed:
- In Progress:
- Blockers:
- Next Session Plan:

---

## 🎯 Current Focus

**Active Step:** Step 2 - Domain Layer 👈 START HERE
**Next Milestone:** Zod schemas and domain entities
**Estimated Progress:** ~10% overall (Step 1 complete)

---

**Last Updated:** 2026-01-07
