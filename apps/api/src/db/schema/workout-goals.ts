import {
	DEFAULT_EXERCISE_TYPE,
	DEFAULT_WORKOUT_GOAL_REPS,
	type ExerciseType,
} from 'contracts'
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
		exerciseType: text('exercise_type')
			.$type<ExerciseType>()
			.notNull()
			.default(DEFAULT_EXERCISE_TYPE),
		targetReps: integer('target_reps')
			.notNull()
			.default(DEFAULT_WORKOUT_GOAL_REPS),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => [unique().on(table.userId, table.exerciseType)],
)
