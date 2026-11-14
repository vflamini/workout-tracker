<script lang="ts">
  import NumberInput from './NumberInput.svelte';
  import TimeInput from './TimeInput.svelte';

  let { exercise, index = 0, addSet, removeSet, removeExercise } = $props();

  const sets = $derived(exercise.sets ?? []);
  const idPrefix = $derived(`ex-${exercise.id ?? index}`);
</script>

<article class="exercise-card">
  <header class="exercise-head">
    <div class="exercise-title">
      <h3>{exercise.exerciseName}</h3>
      {#if exercise.weighted || exercise.isTimed || exercise.equipment}
        <div class="badge-row">
          {#if exercise.weighted}
            <span class="badge">
              <i class="fa-solid fa-dumbbell" aria-hidden="true"></i>
              {exercise.weightName ?? 'Weighted'}
            </span>
          {/if}
          {#if exercise.isTimed}
            <span class="badge">
              <i class="fa-solid fa-stopwatch" aria-hidden="true"></i>
              Timed
            </span>
          {/if}
          {#if exercise.equipment}
            <span class="badge">
              <i class="fa-solid fa-toolbox" aria-hidden="true"></i>
              {exercise.equipment}
            </span>
          {/if}
        </div>
      {/if}
    </div>
    {#if removeExercise}
      <button
        type="button"
        class="btn btn-ghost btn-icon remove-exercise"
        onclick={() => removeExercise(exercise, index)}
        aria-label={`Remove ${exercise.exerciseName}`}
        title="Remove exercise"
      >
        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
      </button>
    {/if}
  </header>

  {#if sets.length}
    <div class={['set-header', { weighted: exercise.weighted }]} aria-hidden="true">
      <span>Set</span>
      {#if exercise.weighted}
        <span>Weight</span>
      {/if}
      <span>{exercise.isTimed ? 'Time' : 'Reps'}</span>
      <span></span>
    </div>

    <div class="set-list">
      {#each sets as set, i (i)}
        <div class={['set-row', { weighted: exercise.weighted }]}>
          <span class="set-index">{i + 1}</span>
          {#if exercise.weighted}
            <NumberInput
              id={`${idPrefix}-set-${i}-weight`}
              ariaLabel={`${exercise.exerciseName} set ${i + 1} weight`}
              step={0.5}
              classes={['compact']}
              bind:bind={set.weight}
            />
          {/if}
          {#if exercise.isTimed}
            <TimeInput
              id={`${idPrefix}-set-${i}-time`}
              ariaLabel={`${exercise.exerciseName} set ${i + 1} time`}
              classes={['compact']}
              bind:bind={set.time}
            />
          {:else}
            <NumberInput
              id={`${idPrefix}-set-${i}-reps`}
              ariaLabel={`${exercise.exerciseName} set ${i + 1} reps`}
              min={1}
              classes={['compact']}
              bind:bind={set.reps}
            />
          {/if}
          <button
            type="button"
            class="btn btn-danger btn-icon set-remove"
            onclick={() => removeSet(exercise, i)}
            aria-label={`Remove set ${i + 1}`}
            title="Remove set"
          >
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      {/each}
    </div>
  {:else}
    <p class="set-empty">No sets yet.</p>
  {/if}

  <div class="exercise-foot">
    <button type="button" class="btn btn-ghost btn-sm add-set-btn" onclick={() => addSet(exercise)}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      Add set
    </button>
  </div>
</article>

<style>
  .exercise-card {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background-color: var(--surface-color);
    background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 48%);
  }

  .exercise-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .exercise-title {
    min-width: 0;
  }

  .exercise-title h3 {
    font-size: 1rem;
    font-weight: 700;
  }

  .badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.45rem;
  }

  .remove-exercise {
    flex: 0 0 auto;
    width: 2.15rem;
    min-height: 2.15rem;
    color: var(--muted-text-color);
    border-color: transparent;
  }

  .remove-exercise:hover {
    border-color: rgba(255, 174, 68, 0.35);
    background: rgba(255, 174, 68, 0.08);
    color: #ffcf8a;
  }

  .set-header,
  .set-row {
    display: grid;
    grid-template-columns: 2.1rem minmax(0, 1fr) 2.35rem;
    align-items: center;
    gap: 0.55rem;
  }

  .set-header.weighted,
  .set-row.weighted {
    grid-template-columns: 2.1rem minmax(0, 1fr) minmax(0, 1fr) 2.35rem;
  }

  .set-header {
    margin-top: 1rem;
    padding-bottom: 0.35rem;
    color: var(--muted-text-color);
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .set-header span:first-child {
    text-align: center;
  }

  .set-list {
    display: grid;
    gap: 0.5rem;
  }

  .set-index {
    display: grid;
    place-items: center;
    height: 2.35rem;
    border-radius: 0.45rem;
    background: rgba(255, 200, 255, 0.055);
    color: var(--muted-text-color);
    font-size: 0.75rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .set-remove {
    width: 2.35rem;
    min-height: 2.35rem;
  }

  .set-empty {
    margin-top: 0.85rem;
    color: var(--muted-text-color);
    font-size: 0.82rem;
  }

  .exercise-foot {
    margin-top: 0.85rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
  }

  .add-set-btn {
    width: 100%;
    border-style: dashed;
  }
</style>
