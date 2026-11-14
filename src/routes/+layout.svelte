<script lang="ts">
  import { resolve } from '$app/paths';
  import { navigating, page } from '$app/state';
  import type { Path } from '$app/types';
  import { setCurrentWorkout } from '#lib/contexts/CurrentWorkout.svelte.ts';

  let { children } = $props();

  setCurrentWorkout();

  const navItems: { href: Path; label: string; shortLabel: string; icon: string }[] = [
    { href: '', label: 'Dashboard', shortLabel: 'Home', icon: 'fa-house' },
    { href: 'create-workout', label: 'Create Workout', shortLabel: 'Workout', icon: 'fa-dumbbell' },
    {
      href: 'create-exercise',
      label: 'Create Exercise',
      shortLabel: 'Exercise',
      icon: 'fa-circle-plus'
    },
    { href: 'history', label: 'History', shortLabel: 'History', icon: 'fa-clock-rotate-left' },
    { href: 'my-stats', label: 'My Stats', shortLabel: 'Stats', icon: 'fa-chart-line' }
  ];

  const pathname = $derived(page.url.pathname);

  function isActive(href: Path) {
    if (href === '') return pathname === '/';
    return pathname === `/${href}` || pathname.startsWith(`/${href}/`);
  }
</script>

<svelte:head>
  <title>Workout Tracker</title>
  <meta name="theme-color" content="#0b1120" />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>

{#if navigating.to}
  <div class="nav-progress" aria-hidden="true"><span></span></div>
{/if}

<div class="app-shell">
  <aside class="sidebar" aria-label="Primary navigation">
    <a class="brand" href={resolve('')} aria-label="Workout Tracker home">
      <span class="brand-mark"><i class="fa-solid fa-bolt"></i></span>
      <span class="brand-copy">
        <strong>Workout</strong>
        <span>Tracker</span>
      </span>
    </a>

    <nav class="side-nav">
      <span class="nav-heading">Menu</span>
      {#each navItems as item (item.href)}
        <a
          class={['nav-link', { active: isActive(item.href) }]}
          href={resolve(item.href)}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          <span class="nav-icon"><i class="fa-solid {item.icon}"></i></span>
          <span>{item.label}</span>
          <i class="fa-solid fa-chevron-right nav-arrow" aria-hidden="true"></i>
        </a>
      {/each}
    </nav>

    <div class="sidebar-footer">
      <div class="profile-chip">
        <span class="avatar">V</span>
        <span class="profile-copy">
          <strong>Your profile</strong>
          <span>Local athlete</span>
        </span>
      </div>
      <p class="sidebar-note">Track consistently. Progress follows.</p>
    </div>
  </aside>

  <header class="mobile-bar">
    <a class="brand compact" href={resolve('')} aria-label="Workout Tracker home">
      <span class="brand-mark"><i class="fa-solid fa-bolt"></i></span>
      <span class="brand-copy">
        <strong>Workout</strong>
        <span>Tracker</span>
      </span>
    </a>
    <a class="avatar" href={resolve('my-stats')} aria-label="View your stats">V</a>
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
        <span>{item.shortLabel}</span>
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
    background: linear-gradient(90deg, transparent, var(--accent-color), #38bdf8);
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
    gap: 2rem;
    height: 100dvh;
    padding: 1.5rem 1rem;
    border-right: 1px solid var(--border-color);
    background: rgba(10, 16, 29, 0.76);
    backdrop-filter: blur(18px);
    overflow-y: auto;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.4rem;
    border-radius: var(--radius-sm);
  }

  .brand-mark {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.8rem;
    background: var(--accent-color);
    color: #03201a;
    font-size: 1rem;
    box-shadow: 0 8px 24px rgba(52, 211, 153, 0.25);
  }

  .brand-copy {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
  }

  .brand-copy strong {
    font-size: 0.98rem;
    letter-spacing: -0.02em;
  }

  .brand-copy span {
    color: var(--muted-text-color);
    font-size: 0.76rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .side-nav {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .nav-heading {
    padding: 0 0.75rem 0.35rem;
    color: var(--muted-text-color);
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.72rem 0.75rem;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    color: var(--muted-text-color);
    font-size: 0.9rem;
    font-weight: 600;
    transition:
      background-color 160ms var(--ease-out),
      border-color 160ms var(--ease-out),
      color 160ms var(--ease-out);
  }

  .nav-link:hover {
    background: rgba(148, 163, 184, 0.07);
    color: var(--main-text-color);
  }

  .nav-link.active {
    border-color: rgba(52, 211, 153, 0.25);
    background: var(--accent-soft);
    color: var(--main-text-color);
  }

  .nav-icon {
    display: grid;
    place-items: center;
    width: 1.9rem;
    height: 1.9rem;
    border-radius: 0.6rem;
    background: rgba(148, 163, 184, 0.08);
    color: inherit;
    font-size: 0.82rem;
  }

  .nav-link.active .nav-icon {
    background: var(--accent-color);
    color: #03201a;
  }

  .nav-arrow {
    margin-left: auto;
    font-size: 0.65rem;
    opacity: 0;
    transition: opacity 160ms var(--ease-out);
  }

  .nav-link:hover .nav-arrow,
  .nav-link.active .nav-arrow {
    opacity: 0.7;
  }

  .sidebar-footer {
    display: grid;
    gap: 0.85rem;
    margin-top: auto;
  }

  .profile-chip {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.7rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
  }

  .avatar {
    display: grid;
    place-items: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 50%;
    background: var(--surface-raised);
    color: var(--accent-color);
    font-size: 0.82rem;
    font-weight: 800;
  }

  .profile-copy {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .profile-copy strong {
    font-size: 0.82rem;
  }

  .profile-copy span {
    color: var(--muted-text-color);
    font-size: 0.72rem;
  }

  .sidebar-note {
    padding: 0 0.7rem;
    color: var(--muted-text-color);
    font-size: 0.72rem;
  }

  .app-main {
    min-width: 0;
    padding: 2.5rem clamp(1rem, 4vw, 3rem) 4rem;
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
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-color);
      background: rgba(10, 16, 29, 0.82);
      backdrop-filter: blur(18px);
    }

    .mobile-bar .brand {
      padding: 0;
    }

    .mobile-bar .brand-mark {
      width: 2.1rem;
      height: 2.1rem;
      border-radius: 0.65rem;
      font-size: 0.85rem;
    }

    .mobile-bar .avatar {
      width: 2.25rem;
      height: 2.25rem;
      border: 1px solid var(--border-color);
      background: var(--surface-muted);
    }

    .app-main {
      padding: 1.5rem 1rem 2rem;
    }

    .mobile-nav {
      position: fixed;
      inset: auto 0 0;
      z-index: 60;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0.25rem;
      padding: 0.5rem 0.55rem calc(0.5rem + env(safe-area-inset-bottom));
      border-top: 1px solid var(--border-color);
      background: rgba(10, 16, 29, 0.92);
      backdrop-filter: blur(20px);
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
        background-color 160ms var(--ease-out),
        color 160ms var(--ease-out);
    }

    .mobile-nav-link i {
      font-size: 1rem;
    }

    .mobile-nav-link.active {
      background: var(--accent-soft);
      color: var(--accent-color);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-progress span {
      animation: none;
      width: 100%;
      opacity: 0.6;
    }
  }
</style>
