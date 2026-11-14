import { resolve } from '$app/paths';
import type { weight, exercise } from '#lib/db/types/_types.ts';

export async function insertWeight(data: weight): Promise<number | null> {
  try {
    const res = await fetch(resolve(`api/weights`), {
      method: 'POST',
      body: JSON.stringify({
        type: data.type,
        defaultBaseWeight: data.defaultBaseWeight
      })
    });
    if (res.ok) {
      const { id } = await res.json();
      return id;
    } else {
      throw Error(`${res.status}: ${res.statusText}`);
    }
  } catch (e: unknown) {
    const errorMessageForeword = 'Error occurred while inserting new weight:';
    if (e instanceof Error) {
      console.error(errorMessageForeword, e.message);
    } else {
      console.error(errorMessageForeword, e);
    }
    return null;
  }
}

export async function insertExercise(data: exercise): Promise<number | null> {
  try {
    console.log(data);
    const res = await fetch(resolve(`api/exercises`), {
      method: 'POST',
      body: JSON.stringify({
        name: data.exerciseName,
        weighted: data.weighted,
        weightBaseAmount: data.weightBaseAmount,
        timed: data.isTimed,
        weightId: data.weightId,
        numHands: data.numHands,
        otherEquipment: data.equipment
      })
    });
    if (res.ok) {
      const { id } = await res.json();
      return id;
    } else {
      throw Error(`${res.status}: ${res.statusText}`);
    }
  } catch (e: unknown) {
    const errorMessageForeword = 'Error occurred while inserting new exercise:';
    if (e instanceof Error) {
      console.error(errorMessageForeword, e.message);
    } else {
      console.error(errorMessageForeword, e);
    }
    return null;
  }
}
