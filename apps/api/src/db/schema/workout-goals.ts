import {
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const workoutGoals = pgTable(
	'workout_goals',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		exerciseType: text('exercise_type').notNull().default('pushups'),
		targetReps: integer('target_reps').notNull().default(100),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => [unique().on(table.userId, table.exerciseType)],
)
