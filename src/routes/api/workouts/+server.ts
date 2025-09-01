import { json } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { workouts } from '$lib/db/schema';

export async function GET() {
  const allWorkouts = await db.select().from(workouts);
  return json(allWorkouts);
}

export async function POST({ request }) {
  const {
    name, variant, date, time
  } = await request.json();
  const [newWorkout] = await db
    .insert(workouts)
    .values({ name, variant, date, time })
    .returning();
  return json({ id: newWorkout.id });
}