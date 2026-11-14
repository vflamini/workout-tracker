<script lang="ts">
  import { refreshAll } from '$app/navigation';
  import TextInput from '#lib/components/TextInput.svelte';
  import { insertExercise, insertWeight } from '#lib/db/functions/post.js';

  let { data } = $props();

  const weightTypes = ['Barbell', 'Dumbbell', 'Curl Bar', 'Hex Bar', 'Plate', 'Band'];

  let exerciseName = $state('');
  let libraryQuery = $state('');
  let saving = $state(false);
  let nameError = $state('');
  let status = $state<'idle' | 'saved' | 'error'>('idle');

  let weightProperties = $state({
    weighted: false,
    numHands: 0,
    baseAmount: 0,
    weightType: ''
  });

  let otherEquipment = $state({
    exists: false,
    equipment: ''
  });

  let isTimed = $state(false);

  const filteredExercises = $derived(
    data.exercises.filter((exercise) => {
      const q = libraryQuery.trim().toLowerCase();
      if (!q) return true;
      const haystack = `${exercise.name} ${exercise.weightType ?? ''} ${exercise.otherEquipment ?? ''}`;
      return haystack.toLowerCase().includes(q);
    })
  );

  function reset() {
    exerciseName = '';
    nameError = '';
    weightProperties = {
      weighted: false,
      numHands: 0,
      baseAmount: 0,
      weightType: ''
    };

    otherEquipment = {
      exists: false,
      equipment: ''
    };

    isTimed = false;
  }

  function toggleWeighted() {
    weightProperties.weighted = !weightProperties.weighted;
    status = 'idle';
  }

  function toggleTimed() {
    isTimed = !isTimed;
    status = 'idle';
  }

  function toggleOtherEquipment() {
    otherEquipment.exists = !otherEquipment.exists;
    status = 'idle';
  }

  function setWeightType(weightType: string) {
    weightProperties.weightType = weightProperties.weightType === weightType ? '' : weightType;
  }

  function setNumHands(numHands: number) {
    weightProperties.numHands = weightProperties.numHands === numHands ? 0 : numHands;
  }

  async function submitExercise() {
    if (saving) return;

    status = 'idle';
    nameError = '';
    const trimmedName = exerciseName.trim();

    if (!trimmedName) {
      nameError = 'Enter an exercise name.';
      return;
    }

    saving = true;

    try {
      let weightId: number | null = null;
      const selectedType = weightProperties.weightType.trim();

      if (weightProperties.weighted && selectedType) {
        const existingWeight = data.weights?.find((weight) => weight.type === selectedType);
        if (existingWeight) {
          weightId = existingWeight.id;
        } else {
          weightId = await insertWeight({
            type: selectedType,
            defaultBaseWeight: weightProperties.baseAmount
          });
        }
      }

      const exerciseId = await insertExercise({
        exerciseName: trimmedName,
        weighted: weightProperties.weighted,
        weightBaseAmount: weightProperties.baseAmount,
        isTimed,
        weightId,
        numHands: weightProperties.numHands,
        equipment: otherEquipment.exists ? otherEquipment.equipment.trim() : ''
      });

      if (exerciseId) {
        reset();
        status = 'saved';
        await refreshAll();
      } else {
        status = 'error';
      }
    } catch {
      status = 'error';
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>Exercises · Workout Log</title>
</svelte:head>

<header class="page-header">
  <div>
    <h1 class="page-title">Exercises</h1>
    <p class="page-subtitle">Add movements once, then reuse them across every workout.</p>
  </div>
</header>

<div class="library-layout">
  <section class="exercise-form card" aria-labelledby="new-exercise-heading">
    <h2 id="new-exercise-heading" class="card-heading">New exercise</h2>

    <div class="form-section">
      <TextInput
        id="exercise-name"
        label="Exercise name"
        placeholder="e.g. Incline dumbbell press"
        bind:bind={exerciseName}
      />
      {#if nameError}
        <p class="field-error" role="alert">{nameError}</p>
      {:else}
        <p class="field-help">Use the name you will recognise mid-session.</p>
      {/if}
    </div>

    <div class="form-section">
      <div class="section-head">
        <div>
          <h3>Tracking mode</h3>
          <p>Pick how this movement is logged.</p>
        </div>
      </div>

      <div class="option-rail" role="group" aria-label="Tracking options">
        <button
          type="button"
          class={['option', { active: weightProperties.weighted }]}
          onclick={toggleWeighted}
          aria-pressed={weightProperties.weighted}
        >
          <span class="option-icon"><i class="fa-solid fa-dumbbell" aria-hidden="true"></i></span>
          <span class="option-copy">
            <strong>Weighted</strong>
            <span>Load per set</span>
          </span>
        </button>

        <button
          type="button"
          class={['option', { active: isTimed }]}
          onclick={toggleTimed}
          aria-pressed={isTimed}
        >
          <span class="option-icon"><i class="fa-solid fa-stopwatch" aria-hidden="true"></i></span>
          <span class="option-copy">
            <strong>Timed</strong>
            <span>Duration per set</span>
          </span>
        </button>

        <button
          type="button"
          class={['option', { active: otherEquipment.exists }]}
          onclick={toggleOtherEquipment}
          aria-pressed={otherEquipment.exists}
        >
          <span class="option-icon"><i class="fa-solid fa-toolbox" aria-hidden="true"></i></span>
          <span class="option-copy">
            <strong>Equipment</strong>
            <span>Uses another tool</span>
          </span>
        </button>
      </div>

      {#if weightProperties.weighted}
        <div class="config-panel">
          <div class="config-group">
            <span class="field-label">Weight type</span>
            <div class="chip-row">
              {#each weightTypes as weightType (weightType)}
                <button
                  type="button"
                  class={['chip', { active: weightProperties.weightType === weightType }]}
                  onclick={() => setWeightType(weightType)}
                  aria-pressed={weightProperties.weightType === weightType}
                >
                  {weightType}
                </button>
              {/each}
            </div>
          </div>

          <div class="config-group">
            <span class="field-label">Hands</span>
            <div class="chip-row">
              <button
                type="button"
                class={['chip', 'hand-chip', { active: weightProperties.numHands === 1 }]}
                onclick={() => setNumHands(1)}
                aria-label="One hand"
                aria-pressed={weightProperties.numHands === 1}
              >
                <i class="fa-solid fa-hand" aria-hidden="true"></i>
                One
              </button>
              <button
                type="button"
                class={['chip', 'hand-chip', { active: weightProperties.numHands === 2 }]}
                onclick={() => setNumHands(2)}
                aria-label="Two hands"
                aria-pressed={weightProperties.numHands === 2}
              >
                <i class="fa-solid fa-hands" aria-hidden="true"></i>
                Two
              </button>
            </div>
          </div>
        </div>
      {/if}

      {#if otherEquipment.exists}
        <div class="config-panel single">
          <TextInput
            id="other-equipment-name"
            label="Equipment name"
            placeholder="e.g. Resistance band"
            classes="compact"
            bind:bind={otherEquipment.equipment}
          />
        </div>
      {/if}
    </div>

    <div class="form-actions">
      <div class="form-status" aria-live="polite">
        {#if status === 'saved'}
          <span class="status success"
            ><i class="fa-solid fa-circle-check"></i> Exercise created</span
          >
        {:else if status === 'error'}
          <span class="status error"
            ><i class="fa-solid fa-circle-exclamation"></i> Could not save exercise</span
          >
        {/if}
      </div>
      <button type="button" class="btn btn-primary" onclick={submitExercise} disabled={saving}>
        <i class="fa-solid fa-plus" aria-hidden="true"></i>
        {saving ? 'Saving...' : 'Create exercise'}
      </button>
    </div>
  </section>

  <section class="library-panel" aria-labelledby="library-heading">
    <div class="section-head">
      <div>
        <h2 id="library-heading">
          In your library <span class="count-muted">({data.exercises.length})</span>
        </h2>
        <p>Available whenever you log a workout.</p>
      </div>
    </div>

    <div class="library-search">
      <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      <input
        bind:value={libraryQuery}
        type="search"
        placeholder="Filter movements"
        aria-label="Filter exercise library"
      />
    </div>

    {#if filteredExercises.length}
      <ul class="library-list">
        {#each filteredExercises as item (item.id)}
          <li class="library-row">
            <span class="library-name">{item.name}</span>
            <span class="library-tags">
              {#if item.weighted}
                <span class="badge">{item.weightType || 'Weighted'}</span>
              {/if}
              {#if item.timed}
                <span class="badge">Timed</span>
              {/if}
              {#if item.otherEquipment}
                <span class="badge">{item.otherEquipment}</span>
              {/if}
              {#if !item.weighted && !item.timed && !item.otherEquipment}
                <span class="badge">Bodyweight</span>
              {/if}
            </span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="library-empty">No matching exercises in your library.</p>
    {/if}
  </section>
</div>

<style>
  .library-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(18rem, 1fr);
    gap: 1.75rem;
    align-items: start;
  }

  .exercise-form {
    padding: clamp(1rem, 2.5vw, 1.4rem);
  }

  .card-heading {
    margin-bottom: 1.1rem;
    font-size: 1.05rem;
  }

  .form-section + .form-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color);
  }

  .section-head h3 {
    font-size: 0.96rem;
    font-weight: 700;
  }

  .field-help {
    margin-top: 0.45rem;
    color: var(--muted-text-color);
    font-size: 0.75rem;
  }

  .field-error {
    margin-top: 0.45rem;
    color: var(--negative-output-color);
    font-size: 0.78rem;
    font-weight: 600;
  }

  .option-rail {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface-muted);
    overflow: hidden;
  }

  .option {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.9rem;
    border: 0;
    border-right: 1px solid var(--border-color);
    background: transparent;
    color: var(--main-text-color);
    text-align: left;
    transition:
      background-color 140ms var(--ease-out),
      transform 100ms var(--ease-out);
  }

  .option:last-child {
    border-right: 0;
  }

  .option:hover {
    background: rgba(255, 200, 255, 0.035);
  }

  .option:active {
    transform: scale(0.985);
    transition: transform 80ms ease-out;
  }

  .option.active {
    background: var(--accent-soft);
  }

  .option.active::after {
    position: absolute;
    inset: auto 0 0;
    height: 2px;
    content: '';
    background: var(--accent-color);
  }

  .option-icon {
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 0.5rem;
    background: rgba(255, 200, 255, 0.06);
    color: var(--muted-text-color);
  }

  .option.active .option-icon {
    background: var(--accent-strong);
    color: #fff;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
  }

  .option-copy {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .option-copy strong {
    font-size: 0.84rem;
  }

  .option-copy span {
    color: var(--muted-text-color);
    font-size: 0.72rem;
    line-height: 1.35;
  }

  .config-panel {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.15rem;
    margin-top: 1rem;
    padding: 0.95rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface-muted);
  }

  .config-panel.single {
    grid-template-columns: minmax(0, 1fr);
  }

  .config-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 2.3rem;
    padding: 0.42rem 0.68rem;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    background: var(--surface-raised);
    color: var(--muted-text-color);
    font-size: 0.78rem;
    font-weight: 600;
    transition:
      border-color 140ms var(--ease-out),
      background-color 140ms var(--ease-out),
      color 140ms var(--ease-out),
      transform 100ms var(--ease-out);
  }

  .chip:hover {
    border-color: var(--border-strong);
    color: var(--main-text-color);
  }

  .chip:active {
    transform: scale(0.96);
    transition: transform 80ms ease-out;
  }

  .chip.active {
    border-color: var(--accent-color);
    background: var(--accent-soft);
    color: var(--pink-color);
  }

  .hand-chip {
    min-width: 5rem;
    justify-content: center;
  }

  .form-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.15rem;
    border-top: 1px solid var(--border-color);
  }

  .form-status {
    min-height: 1.5rem;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.82rem;
    font-weight: 600;
  }

  .status.success {
    color: var(--pink-color);
  }

  .status.error {
    color: var(--negative-output-color);
  }

  .library-panel {
    display: grid;
    gap: 0.9rem;
  }

  .count-muted {
    color: var(--muted-text-color);
    font-weight: 500;
  }

  .library-search {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0 0.8rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--surface-muted);
    color: var(--muted-text-color);
  }

  .library-search:focus-within {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .library-search input {
    width: 100%;
    min-height: 2.5rem;
    border: 0;
    background: transparent;
    color: var(--input-text-color);
    font-size: 0.86rem;
    outline: none;
  }

  .library-search input::placeholder {
    color: #8f779c;
  }

  .library-list {
    border-top: 1px solid var(--border-color);
    max-height: 32rem;
    overflow-y: auto;
  }

  .library-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem 0.75rem;
    padding: 0.68rem 0.2rem;
    border-bottom: 1px solid var(--border-color);
  }

  .library-name {
    font-size: 0.86rem;
    font-weight: 600;
  }

  .library-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .library-empty {
    padding: 1.5rem 0;
    color: var(--muted-text-color);
    font-size: 0.84rem;
  }

  @media (max-width: 960px) {
    .library-layout {
      grid-template-columns: 1fr;
    }

    .library-list {
      max-height: none;
    }
  }

  @media (max-width: 820px) {
    .option-rail {
      grid-template-columns: 1fr;
    }

    .option {
      border-right: 0;
      border-bottom: 1px solid var(--border-color);
    }

    .option:last-child {
      border-bottom: 0;
    }

    .config-panel {
      grid-template-columns: 1fr;
    }

    .form-actions,
    .form-actions .btn {
      width: 100%;
    }
  }
</style>
