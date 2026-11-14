<script lang="ts">
  import { resolve } from '$app/paths';
  import { formatDate, formatDuration } from '#lib/utils/format.ts';

  let { data } = $props();
</script>

<svelte:head>
  <title>History · Workout Log</title>
</svelte:head>

<header class="page-header">
  <div>
    <h1 class="page-title">History</h1>
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
    {#each data.workouts as workout, i (workout.id)}
      <a
        class="history-row reveal"
        style={`--index: ${i}`}
        href={resolve('/history/[id]', { id: String(workout.id) })}
      >
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
            {workout.exerciseCount} exercise{workout.exerciseCount === 1 ? '' : 's'}
          </span>
          <span class="badge">
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
      New workout
    </a>
  </div>
{/if}

<style>
  .history-list {
    border-top: 1px solid var(--border-color);
  }

  .history-row {
    display: grid;
    grid-template-columns: minmax(8.5rem, auto) minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0.65rem;
    border-bottom: 1px solid var(--border-color);
    transition:
      background-color 140ms var(--ease-out),
      transform 120ms var(--ease-out);
  }

  .history-row:hover {
    background: rgba(255, 200, 255, 0.045);
  }

  .history-row:active {
    transform: scale(0.99);
    transition: transform 80ms ease-out;
  }

  .history-date {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    font-size: 0.8rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .history-date .muted {
    font-size: 0.72rem;
    font-weight: 500;
  }

  .history-copy {
    min-width: 0;
  }

  .history-copy h2 {
    font-size: 0.98rem;
    font-weight: 700;
  }

  .history-copy p {
    margin-top: 0.15rem;
    color: var(--muted-text-color);
    font-size: 0.78rem;
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
    .history-row {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.55rem 1rem;
      padding-inline: 0.25rem;
    }

    .history-date {
      grid-column: 1 / -1;
      flex-direction: row;
      gap: 0.6rem;
    }

    .history-metrics {
      grid-column: 1 / -1;
    }

    .history-arrow {
      display: none;
    }
  }
</style>
