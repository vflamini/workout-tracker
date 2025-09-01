export interface weight {
  type: string,
  defaultBaseWeight: number
}

export interface exercise {
  exerciseName: string,
  weighted: boolean,
  weightBaseAmount: number,
  isTimed: boolean,
  weightId: number,
  numHands: number,
  equipment: string
}

export interface WorkoutExercise extends exercise {
  sets: Set[],
}

interface Set {
  reps: number,
  weight: number,
  time: string
}