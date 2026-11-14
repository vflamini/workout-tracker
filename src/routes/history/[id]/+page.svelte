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
    {
      label: 'Exercises',
      value: String(workout.exercises.length),
      icon: 'fa-dumbbell'
    },
    {
      label: 'Sets',
      value: String(totalSets),
      icon: 'fa-layer-group'
    },
    {
      label: 'Volume',
      value: formatVolume(totalVolume),
      icon: 'fa-chart-simple'
    }
  ]);
</script>

<svelte:head>
  <title>{workout.name} · Workout History</title>
</svelte:head>

<header class="page-header">
  <div>
    <a class="back-link" href={resolve('history')}>
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      Back to history
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
      Log another workout
    </a>
  </div>
</header>

<section class="stat-grid" aria-label="Workout totals">
  {#each stats as stat (stat.label)}
    <article class="stat-card card">
      <span class="stat-icon"><i class="fa-solid {stat.icon}" aria-hidden="true"></i></span>
      <span class="stat-label">{stat.label}</span>
      <strong>{stat.value}</strong>
    </article>
  {/each}
</section>

<section class="exercise-list" aria-label="Exercises in this workout">
  {#each workout.exercises as exercise (exercise.id)}
    <article class="card exercise-card">
      <header class="exercise-head">
        <div>
          <h2>{exercise.exerciseName}</h2>
          <div class="badge-row">
            {#if exercise.weighted}
              <span class="badge"
                ><i class="fa-solid fa-dumbbell" aria-hidden="true"></i> Weighted</span
              >
            {/if}
            {#if exercise.timed}
              <span class="badge"
                ><i class="fa-solid fa-stopwatch" aria-hidden="true"></i> Timed</span
              >
            {/if}
            {#if exercise.equipment}
              <span class="badge"
                ><i class="fa-solid fa-toolbox" aria-hidden="true"></i> {exercise.equipment}</span
              >
            {/if}
          </div>
        </div>
        <span class="set-count"
          >{exercise.sets.length} set{exercise.sets.length === 1 ? '' : 's'}</span
        >
      </header>

      {#if exercise.sets.length}
        <div class="set-list">
          {#each exercise.sets as set, i (set.id)}
            <div class="set-row">
              <span class="set-index">#{i + 1}</span>
              {#if set.weight !== null}
                <span class="set-metric">
                  <small>Weight</small>
                  <strong>{set.weight}</strong>
                </span>
              {/if}
              {#if set.reps !== null}
                <span class="set-metric">
                  <small>Reps</small>
                  <strong>{set.reps}</strong>
                </span>
              {/if}
              {#if set.time !== null}
                <span class="set-metric">
                  <small>Time</small>
                  <strong>{formatDuration(set.time)}</strong>
                </span>
              {/if}
            </div>
          {/each}
        </div>
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
    margin-bottom: 0.6rem;
    color: var(--muted-text-color);
    font-size: 0.8rem;
    font-weight: 600;
  }

  .back-link:hover {
    color: var(--accent-color);
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 1rem;
  }

  .stat-icon {
    display: grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    margin-bottom: 0.35rem;
    border-radius: 0.65rem;
    background: var(--accent-soft);
    color: var(--accent-color);
    font-size: 0.85rem;
  }

  .stat-label {
    color: var(--muted-text-color);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .stat-card strong {
    font-size: 1.7rem;
    line-height: 1.15;
  }

  .exercise-list {
    display: grid;
    gap: 0.75rem;
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
    gap: 0.4rem;
    margin-top: 0.45rem;
  }

  .set-count {
    color: var(--muted-text-color);
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .set-list {
    display: grid;
    gap: 0.45rem;
    margin-top: 0.9rem;
  }

  .set-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem;
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
  }

  .set-index {
    display: grid;
    place-items: center;
    min-width: 2rem;
    height: 2rem;
    border-radius: 0.55rem;
    background: rgba(148, 163, 184, 0.08);
    color: var(--muted-text-color);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .set-metric {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    padding: 0.15rem 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    background: var(--surface-color);
  }

  .set-metric small {
    color: var(--muted-text-color);
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .set-metric strong {
    font-size: 0.85rem;
  }

  .set-empty {
    margin-top: 0.9rem;
    color: var(--muted-text-color);
    font-size: 0.82rem;
  }

  @media (max-width: 640px) {
    .stat-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      flex-direction: row;
      align-items: center;
      gap: 0.7rem;
    }

    .stat-icon {
      margin-bottom: 0;
    }

    .stat-card strong {
      margin-left: auto;
    }
  }
</style>
