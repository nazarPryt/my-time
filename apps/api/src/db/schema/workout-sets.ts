import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const workoutSets = pgTable('workout_sets', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	exerciseType: text('exercise_type').notNull().default('pushups'),
	reps: integer('reps').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})
