<script lang="ts">
  import TextInput from '#lib/components/TextInput.svelte';
  import Timer from '#lib/components/Timer.svelte';
  import DateInput from '#lib/components/DateInput.svelte';
  import Exercise from '#lib/components/Exercise.svelte';
  import type { WorkoutExercise, Set } from '#lib/db/types/_types.ts';
  import ExercisesModal from '#lib/components/modals/ExercisesModal.svelte';
  import { getCurrentWorkout } from '#lib/contexts/CurrentWorkout.svelte.js';

  let { data } = $props();
  const exercises = $derived(data.exercises);
  let exercisesModal = $state(false);
  const { actions } = getCurrentWorkout();

  const blankSet: Set = {
    reps: 0,
    weight: 0,
    time: '00:00'
  };

  let currentExercises = $state<WorkoutExercise[]>([]);

  function addExercise(exercise: WorkoutExercise) {
    actions.addExercise(exercise);
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
    actions.removeSet(exercise, setNum);
  }

  function showExercises() {
    exercisesModal = true;
  }

  function hideExercises() {
    exercisesModal = false;
  }

  async function submit() {
    await fetch('/workout-exercise', {
      method: 'POST',
      body: JSON.stringify(currentExercises)
    });
  }
</script>

<div>
  <TextInput id="workout-name" label="Workout Name" />
  <br />
  <TextInput id="workout-variation" label="Workout Variation" classes="skinny" />
  <br />
  <div class="time-inputs">
    <DateInput />
    <Timer />
  </div>
  <div class="exercises">
    {#each currentExercises as exercise, i (`${exercise.exerciseName}-${i}`)}
      <Exercise bind:exercise={currentExercises[i]} {removeSet} {addSet} />
    {/each}
    <button class="add-exercise" onclick={showExercises}>
      Add Exercise <i class="fa-solid fa-plus"></i>
    </button>
  </div>
  {#if currentExercises.length}
    <div class="action-buttons-container">
      <button class="submit" onclick={submit}>Finish</button>
    </div>
  {/if}
  {#if exercisesModal}
    <ExercisesModal {exercises} {addExercise} close={hideExercises} />
  {/if}
</div>

<style>
  div.time-inputs {
    display: flex;
    justify-content: space-between;
  }

  div.exercises,
  div.action-buttons-container {
    padding: 10px 10px 0px 0px;
  }

  div > button {
    background-color: transparent;
    border: 1px solid gray;
    color: white;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
  }

  div > button:hover {
    color: #ffc8ff;
    border-color: #7a017a;
  }
</style>
