import type { RequestEvent } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';
import { db } from '#lib/db/drizzle.ts';
import { sets, workoutExercises, workouts } from '#lib/db/schema.ts';

function nullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function nullableInteger(value: unknown) {
  const number = nullableNumber(value);
  return number === null ? null : Math.round(number);
}

interface WorkoutSetInput {
  weight?: unknown;
  reps?: unknown;
  time?: unknown;
}

interface WorkoutExerciseInput {
  exerciseId?: unknown;
  sets?: unknown;
}

interface WorkoutInput {
  name?: unknown;
  variant?: unknown;
  date?: unknown;
  time?: unknown;
  exercises?: unknown;
}

function secondsFromTime(value: unknown) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed || trimmed === '00:00' || trimmed === '00:00:00') return null;

  const parts = trimmed.split(':').map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return null;

  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

export async function GET() {
  const allWorkouts = await db
    .select()
    .from(workouts)
    .orderBy(desc(workouts.date), desc(workouts.id));
  return Response.json(allWorkouts);
}

export async function POST({ request }: RequestEvent) {
  const body = (await request.json()) as WorkoutInput;

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) {
    return Response.json({ error: 'Workout name is required' }, { status: 400 });
  }

  const rawExercises = Array.isArray(body.exercises)
    ? (body.exercises as WorkoutExerciseInput[])
    : [];
  const exercises = rawExercises
    .map((entry) => {
      const exerciseId = Number(entry?.exerciseId);
      const rawSets = Array.isArray(entry?.sets) ? (entry.sets as WorkoutSetInput[]) : [];
      const normalizedSets = rawSets
        .map((set) => ({
          weight: nullableNumber(set?.weight),
          reps: nullableInteger(set?.reps),
          time: secondsFromTime(set?.time)
        }))
        .filter((set) => set.weight !== null || set.reps !== null || set.time !== null);

      return { exerciseId, sets: normalizedSets };
    })
    .filter((entry) => Number.isInteger(entry.exerciseId) && entry.sets.length > 0);

  if (!exercises.length) {
    return Response.json({ error: 'Add at least one exercise with a logged set' }, { status: 400 });
  }

  const parsedDate =
    typeof body.date === 'string' && body.date ? new Date(`${body.date}T12:00:00`) : new Date();
  const date = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const variant =
    typeof body.variant === 'string' && body.variant.trim() ? body.variant.trim() : null;
  const time = nullableInteger(body.time);

  try {
    const workoutId = db.transaction((tx) => {
      const newWorkout = tx
        .insert(workouts)
        .values({ name, variant, date, time })
        .returning({ id: workouts.id })
        .get();

      if (!newWorkout) {
        throw new Error('Could not create workout');
      }

      for (const entry of exercises) {
        const workoutExercise = tx
          .insert(workoutExercises)
          .values({ exerciseId: entry.exerciseId, workoutId: newWorkout.id })
          .returning({ id: workoutExercises.id })
          .get();

        if (!workoutExercise) {
          throw new Error('Could not create workout exercise');
        }

        tx.insert(sets)
          .values(
            entry.sets.map((set) => ({
              workoutExerciseId: workoutExercise.id,
              weight: set.weight,
              reps: set.reps,
              time: set.time
            }))
          )
          .run();
      }

      return newWorkout.id;
    });

    return Response.json({ id: workoutId }, { status: 201 });
  } catch (error) {
    console.error('Could not save workout:', error);
    return Response.json({ error: 'Could not save workout' }, { status: 500 });
  }
}
