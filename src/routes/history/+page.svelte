<script lang="ts">
  import { resolve } from '$app/paths';
  import { formatDate, formatDuration } from '#lib/utils/format.ts';

  let { data } = $props();
</script>

<svelte:head>
  <title>History · Workout Tracker</title>
</svelte:head>

<header class="page-header">
  <div>
    <p class="eyebrow">Training log</p>
    <h1 class="page-title">Workout history</h1>
    <p class="page-subtitle">Every session you have logged, newest first.</p>
  </div>
  <div class="page-actions">
    <a class="btn btn-primary" href={resolve('create-workout')}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      New workout
    </a>
  </div>
</header>

{#if data.workouts.length}
  <div class="history-list">
    {#each data.workouts as workout (workout.id)}
      <a class="history-card card" href={resolve('/history/[id]', { id: String(workout.id) })}>
        <div class="history-date">
          <span>{formatDate(workout.date)}</span>
          {#if workout.duration}
            <span class="muted">{formatDuration(workout.duration)}</span>
          {/if}
        </div>

        <div class="history-copy">
          <h2>{workout.name}</h2>
          <p>{workout.variant || 'Standard session'}</p>
        </div>

        <div class="history-metrics">
          <span class="badge">
            <i class="fa-solid fa-dumbbell" aria-hidden="true"></i>
            {workout.exerciseCount} exercise{workout.exerciseCount === 1 ? '' : 's'}
          </span>
          <span class="badge">
            <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
            {workout.setCount} set{workout.setCount === 1 ? '' : 's'}
          </span>
        </div>

        <i class="fa-solid fa-chevron-right history-arrow" aria-hidden="true"></i>
      </a>
    {/each}
  </div>
{:else}
  <div class="empty-state">
    <span class="empty-icon"><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i></span>
    <h3>No workouts logged yet</h3>
    <p>Finish your first session and it will appear here with every exercise and set.</p>
    <a class="btn btn-primary" href={resolve('create-workout')}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      Create workout
    </a>
  </div>
{/if}

<style>
  .history-list {
    display: grid;
    gap: 0.75rem;
  }

  .history-card {
    display: grid;
    grid-template-columns: minmax(7rem, auto) minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.1rem;
    transition:
      border-color 160ms var(--ease-out),
      background-color 160ms var(--ease-out),
      transform 160ms var(--ease-out);
  }

  .history-card:hover {
    border-color: rgba(194, 107, 255, 0.42);
    background: var(--surface-raised);
    transform: translateY(-1px);
  }

  .history-date {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .history-date .muted {
    font-size: 0.72rem;
    font-weight: 500;
  }

  .history-copy {
    min-width: 0;
  }

  .history-copy h2 {
    font-size: 1rem;
    font-weight: 700;
  }

  .history-copy p {
    color: var(--muted-text-color);
    font-size: 0.8rem;
  }

  .history-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .history-arrow {
    color: var(--muted-text-color);
    font-size: 0.7rem;
  }

  @media (max-width: 760px) {
    .history-card {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.6rem 1rem;
    }

    .history-date {
      grid-column: 1 / -1;
      flex-direction: row;
      gap: 0.5rem;
    }

    .history-metrics {
      grid-column: 1 / -1;
    }

    .history-arrow {
      display: none;
    }
  }
</style>
