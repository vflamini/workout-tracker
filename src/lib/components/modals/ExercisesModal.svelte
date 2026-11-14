<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion, Spring } from 'svelte/motion';
  import { innerWidth } from 'svelte/reactivity/window';

  interface ModalExercise {
    id: number;
    exerciseName: string;
    weighted: boolean;
    isTimed: boolean;
    weightName?: string | null;
    equipment?: string | null;
  }

  let { exercises, close, addExercise } = $props();

  let query = $state('');
  let closing = $state(false);
  let dragging = $state(false);
  let sheetHeight = $state(520);
  let grabOffset = 0;
  let pointerHistory: { y: number; t: number }[] = [];

  const isMobile = $derived((innerWidth.current ?? 1024) <= 640);

  const offset = new Spring(prefersReducedMotion.current ? 0 : 420, {
    stiffness: 0.24,
    damping: 0.88,
    precision: 0.5
  });

  const progress = $derived(
    prefersReducedMotion.current
      ? closing
        ? 0
        : 1
      : isMobile
        ? Math.max(0, Math.min(1, 1 - offset.current / Math.max(sheetHeight, 1)))
        : Math.max(0, Math.min(1, 1 - offset.current / 18))
  );

  const filtered = $derived(
    (exercises as ModalExercise[]).filter((exercise) => {
      const haystack = `${exercise.exerciseName} ${exercise.weightName ?? ''} ${exercise.equipment ?? ''}`;
      return haystack.toLowerCase().includes(query.trim().toLowerCase());
    })
  );

  function rubberband(overshoot: number, dimension: number, constant = 0.45) {
    return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
  }

  function project(velocityPxPerSec: number, decelerationRate = 0.992) {
    return ((velocityPxPerSec / 1000) * decelerationRate) / (1 - decelerationRate);
  }

  function requestClose() {
    if (closing) return;
    closing = true;

    if (prefersReducedMotion.current) {
      close();
      return;
    }

    const exitOffset = isMobile ? Math.max(sheetHeight + 24, 380) : 18;
    offset.set(exitOffset).then(() => {
      if (closing) close();
    });
  }

  function handleSelect(exercise: ModalExercise) {
    addExercise(exercise);
  }

  function onGrabDown(event: PointerEvent) {
    if (!isMobile || event.button > 0) return;
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.sheet-grab') || target.closest('button, input, a')) return;

    const currentTarget = event.currentTarget as HTMLElement;
    currentTarget.setPointerCapture(event.pointerId);

    closing = false;
    dragging = true;
    grabOffset = event.clientY - offset.current;
    pointerHistory = [{ y: event.clientY, t: performance.now() }];
  }

  function onGrabMove(event: PointerEvent) {
    if (!dragging) return;
    const rawY = event.clientY - grabOffset;
    const nextY = rawY < 0 ? rubberband(rawY, Math.max(sheetHeight, 260)) : rawY;

    offset.set(nextY, { instant: true });

    const now = performance.now();
    pointerHistory.push({ y: event.clientY, t: now });
    if (pointerHistory.length > 5) pointerHistory.shift();
  }

  function onGrabUp(event: PointerEvent) {
    if (!dragging) return;
    dragging = false;

    const currentTarget = event.currentTarget as HTMLElement;
    if (currentTarget.hasPointerCapture(event.pointerId)) {
      currentTarget.releasePointerCapture(event.pointerId);
    }

    let velocity = 0;
    if (pointerHistory.length >= 2) {
      const first = pointerHistory[0];
      const last = pointerHistory[pointerHistory.length - 1];
      const dt = Math.max(1, last.t - first.t);
      velocity = ((last.y - first.y) / dt) * 1000;
    }

    const projected = offset.current + project(velocity);
    const threshold = Math.min(200, sheetHeight * 0.36);

    if (projected > threshold || velocity > 700) {
      requestClose();
    } else {
      offset.set(0);
    }
  }

  function measureSheet(node: HTMLElement) {
    sheetHeight = node.getBoundingClientRect().height || 520;
  }

  function focusSearch(node: HTMLElement) {
    if (!isMobile) {
      (node as HTMLInputElement).focus();
    }
  }

  onMount(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (!prefersReducedMotion.current) {
      offset.set(isMobile ? Math.min(sheetHeight, 420) : 18, { instant: true });
      offset.set(0);
    } else {
      offset.set(0, { instant: true });
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  });
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && requestClose()} />

