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
    <h1 class="page-title">Welcome back</h1>
    <p class="page-subtitle">
      Your training hub. Start a session, grow your exercise library, and keep an eye on the work
      you have put in.
    </p>
  </div>
  <div class="page-actions">
    <a class="btn btn-primary" href={resolve('create-workout')}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      New workout
    </a>
  </div>
</header>

<section class="stat-grid" aria-label="Training totals">
  {#each stats as stat (stat.label)}
    <article class="stat-card card">
      <span class="stat-icon"><i class="fa-solid {stat.icon}" aria-hidden="true"></i></span>
      <span class="stat-label">{stat.label}</span>
      <strong class="stat-value">{stat.value}</strong>
      <span class="stat-meta">{stat.meta}</span>
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
        {#each data.recent as workout, i (i)}
          <li class="activity-item">
            <span class="activity-icon"><i class="fa-solid fa-bolt" aria-hidden="true"></i></span>
            <span class="activity-copy">
              <strong>{workout.name}</strong>
              <span>{workout.variant || 'Standard session'}</span>
            </span>
            <time class="activity-date">{formatDate(workout.date)}</time>
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
          <h2 id="quick-heading">Quick actions</h2>
          <p>Jump straight into the next step.</p>
        </div>
      </div>

      <div class="action-list">
        <a class="action-link" href={resolve('create-workout')}>
          <span class="action-icon"><i class="fa-solid fa-play" aria-hidden="true"></i></span>
          <span>
            <strong>Start a workout</strong>
            <span>Log exercises and sets</span>
          </span>
          <i class="fa-solid fa-arrow-right action-arrow" aria-hidden="true"></i>
        </a>
        <a class="action-link" href={resolve('create-exercise')}>
          <span class="action-icon"><i class="fa-solid fa-plus" aria-hidden="true"></i></span>
          <span>
            <strong>Add an exercise</strong>
            <span>Expand your library</span>
          </span>
          <i class="fa-solid fa-arrow-right action-arrow" aria-hidden="true"></i>
        </a>
        <a class="action-link" href={resolve('my-stats')}>
          <span class="action-icon"><i class="fa-solid fa-chart-line" aria-hidden="true"></i></span>
          <span>
            <strong>Review progress</strong>
            <span>See your training trends</span>
          </span>
          <i class="fa-solid fa-arrow-right action-arrow" aria-hidden="true"></i>
        </a>
      </div>
    </section>

    <section class="card tip-card">
      <span class="tip-icon"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i></span>
      <p><strong>Consistency tip</strong> Small sessions still count. Show up, log the work.</p>
    </section>
  </div>
</div>

<style>
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    position: relative;
    display: grid;
    gap: 0.15rem;
    padding: 1.1rem;
    overflow: hidden;
  }

  .stat-card::after {
    position: absolute;
    right: -2rem;
    bottom: -2rem;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    content: '';
    background: var(--accent-soft);
  }

  .stat-icon {
    display: grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    margin-bottom: 0.5rem;
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

  .stat-value {
    font-size: 2rem;
    font-weight: 750;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .stat-meta {
    color: var(--muted-text-color);
    font-size: 0.76rem;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 1rem;
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
  }

  .activity-icon {
    display: grid;
    place-items: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 0.6rem;
    background: rgba(148, 163, 184, 0.08);
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
      background-color 160ms var(--ease-out);
  }

  .action-link:hover {
    border-color: rgba(52, 211, 153, 0.4);
    background: var(--surface-raised);
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

  .tip-card {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 1rem;
  }

  .tip-icon {
    color: var(--warning-output-color);
  }

  .tip-card p {
    color: var(--muted-text-color);
    font-size: 0.8rem;
    line-height: 1.45;
  }

  .tip-card strong {
    color: var(--main-text-color);
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
    .stat-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      grid-template-columns: auto 1fr;
      align-items: center;
      column-gap: 0.85rem;
    }

    .stat-icon {
      grid-row: span 3;
      margin-bottom: 0;
    }

    .activity-date {
      display: none;
    }
  }
</style>
