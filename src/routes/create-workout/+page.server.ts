import { db } from '$lib/db/drizzle';
import { exercises, workouts, weights } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export async function load() {
  const allExercises = await db
    .select({
      id: exercises.id,
      exerciseName: exercises.name,
      weighted: exercises.weighted,
      weightId: exercises.weightId,
      weightName: weights.type,
      equipment: exercises.otherEquipment,
      isTimed: exercises.timed
    })
    .from(exercises)
    .leftJoin(weights, eq(exercises.weightId, weights.id));;
  const allWorkouts = await db.select().from(workouts);
  return {
    exercises: allExercises,
    workouts: allWorkouts
  };
}