import { json } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { exercises } from '$lib/db/schema';

export async function GET() {
  const allExercises = await db.select().from(exercises);
  return json(allExercises);
}

export async function POST({ request }) {
  const {
    name, weighted, weightBaseAmount, timed,
    weightId, numHands, targetMuscle, otherEquipment
  } = await request.json();
  const [newExercise] = await db
    .insert(exercises)
    .values({
      name, weighted, weightBaseAmount, timed,
      weightId, numHands, targetMuscle, otherEquipment
    })
    .returning();
  return json({ id: newExercise.id });
}