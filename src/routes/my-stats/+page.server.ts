import { getOverview } from '#lib/db/queries/overview.ts';
import { getTrainingStats } from '#lib/db/queries/workouts.ts';

export async function load() {
  const [overview, training] = await Promise.all([getOverview(), getTrainingStats()]);

  return {
    totals: overview.totals,
    weeks: training.weeks,
    maxVolume: training.maxVolume,
    topExercises: training.topExercises
  };
}
