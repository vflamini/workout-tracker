<script lang='ts'>
  import TextInput from '$lib/components/TextInput.svelte';
  import Timer from '$lib/components/Timer.svelte';
  import DateInput from '$lib/components/DateInput.svelte';
  import Exercise from '$lib/components/Exercise.svelte';
  import type { WorkoutExercise } from '$lib/db/types/_types';
  import ExercisesModal from '$lib/components/modals/ExercisesModal.svelte';

  let { data } = $props();
  const { exercises, workouts } = data;
  let exercisesModal = $state(false);

  const blankSet = {
    reps: 0,
    weight: 0,
    time: '00:00'
  }

  const blankExercise = {
    exerciseName: '',
    sets: [blankSet],
  }

  let currentExercises = $state<WorkoutExercise[]>([]);

  function addExercise(exercise: WorkoutExercise) {
    console.log(exercise);
    currentExercises = [...currentExercises, exercise]
    hideExercises();
  }

  function addSet(exercise: WorkoutExercise) {
    if (exercise.sets) {
      exercise.sets = [...exercise.sets, blankSet];
    } else {
      exercise.sets = [blankSet];
    }
  }

  function removeSet(exercise: WorkoutExercise, setNum: number) {
    exercise
      .sets = exercise
                .sets
                .filter((_, i) => i !== setNum);
    if (exercise.sets.length === 0) {
      currentExercises = currentExercises.filter(e => e !== exercise)
    }
  }

  function showExercises() {
    exercisesModal = true;
  }

  function hideExercises() {
    exercisesModal = false;
  }
</script>

<div>
  <TextInput
    id={'workout-name'}
    label={'Workout Name'}
  />
  <br>
  <TextInput
    id={'workout-variation'}
    label={'Workout Variation'}
    classes={'skinny'}
  />
  <br>
  <div class='time-inputs'>
    <DateInput />
    <Timer />
  </div>
  <div class='exercises'>
    {#each currentExercises as exercise, i}
      <Exercise bind:exercise={currentExercises[i]} {removeSet} {addSet} />
    {/each}
    <button
      class='add-exercise'
      onclick={showExercises}
    >
      Add Exercise <i class="fa-solid fa-plus"></i>
    </button>
  </div>
  {#if exercisesModal}
    <ExercisesModal {exercises} {addExercise} close={hideExercises}/>
  {/if}
</div>

<style>
  div.time-inputs {
    display: flex;
    justify-content: space-between;
  }

  div.exercises {
    padding: 10px 10px 0px 0px;
  }

  div.exercises button.add-exercise {
    background-color: transparent;
    border: 1px solid gray;
    color: white;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
  }

  div.exercises button.add-exercise:hover {
    color: #ffc8ff;
    border-color: #7a017a;
  }
</style>