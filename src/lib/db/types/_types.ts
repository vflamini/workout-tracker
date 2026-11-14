export interface weight {
  type: string;
  defaultBaseWeight: number;
}

export interface exercise {
  id?: number;
  exerciseName: string;
  weighted: boolean;
  weightBaseAmount: number;
  isTimed: boolean;
  weightId: number;
  numHands: number;
  equipment: string;
}

export interface Workout {
  id: number;
  time: number;
  name: string;
  variation: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise extends exercise {
  sets: Set[];
}

export interface Set {
  reps: number;
  weight: number;
  time: string;
}
