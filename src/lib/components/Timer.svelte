<script lang="ts">
  import { onMount } from 'svelte';

  let { seconds = $bindable(0) } = $props();

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
      {running ? 'Running' : seconds > 0 ? 'Paused' : 'Timer'}
    </span>
    <span class="timer-value">
      {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(displaySeconds)}
    </span>
  </button>
  {#if seconds > 0 || running}
    <button type="button" class="timer-reset" onclick={reset} aria-label="Reset workout timer">
      <i class="fa-solid fa-rotate-left"></i>
    </button>
  {/if}
</div>

<style>
  .timer {
    display: flex;
    align-items: stretch;
    gap: 0.45rem;
  }

  .timer-display {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    min-height: 2.7rem;
    padding: 0.55rem 0.85rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
    color: var(--main-text-color);
    text-align: left;
    transition:
      border-color 140ms var(--ease-out),
      background-color 140ms var(--ease-out),
      transform 120ms var(--ease-out);
  }

  .timer-display:hover {
    border-color: var(--border-strong);
  }

  .timer-display:active,
  .timer-reset:active {
    transform: scale(0.975);
    transition: transform 80ms ease-out;
  }

  .timer-display[aria-pressed='true'] {
    border-color: rgba(154, 75, 176, 0.55);
    background: var(--accent-soft);
  }

  .timer-status {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--muted-text-color);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .status-dot {
    width: 0.42rem;
    height: 0.42rem;
    border-radius: 50%;
    background: var(--muted-text-color);
  }

  .status-dot.live {
    background: var(--pink-color);
  }

  .timer-value {
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    line-height: 1;
  }

  .timer-reset {
    display: grid;
    place-items: center;
    width: 2.7rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
    color: var(--muted-text-color);
    transition:
      border-color 140ms var(--ease-out),
      color 140ms var(--ease-out),
      background-color 140ms var(--ease-out),
      transform 120ms var(--ease-out);
  }

  .timer-reset:hover {
    border-color: var(--border-strong);
    background: var(--surface-raised);
    color: var(--main-text-color);
  }
</style>
