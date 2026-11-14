<script lang="ts">
  import { resolve } from '$app/paths';

  let { data } = $props();

  const stats = $derived([
    { label: 'Workouts', value: data.totals.workouts, icon: 'fa-dumbbell' },
    { label: 'Exercises', value: data.totals.exercises, icon: 'fa-list-check' },
    { label: 'Sets', value: data.totals.sets, icon: 'fa-layer-group' }
  ]);
</script>

<svelte:head>
  <title>My Stats · Workout Tracker</title>
</svelte:head>

<header class="page-header">
  <div>
    <p class="eyebrow">Progress</p>
    <h1 class="page-title">My stats</h1>
    <p class="page-subtitle">
      A long-term view of your training. Detailed trends and charts are coming next.
    </p>
  </div>
  <div class="page-actions">
    <a class="btn btn-primary" href={resolve('create-workout')}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      Log a workout
    </a>
  </div>
</header>

<section class="stat-grid" aria-label="Lifetime totals">
  {#each stats as stat (stat.label)}
    <article class="stat-card card">
      <span class="stat-icon"><i class="fa-solid {stat.icon}" aria-hidden="true"></i></span>
      <span class="stat-label">{stat.label}</span>
      <strong>{stat.value}</strong>
    </article>
  {/each}
</section>

<section class="card chart-card" aria-labelledby="chart-heading">
  <div class="section-head">
    <div>
      <h2 id="chart-heading">Training volume</h2>
      <p>Charts will appear once you have a few sessions logged.</p>
    </div>
    <span class="badge"
      ><i class="fa-solid fa-hourglass-half" aria-hidden="true"></i> Coming soon</span
    >
  </div>

  <div class="chart-placeholder" aria-hidden="true">
    <span style="height: 32%"></span>
    <span style="height: 48%"></span>
    <span style="height: 40%"></span>
    <span style="height: 68%"></span>
    <span style="height: 56%"></span>
    <span style="height: 82%"></span>
    <span style="height: 74%"></span>
  </div>

  <p class="chart-note">
    Keep logging workouts to unlock weekly volume, personal records, and exercise trends.
  </p>
</section>

<style>
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1.1rem;
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
    font-size: 2rem;
    line-height: 1.1;
  }

  .chart-card {
    margin-top: 1rem;
    padding: 1.25rem;
  }

  .chart-placeholder {
    display: flex;
    align-items: flex-end;
    gap: 0.6rem;
    height: 12rem;
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: var(--radius-md);
    background:
      linear-gradient(to top, rgba(148, 163, 184, 0.06) 1px, transparent 1px) 0 0 / 100% 25%,
      var(--surface-muted);
  }

  .chart-placeholder span {
    flex: 1;
    border-radius: 0.5rem 0.5rem 0 0;
    background: linear-gradient(180deg, var(--accent-color), rgba(16, 185, 129, 0.18));
    opacity: 0.75;
  }

  .chart-note {
    margin-top: 1rem;
    color: var(--muted-text-color);
    font-size: 0.85rem;
  }

  @media (max-width: 640px) {
    .stat-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      flex-direction: row;
      align-items: center;
      gap: 0.85rem;
    }

    .stat-icon {
      margin-bottom: 0;
    }

    .stat-card strong {
      margin-left: auto;
    }
  }
</style>
