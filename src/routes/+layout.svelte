<script lang="ts">
  import { resolve } from '$app/paths';
  import { navigating, page } from '$app/state';
  import type { Path } from '$app/types';
  import { setCurrentWorkout } from '#lib/contexts/CurrentWorkout.svelte.ts';

  let { children } = $props();

  const { workout } = setCurrentWorkout();

  const navItems: { href: Path; label: string; icon: string }[] = [
    { href: '', label: 'Today', icon: 'fa-house' },
    { href: 'create-workout', label: 'Workout', icon: 'fa-dumbbell' },
    { href: 'create-exercise', label: 'Exercises', icon: 'fa-list-check' },
    { href: 'history', label: 'History', icon: 'fa-clock-rotate-left' },
    { href: 'my-stats', label: 'Stats', icon: 'fa-chart-line' }
  ];

  const pathname = $derived(page.url.pathname);
  const activeExerciseCount = $derived(workout.exercises.length);
  const hasDraftSession = $derived(
    activeExerciseCount > 0 || workout.current.name.trim().length > 0
  );
  const showResumeChip = $derived(hasDraftSession && !isActive('create-workout'));

  function isActive(href: Path) {
    if (href === '') return pathname === '/';
    return pathname === `/${href}` || pathname.startsWith(`/${href}/`);
  }
</script>

<svelte:head>
  <title>Workout Tracker</title>
  <meta name="theme-color" content="#2a2431" />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>

