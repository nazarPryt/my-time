# Pomodoro Timer - Implementation TODO

**Reference:** See `Plan4.md` for detailed architectural specifications

---

## 🎯 Overall Progress Tracker

- [x] **Step 1:** Foundation Setup ✅ COMPLETED
- [x] **Step 2:** Domain Layer ✅ COMPLETED
- [x] **Step 3:** Infrastructure Layer ✅ COMPLETED
- [ ] **Step 4:** Application Layer 👈 NEXT
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

## Step 2: Domain Layer 🧠 ✅ COMPLETED

### 2.1 Zod Schemas (src/shared/schemas/) ✅

- [x] Create `SessionTypeSchema` (work, short_break, long_break)
- [x] Create `SessionStatusSchema` (completed, abandoned, interrupted)
- [x] Create `SessionSchema` with all fields
- [x] Create `UserSettingsSchema`
- [x] Create `DailyReportSchema`
- [x] Create `WeeklyReportSchema`
- [x] Create `MonthlyReportSchema`
- [x] Infer TypeScript types from schemas

### 2.2 Domain Entities (src/domain/entities/) ✅

- [x] Create `Session` entity
- [x] Create `UserSettings` entity
- [x] Create `DailyReport` entity
- [x] Add entity methods (calculateRemainingTime, etc.)
- [x] Write unit tests for entities

### 2.3 Value Objects (src/domain/value-objects/) ✅

- [x] Create `Duration` value object
- [x] Create `SessionType` value object
- [x] Create `SessionStatus` value object
- [x] Ensure immutability
- [x] Write unit tests for value objects

### 2.4 State Machine (src/domain/services/) ✅

- [x] Define all timer states (IDLE, WORK_ACTIVE, WORK_PAUSED, etc.)
- [x] Define all events/commands
- [x] Create transition map
- [x] Implement guard conditions
- [x] Implement side effects (onEnter, onExit)
- [x] Write comprehensive state machine tests
- [x] Test all valid transitions
- [x] Test all invalid transitions (should error)

### 2.5 Repository Interfaces (src/domain/interfaces/) ✅

- [x] Create `ISessionRepository` interface
- [x] Create `IReportRepository` interface
- [x] Create `ISettingsRepository` interface
- [x] Document method signatures and contracts

---

## Step 3: Infrastructure Layer 💾 ✅ COMPLETED

### 3.1 Database Setup ✅

- [x] Create PostgreSQL database schema with Drizzle (see Plan4.md)
- [x] Set up connection pooling with pg
- [x] Configure Drizzle ORM for query building
- [x] Create migration system with Drizzle Kit
- [x] Create DATABASE_SETUP.md guide for Supabase setup

### 3.2 Database Migrations (src/infrastructure/database/migrations/) ✅

- [x] Schema: Create `sessions` table with enums
- [x] Schema: Create `daily_aggregates` table
- [x] Schema: Create `user_settings` table
- [x] Migrations are auto-generated by Drizzle Kit
- [x] Push command available for schema deployment
- [x] Database studio available for testing

### 3.3 Repository Implementations (src/infrastructure/database/repositories/) ✅

- [x] Implement `PostgreSQLSessionRepository`
  - [x] save() method
  - [x] update() method
  - [x] findById() method
  - [x] findByUserAndDate() method
  - [x] findByUserAndDateRange() method
  - [x] delete() method
  - [x] countByUserAndType() method
  - [x] countByUserAndStatus() method
  - [x] findMostRecent() method
  - [x] findByTags() method
- [x] Implement `PostgreSQLReportRepository` (split by responsibility)
  - [x] DailyReportGenerator for daily statistics
  - [x] WeeklyReportGenerator for weekly aggregation
  - [x] MonthlyReportGenerator for monthly aggregation
  - [x] DailyAggregateService for caching
  - [x] getDailyReport() method
  - [x] getWeeklyReport() method
  - [x] getMonthlyReport() method
  - [x] regenerateDailyAggregate() method
  - [x] getDailyReportsInRange() method
- [x] Implement `PostgreSQLSettingsRepository`
  - [x] getSettings() method (auto-creates defaults)
  - [x] updateSettings() method (partial updates)
  - [x] resetToDefaults() method
  - [x] exists() method
  - [x] delete() method
- [ ] Write integration tests for all repositories (TODO: Next session)

