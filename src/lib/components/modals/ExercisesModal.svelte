<script lang="ts">
  import { onMount } from 'svelte';

  interface ModalExercise {
    id: number;
    exerciseName: string;
    weighted: boolean;
    isTimed: boolean;
    weightName?: string | null;
    equipment?: string | null;
  }

  let { exercises, close, addExercise } = $props();

  let query = $state('');

  const filtered = $derived(
    (exercises as ModalExercise[]).filter((exercise) => {
      const haystack = `${exercise.exerciseName} ${exercise.weightName ?? ''} ${exercise.equipment ?? ''}`;
      return haystack.toLowerCase().includes(query.trim().toLowerCase());
    })
  );

  function focusOnMount(node: HTMLElement) {
    (node as HTMLInputElement).focus();
  }

  onMount(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  });
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && close()} />

<div class="modal-container">
  <button type="button" class="modal-backdrop" onclick={close} aria-label="Close dialog"></button>

  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="exercise-modal-title">
    <header class="modal-head">
      <div>
        <p class="eyebrow">Exercise library</p>
        <h2 id="exercise-modal-title">Add an exercise</h2>
      </div>
      <button
        type="button"
        class="btn btn-ghost btn-icon"
        onclick={close}
        aria-label="Close dialog"
      >
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </header>

    <div class="search-field">
      <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      <input
        {@attach focusOnMount}
        bind:value={query}
        type="search"
        placeholder="Search by name or equipment"
        aria-label="Search exercises"
      />
    </div>

    <div class="exercises-list">
      {#each filtered as exercise (exercise.id)}
        <button type="button" class="exercise-option" onclick={() => addExercise(exercise)}>
          <span class="exercise-option-icon">
            <i
              class="fa-solid {exercise.weighted
                ? 'fa-dumbbell'
                : exercise.isTimed
                  ? 'fa-stopwatch'
                  : 'fa-person-running'}"
              aria-hidden="true"
            ></i>
          </span>
          <span class="exercise-option-copy">
            <strong>{exercise.exerciseName}</strong>
            <span>
              {#if exercise.weighted}
                {exercise.weightName ?? 'Weighted'}
              {:else if exercise.isTimed}
                Timed
              {:else if exercise.equipment}
                {exercise.equipment}
              {:else}
                Bodyweight
              {/if}
            </span>
          </span>
          <i class="fa-solid fa-plus exercise-option-add" aria-hidden="true"></i>
        </button>
      {:else}
        <div class="empty-state compact-empty">
          <span class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <h3>No exercises found</h3>
          <p>Try another search, or create a new exercise first.</p>
        </div>
      {/each}
    </div>

    <footer class="modal-foot">
      <span class="muted">{filtered.length} exercise{filtered.length === 1 ? '' : 's'}</span>
      <button type="button" class="btn btn-ghost" onclick={close}>Cancel</button>
    </footer>
  </div>
</div>

<style>
  .modal-container {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: grid;
    place-items: center;
    padding: 1rem;
  }

  .modal-backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    background: rgba(2, 6, 23, 0.72);
    backdrop-filter: blur(6px);
  }

  .modal {
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(100%, 34rem);
    max-height: min(88dvh, 46rem);
    padding: 1.25rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    background: var(--surface-color);
    box-shadow: var(--shadow-soft);
    animation: modal-in 200ms var(--ease-out);
  }

  @keyframes modal-in {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }
  }

  .modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .modal-head h2 {
    font-size: 1.25rem;
  }

  .search-field {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-top: 1rem;
    padding: 0 0.85rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
    color: var(--muted-text-color);
  }

  .search-field:focus-within {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .search-field input {
    width: 100%;
    min-height: 2.8rem;
    border: 0;
    background: transparent;
    color: var(--main-text-color);
    outline: none;
  }

  .search-field input::placeholder {
    color: #64748b;
  }

  .exercises-list {
    display: grid;
    gap: 0.5rem;
    margin: 1rem -0.25rem;
    padding: 0 0.25rem;
    overflow-y: auto;
  }

  .exercise-option {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
    padding: 0.8rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
    color: var(--main-text-color);
    text-align: left;
    transition:
      border-color 160ms var(--ease-out),
      background-color 160ms var(--ease-out);
  }

  .exercise-option:hover {
    border-color: var(--accent-color);
    background: var(--surface-raised);
  }

  .exercise-option-icon {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.7rem;
    background: var(--accent-soft);
    color: var(--accent-color);
    font-size: 0.9rem;
  }

  .exercise-option-copy {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    line-height: 1.3;
  }

  .exercise-option-copy strong {
    font-size: 0.92rem;
  }

  .exercise-option-copy span {
    color: var(--muted-text-color);
    font-size: 0.76rem;
  }

  .exercise-option-add {
    color: var(--muted-text-color);
    font-size: 0.8rem;
  }

  .modal-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
  }

  .compact-empty {
    padding: 2rem 1rem;
  }

  @media (max-width: 560px) {
    .modal-container {
      align-items: end;
      padding: 0;
    }

    .modal {
      width: 100%;
      max-height: 92dvh;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      padding-bottom: calc(1.25rem + env(safe-area-inset-bottom));
    }
  }
</style>