{#if navigating.to}
  <div class="nav-progress" aria-hidden="true"><span></span></div>
{/if}

<div class="app-shell">
  <aside class="sidebar" aria-label="Primary navigation">
    <a class="brand" href={resolve('')} aria-label="Workout Tracker home">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <rect x="2" y="7" width="3" height="10" rx="1" fill="currentColor" />
          <rect x="6" y="4.5" width="2.5" height="15" rx="1" fill="currentColor" />
          <rect x="8.5" y="10.75" width="7" height="2.5" fill="currentColor" />
          <rect x="15.5" y="4.5" width="2.5" height="15" rx="1" fill="currentColor" />
          <rect x="19" y="7" width="3" height="10" rx="1" fill="currentColor" />
        </svg>
      </span>
      <span class="brand-copy">
        <strong>Workout</strong>
        <span>Log</span>
      </span>
    </a>

    <nav class="side-nav">
      {#each navItems as item (item.href)}
        <a
          class={['nav-link', { active: isActive(item.href) }]}
          href={resolve(item.href)}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          <span class="nav-icon"><i class="fa-solid {item.icon}"></i></span>
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>

    {#if showResumeChip}
      <div class="sidebar-footer">
        <a class="resume-card" href={resolve('create-workout')}>
          <span class="resume-label">In progress</span>
          <strong>{workout.current.name.trim() || 'Untitled workout'}</strong>
          <span class="resume-meta"
            >{activeExerciseCount} exercise{activeExerciseCount === 1 ? '' : 's'} · Resume</span
          >
        </a>
      </div>
    {/if}
  </aside>

  <header class="mobile-bar">
    <a class="brand compact" href={resolve('')} aria-label="Workout Tracker home">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <rect x="2" y="7" width="3" height="10" rx="1" fill="currentColor" />
          <rect x="6" y="4.5" width="2.5" height="15" rx="1" fill="currentColor" />
          <rect x="8.5" y="10.75" width="7" height="2.5" fill="currentColor" />
          <rect x="15.5" y="4.5" width="2.5" height="15" rx="1" fill="currentColor" />
          <rect x="19" y="7" width="3" height="10" rx="1" fill="currentColor" />
        </svg>
      </span>
      <span class="brand-copy">
        <strong>Workout</strong>
        <span>Log</span>
      </span>
    </a>
    {#if showResumeChip}
      <a class="resume-pill" href={resolve('create-workout')}>
        <span>Resume ({activeExerciseCount})</span>
      </a>
    {/if}
  </header>

  <main id="main-content" class="app-main">
    <div class="page-container">
      {@render children()}
    </div>
  </main>

  <nav class="mobile-nav" aria-label="Primary navigation">
    {#each navItems as item (item.href)}
      <a
        class={['mobile-nav-link', { active: isActive(item.href) }]}
        href={resolve(item.href)}
        aria-current={isActive(item.href) ? 'page' : undefined}
      >
        <i class="fa-solid {item.icon}"></i>
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>
</div>

<style>
  .nav-progress {
    position: fixed;
    inset: 0 0 auto;
    z-index: 90;
    height: 2px;
    overflow: hidden;
    background: transparent;
  }

  .nav-progress span {
    display: block;
    width: 40%;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, var(--pink-color), var(--accent-color));
    animation: loading 900ms var(--ease-out) infinite;
  }

  @keyframes loading {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(350%);
    }
  }

  .app-shell {
    display: grid;
    grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
    min-height: 100dvh;
  }

  .sidebar {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    height: 100dvh;
    padding: 1.35rem 0.9rem;
    border-right: 1px solid var(--border-color);
    background: rgba(42, 36, 49, 0.8);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);
    backdrop-filter: blur(20px) saturate(150%);
    overflow-y: auto;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.35rem;
    border-radius: var(--radius-sm);
    transition: transform 120ms var(--ease-out);
  }

  .brand:active {
    transform: scale(0.98);
  }

  .brand-mark {
    display: grid;
    place-items: center;
    width: 2.35rem;
    height: 2.35rem;
    border-radius: var(--radius-sm);
    background: var(--accent-strong);
    color: #fff;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }

  .brand-copy {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
  }

  .brand-copy strong {
    font-size: 0.95rem;
    letter-spacing: -0.02em;
  }

  .brand-copy span {
    color: var(--muted-text-color);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .side-nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.65rem 0.7rem;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    color: var(--muted-text-color);
    font-size: 0.88rem;
    font-weight: 600;
    transition:
      background-color 140ms var(--ease-out),
      border-color 140ms var(--ease-out),
      color 140ms var(--ease-out),
      transform 120ms var(--ease-out);
  }

  .nav-link:hover {
    background: rgba(255, 200, 255, 0.06);
    color: var(--main-text-color);
  }

  .nav-link:active,
  .mobile-nav-link:active {
    transform: scale(0.975);
    transition: transform 80ms ease-out;
  }

  .nav-link.active {
    border-color: rgba(154, 75, 176, 0.45);
    background: var(--accent-soft);
    color: var(--pink-color);
  }

  .nav-icon {
    display: grid;
    place-items: center;
    width: 1.85rem;
    height: 1.85rem;
    border-radius: 0.45rem;
    background: rgba(255, 200, 255, 0.055);
    color: inherit;
    font-size: 0.8rem;
  }

  .nav-link.active .nav-icon {
    background: var(--accent-strong);
    color: #fff;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }

  .sidebar-footer {
    margin-top: auto;
  }

  .resume-card {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.75rem 0.85rem;
    border: 1px solid rgba(154, 75, 176, 0.48);
    border-radius: var(--radius-sm);
    background: var(--accent-soft);
    transition:
      border-color 140ms var(--ease-out),
      transform 120ms var(--ease-out);
  }

  .resume-card:hover {
    border-color: var(--accent-color);
  }

  .resume-card:active {
    transform: scale(0.98);
  }

  .resume-label {
    color: var(--pink-color);
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .resume-card strong {
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .resume-meta {
    color: var(--muted-text-color);
    font-size: 0.72rem;
  }

  .resume-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.65rem;
    border: 1px solid rgba(154, 75, 176, 0.55);
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--pink-color);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .app-main {
    min-width: 0;
    padding: 2.25rem clamp(1rem, 4vw, 3rem) 4rem;
  }

  .page-container {
    width: min(100%, var(--page-max-width));
    margin-inline: auto;
  }

  .mobile-bar,
  .mobile-nav {
    display: none;
  }

  @media (max-width: 900px) {
    .app-shell {
      grid-template-columns: 1fr;
      padding-bottom: 5.5rem;
    }

    .sidebar {
      display: none;
    }

    .mobile-bar {
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.7rem 1rem;
      border-bottom: 1px solid rgba(255, 200, 255, 0.08);
      background: rgba(42, 36, 49, 0.8);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px) saturate(160%);
    }

    .mobile-bar .brand {
      padding: 0;
    }

    .mobile-bar .brand-mark {
      width: 2rem;
      height: 2rem;
    }

    .app-main {
      padding: 1.35rem 1rem 2rem;
    }

    .mobile-nav {
      position: fixed;
      inset: auto 0 0;
      z-index: 60;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0.25rem;
      padding: 0.45rem 0.5rem calc(0.45rem + env(safe-area-inset-bottom));
      border-top: 1px solid rgba(255, 200, 255, 0.08);
      background: rgba(42, 36, 49, 0.88);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px) saturate(160%);
    }

    .mobile-nav-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;
      min-height: 3.1rem;
      border-radius: var(--radius-sm);
      color: var(--muted-text-color);
      font-size: 0.64rem;
      font-weight: 600;
      transition:
        background-color 140ms var(--ease-out),
        color 140ms var(--ease-out),
        transform 120ms var(--ease-out);
    }

    .mobile-nav-link i {
      font-size: 0.95rem;
    }

    .mobile-nav-link.active {
      background: var(--accent-soft);
      color: var(--pink-color);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-progress span {
      animation: none;
      width: 100%;
      opacity: 0.6;
    }
  }

  @media (prefers-reduced-transparency: reduce) {
    .sidebar,
    .mobile-bar,
    .mobile-nav {
      background: var(--background-color);
      backdrop-filter: none;
    }
  }
</style>
