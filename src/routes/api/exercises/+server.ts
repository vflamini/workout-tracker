import type { RequestEvent } from '@sveltejs/kit';
import { db } from '#lib/db/drizzle.ts';
import { exercises } from '#lib/db/schema.ts';

export async function GET() {
  const allExercises = await db.select().from(exercises);
  return Response.json(allExercises);
}

export async function POST({ request }: RequestEvent) {
  const {
    name,
    weighted,
    weightBaseAmount,
    timed,
    weightId,
    numHands,
    targetMuscle,
    otherEquipment
  } = await request.json();
  const [newExercise] = await db
    .insert(exercises)
    .values({
      name,
      weighted,
      weightBaseAmount,
      timed,
      weightId,
      numHands,
      targetMuscle,
      otherEquipment
    })
    .returning();
  return Response.json({ id: newExercise.id });
}
