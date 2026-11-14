<script lang="ts">
  import { resolve } from '$app/paths';
  import { formatDate, formatDuration, formatVolume } from '#lib/utils/format.ts';

  let { data } = $props();

  const workout = $derived(data.workout);
  const totalSets = $derived(
    workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)
  );
  const totalVolume = $derived(
    workout.exercises.reduce(
      (total, exercise) =>
        total + exercise.sets.reduce((sum, set) => sum + (set.weight ?? 0) * (set.reps ?? 0), 0),
      0
    )
  );

  const stats = $derived([
    { label: 'Exercises', value: String(workout.exercises.length) },
    { label: 'Sets', value: String(totalSets) },
    { label: 'Volume', value: formatVolume(totalVolume) }
  ]);
</script>

<svelte:head>
  <title>{workout.name} · History</title>
</svelte:head>

<header class="page-header">
  <div>
    <a class="back-link" href={resolve('history')}>
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      History
    </a>
    <h1 class="page-title">{workout.name}</h1>
    <p class="page-subtitle">
      {formatDate(workout.date)}
      {#if workout.variant}· {workout.variant}{/if}
      {#if workout.duration}· {formatDuration(workout.duration)}{/if}
    </p>
  </div>
  <div class="page-actions">
    <a class="btn btn-primary" href={resolve('create-workout')}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      New workout
    </a>
  </div>
</header>

<section class="metric-strip" aria-label="Workout totals">
  {#each stats as stat, i (stat.label)}
    <article class="metric" style={`--index: ${i}`}>
      <span class="metric-label">{stat.label}</span>
      <strong class="metric-value">{stat.value}</strong>
    </article>
  {/each}
</section>

<section class="exercise-list" aria-label="Exercises in this workout">
  {#each workout.exercises as exercise, i (exercise.id)}
    <article class="card exercise-card reveal" style={`--index: ${i}`}>
      <header class="exercise-head">
        <div>
          <h2>{exercise.exerciseName}</h2>
          {#if exercise.weighted || exercise.timed || exercise.equipment}
            <div class="badge-row">
              {#if exercise.weighted}
                <span class="badge">Weighted</span>
              {/if}
              {#if exercise.timed}
                <span class="badge">Timed</span>
              {/if}
              {#if exercise.equipment}
                <span class="badge">{exercise.equipment}</span>
              {/if}
            </div>
          {/if}
        </div>
        <span class="set-count">
          {exercise.sets.length} set{exercise.sets.length === 1 ? '' : 's'}
        </span>
      </header>

      {#if exercise.sets.length}
        <table class="set-table">
          <thead>
            <tr>
              <th>Set</th>
              {#if exercise.weighted}
                <th>Weight</th>
              {/if}
              <th>{exercise.timed ? 'Time' : 'Reps'}</th>
            </tr>
          </thead>
          <tbody>
            {#each exercise.sets as set, j (set.id)}
              <tr>
                <td class="set-num">{j + 1}</td>
                {#if exercise.weighted}
                  <td>{set.weight ?? '—'}</td>
                {/if}
                <td>
                  {#if exercise.timed}
                    {formatDuration(set.time)}
                  {:else}
                    {set.reps ?? '—'}
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {:else}
        <p class="set-empty">No sets recorded for this exercise.</p>
      {/if}
    </article>
  {/each}
</section>

<style>
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 0.55rem;
    color: var(--muted-text-color);
    font-size: 0.8rem;
    font-weight: 600;
    transition:
      color 140ms var(--ease-out),
      transform 120ms var(--ease-out);
  }

  .back-link:hover {
    color: var(--pink-color);
  }

  .back-link:active {
    transform: translateX(-2px);
  }

  .metric-strip {
    margin-bottom: 1.5rem;
  }

  .exercise-list {
    display: grid;
    gap: 0.85rem;
  }

  .exercise-card {
    padding: 1.1rem;
  }

  .exercise-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .exercise-head h2 {
    font-size: 1rem;
    font-weight: 700;
  }

  .badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.4rem;
  }

  .set-count {
    color: var(--muted-text-color);
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .set-table {
    width: 100%;
    margin-top: 0.9rem;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }

  .set-table th {
    padding: 0 0.5rem 0.4rem 0;
    border-bottom: 1px solid var(--border-color);
    color: var(--muted-text-color);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-align: left;
    text-transform: uppercase;
  }

  .set-table th:first-child {
    width: 3rem;
  }

  .set-table td {
    padding: 0.55rem 0.5rem 0.55rem 0;
    border-bottom: 1px solid rgba(255, 200, 255, 0.055);
    color: var(--input-text-color);
    font-size: 0.9rem;
    font-weight: 600;
  }

  .set-table tr:last-child td {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .set-table td.set-num {
    color: var(--muted-text-color);
    font-size: 0.78rem;
  }

  .set-empty {
    margin-top: 0.85rem;
    color: var(--muted-text-color);
    font-size: 0.82rem;
  }
</style>
