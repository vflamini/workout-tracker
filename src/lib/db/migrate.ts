import type BetterSqlite3 from 'better-sqlite3';

interface TableRow {
  name: string;
}

interface ColumnRow {
  name: string;
}

function getTables(sqlite: BetterSqlite3.Database) {
  const rows = sqlite
    .prepare("select name from sqlite_master where type = 'table'")
    .all() as TableRow[];
  return new Set(rows.map((row) => row.name));
}

function getColumns(sqlite: BetterSqlite3.Database, table: string) {
  const rows = sqlite.prepare(`PRAGMA table_info('${table}')`).all() as ColumnRow[];
  return new Set(rows.map((row) => row.name));
}

const createSetsTable = `
  CREATE TABLE IF NOT EXISTS sets (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    workout_exercise_id integer NOT NULL,
    weight real,
    time real,
    reps integer,
    FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON UPDATE no action ON DELETE no action
  );

  CREATE INDEX IF NOT EXISTS sets_workout_exercise_id_idx
    ON sets (workout_exercise_id);
`;

export function ensureSchema(sqlite: BetterSqlite3.Database) {
  const tables = getTables(sqlite);

  if (tables.has('workout_exercises') && !getColumns(sqlite, 'workout_exercises').has('id')) {
    const migrateWorkoutExercises = sqlite.transaction(() => {
      sqlite.exec(`
        ALTER TABLE workout_exercises RENAME TO workout_exercises_old;

        CREATE TABLE workout_exercises (
          id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          exercise_id integer NOT NULL,
          workout_id integer NOT NULL,
          FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE no action ON DELETE no action,
          FOREIGN KEY (workout_id) REFERENCES workouts(id) ON UPDATE no action ON DELETE no action
        );

        INSERT INTO workout_exercises (exercise_id, workout_id)
          SELECT exercise_id, workout_id FROM workout_exercises_old;

        ${createSetsTable}

        INSERT INTO sets (workout_exercise_id, weight, time, reps)
          SELECT we.id, old.weight, old.time, old.reps
          FROM workout_exercises we
          JOIN workout_exercises_old old
            ON old.exercise_id = we.exercise_id AND old.workout_id = we.workout_id
          WHERE old.weight IS NOT NULL OR old.time IS NOT NULL OR old.reps IS NOT NULL;

        DROP TABLE workout_exercises_old;

        CREATE INDEX IF NOT EXISTS workout_exercises_workout_id_idx
          ON workout_exercises (workout_id);
      `);
    });

    migrateWorkoutExercises();
    return;
  }

  if (!tables.has('sets')) {
    sqlite.exec(createSetsTable);
  }
}
