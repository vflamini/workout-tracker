import { count, desc } from 'drizzle-orm';
import { db } from '#lib/db/drizzle.ts';
import { exercises, sets, workouts } from '#lib/db/schema.ts';

export async function getOverview() {
  const [workoutTotal] = await db.select({ value: count() }).from(workouts);
  const [exerciseTotal] = await db.select({ value: count() }).from(exercises);

  let setTotal: number;
  try {
    const [setCount] = await db.select({ value: count() }).from(sets);
    setTotal = setCount?.value ?? 0;
  } catch {
    setTotal = 0;
  }

  const recent = await db.select().from(workouts).orderBy(desc(workouts.date)).limit(4);

  return {
    totals: {
      workouts: workoutTotal?.value ?? 0,
      exercises: exerciseTotal?.value ?? 0,
      sets: setTotal
    },
    recent: recent.map((workout) => ({
      id: workout.id,
      name: workout.name,
      variant: workout.variant,
      date: workout.date instanceof Date ? workout.date.toISOString() : null
    }))
  };
}
