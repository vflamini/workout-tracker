import { getContext, setContext } from 'svelte';
import type { WorkoutExercise } from '$lib/db/types/_types';

class CurrentWorkout {
  #exercises = $state<WorkoutExercise[]>([]);

  get exercises() {
    return this.#exercises;
  }

  addExercise(exercise: WorkoutExercise) {
    this.#exercises = [...this.#exercises, exercise];
  }

  removeExercise(exercise: WorkoutExercise | null = null, index: number = -1) {
    if (!exercise && index === -1) {
      throw new Error('must have an exercise or a non-negative index');
    }
    if (exercise) {
      this.#exercises = this.#exercises.filter(e => e !== exercise);
    } else {
      this.#exercises = this.#exercises.filter((_, i) => i !== index);
    }
  }

  removeSet(exercise: WorkoutExercise, setNum: number) {
    exercise
      .sets = exercise
                .sets
                .filter((_, i) => i !== setNum);
    if (exercise.sets.length === 0) {
      this.#exercises = this.#exercises.filter(e => e !== exercise);
    }
  }
}