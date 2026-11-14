<script lang="ts">
  import { resolve } from '$app/paths';
  import { getCurrentWorkout } from '#lib/contexts/CurrentWorkout.svelte.ts';
  import { formatDate } from '#lib/utils/format.ts';

  let { data } = $props();

  const { workout } = getCurrentWorkout();

  const hasDraft = $derived(workout.exercises.length > 0 || workout.current.name.trim().length > 0);

  const ledgerRows = $derived([
    { label: 'Workouts logged', value: data.totals.workouts },
    { label: 'Exercises in library', value: data.totals.exercises },
    { label: 'Sets tracked', value: data.totals.sets }
  ]);
</script>

<svelte:head>
  <title>Today · Workout Log</title>
</svelte:head>

<header class="page-header">
  <div>
    <h1 class="page-title">Today</h1>
    <p class="page-subtitle">Start a session, pick up where you left off, or check recent logs.</p>
  </div>
  <div class="page-actions">
    <a class="btn btn-primary" href={resolve('create-workout')}>
      <i class="fa-solid {hasDraft ? 'fa-play' : 'fa-plus'}" aria-hidden="true"></i>
      {hasDraft ? 'Resume workout' : 'New workout'}
    </a>
  </div>
</header>

{#if hasDraft}
  <a class="draft-banner reveal" href={resolve('create-workout')}>
    <div class="draft-copy">
      <span class="draft-tag">Session in progress</span>
      <strong>{workout.current.name.trim() || 'Untitled workout'}</strong>
      <span class="muted">
        {workout.exercises.length} exercise{workout.exercises.length === 1 ? '' : 's'} queued
      </span>
    </div>
    <span class="btn btn-sm">Open</span>
  </a>
{/if}

<div class="today-grid">
  <section aria-labelledby="recent-heading">
    <div class="section-head">
      <div>
        <h2 id="recent-heading">Recent workouts</h2>
        <p>Your latest logged sessions.</p>
      </div>
      {#if data.recent.length}
        <a class="btn btn-ghost btn-sm" href={resolve('history')}>All history</a>
      {/if}
    </div>

    {#if data.recent.length}
      <ul class="log-list">
        {#each data.recent as item, i (item.id)}
          <li>
            <a
              class="log-row reveal"
              style={`--index: ${i}`}
              href={resolve('/history/[id]', { id: String(item.id) })}
            >
              <span class="log-copy">
                <strong>{item.name}</strong>
                <span>{item.variant || 'Standard session'}</span>
              </span>
              <time class="log-date">{formatDate(item.date)}</time>
              <i class="fa-solid fa-chevron-right log-arrow" aria-hidden="true"></i>
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="empty-state recent-empty">
        <span class="empty-icon"><i class="fa-solid fa-dumbbell" aria-hidden="true"></i></span>
        <h3>No workouts logged yet</h3>
        <p>Start a session to record sets and build your log.</p>
        <a class="btn btn-primary" href={resolve('create-workout')}>
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
          New workout
        </a>
      </div>
    {/if}
  </section>

  <aside class="side-rail">
    <section class="ledger" aria-labelledby="totals-heading">
      <h2 id="totals-heading" class="rail-heading">Totals</h2>
      <dl class="ledger-list">
        {#each ledgerRows as row, i (row.label)}
          <div class="ledger-row reveal" style={`--index: ${i}`}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        {/each}
      </dl>
    </section>

    <section class="jump-section" aria-labelledby="jump-heading">
      <h2 id="jump-heading" class="rail-heading">Library & analysis</h2>
      <div class="jump-list">
        <a class="jump-link" href={resolve('create-exercise')}>
          <span>
            <strong>Exercises</strong>
            <span>Add or browse movements ({data.totals.exercises})</span>
          </span>
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </a>
        <a class="jump-link" href={resolve('my-stats')}>
          <span>
            <strong>Stats</strong>
            <span>Weekly volume and top lifts</span>
          </span>
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    </section>
  </aside>
</div>

<style>
  .draft-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 0.9rem 1.1rem;
    border: 1px solid rgba(154, 75, 176, 0.55);
    border-radius: var(--radius-md);
    background: var(--accent-soft);
    transition:
      border-color 140ms var(--ease-out),
      transform 120ms var(--ease-out);
  }

  .draft-banner:hover {
    border-color: var(--accent-color);
  }

  .draft-banner:active {
    transform: scale(0.99);
  }

  .draft-copy {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  .draft-tag {
    color: var(--pink-color);
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .draft-copy strong {
    font-size: 0.98rem;
  }

  .draft-copy .muted {
    font-size: 0.78rem;
  }

  .today-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(16rem, 1fr);
    gap: 2rem;
    align-items: start;
  }

  .log-list {
    margin-top: 1rem;
    border-top: 1px solid var(--border-color);
  }

  .log-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.9rem 0.65rem;
    border-bottom: 1px solid var(--border-color);
    transition:
      background-color 140ms var(--ease-out),
      transform 120ms var(--ease-out);
  }

  .log-row:hover {
    background: rgba(255, 200, 255, 0.045);
  }

  .log-row:active {
    transform: scale(0.99);
    transition: transform 80ms ease-out;
  }

  .log-copy {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    line-height: 1.35;
  }

  .log-copy strong {
    font-size: 0.94rem;
  }

  .log-copy span {
    color: var(--muted-text-color);
    font-size: 0.78rem;
  }

  .log-date {
    color: var(--muted-text-color);
    font-size: 0.76rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .log-arrow {
    color: var(--muted-text-color);
    font-size: 0.7rem;
  }

  .recent-empty {
    margin-top: 1rem;
  }

  .side-rail {
    display: grid;
    gap: 1.75rem;
  }

  .rail-heading {
    color: var(--muted-text-color);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .ledger-list {
    margin: 0.65rem 0 0;
    border-top: 1px solid var(--border-color);
  }

  .ledger-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-color);
  }

  .ledger-row dt {
    color: var(--muted-text-color);
    font-size: 0.84rem;
  }

  .ledger-row dd {
    margin: 0;
    color: var(--main-text-color);
    font-size: 1.15rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .jump-list {
    display: grid;
    gap: 0.55rem;
    margin-top: 0.7rem;
  }

  .jump-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.8rem 0.9rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-color);
    transition:
      border-color 140ms var(--ease-out),
      background-color 140ms var(--ease-out),
      transform 120ms var(--ease-out);
  }

  .jump-link:hover {
    border-color: var(--border-highlight-color);
    background: var(--surface-raised);
  }

  .jump-link:active {
    transform: scale(0.98);
    transition: transform 80ms ease-out;
  }

  .jump-link span {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
  }

  .jump-link strong {
    font-size: 0.88rem;
  }

  .jump-link span span {
    color: var(--muted-text-color);
    font-size: 0.75rem;
  }

  .jump-link i {
    color: var(--muted-text-color);
    font-size: 0.75rem;
  }

  @media (max-width: 900px) {
    .today-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
