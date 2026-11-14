<script lang="ts">
  import { onMount } from 'svelte';

  let seconds = $state(0);
  let running = $state(false);
  let timer: ReturnType<typeof setInterval> | undefined;

  const hours = $derived(Math.floor(seconds / 3600));
  const minutes = $derived(Math.floor(seconds / 60) % 60);
  const displaySeconds = $derived(seconds % 60);

  function formatNumber(value: number) {
    return String(value).padStart(2, '0');
  }

  function toggle() {
    running = !running;
    if (running) {
      timer = setInterval(() => {
        seconds += 1;
      }, 1000);
    } else {
      clearInterval(timer);
    }
  }

  function reset() {
    running = false;
    clearInterval(timer);
    seconds = 0;
  }

  onMount(() => {
    return () => clearInterval(timer);
  });
</script>

<div class="timer">
  <button
    type="button"
    class="timer-display"
    onclick={toggle}
    aria-pressed={running}
    aria-label={running ? 'Pause workout timer' : 'Start workout timer'}
  >
    <span class="timer-status">
      <span class={['status-dot', { live: running }]}></span>
      {running ? 'Running' : 'Ready'}
    </span>
    <span class="timer-value">
      {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(displaySeconds)}
    </span>
  </button>
  <button type="button" class="timer-reset" onclick={reset} aria-label="Reset workout timer">
    <i class="fa-solid fa-rotate-left"></i>
  </button>
</div>

<style>
  .timer {
    display: flex;
    align-items: stretch;
    gap: 0.5rem;
  }

  .timer-display {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    min-height: 2.8rem;
    padding: 0.65rem 0.9rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
    color: var(--main-text-color);
    text-align: left;
    transition:
      border-color 160ms var(--ease-out),
      background-color 160ms var(--ease-out);
  }

  .timer-display:hover {
    border-color: var(--border-strong);
  }

  .timer-display[aria-pressed='true'] {
    border-color: rgba(194, 107, 255, 0.45);
    background: var(--accent-soft);
  }

  .timer-status {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--muted-text-color);
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .status-dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: var(--muted-text-color);
  }

  .status-dot.live {
    background: var(--accent-color);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }

  .timer-value {
    font-variant-numeric: tabular-nums;
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    line-height: 1;
  }

  .timer-reset {
    display: grid;
    place-items: center;
    width: 2.8rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
    color: var(--muted-text-color);
    transition:
      border-color 160ms var(--ease-out),
      color 160ms var(--ease-out),
      background-color 160ms var(--ease-out);
  }

  .timer-reset:hover {
    border-color: var(--border-strong);
    background: var(--surface-raised);
    color: var(--main-text-color);
  }
</style>