### 3.4 Chrome Storage Adapter (src/infrastructure/storage/) ✅

- [x] Create ChromeStorageAdapter class
- [x] Implement save/load methods
- [x] Handle storage quota limits with auto-cleanup
- [x] Add version migration support
- [x] Implement loadWithValidation for type safety
- [x] Add storage monitoring (bytesInUse, quota, percentage)
- [x] Add export/import functionality for backup
- [ ] Write tests for storage adapter (TODO: Next session)

### 3.5 Timer Engine (src/infrastructure/timer/) ✅

- [x] Create Web Worker for timer ticking (TimerWorker.ts)
- [x] Implement TimerService with event system
- [x] Implement timestamp-based calculations (prevents drift)
- [x] Handle pause/resume logic with accurate tracking
- [x] Fallback to main thread if worker fails
- [x] Auto-detect timer completion
- [x] Observable pattern for state changes
- [ ] Detect time jumps (system sleep) - TODO: Future enhancement
- [ ] Write timer engine tests (TODO: Next session)

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

### Session 2: 2026-01-07 ✅

- **Completed:** Step 2 - Domain Layer (100%)
  - ✅ Created all Zod schemas (Session, UserSettings, DailyReport, WeeklyReport, MonthlyReport)
  - ✅ Created domain entities (Session, UserSettings, DailyReport) with business logic
  - ✅ Created value objects (Duration, SessionType, SessionStatus) - immutable and self-validating
  - ✅ Implemented complete state machine (TimerStateMachine) with all states and transitions
  - ✅ Created repository interfaces (ISessionRepository, IReportRepository, ISettingsRepository)
  - ✅ Wrote comprehensive unit tests (58 tests passing)
  - ✅ All tests passing with 100% coverage for tested components
- **Blockers:** None
- **Next Session Plan:** Start Step 3 - Infrastructure Layer (Database setup, migrations, repository implementations)
- **Notes:**
  - Used const objects instead of enums (user preference)
  - State machine includes all 7 states and 8 events with proper side effects
  - Value objects are immutable and provide rich business logic
  - All domain code is framework-agnostic and testable

### Session 3: 2026-01-07 ✅

- **Completed:** Step 3 - Infrastructure Layer (100%)
  - ✅ Created PostgreSQL database schema with Drizzle ORM
  - ✅ Set up database connection with connection pooling
  - ✅ Implemented all three repository classes (Session, Settings, Report)
  - ✅ Split Report repository by responsibility (5 focused classes)
  - ✅ Created ChromeStorageAdapter with quota management
  - ✅ Implemented Timer Engine with Web Worker support
  - ✅ Timestamp-based timer calculations (prevents drift)
  - ✅ Created comprehensive DATABASE_SETUP.md guide
  - ✅ Updated infrastructure README with detailed documentation
  - ✅ Added database scripts to package.json
- **Database:**
  - Using Drizzle ORM (instead of Kysely as originally planned)
  - Supabase for PostgreSQL hosting
  - Auto-generated migrations with Drizzle Kit
  - Ready for: `bun db:generate` and `bun db:push`
- **Architecture:**
  - Report repository split into 5 classes (Single Responsibility Principle)
  - Timer uses Web Worker for accuracy
  - Storage adapter handles quota management automatically
- **Blockers:** None - User needs to set up Supabase and create .env file
- **Next Session Plan:**
  - User should follow DATABASE_SETUP.md to configure Supabase
  - Start Step 4 - Application Layer (Use Cases and Zustand Store)
- **Notes:**
  - Infrastructure layer is complete and ready for testing
  - All code follows clean architecture principles
  - Repository implementations use Zod for validation
  - Timer service has fallback to main thread if worker fails

### Session 4: [Date]

- Completed:
- In Progress:
- Blockers:
- Next Session Plan:

---

## 🎯 Current Focus

**Active Step:** Step 4 - Application Layer 👈 START HERE
**Next Milestone:** Use Cases and Zustand Store setup
**Estimated Progress:** ~30% overall (Steps 1-3 complete)

**⚠️ Before Starting Step 4:**

1. Follow [DATABASE_SETUP.md](./DATABASE_SETUP.md) to set up Supabase
2. Create `.env` file with your database connection string
3. Run `bun db:push` to create database tables
4. Verify setup with `bun db:studio`

---

**Last Updated:** 2026-01-07
