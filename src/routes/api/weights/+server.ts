import type { RequestEvent } from '@sveltejs/kit';
import { db } from '#lib/db/drizzle.ts';
import { weights } from '#lib/db/schema.ts';

export async function GET() {
  const allWeights = await db.select().from(weights);
  return Response.json(allWeights);
}

export async function POST({ request }: RequestEvent) {
  const { type, defaultBaseWeight } = await request.json();
  const [newWeight] = await db
    .insert(weights)
    .values({
      type,
      defaultBaseWeight
    })
    .returning();
  return Response.json({ id: newWeight.id });
}
