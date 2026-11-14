import { asc, count, desc, eq, gte, inArray } from 'drizzle-orm';
import { db } from '#lib/db/drizzle.ts';
import { exercises, sets, workoutExercises, workouts } from '#lib/db/schema.ts';

export async function getWorkoutHistory() {
  const rows = await db.select().from(workouts).orderBy(desc(workouts.date), desc(workouts.id));

  const exerciseCounts = await db
    .select({ workoutId: workoutExercises.workoutId, total: count() })
    .from(workoutExercises)
    .groupBy(workoutExercises.workoutId);

  const setCounts = await db
    .select({ workoutId: workoutExercises.workoutId, total: count() })
    .from(sets)
    .innerJoin(workoutExercises, eq(sets.workoutExerciseId, workoutExercises.id))
    .groupBy(workoutExercises.workoutId);

  const exerciseTotals = new Map(exerciseCounts.map((row) => [row.workoutId, row.total]));
  const setTotals = new Map(setCounts.map((row) => [row.workoutId, row.total]));

  return rows.map((workout) => ({
    id: workout.id,
    name: workout.name,
    variant: workout.variant,
    date: workout.date instanceof Date ? workout.date.toISOString() : null,
    duration: workout.time,
    exerciseCount: exerciseTotals.get(workout.id) ?? 0,
    setCount: setTotals.get(workout.id) ?? 0
  }));
}

export async function getWorkoutDetail(id: number) {
  const [workout] = await db.select().from(workouts).where(eq(workouts.id, id)).limit(1);
  if (!workout) return null;

  const entries = await db
    .select({
      id: workoutExercises.id,
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      weighted: exercises.weighted,
      timed: exercises.timed,
      equipment: exercises.otherEquipment
    })
    .from(workoutExercises)
    .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .where(eq(workoutExercises.workoutId, id))
    .orderBy(asc(workoutExercises.id));

  const entryIds = entries.map((entry) => entry.id);
  const setRows = entryIds.length
    ? await db
        .select()
        .from(sets)
        .where(inArray(sets.workoutExerciseId, entryIds))
        .orderBy(asc(sets.id))
    : [];

  const setsByEntry = new Map<number, typeof setRows>();
  for (const set of setRows) {
    const current = setsByEntry.get(set.workoutExerciseId) ?? [];
    current.push(set);
    setsByEntry.set(set.workoutExerciseId, current);
  }

  return {
    id: workout.id,
    name: workout.name,
    variant: workout.variant,
    date: workout.date instanceof Date ? workout.date.toISOString() : null,
    duration: workout.time,
    exercises: entries.map((entry) => ({
      ...entry,
      sets: setsByEntry.get(entry.id) ?? []
    }))
  };
}

export async function getTrainingStats(weekCount = 8) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const mondayOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayOffset - (weekCount - 1) * 7);

  const rows = await db
    .select({
      workoutId: workouts.id,
      date: workouts.date,
      exerciseName: exercises.name,
      weight: sets.weight,
      reps: sets.reps
    })
    .from(sets)
    .innerJoin(workoutExercises, eq(sets.workoutExerciseId, workoutExercises.id))
    .innerJoin(workouts, eq(workoutExercises.workoutId, workouts.id))
    .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .where(gte(workouts.date, start));

  const buckets = Array.from({ length: weekCount }, (_, index) => {
    const bucketStart = new Date(start);
    bucketStart.setDate(start.getDate() + index * 7);
    const bucketEnd = new Date(bucketStart);
    bucketEnd.setDate(bucketStart.getDate() + 7);

    return {
      start: bucketStart,
      end: bucketEnd,
      volume: 0,
      sets: 0,
      workoutIds: new Set<number>(),
      exerciseVolumes: new Map<string, number>()
    };
  });

  const exerciseVolumes = new Map<string, number>();

  for (const row of rows) {
    if (!(row.date instanceof Date)) continue;

    const bucket = buckets.find(
      (item) => row.date instanceof Date && row.date >= item.start && row.date < item.end
    );
    if (!bucket) continue;

    const volume = (row.weight ?? 0) * (row.reps ?? 0);
    bucket.volume += volume;
    bucket.sets += 1;
    bucket.workoutIds.add(row.workoutId);
    exerciseVolumes.set(row.exerciseName, (exerciseVolumes.get(row.exerciseName) ?? 0) + volume);
  }

  const weeks = buckets.map((bucket) => ({
    label: new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
      bucket.start
    ),
    volume: Math.round(bucket.volume),
    sets: bucket.sets,
    workouts: bucket.workoutIds.size
  }));

  const topExercises = [...exerciseVolumes.entries()]
    .filter(([, volume]) => volume > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, volume]) => ({ name, volume: Math.round(volume) }));

  return {
    weeks,
    maxVolume: Math.max(1, ...weeks.map((week) => week.volume)),
    topExercises
  };
}
