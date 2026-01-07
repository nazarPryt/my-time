# Database Setup Guide

This guide will help you set up PostgreSQL database using Supabase for the Pomodoro Timer application.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Bun package manager installed
- Basic knowledge of PostgreSQL

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: my-time (or any name you prefer)
   - **Database Password**: Choose a strong password (save it securely!)
   - **Region**: Select the closest region to you
4. Click "Create new project"
5. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Get Your Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the database password you chose in Step 1

## Step 3: Configure Environment Variables

1. Create a `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and update the `DATABASE_URL`:

   ```env
   # Replace with your actual Supabase connection string
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres

   # For local development, you can use this default user ID
   DEFAULT_USER_ID=00000000-0000-0000-0000-000000000000
   ```

3. **Important**: Never commit the `.env` file to Git! It's already in `.gitignore`.

## Step 4: Generate and Run Migrations

1. Generate migration files from the schema:

   ```bash
   bun db:generate
   ```

   This will create migration SQL files in `src/infrastructure/database/migrations/`

2. Push the schema to your Supabase database:

   ```bash
   bun db:push
   ```

   This command will:
   - Create the `sessions` table
   - Create the `daily_aggregates` table
   - Create the `user_settings` table
   - Set up all necessary indexes and constraints

3. Verify the migration:
   - Go to Supabase dashboard → **Table Editor**
   - You should see three new tables:
     - `sessions`
     - `daily_aggregates`
     - `user_settings`

## Step 5: Verify Database Connection

You can test the connection using the database studio:

```bash
bun db:studio
```

This will open Drizzle Studio in your browser where you can:

- Browse your tables
- View and edit data
- Test queries

## Database Schema Overview

### `sessions` Table

Stores all Pomodoro sessions and breaks.

**Columns:**

- `id` (UUID): Unique session identifier
- `user_id` (UUID): User identifier
- `session_type` (ENUM): 'work', 'short_break', or 'long_break'
- `status` (ENUM): 'completed', 'abandoned', or 'interrupted'
- `planned_duration` (INTEGER): Intended duration in seconds
- `actual_duration` (INTEGER): Actual duration in seconds
- `started_at` (TIMESTAMP): Session start time
- `completed_at` (TIMESTAMP): Session end time (nullable)
- `paused_duration` (INTEGER): Total paused time in seconds
- `tags` (TEXT[]): Array of tags
- `notes` (TEXT): Optional notes
- `pomodoro_count` (INTEGER): Position in pomodoro cycle (1-4)
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

### `daily_aggregates` Table

Pre-computed daily statistics for fast report generation.

**Columns:**

- `id` (UUID): Unique identifier
- `user_id` (UUID): User identifier
- `date` (DATE): The day this aggregate represents
- `total_work_time` (INTEGER): Total seconds of work
- `total_break_time` (INTEGER): Total seconds of breaks
- `completed_pomodoros` (INTEGER): Number of completed work sessions
- `abandoned_pomodoros` (INTEGER): Number of abandoned work sessions
- `total_sessions` (INTEGER): Total session count
- `focus_score` (DECIMAL): Completion rate (0-100)
- `longest_streak` (INTEGER): Longest consecutive completed pomodoros
- `peak_hour` (INTEGER): Most productive hour (0-23)
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

### `user_settings` Table

User preferences and configuration.

**Columns:**

- `user_id` (UUID): User identifier (primary key)
- `work_duration` (INTEGER): Default work duration in seconds (default: 1500 = 25 min)
- `short_break_duration` (INTEGER): Short break duration (default: 300 = 5 min)
- `long_break_duration` (INTEGER): Long break duration (default: 900 = 15 min)
- `long_break_interval` (INTEGER): Pomodoros before long break (default: 4)
- `auto_start_breaks` (BOOLEAN): Auto-start break after work (default: false)
- `auto_start_pomodoros` (BOOLEAN): Auto-start work after break (default: false)
- `notification_enabled` (BOOLEAN): Enable notifications (default: true)
- `notification_sound` (TEXT): Sound identifier (default: 'default')
- `daily_goal_pomodoros` (INTEGER): Daily pomodoro target (default: 8)
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

## Available Database Commands

```bash
# Generate migration files from schema changes
bun db:generate

# Push schema changes to database
bun db:push

# Run migrations (alternative to push)
bun db:migrate

# Open Drizzle Studio (database GUI)
bun db:studio
```

## Troubleshooting

### Connection Issues

**Error: "DATABASE_URL environment variable is not set"**

- Make sure you created the `.env` file
- Verify the `DATABASE_URL` is correctly set
- Restart your development server

**Error: "Connection refused"**

- Check your Supabase project status (should be "Active")
- Verify the connection string is correct
- Check if your IP is allowed (Supabase allows all IPs by default)

**Error: "SSL connection required"**

- The code automatically handles SSL for Supabase URLs
- If issues persist, check your Supabase connection settings

### Migration Issues

**Error: "relation already exists"**

- The table was already created
- Use `bun db:studio` to check existing tables
- If you want to start fresh, drop the tables in Supabase dashboard first

**Schema changes not applying**

- Delete the existing migration files in `src/infrastructure/database/migrations/`
- Run `bun db:generate` again
- Run `bun db:push` to apply changes

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong database passwords** - At least 16 characters with mixed case, numbers, and symbols
3. **Rotate passwords regularly** - Change your database password every 3-6 months
4. **Use Row Level Security (RLS)** - For production, enable RLS in Supabase
5. **Monitor access logs** - Check Supabase logs regularly for suspicious activity

## Next Steps

After setting up the database:

1. Test the connection by running the application
2. Create your first session to verify data persistence
3. Check the data in Supabase dashboard or Drizzle Studio
4. Set up regular backups in Supabase (Settings → Database → Backups)

## Support

If you encounter any issues:

1. Check the Supabase status page: https://status.supabase.com
2. Review Supabase documentation: https://supabase.com/docs
3. Check Drizzle ORM documentation: https://orm.drizzle.team/docs/overview
4. Open an issue in the project repository

---

**Last Updated:** 2026-01-07
