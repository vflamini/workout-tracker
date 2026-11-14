import { getContext, setContext } from 'svelte';
import type { Workout, WorkoutExercise } from '#lib/db/types/_types.ts';

class CurrentWorkout {
  #current = $state<Workout>({
    id: 0,
    time: 0,
    name: '',
    variation: '',
    exercises: []
  });

  #blankSet() {
    return {
      reps: 0,
      weight: 0,
      time: '00:00'
    };
  }

  get exercises() {
    return this.#current.exercises;
  }

  get current() {
    return this.#current;
  }

  #addExercise(exercise: WorkoutExercise) {
    this.#current.exercises = [...this.#current.exercises, exercise];
  }

  #removeExercise(exercise: WorkoutExercise | null = null, index: number = -1) {
    if (!exercise && index === -1) {
      throw new Error('must have an exercise or a non-negative index');
    }
    if (exercise) {
      this.#current.exercises = this.#current.exercises.filter((e) => e !== exercise);
    } else {
      this.#current.exercises = this.#current.exercises.filter((_, i) => i !== index);
    }
  }

  #addSet(exercise: WorkoutExercise) {
    this.#current.exercises = this.#current.exercises.map((currentExercise) => {
      if (currentExercise.exerciseName !== exercise.exerciseName) {
        return currentExercise;
      } else {
        return {
          ...currentExercise,
          sets: [...currentExercise.sets, this.#blankSet()]
        };
      }
    });
  }

  #removeSet(exercise: WorkoutExercise, setNum: number) {
    exercise.sets = exercise.sets.filter((_, i) => i !== setNum);
    if (exercise.sets.length === 0) {
      this.#current.exercises = this.#current.exercises.filter((e) => e !== exercise);
    }
  }

  #reset() {
    this.#current = {
      id: 0,
      time: 0,
      name: '',
      variation: '',
      exercises: []
    };
  }

  actions = {
    addExercise: (exercise: WorkoutExercise) => {
      this.#addExercise(exercise);
    },

    removeExercise: (exercise: WorkoutExercise | null = null, index: number = -1) => {
      this.#removeExercise(exercise, index);
    },

    addSet: (exercise: WorkoutExercise) => {
      this.#addSet(exercise);
    },

    removeSet: (exercise: WorkoutExercise, setNum: number) => {
      this.#removeSet(exercise, setNum);
    },

    reset: () => {
      this.#reset();
    }
  };
}

/* --------------------------------- Context -------------------------------- */
interface Context {
  workout: CurrentWorkout;
  actions: CurrentWorkout['actions'];
}

const KEY = Symbol('CurrentWorkout');

export const getCurrentWorkout = () => {
  const context = getContext<Context>(KEY);
  if (!context) {
    throw new Error('getCurrentWorkout must be used within a project context provider');
  }
  return context;
};

export const setCurrentWorkout = () => {
  const currentWorkoutStore = new CurrentWorkout();
  const context: Context = {
    workout: currentWorkoutStore,
    actions: currentWorkoutStore.actions
  };
  setContext(KEY, context);
  return context;
};
