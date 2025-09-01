import { json } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { weights } from '$lib/db/schema';

export async function GET() {
  const allWeights = await db.select().from(weights);
  return json(allWeights);
}

export async function POST({ request }) {
  const {
    type, defaultBaseWeight
  } = await request.json();
  const [newWeight] = await db
    .insert(weights)
    .values({
      type, defaultBaseWeight
    })
    .returning();
  return json({ id: newWeight.id });
}