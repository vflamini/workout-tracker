import type { RequestEvent } from '@sveltejs/kit';
import { db } from '#lib/db/drizzle.ts';
import { workoutExercises, sets } from '#lib/db/schema.ts';

export async function POST({ request }: RequestEvent) {
  try {
    const workouts = await request.json();
    for (const workout of workouts) {
      const inserted = await db
        .insert(workoutExercises)
        .values({
          exerciseId: workout.exercise.id,
          workoutId: workout.id
        })
        .returning({ id: workoutExercises.id });
      const id = inserted[0].id;
      await db.insert(sets).values({
        workoutExerciseId: id,
        weight: workout.exercise.weight,
        time: workout.exercise.time,
        reps: workout.exercise.reps
      });
    }
    return Response.json({ success: true });
  } catch (e) {
    console.error('There was an error submitting a workout exercise to the db:');
    console.error(`ERROR: ${e instanceof Error ? e.message : 'unknown'}`);
  }
}
