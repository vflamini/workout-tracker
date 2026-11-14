<script lang="ts">
  import { resolve } from '$app/paths';

  let { data } = $props();

  const stats = $derived([
    {
      label: 'Workouts',
      value: data.totals.workouts,
      meta: 'logged all time',
      icon: 'fa-dumbbell'
    },
    {
      label: 'Exercises',
      value: data.totals.exercises,
      meta: 'in your library',
      icon: 'fa-list-check'
    },
    {
      label: 'Sets',
      value: data.totals.sets,
      meta: 'tracked total',
      icon: 'fa-layer-group'
    }
  ]);

  function formatDate(value: string | null) {
    if (!value) return 'No date';
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(value));
  }
</script>

<svelte:head>
  <title>Dashboard · Workout Tracker</title>
</svelte:head>

<header class="page-header">
  <div>
    <p class="eyebrow">Overview</p>
    <h1 class="page-title">Training desk</h1>
    <p class="page-subtitle">Start a session, add to the library, or check the log.</p>
  </div>
  <div class="page-actions">
    <a class="btn btn-primary" href={resolve('create-workout')}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      New workout
    </a>
  </div>
</header>

<section class="metric-strip" aria-label="Training totals">
  {#each stats as stat, i (stat.label)}
    <article class="metric" style={`--index: ${i}`}>
      <span class="metric-icon"><i class="fa-solid {stat.icon}" aria-hidden="true"></i></span>
      <span class="metric-label">{stat.label}</span>
      <strong class="metric-value">{stat.value}</strong>
      <span class="metric-meta">{stat.meta}</span>
    </article>
  {/each}
</section>

<div class="dashboard-grid">
  <section class="card recent-card" aria-labelledby="recent-heading">
    <div class="section-head">
      <div>
        <h2 id="recent-heading">Recent workouts</h2>
        <p>Your latest logged sessions.</p>
      </div>
      <a class="btn btn-ghost btn-sm" href={resolve('my-stats')}>View stats</a>
    </div>

    {#if data.recent.length}
      <ul class="activity-list">
        {#each data.recent as workout, i (workout.id)}
          <li>
            <a
              class="activity-item reveal"
              style={`--index: ${i}`}
              href={resolve('/history/[id]', { id: String(workout.id) })}
            >
              <span class="activity-icon"><i class="fa-solid fa-bolt" aria-hidden="true"></i></span>
              <span class="activity-copy">
                <strong>{workout.name}</strong>
                <span>{workout.variant || 'Standard session'}</span>
              </span>
              <time class="activity-date">{formatDate(workout.date)}</time>
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="empty-state compact-empty">
        <span class="empty-icon"><i class="fa-solid fa-dumbbell" aria-hidden="true"></i></span>
        <h3>No workouts logged</h3>
        <p>Create your first workout and it will show up here.</p>
        <a class="btn btn-primary" href={resolve('create-workout')}>
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
          Create workout
        </a>
      </div>
    {/if}
  </section>

  <div class="side-stack">
    <section class="card action-card" aria-labelledby="quick-heading">
      <div class="section-head">
        <div>
          <h2 id="quick-heading">Next move</h2>
          <p>Pick up where you left off.</p>
        </div>
      </div>

      <div class="action-list">
        <a class="action-link reveal" style="--index: 0" href={resolve('create-workout')}>
          <span class="action-icon"><i class="fa-solid fa-play" aria-hidden="true"></i></span>
          <span>
            <strong>Start a workout</strong>
            <span>Open a blank session</span>
          </span>
          <i class="fa-solid fa-arrow-right action-arrow" aria-hidden="true"></i>
        </a>
        <a class="action-link reveal" style="--index: 1" href={resolve('create-exercise')}>
          <span class="action-icon"><i class="fa-solid fa-plus" aria-hidden="true"></i></span>
          <span>
            <strong>Add an exercise</strong>
            <span>Add a movement</span>
          </span>
          <i class="fa-solid fa-arrow-right action-arrow" aria-hidden="true"></i>
        </a>
        <a class="action-link reveal" style="--index: 2" href={resolve('my-stats')}>
          <span class="action-icon"><i class="fa-solid fa-chart-line" aria-hidden="true"></i></span>
          <span>
            <strong>Open stats</strong>
            <span>Weekly volume and top lifts</span>
          </span>
          <i class="fa-solid fa-arrow-right action-arrow" aria-hidden="true"></i>
        </a>
      </div>
    </section>

    <section class="card flow-card" aria-labelledby="flow-heading">
      <span class="eyebrow">Session flow</span>
      <h2 id="flow-heading">From blank page to saved log</h2>
      <ol class="flow-list">
        <li><span>01</span> Name the workout</li>
        <li><span>02</span> Add exercises and sets</li>
        <li><span>03</span> Finish to save it to history</li>
      </ol>
    </section>
  </div>
</div>

<style>
  .metric-strip {
    margin-bottom: 1.5rem;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
  }

  .recent-card,
  .action-card {
    padding: 1.25rem;
  }

  .activity-list {
    display: grid;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
    transition:
      border-color 160ms var(--ease-out),
      background-color 160ms var(--ease-out),
      transform 160ms var(--ease-out);
  }

  .activity-item:hover {
    border-color: rgba(154, 75, 176, 0.45);
    background: var(--surface-raised);
    transform: translateY(-1px);
  }

  .activity-icon {
    display: grid;
    place-items: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 0.6rem;
    background: rgba(255, 200, 255, 0.06);
    color: var(--accent-color);
    font-size: 0.75rem;
  }

  .activity-copy {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    line-height: 1.3;
  }

  .activity-copy strong {
    font-size: 0.88rem;
  }

  .activity-copy span {
    color: var(--muted-text-color);
    font-size: 0.76rem;
  }

  .activity-date {
    color: var(--muted-text-color);
    font-size: 0.72rem;
    white-space: nowrap;
  }

  .side-stack {
    display: grid;
    gap: 1rem;
    align-content: start;
  }

  .action-list {
    display: grid;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .action-link {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.7rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
    transition:
      border-color 160ms var(--ease-out),
      background-color 160ms var(--ease-out),
      transform 160ms var(--ease-out);
  }

  .action-link:hover {
    border-color: rgba(154, 75, 176, 0.48);
    background: var(--surface-raised);
    transform: translateY(-1px);
  }

  .action-icon {
    display: grid;
    place-items: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 0.6rem;
    background: var(--accent-soft);
    color: var(--accent-color);
    font-size: 0.75rem;
  }

  .action-link > span:not(.action-icon) {
    display: flex;
    flex: 1;
    flex-direction: column;
    line-height: 1.3;
  }

  .action-link strong {
    font-size: 0.85rem;
  }

  .action-link span span {
    color: var(--muted-text-color);
    font-size: 0.74rem;
  }

  .action-arrow {
    color: var(--muted-text-color);
    font-size: 0.7rem;
  }

  .flow-card {
    padding: 1.1rem;
  }

  .flow-card h2 {
    margin-top: 0.25rem;
    font-size: 0.98rem;
  }

  .flow-list {
    display: grid;
    gap: 0.55rem;
    margin-top: 0.9rem;
  }

  .flow-list li {
    display: flex;
    align-items: baseline;
    gap: 0.65rem;
    color: var(--muted-text-color);
    font-size: 0.78rem;
  }

  .flow-list span {
    color: var(--warning-output-color);
    font-size: 0.68rem;
    font-weight: 700;
  }

  .compact-empty {
    margin-top: 1rem;
    padding: 2rem 1rem;
  }

  @media (max-width: 980px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .activity-date {
      display: none;
    }
  }
</style>
