# Production-Ready Pomodoro Timer Application - Detailed Implementation Plan

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architectural Overview](#architectural-overview)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Database Design](#database-design)
6. [State Management Architecture](#state-management-architecture)
7. [Timer Implementation Strategy](#timer-implementation-strategy)
8. [Chrome Extension Architecture](#chrome-extension-architecture)
9. [Repository Pattern & Data Access](#repository-pattern--data-access)
10. [State Machine Design](#state-machine-design)
11. [Reporting System](#reporting-system)
12. [Validation & Type Safety](#validation--type-safety)
13. [Dependency Injection](#dependency-injection)
14. [Error Handling & Logging](#error-handling--logging)
15. [Testing Strategy](#testing-strategy)
16. [Security Considerations](#security-considerations)
17. [Performance Optimization](#performance-optimization)
18. [Implementation Phases](#implementation-phases)
19. [Production Checklist](#production-checklist)

---

## Executive Summary

This document provides a comprehensive implementation plan for a production-ready Pomodoro timer Chrome extension with clean architecture, modern state management using Zustand, PostgreSQL data persistence, and comprehensive time tracking capabilities.

**Core Features:**

- Pomodoro Timer (25min work / 5min short break / 15min long break)
- Automatic session tracking and persistence
- Daily, weekly, and monthly reports with analytics
- Chrome extension optimized for browser environment
- PostgreSQL database for data persistence
- Offline-first with sync capabilities

**Architectural Improvements Addressed:**

- ✅ Eliminated event emitter anti-patterns
- ✅ Single source of truth with Zustand
- ✅ Timestamp-based timer preventing drift
- ✅ No memory leaks through proper state management
- ✅ Optimized performance with selective re-renders
- ✅ Runtime validation with Zod schemas
- ✅ State machine pattern preventing invalid states
- ✅ Repository pattern ensuring data integrity

---

## Architectural Overview

### Clean Architecture Principles

The application follows clean architecture with clear separation of concerns across four layers:

**Layer 1: Domain Layer (Core Business Logic)**

- Contains pure business logic with no external dependencies
- Entities, value objects, domain services
- Business rules and validation logic
- Completely framework-agnostic

**Layer 2: Application Layer (Use Cases)**

- Orchestrates domain objects to perform specific tasks
- Defines application-specific business rules
- Depends only on domain layer
- Independent of UI, database, or framework

**Layer 3: Infrastructure Layer (External Systems)**

- Implements interfaces defined in inner layers
- Database repositories, external APIs
- Framework-specific implementations
- State management configuration

**Layer 4: Presentation Layer (UI)**

- React components and UI logic
- Hooks and selectors
- User interaction handling
- Depends on all other layers

### Dependency Flow

```
Presentation → Application → Domain ← Infrastructure
```

Dependencies always point inward. Inner layers define interfaces, outer layers implement them (Dependency Inversion Principle).

### Key Architectural Patterns

1. **Repository Pattern**: Abstract data access behind interfaces
2. **State Machine Pattern**: Prevent invalid timer state transitions
3. **Command/Query Separation**: Clear distinction between reads and writes
4. **Unit of Work**: Ensure atomic database operations
5. **Factory Pattern**: Create complex objects with dependencies
6. **Observer Pattern**: React to state changes (via Zustand)
7. **Strategy Pattern**: Swappable implementations (e.g., storage strategies)

---

## Technology Stack

### Core Technologies

- **TypeScript**: Type-safe development with strict mode
- **React 18+**: UI library with concurrent features
- **Zustand**: Lightweight state management with middleware
- **PostgreSQL**: Robust relational database
- **Zod**: Runtime validation and type inference
- **Vite**: Fast build tool and dev server

### Chrome Extension Specific

- **Manifest V3**: Latest Chrome extension platform
- **Service Workers**: Background processing
- **Chrome APIs**: alarms, storage, notifications, runtime

### Development Tools

- **Vitest**: Fast unit test runner
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

### Infrastructure

- **pg (node-postgres)**: PostgreSQL client with connection pooling
- **Knex.js** or **Kysely**: SQL query builder and migrations
- **Sentry**: Error tracking and monitoring (optional)

---

## System Architecture

### Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Timer UI     │  │ Reports UI   │  │ Settings UI  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            │                             │
│                    ┌───────▼────────┐                    │
│                    │ Zustand Store  │                    │
│                    └───────┬────────┘                    │
└────────────────────────────┼──────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────┐
│                   Application Layer                       │
│  ┌─────────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ Timer Use Cases │  │ Report Use   │  │ Settings    │ │
│  │                 │  │ Cases        │  │ Use Cases   │ │
│  └────────┬────────┘  └──────┬───────┘  └─────┬───────┘ │
└───────────┼───────────────────┼─────────────────┼─────────┘
            │                   │                 │
┌───────────▼───────────────────▼─────────────────▼─────────┐
│                      Domain Layer                          │
│  ┌──────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Entities     │  │ State Machine   │  │ Domain       │ │
│  │              │  │                 │  │ Services     │ │
│  └──────────────┘  └─────────────────┘  └──────────────┘ │
└────────────────────────────────────────────────────────────┘
            ▲                   ▲                 ▲
┌───────────┼───────────────────┼─────────────────┼─────────┐
│                   Infrastructure Layer                     │
│  ┌────────┴──────┐  ┌────────┴──────┐  ┌────────┴──────┐ │
│  │ PostgreSQL    │  │ Chrome        │  │ Timer Engine  │ │
│  │ Repositories  │  │ Storage       │  │ (Worker)      │ │
│  └───────────────┘  └───────────────┘  └───────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Data Flow

**Unidirectional Data Flow:**

1. User interacts with UI (Presentation)
2. UI dispatches action to Zustand store
3. Store invokes appropriate use case (Application)
4. Use case executes business logic using domain entities
5. Use case persists changes via repository (Infrastructure)
6. Repository updates database
7. Store state updates
8. UI re-renders with new state

---

## Database Design

### PostgreSQL Schema

#### Table: sessions

Primary table for storing all Pomodoro sessions and breaks.

**Columns:**

- `id` (UUID, PRIMARY KEY): Unique session identifier
- `user_id` (UUID, NOT NULL): User identifier (for future multi-user support)
- `session_type` (ENUM: 'work', 'short_break', 'long_break', NOT NULL): Type of session
- `status` (ENUM: 'completed', 'abandoned', 'interrupted', NOT NULL): Session outcome
- `planned_duration` (INTEGER, NOT NULL): Intended duration in seconds
- `actual_duration` (INTEGER, NOT NULL): Actual duration in seconds
- `started_at` (TIMESTAMP WITH TIME ZONE, NOT NULL): Session start time
- `completed_at` (TIMESTAMP WITH TIME ZONE): Session end time (NULL if not completed)
- `paused_duration` (INTEGER, DEFAULT 0): Total time paused in seconds
- `tags` (TEXT[]): User-defined tags for categorization
- `notes` (TEXT): Optional user notes about the session
- `pomodoro_count` (INTEGER): Which pomodoro in the cycle (1-4)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

**Indexes:**

- `idx_sessions_user_started` ON sessions(user_id, started_at DESC)
- `idx_sessions_user_type_status` ON sessions(user_id, session_type, status)
- `idx_sessions_completed_at` ON sessions(completed_at) WHERE completed_at IS NOT NULL
- `idx_sessions_tags` ON sessions USING GIN(tags)

#### Table: daily_aggregates

Pre-computed daily statistics for fast report generation.

**Columns:**

- `id` (UUID, PRIMARY KEY)
- `user_id` (UUID, NOT NULL)
- `date` (DATE, NOT NULL): The day this aggregate represents
- `total_work_time` (INTEGER, NOT NULL): Total seconds of work
- `total_break_time` (INTEGER, NOT NULL): Total seconds of breaks
- `completed_pomodoros` (INTEGER, NOT NULL): Number of completed work sessions
- `abandoned_pomodoros` (INTEGER, NOT NULL): Number of abandoned work sessions
- `total_sessions` (INTEGER, NOT NULL): Total number of sessions
- `focus_score` (DECIMAL(5,2)): Completion rate (0-100)
- `longest_streak` (INTEGER): Longest consecutive completed pomodoros
- `peak_hour` (INTEGER): Most productive hour (0-23)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

**Indexes:**

- `idx_daily_aggregates_user_date` ON daily_aggregates(user_id, date DESC) UNIQUE

#### Table: user_settings

User preferences and configuration.

**Columns:**

- `user_id` (UUID, PRIMARY KEY)
- `work_duration` (INTEGER, DEFAULT 1500): Default work duration (25 min)
- `short_break_duration` (INTEGER, DEFAULT 300): Default short break (5 min)
- `long_break_duration` (INTEGER, DEFAULT 900): Default long break (15 min)
- `long_break_interval` (INTEGER, DEFAULT 4): Pomodoros before long break
- `auto_start_breaks` (BOOLEAN, DEFAULT false): Auto-start break after work
- `auto_start_pomodoros` (BOOLEAN, DEFAULT false): Auto-start work after break
- `notification_enabled` (BOOLEAN, DEFAULT true): Enable notifications
- `notification_sound` (TEXT, DEFAULT 'default'): Notification sound identifier
- `daily_goal_pomodoros` (INTEGER, DEFAULT 8): Daily pomodoro target
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### Database Migrations Strategy

**Migration Tool:** Knex.js or Kysely migrations

**Migration Naming Convention:**

- `YYYYMMDDHHMMSS_descriptive_name.ts`
- Example: `20260107120000_create_sessions_table.ts`

**Migration Structure:**

- `up()`: Apply the migration
- `down()`: Rollback the migration
- All migrations must be reversible

**Migration Execution:**

- Run automatically on application startup (development)
- Manual execution in production with verification
- Keep migrations in version control
- Never modify existing migrations once deployed

### Data Integrity Rules

**Constraints:**

- Foreign keys with CASCADE delete (user_id references)
- CHECK constraints on durations (must be positive)
- CHECK constraints on status enums
- UNIQUE constraint on user_id + date in daily_aggregates

**Triggers:**

- `updated_at` trigger to auto-update timestamp on row modification
- Trigger to update daily_aggregates when sessions are inserted/updated

**Transactions:**

- All multi-table operations wrapped in transactions
- Use of BEGIN/COMMIT/ROLLBACK for atomicity
- Optimistic locking for concurrent updates

---

## State Management Architecture

### Zustand Store Structure

The application uses a single Zustand store with multiple slices for different concerns. Each slice manages a specific domain of state.

#### Store Slices

**1. TimerSlice**
Manages current timer session state.

State:

- `currentSession`: Current session details (id, type, startedAt, plannedDuration)
- `state`: Current state machine state (IDLE, WORK_ACTIVE, WORK_PAUSED, etc.)
- `remainingTime`: Calculated remaining time in seconds
- `pomodoroCount`: Current pomodoro in the cycle (1-4)
- `isPaused`: Boolean flag for pause state
- `pausedAt`: Timestamp when paused
- `totalPausedDuration`: Accumulated pause time

Actions:

- `startWork()`: Initiate a work session
- `startShortBreak()`: Initiate a short break
- `startLongBreak()`: Initiate a long break
- `pause()`: Pause current session
- `resume()`: Resume paused session
- `complete()`: Mark session as completed
- `abandon()`: Cancel current session
- `tick()`: Update remaining time (called every 100ms)

**2. SessionHistorySlice**
Manages session history and current day tracking.

State:

- `todaySessions`: Array of today's sessions
- `recentSessions`: Last 10 sessions across all days
- `isLoading`: Loading state for history fetch
- `error`: Error state

Actions:

- `loadTodaySessions()`: Fetch today's sessions from DB
- `loadRecentSessions()`: Fetch recent sessions
- `addSession()`: Add a session to history
- `updateSession()`: Update an existing session
- `deleteSession()`: Remove a session

**3. ReportsSlice**
Manages cached report data.

State:

- `dailyReport`: Current day report
- `weeklyReport`: Current week report
- `monthlyReport`: Current month report
- `selectedDate`: Date for report viewing
- `cacheTimestamps`: Last fetch times for cache invalidation

Actions:

- `loadDailyReport(date)`: Load daily report
- `loadWeeklyReport(date)`: Load weekly report
- `loadMonthlyReport(date)`: Load monthly report
- `invalidateCache()`: Clear cached reports

**4. SettingsSlice**
Manages user preferences.

State:

- `workDuration`: Configured work duration
- `shortBreakDuration`: Configured short break duration
- `longBreakDuration`: Configured long break duration
- `longBreakInterval`: Pomodoros before long break
- `autoStartBreaks`: Auto-start preference
- `autoStartPomodoros`: Auto-start preference
- `notificationEnabled`: Notification preference
- `notificationSound`: Sound preference
- `dailyGoal`: Daily pomodoro goal

Actions:

- `loadSettings()`: Load settings from DB
- `updateSettings(settings)`: Update settings
- `resetToDefaults()`: Reset to default values

**5. SyncSlice**
Manages synchronization state.

State:

- `isSyncing`: Currently syncing flag
- `lastSyncAt`: Last successful sync timestamp
- `pendingOperations`: Queue of offline operations
- `syncError`: Sync error if any

Actions:

- `queueOperation(operation)`: Add to offline queue
- `processSyncQueue()`: Process pending operations
- `markSynced()`: Update sync timestamp

### Zustand Middleware Stack

**1. Immer Middleware**
Enables immutable state updates with mutable syntax.

- Simplifies complex nested state updates
- Prevents accidental mutations
- Improves developer experience

**2. Persist Middleware**
Persists state to chrome.storage.local.

- Only critical state persisted (current session, settings)
- Session history and reports loaded from DB
- Handles storage quota limits
- Version migration support

**3. DevTools Middleware**
Enables Redux DevTools integration.

- Time-travel debugging
- State inspection
- Action logging
- Only enabled in development

**4. Subscriptions Middleware**
Enables component subscriptions to specific state slices.

- Prevents unnecessary re-renders
- Granular subscription management
- Automatic cleanup on unmount

### Selectors Design

**Principle:** Create fine-grained selectors to minimize re-renders.

**Basic Selectors:**

- `selectTimerState`: Current timer state
- `selectRemainingTime`: Remaining time
- `selectCurrentSession`: Current session details
- `selectTodaySessions`: Today's sessions
- `selectSettings`: User settings

**Computed Selectors (Memoized):**

- `selectProgress`: (remainingTime, plannedDuration) => percentage
- `selectTodayWorkTime`: Sum of today's work sessions
- `selectTodayPomodoroCount`: Count of completed pomodoros
- `selectIsLongBreakDue`: Check if long break is needed
- `selectCompletionRate`: Percentage of completed vs started sessions
- `selectCurrentStreak`: Current consecutive completed pomodoros

**Selector Performance:**

- Use shallow equality checks
- Memoize expensive computations with reselect-like patterns
- Return stable references (avoid creating new objects/arrays)

### State Update Patterns

**Optimistic Updates:**

- Update UI immediately
- Queue operation for persistence
- Rollback on failure with error notification

**Pessimistic Updates:**

- Wait for persistence confirmation
- Show loading state during operation
- Update UI only on success

**Decision Criteria:**

- Use optimistic for frequent, low-risk operations (pause, resume)
- Use pessimistic for critical operations (session completion, settings changes)

---

## Timer Implementation Strategy

### The Timer Drift Problem

Traditional timer implementations using `setInterval` or `setTimeout` accumulate errors over time due to:

- JavaScript single-threaded event loop delays
- Browser tab throttling when inactive
- System sleep/wake cycles
- CPU load variations

**Solution:** Timestamp-based calculations

### Timestamp-Based Timer Architecture

**Core Principle:** Always calculate time from timestamps, never increment/decrement counters.

**Implementation Strategy:**

1. **Session Start:**
   - Record start timestamp: `startedAt = Date.now()`
   - Store planned duration: `plannedDuration = 1500` (25 minutes in seconds)
   - Store in both Zustand state and database

2. **Every Tick (100ms interval):**
   - Get current timestamp: `now = Date.now()`
   - Calculate elapsed: `elapsed = (now - startedAt - totalPausedDuration) / 1000`
   - Calculate remaining: `remaining = plannedDuration - elapsed`
   - Update UI with remaining time
   - If remaining <= 0, trigger completion

3. **Pause Handling:**
   - Record pause timestamp: `pausedAt = Date.now()`
   - Keep timer ticking in background
   - Don't update UI remaining time while paused

4. **Resume Handling:**
   - Calculate pause duration: `pauseDuration = Date.now() - pausedAt`
   - Add to total: `totalPausedDuration += pauseDuration`
   - Clear pausedAt
   - Continue normal ticking

5. **Browser Lifecycle:**
   - On tab inactive: Timer continues (timestamps don't drift)
   - On tab active: Recalculate from timestamps (catches up instantly)
   - On browser restart: Load session from DB, recalculate

**Benefits:**

- Zero drift accumulation
- Accurate even with irregular tick rates
- Survives browser throttling
- Self-correcting on system wake

### Timer Engine Design

**Worker-Based Architecture:**

Use Web Workers for timer ticking to avoid main thread blocking.

**Components:**

1. **TimerWorker (Web Worker):**
   - Runs `setInterval(tick, 100)` in dedicated thread
   - Posts messages to main thread with tick events
   - Unaffected by main thread blocking
   - More accurate timing

2. **TimerService (Main Thread):**
   - Receives tick events from worker
   - Calculates remaining time from timestamps
   - Updates Zustand store
   - Triggers session completion

3. **Chrome Alarms (Background):**
   - Service worker uses `chrome.alarms.create()`
   - More reliable than setTimeout in background
   - Survives service worker restarts
   - Backup for web worker timer

**Timer Service Responsibilities:**

- Start/stop web worker
- Manage session lifecycle
- Handle pause/resume logic
- Detect system anomalies (time jumps)
- Trigger notifications
- Persist state changes

**Time Jump Detection:**

Detect system sleep/wake or clock changes:

Logic:

- If elapsed time > expected time + threshold (e.g., 5 seconds)
- Assume system was asleep
- Offer user options:
  - Complete session automatically
  - Abandon session
  - Continue session

**Notification Timing:**

Trigger notifications at:

- Session start (if enabled)
- Session complete (always)
- 5 minutes remaining (optional)
- 1 minute remaining (optional)

Use `chrome.notifications.create()` with:

- Title: "Pomodoro Complete!" or "Break Complete!"
- Message:励encouragement or next action
- Icon: Extension icon
- Sound: User-configured sound

---

## Chrome Extension Architecture

### Manifest V3 Structure

**manifest.json Configuration:**

Key sections:

- `manifest_version: 3`
- `name, version, description, icons`
- `action`: Defines popup behavior
- `background`: Service worker configuration
- `permissions`: Required permissions array
- `host_permissions`: If accessing external APIs (e.g., PostgreSQL via proxy)
- `content_security_policy`: Restrictive CSP for security

**Required Permissions:**

- `storage`: Access to chrome.storage.local
- `alarms`: Background timer functionality
- `notifications`: Session completion alerts
- `idle`: Detect user idle state (optional)

### Extension Architecture Components

**1. Service Worker (background.js)**

**Responsibilities:**

- Persistent timer state management (source of truth)
- Chrome alarms management
- Badge text updates (show remaining time)
- Notification triggers
- Message routing between extension parts
- Database synchronization
- Offline queue processing

**Lifecycle:**

- Starts when Chrome starts
- Stays alive as long as there are listeners
- Can be terminated by Chrome when inactive
- Must restore state on wake

**State Persistence:**

- Store current session in chrome.storage.local
- Restore on service worker wake
- Sync to PostgreSQL periodically

**2. Popup (popup.html + React app)**

**Responsibilities:**

- Main UI for timer control
- Display current session state
- Start/pause/skip controls
- Today's session summary
- Quick settings access

**Lifecycle:**

- Created when user clicks extension icon
- Destroyed when popup closes
- Reads state from service worker on open
- Subscribes to state changes while open

**Communication:**

- Query state on open: `chrome.runtime.sendMessage({ type: 'GET_STATE' })`
- Send commands: `chrome.runtime.sendMessage({ type: 'START_WORK' })`
- Listen for updates: `chrome.runtime.onMessage.addListener()`

**3. Options Page (options.html)**

**Responsibilities:**

- Detailed settings configuration
- Report viewing (daily, weekly, monthly)
- Session history browser
- Data export functionality
- Account management (future)

**Implementation:**

- Full React application
- More complex UI than popup
- Larger bundle size acceptable
- Opens in dedicated tab

**4. Content Scripts (Optional)**

**Potential Use Cases:**

- Block distracting websites during work sessions
- Inject timer display into web pages
- Track time spent on specific sites

**Implementation:**

- Only if requested by user
- Request additional permissions
- Respect user privacy

### Message Passing Architecture

**Message Types:**

Commands (Popup/Options → Service Worker):

- `START_WORK`, `START_SHORT_BREAK`, `START_LONG_BREAK`
- `PAUSE`, `RESUME`, `SKIP`, `ABANDON`
- `UPDATE_SETTINGS`
- `SYNC_NOW`

Queries (Popup/Options → Service Worker):

- `GET_STATE`: Get current timer state
- `GET_TODAY_SESSIONS`: Get today's sessions
- `GET_SETTINGS`: Get user settings
- `GET_REPORT`: Get specific report

Events (Service Worker → Popup/Options):

- `STATE_CHANGED`: Timer state updated
- `SESSION_COMPLETED`: Session finished
- `SESSION_STARTED`: New session started
- `SYNC_COMPLETED`: Database sync finished
- `SETTINGS_UPDATED`: Settings changed

**Message Handler Pattern:**

Service Worker:

- Single message listener with type-based routing
- Async handlers for each message type
- Return response or send follow-up message
- Error handling with structured error responses

Popup/Options:

- Send message and await response
- Handle errors gracefully
- Subscribe to relevant events
- Unsubscribe on unmount

### Badge Management

**Purpose:** Show timer state in extension icon badge.

**Badge States:**

- Empty: No active session
- "25:00": Remaining time during session
- "⏸": Paused state
- "✓": Session completed (briefly)

**Update Strategy:**

- Update every 1 second during active session
- Use `chrome.action.setBadgeText()`
- Set badge color: work (red), break (green), paused (yellow)
- Clear badge on idle

### Chrome Storage Strategy

**chrome.storage.local Usage:**

**What to Store:**

- Current session state (for recovery)
- User settings (for quick access)
- Offline operation queue
- Last sync timestamp

**What NOT to Store:**

- Complete session history (use DB)
- Large reports (generate on-demand)
- Computed values (derive from source data)

**Storage Limits:**

- chrome.storage.local: 10MB quota
- Monitor usage, clean old data
- Implement storage quota management

**Sync Strategy:**

- Write to chrome.storage immediately (fast)
- Queue DB sync operation (async)
- Retry on failure with exponential backoff
- Resolve conflicts: last-write-wins for settings, append-only for sessions

---

## Repository Pattern & Data Access

### Repository Pattern Architecture

**Goal:** Abstract data access behind interfaces, enabling testability and flexibility.

### Abstract Repository Interfaces

**ISessionRepository:**

Methods:

- `save(session: Session): Promise<Session>`: Create new session
- `update(session: Session): Promise<Session>`: Update existing session
- `findById(id: string): Promise<Session | null>`: Get session by ID
- `findByUserAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Session[]>`: Query sessions
- `findByUserAndDate(userId: string, date: Date): Promise<Session[]>`: Get day's sessions
- `delete(id: string): Promise<void>`: Delete session (soft delete)
- `countByUserAndType(userId: string, type: SessionType): Promise<number>`: Count sessions

**IReportRepository:**

Methods:

- `getDailyReport(userId: string, date: Date): Promise<DailyReport>`: Get/generate daily report
- `getWeeklyReport(userId: string, date: Date): Promise<WeeklyReport>`: Get/generate weekly report
- `getMonthlyReport(userId: string, date: Date): Promise<MonthlyReport>`: Get/generate monthly report
- `regenerateDailyAggregate(userId: string, date: Date): Promise<void>`: Recompute aggregate

**ISettingsRepository:**

Methods:

- `getSettings(userId: string): Promise<UserSettings>`: Get user settings
- `updateSettings(settings: UserSettings): Promise<UserSettings>`: Update settings
- `resetToDefaults(userId: string): Promise<UserSettings>`: Reset to defaults

### Concrete PostgreSQL Implementations

**PostgreSQLSessionRepository:**

**Implementation Details:**

- Uses pg connection pool for database access
- Parameterized queries to prevent SQL injection
- Prepared statements for frequently-used queries
- Transaction support for atomic operations
- Converts database rows to domain entities
- Validates data with Zod before returning

**Key Methods:**

`save(session)`:

- Insert new row into sessions table
- Return created session with generated ID
- Wrap in transaction if part of larger operation

`findByUserAndDate(userId, date)`:

- Query sessions WHERE user_id = ? AND started_at::date = ?
- Use index on (user_id, started_at)
- Return array of Session entities
- Order by started_at DESC

`update(session)`:

- Update row by ID
- Update updated_at timestamp
- Validate before update
- Return updated session

**PostgreSQLReportRepository:**

**Implementation Details:**

- Aggregation queries for report generation
- Uses daily_aggregates table for fast daily reports
- Calculates weekly/monthly from daily aggregates
- Caching layer to avoid repeated calculations
- Background job to pre-calculate reports

**Key Methods:**

`getDailyReport(userId, date)`:

- Check if daily_aggregate exists for date
- If not, calculate from sessions table
- Store in daily_aggregates
- Return DailyReport entity

`getWeeklyReport(userId, date)`:

- Get 7 daily aggregates for the week
- Sum totals, calculate averages
- Identify trends
- Return WeeklyReport entity

`getMonthlyReport(userId, date)`:

- Get all daily aggregates for the month
- Group by week
- Calculate monthly totals and trends
- Return MonthlyReport entity

### Unit of Work Pattern

**Purpose:** Manage database transactions for operations spanning multiple repositories.

**Implementation:**

Unit of Work class:

- Begins transaction
- Provides repository instances sharing the transaction
- Commits on success
- Rolls back on error
- Ensures atomicity

**Example Use Case:**

Complete session operation:

1. Begin transaction
2. Update session status to 'completed'
3. Update daily_aggregate
4. Commit transaction
5. If any step fails, rollback entire operation

### Connection Pooling

**Strategy:**

- Use pg-pool for connection management
- Pool size: 10-20 connections (tune based on load)
- Idle timeout: 30 seconds
- Connection timeout: 5 seconds
- Query timeout: 30 seconds

**Health Checks:**

- Periodic ping to check database connectivity
- Reconnect on connection loss
- Graceful degradation if database unavailable

### Query Optimization

**Techniques:**

- Use indexes on frequently queried columns
- Avoid SELECT \*, specify needed columns
- Use prepared statements for repeated queries
- Batch inserts for multiple records
- Use appropriate JOIN types
- Limit result sets (pagination)
- Use EXPLAIN to analyze query plans

**Critical Queries to Optimize:**

- Today's sessions query (very frequent)
- Daily aggregate calculation (complex aggregation)
- Recent sessions query (large result sets)

---

## State Machine Design

### Timer State Machine

**Purpose:** Enforce valid timer state transitions and prevent impossible states.

### States

1. **IDLE**
   - No active session
   - Starting state
   - Returned to after session completion

2. **WORK_ACTIVE**
   - Work session in progress
   - Timer ticking
   - Can pause or complete

3. **WORK_PAUSED**
   - Work session paused
   - Timer not ticking
   - Can resume or abandon

4. **SHORT_BREAK_ACTIVE**
   - Short break in progress
   - Timer ticking
   - Can pause, skip, or complete

5. **SHORT_BREAK_PAUSED**
   - Short break paused
   - Can resume or skip

6. **LONG_BREAK_ACTIVE**
   - Long break in progress
   - Timer ticking
   - Can pause, skip, or complete

7. **LONG_BREAK_PAUSED**
   - Long break paused
   - Can resume or skip

### Events (Commands)

- `START_WORK`: Begin a new work session
- `START_SHORT_BREAK`: Begin a short break
- `START_LONG_BREAK`: Begin a long break
- `PAUSE`: Pause current active session
- `RESUME`: Resume current paused session
- `SKIP`: Skip current session (mark as abandoned)
- `COMPLETE`: Current session timer expires
- `ABANDON`: User explicitly cancels session

### Valid Transitions

**From IDLE:**

- START_WORK → WORK_ACTIVE
- START_SHORT_BREAK → SHORT_BREAK_ACTIVE
- START_LONG_BREAK → LONG_BREAK_ACTIVE

**From WORK_ACTIVE:**

- PAUSE → WORK_PAUSED
- COMPLETE → IDLE (automatically determine next: short or long break)
- SKIP → IDLE
- ABANDON → IDLE

**From WORK_PAUSED:**

- RESUME → WORK_ACTIVE
- ABANDON → IDLE

**From SHORT_BREAK_ACTIVE:**

- PAUSE → SHORT_BREAK_PAUSED
- COMPLETE → IDLE
- SKIP → IDLE

**From SHORT_BREAK_PAUSED:**

- RESUME → SHORT_BREAK_ACTIVE
- SKIP → IDLE

**From LONG_BREAK_ACTIVE:**

- PAUSE → LONG_BREAK_PAUSED
- COMPLETE → IDLE
- SKIP → IDLE

**From LONG_BREAK_PAUSED:**

- RESUME → LONG_BREAK_ACTIVE
- SKIP → IDLE

### Guards (Preconditions)

**canStartWork:**

- Current state is IDLE
- No active session exists

**canPause:**

- Current state is \*\_ACTIVE

**canResume:**

- Current state is \*\_PAUSED

**canSkip:**

- Current state is not IDLE

**isLongBreakDue:**

- Completed pomodoro count % longBreakInterval === 0
- Used after work session COMPLETE to decide next break type

### Side Effects (Actions)

**onEnterWorkActive:**

- Create session record in database
- Start timer worker
- Update badge
- Show "Work session started" notification (if enabled)
- Record start timestamp

**onExitWorkActive:**

- Stop timer worker (if completing)
- Update session record with actual duration
- Calculate pomodoro count

**onEnterPaused:**

- Record pause timestamp
- Show paused badge
- Don't stop timer worker (keeps running)

**onExitPaused:**

- Calculate pause duration
- Add to totalPausedDuration

**onComplete:**

- Mark session as 'completed' in database
- Update daily_aggregate
- Show completion notification
- Play sound (if enabled)
- Increment pomodoro count if work session
- Automatically determine next state (based on auto-start settings)

**onAbandon:**

- Mark session as 'abandoned' in database
- Reset timer state
- Show brief notification

### State Machine Implementation Pattern

**Approach:** Use a state machine library or implement manually.

**Manual Implementation Structure:**

State Machine class:

- Current state property
- Event handler methods
- Guard methods (validate transitions)
- Action methods (side effects)
- Transition map (state + event → new state)

**Transition Method:**

Process:

1. Validate current state + event combination
2. Check guard conditions
3. Execute exit actions for current state
4. Execute entry actions for new state
5. Update current state
6. Emit state change event

**Benefits:**

- Impossible to enter invalid states
- All transitions are explicit and documented
- Easy to visualize (can generate state diagram)
- Simple to test (check transitions)
- Clear error messages for invalid transitions

---

## Reporting System

### Report Types and Metrics

### Daily Report

**Purpose:** Provide insight into a single day's productivity.

**Data Structure:**

- **date**: The report date
- **totalWorkTime**: Sum of all completed work sessions (seconds)
- **totalBreakTime**: Sum of all completed break sessions (seconds)
- **completedPomodoros**: Count of completed work sessions
- **abandonedPomodoros**: Count of abandoned/interrupted work sessions
- **totalSessions**: Total number of all session types
- **focusScore**: (completedPomodoros / (completedPomodoros + abandonedPomodoros)) \* 100
- **completionRate**: Percentage of sessions completed vs started
- **longestStreak**: Longest consecutive completed pomodoros
- **shortestSession**: Minimum actual duration
- **longestSession**: Maximum actual duration
- **averageSessionLength**: Mean actual duration
- **peakProductivityHour**: Hour with most completed pomodoros
- **sessionDistribution**: Array of session counts by hour (24-element array)
- **hourlyWorkTime**: Array of work time by hour
- **tags**: Aggregated tags from sessions with counts

**Visualization Elements:**

- Total work time (large display, formatted as "4h 15m")
- Completed pomodoros count with goal progress
- Focus score gauge (0-100%)
- Hourly distribution bar chart
- Session timeline (visual representation of work/break pattern)
- Comparison to yesterday (trend indicators)

### Weekly Report

**Purpose:** Show productivity trends over the week.

**Data Structure:**

- **weekStart**: Start date of the week
- **weekEnd**: End date of the week
- **dailyBreakdown**: Array of 7 daily reports
- **totalWorkTime**: Sum of week's work time
- **totalBreakTime**: Sum of week's break time
- **totalPomodoros**: Sum of week's completed pomodoros
- **averageDailyWorkTime**: Mean daily work time
- **averageDailyPomodoros**: Mean daily completed pomodoros
- **mostProductiveDay**: Day with highest work time
- **leastProductiveDay**: Day with lowest work time (excluding zero days)
- **consistencyScore**: Inverse of standard deviation (higher = more consistent)
- **weeklyFocusScore**: Average of daily focus scores
- **activeDays**: Number of days with at least one session
- **longestDailyStreak**: Best daily streak in the week
- **weekOverWeekChange**: Percentage change from previous week
- **weeklyGoalProgress**: Progress toward weekly goal (if set)

**Visualization Elements:**

- Weekly total work time (prominent display)
- Daily breakdown bar chart (7 bars, color-coded by productivity)
- Sparkline of daily pomodoro counts
- Week-over-week comparison
- Consistency score indicator
- Day-of-week heatmap (if multiple weeks of data available)

### Monthly Report

**Purpose:** Provide long-term productivity insights and trends.

**Data Structure:**

- **month**: Month number (1-12)
- **year**: Year
- **weeklyBreakdown**: Array of 4-5 weekly summaries
- **totalWorkTime**: Sum of month's work time
- **totalPomodoros**: Sum of month's completed pomodoros
- **averageDailyWorkTime**: Mean daily work time
- **mostProductiveWeek**: Week with highest work time
- **productivityTrend**: 'increasing', 'decreasing', or 'stable'
- **monthlyFocusScore**: Average of daily focus scores
- **activeDays**: Number of days with at least one session
- **totalActiveDays**: Days in month with sessions
- **longestStreak**: Longest consecutive active days
- **monthOverMonthChange**: Percentage change from previous month
- **heatmapData**: 2D array for calendar heatmap (day of week × week of month)
- **hourOfDayDistribution**: Which hours are most productive
- **dayOfWeekDistribution**: Which days of week are most productive
- **monthlyGoalProgress**: Progress toward monthly goal (if set)

**Visualization Elements:**

- Monthly total work time (hero metric)
- Calendar heatmap (intensity by day)
- Weekly trend line chart
- Hour-of-day productivity heatmap
- Day-of-week bar chart
- Month-over-month comparison
- Productivity trend indicator with insight

### Report Generation Strategy

**Calculation Timing:**

1. **Real-time (Live Data):**
   - Current day's running totals
   - Update as sessions complete
   - Display in UI immediately

2. **On-Demand (Lazy Calculation):**
   - Historical daily reports (if not pre-aggregated)
   - Weekly reports
   - Monthly reports
   - Calculate when user requests

3. **Pre-Aggregation (Background Job):**
   - Daily aggregates calculated at end of day
   - Stored in daily_aggregates table
   - Triggered at midnight or on first access of new day

4. **Caching:**
   - Cache report data for 1 hour
   - Invalidate cache on new session completion
   - Store in memory (Zustand) and chrome.storage

**Aggregation Queries:**

**Daily Aggregate Calculation:**

From sessions table:

- Filter by user_id and date
- Group by session_type
- SUM(actual_duration) for work and break time separately
- COUNT(\*) WHERE status = 'completed' for completed pomodoros
- COUNT(\*) WHERE status = 'abandoned' for abandoned count
- MAX(streak_calculation) for longest streak
- Extract hour from started_at for distribution

**Weekly Aggregate Calculation:**

From daily_aggregates table:

- Filter by user_id and date range (7 days)
- SUM(total_work_time) for weekly total
- AVG(total_work_time) for daily average
- STDDEV(total_work_time) for consistency
- Identify max/min days

**Monthly Aggregate Calculation:**

From daily_aggregates table:

- Filter by user_id and month/year
- Group by week for weekly breakdown
- Similar aggregations as weekly
- Generate heatmap data structure

### Analytics and Insights

**Calculated Metrics:**

**Focus Efficiency:**

- Formula: (Total actual work time) / (Total planned work time)
- Accounts for early completions and overtime
- Indicates session quality

**Consistency Score:**

- Formula: 100 - (StandardDeviation(dailyWorkTimes) / Mean(dailyWorkTimes) \* 100)
- Higher score = more consistent daily work
- Range: 0-100

**Break Adherence:**

- Formula: (Breaks taken / Pomodoros completed) \* 100
- Should be close to 100% for healthy work pattern
- Indicates if user is skipping breaks

**Session Quality Score:**

- Formula: Average(sessionActualDuration / sessionPlannedDuration)
- Values close to 1.0 indicate good session discipline
- <0.8 suggests too many early abandonments
- > 1.2 suggests frequently overrunning sessions

**Automated Insights:**

Generate textual insights based on data:

- "You're 20% more productive on Tuesdays!"
- "Your focus drops after 3pm. Consider scheduling difficult tasks earlier."
- "You've completed 5 days in a row! Keep up the streak."
- "You're taking fewer breaks this week. Remember to rest!"

**Insight Generation Rules:**

Condition-based templates:

- IF consistency_score > 80 THEN "You're maintaining excellent consistency!"
- IF break_adherence < 50 THEN "Consider taking more breaks to avoid burnout"
- IF current_streak >= 7 THEN "Amazing! You've worked {streak} days in a row"
- IF today_pomodoros < daily_goal \* 0.5 AND hour >= 20 THEN "Don't worry, tomorrow is a new day"

---

## Validation & Type Safety

### Zod Schema Architecture

**Purpose:** Provide runtime validation and type inference for all data boundaries.

### Domain Schemas

**SessionTypeSchema:**

Enum validation:

- 'work'
- 'short_break'
- 'long_break'

**SessionStatusSchema:**

Enum validation:

- 'completed'
- 'abandoned'
- 'interrupted'

**SessionSchema:**

Fields:

- id: z.string().uuid()
- userId: z.string().uuid()
- sessionType: SessionTypeSchema
- status: SessionStatusSchema
- plannedDuration: z.number().int().positive()
- actualDuration: z.number().int().nonnegative()
- startedAt: z.string().datetime() or z.date()
- completedAt: z.string().datetime().nullable()
- pausedDuration: z.number().int().nonnegative()
- tags: z.array(z.string())
- notes: z.string().optional()
- pomodoroCount: z.number().int().min(1).max(4)

Refinements:

- completedAt must be after startedAt (if not null)
- actualDuration should be <= plannedDuration + reasonable buffer
- If status is 'completed', completedAt must not be null

**UserSettingsSchema:**

Fields:

- userId: z.string().uuid()
- workDuration: z.number().int().min(60).max(7200) // 1min - 2hours
- shortBreakDuration: z.number().int().min(60).max(1800) // 1min - 30min
- longBreakDuration: z.number().int().min(300).max(3600) // 5min - 1hour
- longBreakInterval: z.number().int().min(2).max(10)
- autoStartBreaks: z.boolean()
- autoStartPomodoros: z.boolean()
- notificationEnabled: z.boolean()
- notificationSound: z.string()
- dailyGoalPomodoros: z.number().int().min(1).max(24)

**DailyReportSchema:**

Fields:

- date: z.string().date() or z.date()
- totalWorkTime: z.number().int().nonnegative()
- totalBreakTime: z.number().int().nonnegative()
- completedPomodoros: z.number().int().nonnegative()
- abandonedPomodoros: z.number().int().nonnegative()
- focusScore: z.number().min(0).max(100)
- peakProductivityHour: z.number().int().min(0).max(23).nullable()
- sessionDistribution: z.array(z.number().int()).length(24)

### Type Inference Strategy

**Pattern:** Infer TypeScript types from Zod schemas.

**Implementation:**

Schema definition (source of truth):

```
Define SessionSchema using z.object()
```

Type inference:

```
Export type Session = z.infer<typeof SessionSchema>
```

**Benefits:**

- Single source of truth (schema is the source)
- No manual type duplication
- Runtime validation matches compile-time types
- Refactoring changes both automatically

### Validation Boundaries

**Where to Validate:**

1. **API Boundaries (Database):**
   - Validate data coming from PostgreSQL
   - Use schema.parse() (throws on error)
   - Catch validation errors, log, and handle gracefully

2. **Storage Boundaries (chrome.storage):**
   - Validate data loaded from storage
   - Use schema.safeParse() (returns Result)
   - Handle corrupted data with defaults

3. **User Input Boundaries (Forms):**
   - Validate form submissions
   - Use schema.safeParse() for user-friendly errors
   - Display validation errors in UI

4. **Message Boundaries (Extension Messages):**
   - Validate messages between extension components
   - Prevent malformed messages from causing errors
   - Use schema.parse() with try-catch

5. **External API Boundaries (Future):**
   - Validate responses from external APIs
   - Don't trust external data

### Validation Patterns

**Parse (Throwing):**

Use when:

- Validation failure is unexpected
- In critical paths where invalid data is a bug
- When you want to fail fast

Handling:

```
Try parsing, catch ZodError, log error, throw custom error
```

**SafeParse (Result Type):**

Use when:

- Validation failure is expected (user input)
- When you need to handle errors gracefully
- When you want to continue execution

Handling:

```
Call safeParse, check success property, handle error object
```

**Transform:**

Use when:

- Data needs transformation after validation
- Converting string dates to Date objects
- Normalizing data format

Example:

```
z.string().datetime().transform(str => new Date(str))
```

**Refinement (Custom Validation):**

Use when:

- Complex validation rules
- Cross-field validation
- Business rule validation

Example:

```
z.object({...}).refine(
  data => data.completedAt > data.startedAt,
  { message: "Completed time must be after start time" }
)
```

### Error Handling

**Zod Error Structure:**

ZodError contains:

- issues: Array of validation errors
- Each issue has: path, message, code

**Custom Error Messages:**

Provide user-friendly messages:

```
z.number().min(60, { message: "Work duration must be at least 1 minute" })
```

**Error Aggregation for Forms:**

Collect all errors for display:

```
Parse form data, extract issues, map to field errors object, display in UI
```

**Structured Error Logging:**

Log validation errors with context:

- What was being validated
- Input data (sanitized)
- Validation errors
- Stack trace

### Schema Composition

**Pattern:** Build complex schemas from smaller ones.

**Base Schemas:**

- TimestampSchema
- DurationSchema
- UuidSchema

**Composed Schemas:**

- SessionSchema uses TimestampSchema, DurationSchema, UuidSchema
- Promotes reusability
- Consistent validation rules

**Partial Schemas:**

For updates (where not all fields required):

```
Use SessionSchema.partial() or .pick() for specific fields
```

---

## Dependency Injection

### Composition Root Pattern

**Philosophy:** Manual dependency injection without a DI framework.

**Benefits:**

- No magic or hidden dependencies
- Explicit and easy to understand
- Type-safe with TypeScript
- Zero runtime overhead
- Easy to test (pass mocks)

### Dependency Structure

**Layer Dependencies:**

1. **Domain Layer:**
   - No dependencies (pure business logic)

2. **Application Layer:**
   - Depends on: Domain entities, Repository interfaces
   - Receives: Repository implementations via constructor

3. **Infrastructure Layer:**
   - Depends on: Domain entities, Repository interfaces
   - Implements: Repository interfaces
   - Receives: Database connection, configuration via constructor

4. **Presentation Layer:**
   - Depends on: Application use cases
   - Receives: Zustand store (which contains use cases)

### Container Implementation

**Composition Root (main.ts or background.ts):**

Initialization sequence:

1. **Load Configuration:**
   - Load environment variables
   - Validate configuration with Zod
   - Set defaults for missing values

2. **Initialize Infrastructure:**
   - Create database connection pool
   - Test database connection
   - Run pending migrations (development) or verify (production)

3. **Create Repositories:**
   - Instantiate PostgreSQLSessionRepository(dbPool)
   - Instantiate PostgreSQLReportRepository(dbPool)
   - Instantiate PostgreSQLSettingsRepository(dbPool)

4. **Create Use Cases:**
   - Instantiate StartWorkUseCase(sessionRepo, settingsRepo)
   - Instantiate CompleteSessionUseCase(sessionRepo, reportRepo)
   - Instantiate GetDailyReportUseCase(reportRepo)
   - ... (all use cases)

5. **Create Zustand Store:**
   - Pass use cases to store factory
   - Configure middleware
   - Initialize state

6. **Initialize Services:**
   - Create TimerService(store, useCases)
   - Create NotificationService(settings)
   - Create SyncService(store, repos)

7. **Set Up Extension Listeners:**
   - Register message listeners
   - Set up alarm listeners
   - Initialize badge updates

8. **Start Application:**
   - Mount React app (popup/options)
   - Restore previous session state
   - Begin sync process

### Factory Functions

**Repository Factories:**

Purpose: Create repository instances with dependencies

Pattern:

```
Function takes database pool, returns repository instance
```

**Use Case Factories:**

Purpose: Create use case instances with repository dependencies

Pattern:

```
Function takes repositories, returns use case instance
```

**Store Factory:**

Purpose: Create Zustand store with use case dependencies

Pattern:

```
Function takes use cases, returns configured store
```

### Configuration Management

**Configuration Object Structure:**

Sections:

- database: Connection string, pool size, timeouts
- extension: Extension-specific settings
- notifications: Notification preferences
- sync: Sync intervals and strategies
- logging: Log levels and targets

**Environment-Based Configuration:**

Environments:

- development: Verbose logging, local database, no error tracking
- production: Minimal logging, production database, Sentry enabled
- test: Test database, mock external services

**Configuration Loading:**

Process:

1. Load .env file (development)
2. Load environment variables
3. Merge with default configuration
4. Validate with ConfigSchema (Zod)
5. Throw error if invalid
6. Export typed configuration object

**Type-Safe Configuration:**

Use TypeScript and Zod for type safety:

```
Define ConfigSchema with Zod
Infer Config type from schema
Export validated config object
```

### Error Handling During Initialization

**Database Connection Failure:**

Strategy:

- Retry with exponential backoff (3 attempts)
- If all retries fail, show error to user
- Offer "Retry" button
- Log error details for debugging
- Graceful degradation: Allow offline mode

**Migration Failure:**

Strategy:

- Log error with migration details
- Prevent application start
- Show error message: "Database migration failed. Please contact support."
- Do not attempt automatic rollback (data safety)

**Invalid Configuration:**

Strategy:

- Log configuration validation errors
- Show user-friendly error: "Configuration error. Please check settings."
- Use safe defaults where possible
- Prevent application start if critical config missing (e.g., database connection)

### Testability

**Unit Testing with Mocked Dependencies:**

Pattern:

- Create mock implementations of repository interfaces
- Pass mocks to use case constructors
- Test use case logic in isolation
- Assert repository methods called correctly

**Integration Testing with Real Dependencies:**

Pattern:

- Use test database (separate from development)
- Use real repository implementations
- Test complete flows (use case → repository → database)
- Clean up test data after tests

**Test Doubles:**

Types:

- **Mocks:** Verify interactions (e.g., was save() called?)
- **Stubs:** Provide predetermined responses
- **Spies:** Record calls while using real implementation
- **Fakes:** Simplified working implementations (e.g., in-memory repository)

---

## Error Handling & Logging

### Error Type Hierarchy

**Custom Error Classes:**

**1. DomainError (Base for business logic errors):**

Examples:

- InvalidStateTransitionError
- SessionNotFoundError
- InvalidSessionDurationError
- PomodoroLimitExceededError

Characteristics:

- Extend Error class
- Include error code
- Include contextual data
- User-facing message
- Developer details

**2. InfrastructureError (External system failures):**

Examples:

- DatabaseConnectionError
- DatabaseQueryError
- StorageLimitExceededError
- NetworkError

Characteristics:

- Include retry information
- Include underlying error
- Severity level

**3. ValidationError (Data validation failures):**

Examples:

- SchemaValidationError
- InputValidationError

Characteristics:

- Wraps ZodError
- Field-specific errors
- User-friendly messages

**4. ApplicationError (Use case level errors):**

Examples:

- SessionAlreadyActiveError
- NoActiveSessionError
- InvalidOperationError

Characteristics:

- Application-level context
- Business rule violations
- Recovery suggestions

### Error Handling Patterns

**1. Result Type Pattern (Expected Errors):**

Use for: Operations where failure is expected and part of normal flow

Pattern:

```
Define Result type: { success: true, data: T } | { success: false, error: Error }
Functions return Result instead of throwing
Callers check success and handle error branch
```

Benefits:

- Type-safe error handling
- Forces explicit error handling
- No unexpected exceptions
- Clear control flow

Use cases:

- User input validation
- Business rule checks
- Optional operations

**2. Try-Catch Pattern (Unexpected Errors):**

Use for: Infrastructure failures, unexpected errors, third-party code

Pattern:

```
Wrap risky operations in try-catch
Catch specific error types when possible
Log error details
Rethrow or wrap in custom error
```

Use cases:

- Database operations
- Network requests
- File system operations
- External library calls

**3. Error Boundaries (React):**

Use for: Catching rendering errors in React components

Implementation:

- Create ErrorBoundary component
- Wrap app sections that might fail
- Display fallback UI on error
- Log error to error tracking service
- Provide recovery mechanism (e.g., "Retry" button)

Error boundary locations:

- Root level (catch all errors)
- Route level (isolate page errors)
- Component level (isolate complex components)

### Logging Strategy

**Log Levels:**

1. **DEBUG:**
   - Detailed state changes
   - Function entry/exit
   - Variable values
   - Only in development

2. **INFO:**
   - Normal operations
   - Session started/completed
   - User actions
   - Sync operations

3. **WARN:**
   - Recoverable issues
   - Retry attempts
   - Degraded functionality
   - Configuration issues

4. **ERROR:**
   - Operation failures
   - Unhandled exceptions
   - Data corruption
   - External service failures

**Structured Logging:**

Log entry format (JSON):

```
{
  timestamp: ISO 8601 string
  level: "DEBUG" | "INFO" | "WARN" | "ERROR"
  message: string
  context: {
    userId: string
    sessionId: string
    component: string
  }
  error: {
    name: string
    message: string
    stack: string
    code: string
  }
  requestId: string (for tracing)
  metadata: object (additional data)
}
```

**Logging Targets:**

Development:

- Console with pretty formatting (colors, indentation)
- Verbose output (DEBUG level)
- Source maps for stack traces

Production:

- Sentry for ERROR level
- Cloud logging service for all levels (e.g., AWS CloudWatch, Google Cloud Logging)
- Local storage for recent logs (for user bug reports)
- Minimal PII (personally identifiable information)

**What to Log:**

Log:

- All errors with full context
- User actions (start session, change settings)
- State transitions
- External API calls
- Database queries (in debug mode)
- Performance metrics

Don't log:

- Sensitive user data (passwords, tokens)
- Full database contents
- Excessive noise (every render)

**Log Sampling:**

In high-traffic scenarios:

- Sample INFO logs (e.g., 10%)
- Always log WARN and ERROR
- Use request IDs to trace full flow when needed

### User-Facing Error Messages

**Principles:**

1. Never show technical details to users
2. Explain what went wrong in simple terms
3. Provide actionable next steps
4. Offer recovery options when possible
5. Be empathetic and helpful

**Error Message Patterns:**

**Database Connection Error:**

- User message: "Unable to connect to database. Please check your internet connection and try again."
- Actions: [Retry] [Cancel]
- Log: Full error details, connection string (sanitized), stack trace

**Session Save Error:**

- User message: "Failed to save session. Your work is stored locally and will sync when connection is restored."
- Actions: [OK]
- Log: Error details, session data (sanitized)

**Validation Error:**

- User message: "Invalid input: Work duration must be at least 1 minute."
- Actions: [Fix Input]
- Log: Validation errors, input data

**Unexpected Error:**

- User message: "Something went wrong. Please try again or contact support if the issue persists."
- Actions: [Retry] [Report Bug]
- Log: Full error details, application state snapshot

### Monitoring & Alerting

**Key Metrics to Monitor:**

1. **Error Rates:**
   - Total errors per hour
   - Error rate percentage (errors / total operations)
   - Error type distribution

2. **Performance Metrics:**
   - Database query times
   - Report generation times
   - UI render times
   - Extension load time

3. **Usage Metrics:**
   - Active users
   - Sessions per day
   - Feature usage (which features are used most)

4. **Health Metrics:**
   - Database connection pool status
   - Sync queue length
   - Storage usage

**Alerting Rules:**

Critical Alerts (Immediate Response):

- Database connection failure
- Error rate >10%
- Critical error in production

Warning Alerts (Review Soon):

- Error rate >5%
- Slow database queries (>5 seconds)
- Storage approaching quota

Info Alerts (FYI):

- New feature usage
- Unusual usage patterns
- Performance improvements

**Error Tracking with Sentry:**

Configuration:

- Initialize Sentry in production only
- Set environment (production)
- Set release version (for tracking across versions)
- Configure sample rate (100% for errors, 10% for performance)

Context to Include:

- User ID (anonymized if needed)
- Current session state
- Browser information
- Extension version
- Breadcrumbs (user actions leading to error)

Privacy Considerations:

- Scrub sensitive data from error reports
- Allow users to opt-out of error reporting
- Be transparent about data collection

---

## Testing Strategy

### Testing Pyramid

**Level 1: Unit Tests (70% of tests)**

Focus: Individual functions, classes, and modules in isolation

What to test:

- Domain logic (entities, value objects, state machine)
- Use cases with mocked repositories
- Repository logic with mocked database
- Validators (Zod schemas)
- Selectors (Zustand)
- Pure utility functions
- Timer calculations

Characteristics:

- Fast (entire suite <5 seconds)
- No external dependencies
- High isolation
- Easy to debug
- Run on every file save

**Level 2: Integration Tests (20% of tests)**

Focus: Multiple components working together

What to test:

- Use cases with real repositories and test database
- Database migrations and schema
- Zustand store with real actions
- Timer flow (start, pause, resume, complete)
- Report generation with sample data
- Chrome storage sync

Characteristics:

- Moderate speed (suite <30 seconds)
- Real database (testcontainers)
- Tests realistic scenarios
- Run on pre-commit hook

**Level 3: End-to-End Tests (10% of tests)**

Focus: Complete user workflows

What to test:

- Complete pomodoro cycle
- Session persistence across browser restart
- Settings changes and their effects
- Report viewing
- Notification triggers
- Extension popup interactions

Characteristics:

- Slow (suite 2-5 minutes)
- Real browser environment
- Tests user perspective
- Run on pre-push hook and CI

### Testing Tools

**Unit Test Framework:**

- Vitest: Fast, Vite-native, Jest-compatible API

**Component Testing:**

- React Testing Library: Test components as users interact with them
- @testing-library/jest-dom: Custom matchers

**E2E Testing:**

- Playwright: Reliable cross-browser testing
- playwright-chrome-extension: Extension-specific testing

**Mocking:**

- Vitest mocks: Built-in mocking
- MSW (Mock Service Worker): API mocking (if using external APIs)

**Test Database:**

- Testcontainers: Spin up PostgreSQL in Docker for tests
- Ensures consistent test environment

**Coverage:**

- Vitest coverage: Built-in coverage with c8
- Coverage thresholds enforced in CI

### Unit Testing Strategy

**Domain Layer Tests:**

State Machine Tests:

- Test every valid transition
- Test every invalid transition (should throw or return error)
- Test guard conditions
- Test side effects are called
- Example: "should transition from IDLE to WORK_ACTIVE on START_WORK"

Entity Tests:

- Test creation with valid data
- Test validation rules
- Test behavior methods
- Example: "Session.calculateRemainingTime should account for paused duration"

Value Object Tests:

- Test immutability
- Test equality
- Test validation
- Example: "Duration should not accept negative values"

**Application Layer Tests:**

Use Case Tests (with mocked repositories):

- Setup: Create mocks for repositories
- Execute: Call use case method
- Assert: Verify repository methods called correctly
- Assert: Verify return value/result
- Example:
  - "StartWorkUseCase should create session with correct duration from settings"
  - "CompleteSessionUseCase should update session status and trigger report update"

**Infrastructure Layer Tests:**

Repository Tests (with test database):

- Setup: Create test database connection
- Seed: Insert test data
- Execute: Call repository method
- Assert: Verify database state
- Cleanup: Clear test data
- Example: "PostgreSQLSessionRepository.findByUserAndDate should return all sessions for the date"

**Selector Tests:**

Zustand Selector Tests:

- Setup: Create store with test state
- Execute: Call selector
- Assert: Verify computed value
- Example: "selectProgress should return correct percentage based on remaining time and planned duration"

### Integration Testing Strategy

**Database Integration Tests:**

Migration Tests:

- Test migration up
- Test migration down (rollback)
- Verify schema after migration
- Verify data integrity after migration

Full Stack Tests:

- Setup: Create store with real repositories and test database
- Execute: Perform user action via store
- Assert: Verify database state
- Assert: Verify store state
- Example: "Completing a session should update database and recompute daily aggregate"

**Timer Integration Tests:**

Timer Flow Tests:

- Test complete work session with real timer
- Test pause and resume with time calculations
- Test session completion triggers correct state transitions
- Mock time functions for speed

### End-to-End Testing Strategy

**Playwright Test Structure:**

Setup:

- Load extension in Playwright browser
- Clear extension storage
- Set up test database

Scenarios:

- Complete Pomodoro Cycle:
  1. Open extension popup
  2. Click "Start Work"
  3. Verify timer starts
  4. Wait for session to complete (accelerated time)
  5. Verify notification shown
  6. Verify session saved
  7. Click "Start Break"
  8. Verify break starts

- Settings Persistence:
  1. Open options page
  2. Change work duration to 15 minutes
  3. Save settings
  4. Close and reopen extension
  5. Verify setting persisted
  6. Start session, verify uses new duration

- Report Accuracy:
  1. Complete 3 pomodoros
  2. Open reports page
  3. Verify today's report shows 3 completed pomodoros
  4. Verify total work time is correct

**Extension-Specific Testing:**

Service Worker Tests:

- Test service worker stays alive during session
- Test service worker restarts and recovers state
- Test background alarms trigger correctly

Message Passing Tests:

- Test popup communicates with service worker
- Test state updates propagate to popup

Storage Tests:

- Test chrome.storage.local persistence
- Test storage quota handling

### Test Coverage Goals

**Target Coverage:**

- Domain Layer: 100% (no excuse for gaps)
- Application Layer: 100% (use cases are critical)
- Infrastructure Layer: 90% (some error paths hard to test)
- Presentation Layer: 80% (focus on logic, not every UI detail)
- Overall: >85%

**Coverage Enforcement:**

- Set minimum coverage thresholds in vitest.config
- Block PR merge if coverage drops below threshold
- Generate coverage reports in CI
- Display coverage badge in README

### Testing Best Practices

**1. Test Behavior, Not Implementation:**

- Test what the code does, not how it does it
- Don't test internal details
- Refactor without breaking tests

**2. Arrange-Act-Assert Pattern:**

- Arrange: Set up test data and dependencies
- Act: Execute the code under test
- Assert: Verify the result

**3. Descriptive Test Names:**

- Use "should" statements
- Example: "should return null when session not found"
- Avoid: "test1", "testSessionRepository"

**4. One Assertion Per Test (When Possible):**

- Makes failures easier to understand
- Exceptions: Testing related properties of a result

**5. Isolate Tests:**

- Each test independent
- No shared state between tests
- Use beforeEach for setup

**6. Test Data Builders:**

- Create factory functions for test data
- Makes tests more readable
- Easy to create variations

**7. Fast Feedback:**

- Unit tests should be instant
- Run unit tests on file save (watch mode)
- Run integration tests on commit
- Run E2E tests on push

**8. Test Edge Cases:**

- Null/undefined inputs
- Empty arrays
- Maximum values
- Minimum values
- Invalid inputs

**9. Mock External Dependencies:**

- Don't test external libraries
- Mock database in unit tests
- Mock time functions for timer tests
- Mock Chrome APIs in tests

**10. Keep Tests Simple:**

- Tests should be easier to understand than the code they test
- Avoid complex logic in tests
- Duplicate is better than abstraction in tests

### Continuous Integration

**CI Pipeline:**

On Pull Request:

1. Lint (ESLint)
2. Type check (TypeScript)
3. Unit tests with coverage
4. Integration tests
5. Build extension
6. E2E tests (on main scenarios)
7. Report coverage

On Merge to Main:

1. All PR checks
2. Full E2E test suite
3. Generate test reports
4. Update coverage badge
5. Create release build (if tagged)

**Test Parallelization:**

- Run unit tests in parallel
- Run integration tests in parallel (separate test databases)
- Run E2E tests in parallel (separate browser instances)

---

## Security Considerations

### Extension Security

**Content Security Policy (CSP):**

Manifest configuration:

- Restrict script sources to extension only
- No inline scripts
- No eval()
- No external script loading
- Allow connections only to configured database host

**Permissions Minimization:**

Only request necessary permissions:

- storage: Required for persistence
- alarms: Required for background timer
- notifications: Required for alerts
- Do NOT request: tabs, webNavigation, history, cookies (not needed)

**Message Validation:**

All messages between extension components:

- Validate message structure with Zod
- Validate message sender
- Don't trust message data
- Use type guards

**Storage Security:**

chrome.storage.local:

- Data is local only (not synced)
- Not encrypted by default
- Don't store sensitive data (tokens, passwords)
- Validate data on read

### Database Security

**SQL Injection Prevention:**

Always use parameterized queries:

- Never concatenate user input into SQL
- Use query builders with parameter binding
- Validate input before queries

**Connection Security:**

Database connection:

- Use SSL/TLS for database connections
- Store connection string in environment variables
- Never commit connection strings to repository
- Use least-privilege database user (not admin)

**Database User Permissions:**

Grant only necessary permissions:

- SELECT, INSERT, UPDATE on sessions table
- SELECT, INSERT, UPDATE on daily_aggregates
- SELECT, UPDATE on user_settings
- No DROP, TRUNCATE, or admin permissions

**Data Encryption:**

Consider encryption for:

- Session notes (if sensitive)
- User data at rest (database level)
- Backups

### Input Validation

**User Input:**

All user inputs must be validated:

- Form inputs (durations, settings)
- Search queries
- Notes/tags
- File uploads (if any)

Validation approach:

- Client-side validation (UX)
- Schema validation with Zod (security)
- Sanitize for display (prevent XSS)

**Sanitization:**

For displaying user content:

- Escape HTML entities
- Use React's built-in XSS protection
- Don't use dangerouslySetInnerHTML unless absolutely necessary
- Sanitize URLs if displaying links

### Data Privacy

**User Data Handling:**

Principles:

- Collect only necessary data
- Store locally when possible
- Clear retention policies
- Allow user to export/delete data

**Personally Identifiable Information (PII):**

Do NOT collect:

- Real names (use anonymous user IDs)
- Email addresses (unless for future features)
- Location data
- Browsing history

**Telemetry and Analytics:**

If implemented:

- Opt-in only (ask user permission)
- Anonymous usage statistics only
- No session content
- Clear privacy policy
- Easy opt-out

**Data Export:**

Provide functionality:

- Export all user data (JSON, CSV)
- Clear, readable format
- Include all sessions, settings, reports
- GDPR compliance

**Data Deletion:**

Provide functionality:

- Delete all user data
- Cascade delete (sessions, aggregates)
- Clear chrome.storage
- Confirm action with user

### Third-Party Dependencies

**Dependency Security:**

Practices:

- Regularly update dependencies (automated with Dependabot)
- Audit dependencies (npm audit)
- Review dependencies before adding
- Minimize number of dependencies
- Pin dependency versions

**Supply Chain Security:**

Measures:

- Use lock files (package-lock.json)
- Verify package integrity (checksums)
- Use trusted registries only
- Review package source code (for critical dependencies)

### Error Information Disclosure

**Avoid Leaking Information:**

Don't expose in error messages:

- Database structure
- File paths
- Internal implementation details
- Stack traces (to users)

Do expose:

- User-friendly error descriptions
- Actionable recovery steps

### Secure Communication

**Database Connection:**

If database is remote:

- Use SSL/TLS encryption
- Verify server certificate
- Use connection pooling with security settings

**Future API Communication:**

If adding external APIs:

- HTTPS only
- Verify SSL certificates
- Store API keys securely (not in code)
- Use environment variables
- Rotate keys regularly

---

## Performance Optimization

### Database Performance

**Indexing Strategy:**

Create indexes on:

- sessions(user_id, started_at DESC): For recent sessions queries
- sessions(user_id, session_type, status): For filtered queries
- sessions(completed_at): For report generation
- daily_aggregates(user_id, date DESC): For report queries

Monitor and optimize:

- Use EXPLAIN ANALYZE to check query plans
- Add indexes based on slow query log
- Avoid over-indexing (slows writes)

**Query Optimization:**

Techniques:

- SELECT only needed columns (not SELECT \*)
- Use LIMIT for pagination
- Avoid N+1 queries (use JOINs or batch queries)
- Use database aggregations instead of application-level aggregations
- Cache expensive queries

**Connection Pooling:**

Configuration:

- Pool size: 10-20 connections
- Idle timeout: 30 seconds
- Connection timeout: 5 seconds
- Query timeout: 30 seconds
- Reuse connections efficiently

**Batch Operations:**

For multiple inserts:

- Use batch INSERT statements
- Reduces round trips
- Faster than individual inserts
- Example: Insert all daily sessions at once when syncing

### Frontend Performance

**Bundle Size Optimization:**

Target: <500KB total bundle size

Techniques:

- Code splitting (React.lazy)
- Tree shaking (remove unused code)
- Minimize dependencies
- Use production builds
- Analyze bundle with webpack-bundle-analyzer

**React Performance:**

Optimization techniques:

- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable function references
- Avoid inline object/array creation in render
- Use React DevTools Profiler to identify slow components

**Rendering Optimization:**

Strategies:

- Lazy load non-critical components
- Virtual scrolling for long lists (e.g., session history)
- Debounce user inputs (search, settings)
- Throttle scroll/resize handlers
- Avoid unnecessary re-renders (use selectors)

**Asset Optimization:**

For images/icons:

- Use SVG for icons (smaller, scalable)
- Optimize PNG/JPG (compress)
- Use appropriate sizes
- Lazy load images below fold

### State Management Performance

**Zustand Optimization:**

Techniques:

- Fine-grained selectors (select only what you need)
- Avoid selecting entire state object
- Use shallow equality checks
- Batch state updates
- Memoize computed selectors

**Example:**

Bad:

- Component selects entire store, re-renders on any state change

Good:

- Component selects only `remainingTime`, re-renders only when it changes

**Computed Values:**

Derive instead of store:

- Don't store `progress`, calculate from `remainingTime` and `plannedDuration`
- Don't store `todayWorkTime`, calculate from `todaySessions`
- Use memoization for expensive calculations

### Chrome Extension Performance

**Extension Startup:**

Optimize:

- Lazy load non-critical modules
- Defer non-essential initialization
- Use dynamic imports
- Minimize work in service worker startup

**Message Passing:**

Optimize:

- Batch messages when possible
- Use structured clone for serialization (avoid JSON when possible)
- Minimize message size
- Debounce frequent messages

**Storage Performance:**

Optimize:

- Batch chrome.storage writes
- Avoid writing on every state change
- Use debounce for storage writes
- Store only essential data

**Background Performance:**

Optimize:

- Use chrome.alarms instead of setTimeout
- Minimize service worker wake-ups
- Batch background work
- Use efficient algorithms

### Timer Performance

**Worker Performance:**

Optimize:

- Use Web Workers for timer (off main thread)
- Minimize message passing between worker and main thread
- Use SharedArrayBuffer if needed for high-frequency updates
- Keep worker code minimal

**Tick Rate:**

Balance accuracy and performance:

- 100ms tick rate for UI updates (smooth countdown)
- 1000ms sync rate to database (reduce writes)
- 60s cache invalidation (reduce recalculations)

### Report Generation Performance

**Caching Strategy:**

Cache:

- Daily reports for 1 hour
- Weekly reports for 1 hour
- Monthly reports for 1 hour
- Invalidate cache on new session completion

Implementation:

- Store in Zustand state
- Store timestamps for cache invalidation
- Evict old cache entries

**Pre-Aggregation:**

Strategy:

- Calculate daily aggregates at end of day (background job)
- Store in daily_aggregates table
- Use pre-calculated values for weekly/monthly reports
- Reduces query time from seconds to milliseconds

**Lazy Loading:**

Strategy:

- Load reports on-demand (when user navigates to report page)
- Don't pre-load all reports
- Use loading states
- Paginate historical data

### Memory Management

**Avoid Memory Leaks:**

Common causes and solutions:

- Event listeners: Remove on unmount
- Timers: Clear on unmount
- Subscriptions: Unsubscribe on unmount (Zustand handles this)
- Large data structures: Limit size, paginate

**Garbage Collection:**

Help GC:

- Null out large objects when done
- Avoid creating unnecessary closures
- Use object pooling for frequently created objects (if applicable)

**Monitoring:**

Monitor memory usage:

- Chrome DevTools Memory profiler
- Check for memory growth over time
- Identify leaks in development

### Performance Monitoring

**Metrics to Track:**

1. **Time to Interactive (TTI):**
   - Extension popup open time
   - Target: <500ms

2. **Database Query Time:**
   - Monitor query duration
   - Alert on queries >1s
   - Optimize slow queries

3. **Report Generation Time:**
   - Track time to generate reports
   - Target: <1s for daily, <2s for monthly

4. **Render Time:**
   - Track component render time
   - Use React DevTools Profiler
   - Optimize components >50ms

5. **Bundle Size:**
   - Track over time
   - Alert on significant increases
   - Keep under 500KB

**Performance Budget:**

Set and enforce limits:

- Total bundle size: <500KB
- Initial load time: <500ms
- Database query time: <1s
- Report generation: <2s

**Monitoring Tools:**

- Chrome DevTools Performance tab
- Lighthouse (for web vitals)
- React DevTools Profiler
- Custom performance marks and measures

---

## Implementation Phases

### Phase 1: Foundation (MVP Core)

**Goal:** Establish project structure, core architecture, and basic timer functionality.

**Milestone 1.1: Project Setup (Duration: Initial setup)**

Tasks:

- Initialize TypeScript project with strict mode configuration
- Configure build tool (Vite) for Chrome extension
- Set up directory structure following clean architecture
- Configure ESLint with strict rules and Prettier
- Set up Git repository with .gitignore
- Configure Vitest for testing
- Create initial README with project overview
- Set up CI/CD pipeline basics (GitHub Actions or similar)

Deliverables:

- Buildable project skeleton
- Linting and formatting configuration
- Test framework ready
- Basic documentation

**Milestone 1.2: Domain Layer (Duration: Core logic)**

Tasks:

- Define core entities (Session, TimeEntry, Report)
- Create value objects (SessionType, SessionStatus, Duration)
- Implement state machine logic for timer states
- Create domain services (TimerStateMachine, SessionCalculator)
- Define repository interfaces (ISessionRepository, IReportRepository, ISettingsRepository)
- Create Zod schemas for all entities
- Write comprehensive unit tests for domain layer

Deliverables:

- Complete domain layer with 100% test coverage
- Zod schemas for validation
- State machine with all transitions
- Documentation of business rules

**Milestone 1.3: Infrastructure Layer (Duration: Setup external dependencies)**

Tasks:

- Create PostgreSQL database schema
- Write database migration files
- Set up connection pooling with pg
- Implement PostgreSQLSessionRepository
- Implement PostgreSQLReportRepository
- Implement PostgreSQLSettingsRepository
- Configure Zustand store with middleware (immer, persist, devtools)
- Create storage adapters for chrome.storage.local
- Write integration tests for repositories

Deliverables:

- Working database with migrations
- Repository implementations
- Zustand store structure
- Integration tests passing

**Milestone 1.4: Basic Timer Functionality (Duration: Core feature)**

Tasks:

- Implement timestamp-based timer engine
- Create Web Worker for timer ticking
- Implement StartWorkUseCase
- Implement PauseTimerUseCase
- Implement ResumeTimerUseCase
- Implement CompleteSessionUseCase
- Wire use cases to Zustand store
- Create basic React UI (simple countdown display)
- Implement start, pause, resume, complete actions
- Test complete timer flow
- Implement session persistence to database

Deliverables:

- Working timer with start, pause, resume, complete
- Sessions saved to database
- Basic UI for timer control
- Integration tests for timer flow

**Phase 1 Success Criteria:**

- User can start a work session and it counts down
- User can pause and resume session
- Session automatically completes and saves to database
- All core domain logic tested and working

---

### Phase 2: Chrome Extension Integration

**Goal:** Package application as Chrome extension with full extension capabilities.

**Milestone 2.1: Extension Structure (Duration: Extension setup)**

Tasks:

- Create manifest.json (Manifest V3)
- Configure required permissions
- Set up service worker (background script)
- Create popup HTML and entry point
- Create options page HTML and entry point
- Configure Vite build for extension format
- Set up message passing infrastructure
- Create message type definitions and schemas

Deliverables:

- Loadable Chrome extension
- Popup opens with basic UI
- Service worker initializes
- Message passing working between components

**Milestone 2.2: Background Processing (Duration: Background features)**

Tasks:

- Implement timer state management in service worker
- Integrate chrome.alarms for reliable background timing
- Implement badge updates (show remaining time)
- Implement chrome.notifications for session completion
- Create offline queue for operations
- Implement periodic sync to database
- Handle service worker lifecycle (wake/sleep)
- Restore session state on service worker restart

Deliverables:

- Timer runs in background reliably
- Badge shows remaining time
- Notifications on session complete
- State persists across browser restarts

**Milestone 2.3: UI Development (Duration: Complete UI)**

Tasks:

- Implement timer component with countdown display
- Create start/pause/resume/skip controls
- Implement today's session summary widget
- Create settings page with form for all preferences
- Implement session history view with list
- Style components with CSS (responsive, accessible)
- Implement keyboard shortcuts
- Add loading and error states
- Test UI interactions with E2E tests

Deliverables:

- Polished popup UI
- Functional settings page
- Session history view
- Accessible and responsive design

**Phase 2 Success Criteria:**

- Extension installable and runs in Chrome
- Timer works in background when browser closed
- Notifications appear on session complete
- Settings persist across sessions
- UI is polished and user-friendly

---

### Phase 3: Reporting System

**Goal:** Implement comprehensive reporting and analytics.

**Milestone 3.1: Data Aggregation (Duration: Backend for reports)**

Tasks:

- Implement daily aggregate calculation logic
- Create background job to calculate daily aggregates
- Implement GetDailyReportUseCase
- Implement GetWeeklyReportUseCase
- Implement GetMonthlyReportUseCase
- Create caching layer for reports (in Zustand and chrome.storage)
- Implement cache invalidation on new session
- Optimize aggregation queries for performance
- Create report selectors in Zustand

Deliverables:

- Reports generate accurately
- Caching reduces database load
- Fast report queries (<2s for monthly)

**Milestone 3.2: Report Views (Duration: Frontend for reports)**

Tasks:

- Create DailyReportView component
- Create WeeklyReportView component
- Create MonthlyReportView component
- Implement charts and visualizations (use lightweight chart library)
- Create date picker for viewing historical reports
- Implement report export functionality (CSV format)
- Add insights generation logic
- Style report pages
- Add print-friendly CSS

Deliverables:

- Beautiful daily/weekly/monthly report views
- Interactive charts
- Export functionality
- Automated insights

**Phase 3 Success Criteria:**

- User can view today's report with all metrics
- User can view weekly trends
- User can view monthly calendar heatmap
- Reports are accurate and fast
- Export works for data portability

---

### Phase 4: Polish and Optimization

**Goal:** Production-ready quality, performance, and user experience.

**Milestone 4.1: Performance Optimization (Duration: Optimization pass)**

Tasks:

- Analyze and reduce bundle size
- Implement code splitting for options page
- Optimize database queries (add missing indexes)
- Implement virtual scrolling for session history
- Optimize React re-renders (memoization)
- Reduce chrome.storage write frequency
- Optimize timer tick rate
- Run Lighthouse audit and fix issues
- Test performance on low-end devices

Deliverables:

- Bundle size <500KB
- Popup opens <500ms
- Reports generate <2s
- Smooth UI performance

**Milestone 4.2: UX Enhancements (Duration: Polish)**

Tasks:

- Add animations and transitions (subtle, fast)
- Implement sound effects for notifications (optional, configurable)
- Add more customization options (themes, sounds)
- Implement keyboard shortcuts documentation
- Create onboarding flow for first-time users
- Add tooltips and help text
- Implement "What's New" modal for updates
- Polish visual design (colors, spacing, typography)

Deliverables:

- Delightful user experience
- Smooth animations
- Customization options
- Helpful onboarding

**Milestone 4.3: Production Readiness (Duration: Launch preparation)**

Tasks:

- Set up error tracking (Sentry or similar)
- Implement privacy-respecting analytics (optional, opt-in)
- Write comprehensive user documentation
- Create privacy policy document
- Create promotional images and screenshots
- Write Chrome Web Store listing description
- Test on multiple Chrome versions
- Conduct security audit
- Set up user feedback mechanism (GitHub issues)
- Create demo video
- Prepare launch checklist

Deliverables:

- Error tracking active
- Complete documentation
- Chrome Web Store listing ready
- Security audit passed

**Phase 4 Success Criteria:**

- Extension is performant and polished
- All documentation complete
- Ready for Chrome Web Store submission
- Error tracking and monitoring in place
- User onboarding is smooth

---

### Post-Launch Phases (Future)

**Phase 5: Advanced Features (Future enhancements)**

Potential features:

- Multi-device sync (cloud backend)
- Team/shared pomodoros
- Integration with task management tools (Todoist, Asana)
- Website blocking during work sessions
- Advanced analytics (focus patterns, productivity insights)
- Custom pomodoro templates
- Gamification (achievements, streaks, levels)
- Social features (share progress)

**Phase 6: Mobile Apps (Long-term)**

Potential expansion:

- React Native mobile app
- Shared codebase (domain/application layers)
- Mobile-specific UI
- Cross-platform sync

---

## Production Checklist

### Pre-Launch Checklist

**Code Quality:**

- [ ] All tests passing (unit, integration, E2E)
- [ ] Test coverage >85%
- [ ] No ESLint errors or warnings
- [ ] TypeScript strict mode with no errors
- [ ] Code review completed
- [ ] Security audit completed

**Performance:**

- [ ] Bundle size <500KB
- [ ] Popup opens <500ms
- [ ] All database queries <1s
- [ ] Report generation <2s
- [ ] Lighthouse score >90

**Functionality:**

- [ ] All features working as specified
- [ ] Timer accurate (no drift)
- [ ] Sessions persist correctly
- [ ] Reports calculate accurately
- [ ] Settings save and load correctly
- [ ] Notifications work
- [ ] Badge updates correctly
- [ ] Offline mode works
- [ ] Sync works when online

**Compatibility:**

- [ ] Tested on latest Chrome version
- [ ] Tested on Chrome 2 versions back
- [ ] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux
- [ ] Tested with various screen sizes

**Database:**

- [ ] Migrations tested (up and down)
- [ ] Indexes created for performance
- [ ] Connection pooling configured
- [ ] Backup strategy in place
- [ ] Data retention policy defined

**Security:**

- [ ] No secrets in code or repository
- [ ] All inputs validated
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] CSP configured correctly
- [ ] Permissions minimized

**Documentation:**

- [ ] README complete
- [ ] User guide written
- [ ] Privacy policy created
- [ ] Architecture documented
- [ ] API documentation complete
- [ ] Changelog started

**Error Handling:**

- [ ] All errors logged appropriately
- [ ] User-facing errors are friendly
- [ ] Error tracking (Sentry) configured
- [ ] Error recovery mechanisms tested
- [ ] Edge cases handled

**Chrome Web Store:**

- [ ] Extension icons (16px, 48px, 128px) ready
- [ ] Promotional images (1280x800) created
- [ ] Screenshots (1280x800 or 640x400) ready
- [ ] Store listing description written
- [ ] Privacy policy URL ready
- [ ] Support URL/email configured
- [ ] Version number set correctly

**Legal:**

- [ ] Privacy policy compliant with GDPR (if applicable)
- [ ] Terms of service (if applicable)
- [ ] License chosen and file included
- [ ] Third-party licenses acknowledged

**Deployment:**

- [ ] Production environment configured
- [ ] Environment variables set
- [ ] Database connection tested
- [ ] CI/CD pipeline working
- [ ] Rollback plan ready

**Monitoring:**

- [ ] Error tracking configured
- [ ] Performance monitoring set up
- [ ] Alerts configured
- [ ] Dashboard for key metrics

**Support:**

- [ ] Issue tracker set up (GitHub Issues)
- [ ] Support email or forum ready
- [ ] FAQ document created
- [ ] Response process defined

### Launch Day Checklist

**Final Testing:**

- [ ] Smoke test all critical paths
- [ ] Verify production database connection
- [ ] Test with production build
- [ ] Verify error tracking works

**Deployment:**

- [ ] Upload to Chrome Web Store
- [ ] Submit for review
- [ ] Monitor review status
- [ ] Respond to reviewer feedback if any

**Communication:**

- [ ] Announcement ready (blog, social media)
- [ ] Share with beta testers
- [ ] Update personal website/portfolio
- [ ] Post on relevant communities (Reddit, HN, etc.)

**Monitoring:**

- [ ] Monitor error rates
- [ ] Monitor user feedback
- [ ] Monitor performance metrics
- [ ] Be ready to deploy hotfix if needed

### Post-Launch Checklist

**Week 1:**

- [ ] Monitor user reviews and ratings
- [ ] Respond to user feedback
- [ ] Fix critical bugs (hotfix if needed)
- [ ] Analyze usage metrics
- [ ] Update documentation based on feedback

**Week 2-4:**

- [ ] Address non-critical bugs
- [ ] Implement quick wins from feedback
- [ ] Optimize based on performance data
- [ ] Plan next iteration

**Ongoing:**

- [ ] Regular dependency updates
- [ ] Security patches
- [ ] Feature development based on roadmap
- [ ] Community engagement

---

## Conclusion

This plan provides a comprehensive roadmap for building a production-ready Pomodoro timer Chrome extension with clean architecture, modern state management, robust data persistence, and comprehensive analytics.

**Key Success Factors:**

1. **Clean Architecture:** Separation of concerns ensures maintainability and testability
2. **Zustand State Management:** Single source of truth eliminates synchronization issues
3. **Timestamp-Based Timer:** Prevents drift and ensures accuracy
4. **PostgreSQL Persistence:** Reliable data storage with advanced querying
5. **Comprehensive Testing:** Confidence in code quality and functionality
6. **Performance Optimization:** Fast, responsive user experience
7. **Security Best Practices:** Protects user data and prevents vulnerabilities

**Next Steps:**

1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1: Foundation implementation
4. Iterate based on testing and feedback

**Timeline Estimate:**

- Phase 1: Foundation - Core development period
- Phase 2: Chrome Extension - Extension-specific work
- Phase 3: Reporting System - Analytics implementation
- Phase 4: Polish & Optimization - Production readiness

Total development effort depends on team size, experience, and available time. With dedicated effort, a working MVP (Phase 1-2) can be achieved, followed by reports and polish.

**Success Metrics:**

Post-launch:

- User retention rate
- Daily active users
- Average sessions per user
- User ratings on Chrome Web Store
- Bug report rate
- Performance metrics

This plan is comprehensive but flexible. Adjust based on user feedback, technical constraints, and evolving requirements. Focus on delivering value incrementally, starting with the core timer functionality and building from there.

---

**End of Plan**
