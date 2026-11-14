<script lang="ts">
  import { resolve } from '$app/paths';
  import { formatVolume } from '#lib/utils/format.ts';

  let { data } = $props();

  const stats = $derived([
    { label: 'Workouts', value: data.totals.workouts },
    { label: 'Exercises', value: data.totals.exercises },
    { label: 'Sets', value: data.totals.sets }
  ]);

  const totalVolume = $derived(data.weeks.reduce((total, week) => total + week.volume, 0));
  const bestWeek = $derived(
    data.weeks.reduce((best, week) => (week.volume > best.volume ? week : best), data.weeks[0])
  );

  let selectedWeekIndex = $state<number | null>(null);
  const inspectedWeek = $derived(selectedWeekIndex !== null ? data.weeks[selectedWeekIndex] : null);
</script>

<svelte:head>
  <title>Stats · Workout Log</title>
</svelte:head>

<header class="page-header">
  <div>
    <h1 class="page-title">Stats</h1>
    <p class="page-subtitle">Weekly volume, lifetime totals, and the lifts doing the most work.</p>
  </div>
  <div class="page-actions">
    <a class="btn btn-primary" href={resolve('create-workout')}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      New workout
    </a>
  </div>
</header>

<section class="metric-strip" aria-label="Lifetime totals">
  {#each stats as stat, i (stat.label)}
    <article class="metric" style={`--index: ${i}`}>
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
        <p>
          {#if inspectedWeek}
            Week of {inspectedWeek.label} · {inspectedWeek.workouts} workout{inspectedWeek.workouts ===
            1
              ? ''
              : 's'} · {inspectedWeek.sets} set{inspectedWeek.sets === 1 ? '' : 's'} · {formatVolume(
              inspectedWeek.volume
            )} volume
          {:else}
            Weight moved per week over the last {data.weeks.length} weeks.
          {/if}
        </p>
      </div>
      {#if data.totals.sets}
        <span class="badge">Best: {formatVolume(bestWeek.volume)}</span>
      {/if}
    </div>

    {#if data.totals.sets}
      <div class="bar-chart" role="list" aria-label="Weekly volume bars">
        {#each data.weeks as week, i (i)}
          <button
            type="button"
            class={['bar-column reveal', { selected: selectedWeekIndex === i }]}
            style={`--index: ${i}`}
            aria-label={`${week.label}: ${formatVolume(week.volume)} volume, ${week.sets} sets`}
            onmouseenter={() => (selectedWeekIndex = i)}
            onmouseleave={() => (selectedWeekIndex = null)}
            onfocus={() => (selectedWeekIndex = i)}
            onblur={() => (selectedWeekIndex = null)}
            onclick={() => (selectedWeekIndex = selectedWeekIndex === i ? null : i)}
          >
            <span class="bar-value">{week.volume ? formatVolume(week.volume) : ''}</span>
            <span class="bar-slot">
              <span
                class={['bar-fill', { empty: week.volume === 0 }]}
                style={`height: ${week.volume > 0 ? Math.max((week.volume / data.maxVolume) * 100, 6) : 2}%`}
              ></span>
            </span>
            <span class="bar-label">{week.label}</span>
          </button>
        {/each}
      </div>

      <dl class="chart-summary">
        <div>
          <dt>8-week volume</dt>
          <dd>{formatVolume(totalVolume)}</dd>
        </div>
        <div>
          <dt>Sets logged</dt>
          <dd>{data.totals.sets}</dd>
        </div>
        <div>
          <dt>Best week</dt>
          <dd>{formatVolume(bestWeek.volume)}</dd>
        </div>
      </dl>
    {:else}
      <div class="empty-state chart-empty">
        <span class="empty-icon"><i class="fa-solid fa-chart-column" aria-hidden="true"></i></span>
        <h3>No training data yet</h3>
        <p>Log a workout with at least one weighted set and your weekly volume will appear here.</p>
        <a class="btn btn-primary" href={resolve('create-workout')}>
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
          New workout
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
    margin-bottom: 1.25rem;
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
    gap: clamp(0.35rem, 1.4vw, 0.75rem);
    height: 14rem;
    margin-top: 1.35rem;
    padding: 1rem 0.65rem 0.55rem;
    border-bottom: 1px solid var(--border-color);
    background: linear-gradient(to top, rgba(255, 200, 255, 0.05) 1px, transparent 1px) 0 0 / 100%
      25%;
  }

  .bar-column {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    height: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
  }

  .bar-value {
    min-height: 1rem;
    color: var(--muted-text-color);
    font-size: 0.62rem;
    font-variant-numeric: tabular-nums;
  }

  .bar-slot {
    display: flex;
    align-items: flex-end;
    width: 100%;
    flex: 1;
    max-width: 2.8rem;
  }

  .bar-fill {
    display: block;
    width: 100%;
    border-radius: 0.35rem 0.35rem 0 0;
    background: linear-gradient(180deg, var(--accent-color), #a06bb8);
    transition:
      background-color 140ms var(--ease-out),
      transform 120ms var(--ease-out);
  }

  .bar-fill.empty {
    background: var(--border-color);
  }

  .bar-column:hover .bar-fill:not(.empty),
  .bar-column.selected .bar-fill:not(.empty) {
    background: var(--pink-color);
  }

  .bar-column:active .bar-fill {
    transform: scaleY(0.96);
    transform-origin: bottom;
  }

  .bar-label {
    color: var(--muted-text-color);
    font-size: 0.64rem;
    white-space: nowrap;
  }

  .chart-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
    margin: 1rem 0 0;
  }

  .chart-summary div {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.6rem 0;
  }

  .chart-summary dt {
    color: var(--muted-text-color);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .chart-summary dd {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .chart-empty {
    margin-top: 1.25rem;
  }

  .top-list {
    margin-top: 1rem;
    border-top: 1px solid var(--border-color);
  }

  .top-row {
    display: grid;
    grid-template-columns: auto minmax(7rem, 1fr) minmax(4rem, 1.3fr);
    align-items: center;
    gap: 0.75rem;
    padding: 0.72rem 0;
    border-bottom: 1px solid var(--border-color);
  }

  .top-rank {
    color: var(--muted-text-color);
    font-size: 0.74rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    min-width: 1.25rem;
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
    height: 0.4rem;
    border-radius: 999px;
    background: rgba(255, 200, 255, 0.06);
    overflow: hidden;
  }

  .top-bar span {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #a06bb8, var(--accent-color));
  }

  @media (max-width: 1000px) {
    .progress-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .chart-summary {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .chart-summary div {
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid var(--border-color);
    }

    .chart-summary div:last-child {
      border-bottom: 0;
    }

    .bar-chart {
      height: 11rem;
      gap: 0.25rem;
      padding-inline: 0.25rem;
    }

    .bar-value,
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