<div class="modal-container">
  <button
    type="button"
    class="modal-backdrop"
    style={`opacity: ${progress}`}
    onclick={requestClose}
    aria-label="Close dialog"
  ></button>

  <div
    {@attach measureSheet}
    class={['modal', { dragging }]}
    style={isMobile
      ? `transform: translate3d(0, ${offset.current}px, 0); opacity: ${prefersReducedMotion.current ? progress : 1}`
      : `transform: translate3d(0, ${offset.current}px, 0) scale(${0.97 + 0.03 * progress}); opacity: ${progress}`}
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-labelledby="exercise-modal-title"
    onpointerdown={onGrabDown}
    onpointermove={onGrabMove}
    onpointerup={onGrabUp}
    onpointercancel={onGrabUp}
  >
    <div class="sheet-grab">
      <span class="sheet-handle" aria-hidden="true"></span>
      <header class="modal-head">
        <div>
          <h2 id="exercise-modal-title">Add exercise</h2>
          <p class="modal-sub">Pick a movement from your library</p>
        </div>
        <button
          type="button"
          class="btn btn-ghost btn-icon"
          onclick={requestClose}
          aria-label="Close dialog"
        >
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </header>
    </div>

    <div class="search-field">
      <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      <input
        {@attach focusSearch}
        bind:value={query}
        type="search"
        placeholder="Search by name or equipment"
        aria-label="Search exercises"
      />
    </div>

    <div class="exercises-list">
      {#each filtered as exercise (exercise.id)}
        <button type="button" class="exercise-option" onclick={() => handleSelect(exercise)}>
          <span class="exercise-option-icon">
            <i
              class="fa-solid {exercise.weighted
                ? 'fa-dumbbell'
                : exercise.isTimed
                  ? 'fa-stopwatch'
                  : 'fa-person-running'}"
              aria-hidden="true"
            ></i>
          </span>
          <span class="exercise-option-copy">
            <strong>{exercise.exerciseName}</strong>
            <span>
              {#if exercise.weighted}
                {exercise.weightName ?? 'Weighted'}
              {:else if exercise.isTimed}
                Timed
              {:else if exercise.equipment}
                {exercise.equipment}
              {:else}
                Bodyweight
              {/if}
            </span>
          </span>
          <i class="fa-solid fa-plus exercise-option-add" aria-hidden="true"></i>
        </button>
      {:else}
        <div class="empty-state compact-empty">
          <span class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <h3>No exercises found</h3>
          <p>Try another search, or create a new exercise first.</p>
        </div>
      {/each}
    </div>

    <footer class="modal-foot">
      <span class="muted">{filtered.length} exercise{filtered.length === 1 ? '' : 's'}</span>
      <button type="button" class="btn btn-ghost" onclick={requestClose}>Cancel</button>
    </footer>
  </div>
</div>

<style>
  .modal-container {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: grid;
    place-items: center;
    padding: 1rem;
  }

  .modal-backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    background: rgba(20, 10, 25, 0.78);
    backdrop-filter: blur(8px);
    will-change: opacity;
  }

  .modal {
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(100%, 34rem);
    max-height: min(88dvh, 46rem);
    padding: 1.25rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    background: var(--surface-color);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      var(--shadow-soft);
    will-change: transform, opacity;
  }

  .sheet-grab {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sheet-handle {
    display: none;
  }

  .modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .modal-head h2 {
    font-size: 1.2rem;
  }

  .modal-sub {
    margin-top: 0.2rem;
    color: var(--muted-text-color);
    font-size: 0.78rem;
  }

  .search-field {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-top: 1rem;
    padding: 0 0.85rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
    color: var(--muted-text-color);
  }

  .search-field:focus-within {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .search-field input {
    width: 100%;
    min-height: 2.7rem;
    border: 0;
    background: transparent;
    color: var(--input-text-color);
    outline: none;
  }

  .search-field input::placeholder {
    color: #9a82a7;
  }

  .exercises-list {
    display: grid;
    gap: 0.45rem;
    margin: 1rem -0.25rem;
    padding: 0 0.25rem;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .exercise-option {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
    padding: 0.75rem;
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

  .exercise-option:hover {
    border-color: var(--accent-color);
    background: var(--surface-raised);
  }

  .exercise-option:active {
    transform: scale(0.985);
    transition: transform 80ms ease-out;
  }

  .exercise-option-icon {
    display: grid;
    place-items: center;
    width: 2.35rem;
    height: 2.35rem;
    border-radius: 0.6rem;
    background: var(--accent-soft);
    color: var(--accent-color);
    font-size: 0.85rem;
  }

  .exercise-option-copy {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    line-height: 1.3;
  }

  .exercise-option-copy strong {
    font-size: 0.9rem;
  }

  .exercise-option-copy span {
    color: var(--muted-text-color);
    font-size: 0.74rem;
  }

  .exercise-option-add {
    color: var(--muted-text-color);
    font-size: 0.8rem;
  }

  .modal-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
  }

  .compact-empty {
    padding: 2rem 1rem;
  }

  @media (max-width: 640px) {
    .modal-container {
      align-items: end;
      padding: 0;
    }

    .modal {
      width: 100%;
      max-height: 90dvh;
      border-bottom: 0;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      padding: 0.65rem 1.1rem calc(1.1rem + env(safe-area-inset-bottom));
    }

    .sheet-grab {
      touch-action: none;
      cursor: grab;
      padding-top: 0.2rem;
    }

    .modal.dragging .sheet-grab {
      cursor: grabbing;
    }

    .sheet-handle {
      display: block;
      width: 2.5rem;
      height: 0.28rem;
      margin: 0 auto 0.25rem;
      border-radius: 999px;
      background: var(--border-strong);
    }
  }

  @media (prefers-reduced-transparency: reduce) {
    .modal-backdrop {
      background: rgba(20, 10, 25, 0.94);
      backdrop-filter: none;
    }
  }
</style>
