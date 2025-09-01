import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey
} from 'drizzle-orm/sqlite-core';

export const weights = sqliteTable('weights', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  type: text('type').notNull(),
  defaultBaseWeight: real('defaultBaseWeight').notNull()
});

export const workouts = sqliteTable('workouts', {
  id: integer('id', { mode: 'boolean' }).notNull().primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  variant: text('variant'),
  date: integer('date', { mode: 'timestamp' }),
  time: integer('time')
});

export const exercises = sqliteTable('exercises', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  weighted: integer('weighted', { mode: 'boolean' }).notNull(),
  weightBaseAmount: real('weight_base_amt'),
  timed: integer('timed', { mode: 'boolean' }).notNull(),
  weightId: integer('weight_id').references(() => weights.id),
  numHands: integer('num_hands'),
  targetMuscle: text('target_muscle'),
  otherEquipment: text('other_equipment')
});

export const workoutExercises = sqliteTable('workout_exercises', 
  {
    exerciseId: integer('exercise_id').notNull().references(() => exercises.id),
    workoutId: integer('workout_id').notNull().references(() => workouts.id),
    weight: real('weight'),
    time: real('time'),
    reps: integer('reps')
  },
  (table) => [
    primaryKey({ columns: [table.exerciseId, table.workoutId] }),
  ]
);