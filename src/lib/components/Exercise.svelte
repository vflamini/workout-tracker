<script lang="ts">
  import NumberInput from './NumberInput.svelte';
  import TimeInput from './TimeInput.svelte';

  let { exercise, addSet, removeSet } = $props();
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
    <button type="button" class="btn btn-ghost btn-sm" onclick={() => addSet(exercise)}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      Add set
    </button>
  </header>

  <div class="set-list">
    {#each exercise.sets ?? [] as set, i (i)}
      <div class="set-row">
        <span class="set-index">#{i + 1}</span>
        {#if exercise.weighted}
          <NumberInput
            id={`set-${i}-weight`}
            label="Weight"
            step={0.5}
            classes={['compact']}
            bind:bind={set.weight}
          />
        {/if}
        {#if exercise.isTimed}
          <TimeInput id={`set-${i}-time`} label="Time" classes={['compact']} bind:bind={set.time} />
        {:else}
          <NumberInput
            id={`set-${i}-reps`}
            label="Reps"
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
    {#if !exercise.sets?.length}
      <p class="set-empty">No sets yet. Add your first set to start logging.</p>
    {/if}
  </div>
</article>

<style>
  .exercise-card {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface-muted);
  }

  .exercise-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
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
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .set-list {
    display: grid;
    gap: 0.65rem;
    margin-top: 1rem;
  }

  .set-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 0.6rem;
  }

  .set-row :global(.field) {
    flex: 1 1 7.5rem;
  }

  .set-index {
    display: grid;
    place-items: center;
    min-width: 2.2rem;
    height: 2.45rem;
    border-radius: 0.6rem;
    background: rgba(255, 200, 255, 0.06);
    color: var(--muted-text-color);
    font-size: 0.76rem;
    font-weight: 700;
  }

  .set-remove {
    flex: 0 0 auto;
  }

  .set-empty {
    padding: 0.75rem 0;
    color: var(--muted-text-color);
    font-size: 0.85rem;
  }

  @media (max-width: 560px) {
    .exercise-head {
      flex-direction: column;
    }

    .exercise-head .btn {
      width: 100%;
    }

    .set-row :global(.field) {
      flex-basis: 8rem;
    }
  }
</style>
