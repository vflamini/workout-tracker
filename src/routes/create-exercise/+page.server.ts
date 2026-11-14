import { db } from '#lib/db/drizzle.ts';
import { exercises, weights } from '#lib/db/schema.ts';

export async function load() {
  const allExercises = await db.select().from(exercises);
  const allWeights = await db.select().from(weights);
  return {
    exercises: allExercises,
    weights: allWeights
  };
}
