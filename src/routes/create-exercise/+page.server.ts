import { asc, eq } from 'drizzle-orm';
import { db } from '#lib/db/drizzle.ts';
import { exercises, weights } from '#lib/db/schema.ts';

export async function load() {
  const allExercises = await db
    .select({
      id: exercises.id,
      name: exercises.name,
      weighted: exercises.weighted,
      timed: exercises.timed,
      weightType: weights.type,
      otherEquipment: exercises.otherEquipment
    })
    .from(exercises)
    .leftJoin(weights, eq(exercises.weightId, weights.id))
    .orderBy(asc(exercises.name));

  const allWeights = await db.select().from(weights);
  return {
    exercises: allExercises,
    weights: allWeights
  };
}
