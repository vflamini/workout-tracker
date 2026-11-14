import { getWorkoutHistory } from '#lib/db/queries/workouts.ts';

export async function load() {
  return {
    workouts: await getWorkoutHistory()
  };
}
