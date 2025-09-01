import { db } from '$lib/db/drizzle';
import { exercises, weights } from '$lib/db/schema';

export async function load() {
  const allExercises = await db.select().from(exercises);
  const allWeights = await db.select().from(weights);
  return {
    exercises: allExercises,
    weights: allWeights
  };
}