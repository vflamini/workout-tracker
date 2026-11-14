<script lang="ts">
  import { onMount } from 'svelte';

  let s = $state(0);
  let displayedSeconds = $derived(s % 60);
  let m = $derived(Math.floor(s / 60));
  let displayedMinutes = $derived(m % 60);
  let h = $derived(Math.floor(m / 60));
  let toggled = $state(false);
  let timer: NodeJS.Timeout;

  function formatNumber(num: number, minIntegerDigits: number, maxFractionDigits = 0) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumIntegerDigits: minIntegerDigits,
      maximumFractionDigits: maxFractionDigits,
      useGrouping: false
    });

    return formatter.format(num);
  }

  onMount(() => {
    return clearInterval(timer);
  });

  function onclick() {
    toggled = !toggled;
    if (toggled) {
      timer = setInterval(() => {
        s += 1;
      }, 1000);
    } else {
      clearInterval(timer);
    }
  }

  function reset() {
    s = 0;
  }
</script>

<div>
  <button {onclick} class={{ timer: true, toggled }}>
    {`${formatNumber(h, 2)}:${formatNumber(displayedMinutes, 2)}:${formatNumber(displayedSeconds, 2)}`}
  </button>
  <button onclick={reset} aria-label="reset timer" class="reset">
    <i class="fa-solid fa-arrows-rotate"></i>
  </button>
</div>

<style>
  div button {
    cursor: pointer;
    background-color: transparent;
    color: white;
    border: 1px solid gray;
    outline: none;
    border-radius: 5px;
    padding: 5px;
  }

  div button.timer.toggled {
    border-color: #7a017a;
  }

  div button.reset {
    border: none;
    transition: background-color 0.5s ease;
  }

  div button.reset:hover {
    background-color: #3d003d;
  }
</style>
