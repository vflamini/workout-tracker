<script lang="ts">
  import { resolve } from '$app/paths';
  import { formatVolume } from '#lib/utils/format.ts';

  let { data } = $props();

  const stats = $derived([
    { label: 'Workouts', value: data.totals.workouts, icon: 'fa-dumbbell' },
    { label: 'Exercises', value: data.totals.exercises, icon: 'fa-list-check' },
    { label: 'Sets', value: data.totals.sets, icon: 'fa-layer-group' }
  ]);

  const totalVolume = $derived(data.weeks.reduce((total, week) => total + week.volume, 0));
  const bestWeek = $derived(
    data.weeks.reduce((best, week) => (week.volume > best.volume ? week : best), data.weeks[0])
  );
</script>

<svelte:head>
  <title>My Stats · Workout Tracker</title>
</svelte:head>

<header class="page-header">
  <div>
    <p class="eyebrow">Progress</p>
    <h1 class="page-title">Progress log</h1>
    <p class="page-subtitle">Weekly volume, lifetime totals, and the lifts doing the most work.</p>
  </div>
  <div class="page-actions">
    <a class="btn btn-primary" href={resolve('create-workout')}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      Log a workout
    </a>
  </div>
</header>

<section class="metric-strip" aria-label="Lifetime totals">
  {#each stats as stat, i (stat.label)}
    <article class="metric" style={`--index: ${i}`}>
      <span class="metric-icon"><i class="fa-solid {stat.icon}" aria-hidden="true"></i></span>
      <span class="metric-label">{stat.label}</span>
      <strong class="metric-value">{stat.value}</strong>
    </article>
  {/each}
</section>

<div class="progress-grid">
  <section class="card chart-card" aria-labelledby="chart-heading">
    <div class="section-head">
      <div>
        <h2 id="chart-heading">Weekly volume</h2>
        <p>Weight moved per week over the last {data.weeks.length} weeks.</p>
      </div>
      {#if data.totals.sets}
        <span class="badge">
          <i class="fa-solid fa-chart-column" aria-hidden="true"></i>
          Best week: {formatVolume(bestWeek.volume)}
        </span>
      {/if}
    </div>

    {#if data.totals.sets}
      <div class="bar-chart">
        {#each data.weeks as week, i (i)}
          <div class="bar-column reveal" style={`--index: ${i}`}>
            <span class="bar-value">{week.volume ? formatVolume(week.volume) : ''}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                style={`height: ${Math.max((week.volume / data.maxVolume) * 100, week.volume > 0 ? 5 : 1.5)}%`}
              ></div>
            </div>
            <span class="bar-label">{week.label}</span>
          </div>
        {/each}
      </div>

      <div class="chart-summary">
        <div>
          <span class="muted">Volume in this window</span>
          <strong>{formatVolume(totalVolume)}</strong>
        </div>
        <div>
          <span class="muted">Sets logged</span>
          <strong>{data.totals.sets}</strong>
        </div>
        <div>
          <span class="muted">Best week</span>
          <strong>{formatVolume(bestWeek.volume)}</strong>
        </div>
      </div>
    {:else}
      <div class="empty-state chart-empty">
        <span class="empty-icon"><i class="fa-solid fa-chart-column" aria-hidden="true"></i></span>
        <h3>No training data yet</h3>
        <p>Log a workout with at least one weighted set and your weekly volume will appear here.</p>
        <a class="btn btn-primary" href={resolve('create-workout')}>
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
          Log a workout
        </a>
      </div>
    {/if}
  </section>

  {#if data.topExercises.length}
    <section class="card top-card" aria-labelledby="top-heading">
      <div class="section-head">
        <div>
          <h2 id="top-heading">Top exercises</h2>
          <p>Ranked by volume across the last {data.weeks.length} weeks.</p>
        </div>
      </div>

      <div class="top-list">
        {#each data.topExercises as exercise, i (exercise.name)}
          <div class="top-row reveal" style={`--index: ${i}`}>
            <span class="top-rank">{i + 1}</span>
            <span class="top-copy">
              <strong>{exercise.name}</strong>
              <span>{formatVolume(exercise.volume)} volume</span>
            </span>
            <div class="top-bar" aria-hidden="true">
              <span style={`width: ${(exercise.volume / data.topExercises[0].volume) * 100}%`}
              ></span>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  .metric-strip {
    margin-bottom: 1rem;
  }

  .progress-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(18rem, 1fr);
    gap: 1rem;
    align-items: start;
  }

  .progress-grid > :only-child {
    grid-column: 1 / -1;
  }

  .chart-card,
  .top-card {
    padding: 1.25rem;
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: clamp(0.35rem, 1.4vw, 0.8rem);
    height: 14rem;
    margin-top: 1.5rem;
    padding: 1rem 0.75rem 0;
    border-radius: var(--radius-md);
    background:
      linear-gradient(to top, rgba(255, 200, 255, 0.055) 1px, transparent 1px) 0 0 / 100% 25%,
      var(--surface-muted);
  }

  .bar-column {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    height: 100%;
    min-width: 0;
  }

  .bar-value {
    min-height: 1rem;
    color: var(--muted-text-color);
    font-size: 0.62rem;
    font-variant-numeric: tabular-nums;
  }

  .bar-track {
    display: flex;
    align-items: flex-end;
    width: 100%;
    flex: 1;
    max-width: 3.2rem;
    border-radius: 0.45rem 0.45rem 0 0;
    background: rgba(255, 200, 255, 0.035);
    overflow: hidden;
  }

  .bar-fill {
    width: 100%;
    border-radius: 0.45rem 0.45rem 0 0;
    background: var(--accent-color);
    transition: height 300ms var(--ease-out);
  }

  .bar-label {
    color: var(--muted-text-color);
    font-size: 0.66rem;
    white-space: nowrap;
  }

  .chart-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .chart-summary div {
    display: flex;
    flex-direction: column;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
  }

  .chart-summary .muted {
    font-size: 0.72rem;
  }

  .chart-summary strong {
    font-size: 1rem;
  }

  .chart-empty {
    margin-top: 1.25rem;
  }

  .top-list {
    display: grid;
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .top-row {
    display: grid;
    grid-template-columns: auto minmax(7rem, 1fr) minmax(4rem, 1.4fr);
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.75rem;
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
  }

  .top-rank {
    display: grid;
    place-items: center;
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 0.5rem;
    background: rgba(255, 200, 255, 0.06);
    color: var(--muted-text-color);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .top-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.3;
  }

  .top-copy strong {
    overflow: hidden;
    font-size: 0.86rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .top-copy span {
    color: var(--muted-text-color);
    font-size: 0.72rem;
  }

  .top-bar {
    height: 0.45rem;
    border-radius: 999px;
    background: rgba(255, 200, 255, 0.06);
    overflow: hidden;
  }

  .top-bar span {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: var(--accent-color);
  }

  @media (max-width: 1000px) {
    .progress-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .chart-summary {
      grid-template-columns: 1fr;
    }

    .bar-chart {
      height: 11rem;
      gap: 0.25rem;
      padding-inline: 0.35rem;
    }

    .bar-value {
      font-size: 0.55rem;
    }

    .bar-label {
      font-size: 0.55rem;
    }

    .top-row {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .top-bar {
      display: none;
    }
  }
</style>
