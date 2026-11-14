import { error } from '@sveltejs/kit';
import { getWorkoutDetail } from '#lib/db/queries/workouts.ts';

export async function load({ params }) {
  const id = Number(params.id);

  if (!Number.isInteger(id) || id <= 0) {
    error(404, 'Workout not found');
  }

  const workout = await getWorkoutDetail(id);

  if (!workout) {
    error(404, 'Workout not found');
  }

  return { workout };
}
