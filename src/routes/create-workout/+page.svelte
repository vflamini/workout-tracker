<script lang="ts">
  import { resolve } from '$app/paths';
  import TextInput from '#lib/components/TextInput.svelte';
  import Timer from '#lib/components/Timer.svelte';
  import DateInput from '#lib/components/DateInput.svelte';
  import Exercise from '#lib/components/Exercise.svelte';
  import type { WorkoutExercise, Set } from '#lib/db/types/_types.ts';
  import ExercisesModal from '#lib/components/modals/ExercisesModal.svelte';
  import { getCurrentWorkout } from '#lib/contexts/CurrentWorkout.svelte.js';

  let { data } = $props();
  const exercises = $derived(data.exercises);
  const { workout, actions } = getCurrentWorkout();
  const currentExercises = $derived(workout.exercises);
  let exercisesModal = $state(false);

  const blankSet: Set = {
    reps: 0,
    weight: 0,
    time: '00:00'
  };

  function addExercise(exercise: WorkoutExercise) {
    actions.addExercise({ ...exercise, sets: [] });
    hideExercises();
  }

  function addSet(exercise: WorkoutExercise) {
    exercise.sets = [...(exercise.sets ?? []), { ...blankSet }];
  }

  function removeSet(exercise: WorkoutExercise, setNum: number) {
    exercise.sets = (exercise.sets ?? []).filter((_, index) => index !== setNum);
  }

  function showExercises() {
    exercisesModal = true;
  }

  function hideExercises() {
    exercisesModal = false;
  }

  async function submit() {
    await fetch('/api/workout-exercise', {
      method: 'POST',
      body: JSON.stringify(currentExercises)
    });
  }
</script>

<svelte:head>
  <title>Create Workout · Workout Tracker</title>
</svelte:head>

<header class="page-header">
  <div>
    <p class="eyebrow">Train</p>
    <h1 class="page-title">Create workout</h1>
    <p class="page-subtitle">Build your session, add exercises, and log each set as you go.</p>
  </div>
  <div class="page-actions">
    <a class="btn btn-ghost" href={resolve('')}>
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      Back to dashboard
    </a>
  </div>
</header>

<div class="workout-layout">
  <section class="card details-card" aria-labelledby="session-details">
    <div class="section-head">
      <div>
        <h2 id="session-details">Session details</h2>
        <p>Name the workout and set the date for this session.</p>
      </div>
    </div>

    <div class="details-grid">
      <TextInput
        id="workout-name"
        label="Workout name"
        placeholder="Push day"
        bind:bind={workout.current.name}
      />
      <TextInput
        id="workout-variation"
        label="Variation"
        placeholder="Optional"
        bind:bind={workout.current.variation}
      />
      <DateInput id="workout-date" label="Date" />
      <div class="timer-field">
        <span class="field-label">Elapsed</span>
        <Timer />
      </div>
    </div>
  </section>

  <section class="exercise-section" aria-labelledby="exercise-heading">
    <div class="section-head">
      <div>
        <h2 id="exercise-heading">Exercises</h2>
        <p>{currentExercises.length} exercise{currentExercises.length === 1 ? '' : 's'} added</p>
      </div>
      <button type="button" class="btn btn-ghost" onclick={showExercises}>
        <i class="fa-solid fa-plus" aria-hidden="true"></i>
        Add exercise
      </button>
    </div>

    {#if currentExercises.length}
      <div class="exercise-list">
        {#each currentExercises as exercise, i (`${exercise.exerciseName}-${i}`)}
          <Exercise {exercise} {removeSet} {addSet} />
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <span class="empty-icon"><i class="fa-solid fa-dumbbell" aria-hidden="true"></i></span>
        <h3>No exercises yet</h3>
        <p>Add your first movement to start building this session.</p>
        <button type="button" class="btn btn-primary" onclick={showExercises}>
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
          Add exercise
        </button>
      </div>
    {/if}
  </section>
</div>

{#if currentExercises.length}
  <div class="finish-bar">
    <div class="finish-copy">
      <span class="muted">Ready when you are</span>
      <strong
        >{currentExercises.length} exercise{currentExercises.length === 1 ? '' : 's'} in this session</strong
      >
    </div>
    <button type="button" class="btn btn-primary" onclick={submit}>
      <i class="fa-solid fa-check" aria-hidden="true"></i>
      Finish workout
    </button>
  </div>
{/if}

{#if exercisesModal}
  <ExercisesModal {exercises} {addExercise} close={hideExercises} />
{/if}

<style>
  .workout-layout {
    display: grid;
    gap: 2rem;
  }

  .details-card {
    padding: clamp(1rem, 2.5vw, 1.5rem);
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 1.25rem;
  }

  .timer-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .exercise-section {
    display: grid;
    gap: 1rem;
  }

  .exercise-list {
    display: grid;
    gap: 0.75rem;
  }

  .finish-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface-color);
  }

  .finish-copy {
    display: flex;
    flex-direction: column;
    line-height: 1.35;
  }

  .finish-copy .muted {
    font-size: 0.76rem;
  }

  .finish-copy strong {
    font-size: 0.95rem;
  }

  @media (max-width: 720px) {
    .details-grid {
      grid-template-columns: 1fr;
    }

    .finish-bar,
    .finish-bar .btn {
      width: 100%;
    }
  }
</style>
