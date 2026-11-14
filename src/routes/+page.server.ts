import { getOverview } from '#lib/db/queries/overview.ts';

export async function load() {
  return await getOverview();
}
