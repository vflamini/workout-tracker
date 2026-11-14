import type { RequestEvent } from '@sveltejs/kit';
import { db } from '#lib/db/drizzle.ts';
import { workouts } from '#lib/db/schema.ts';

export async function GET() {
  const allWorkouts = await db.select().from(workouts);
  return Response.json(allWorkouts);
}

export async function POST({ request }: RequestEvent) {
  const { name, variant, date, time } = await request.json();
  const [newWorkout] = await db.insert(workouts).values({ name, variant, date, time }).returning();
  return Response.json({ id: newWorkout.id });
}
