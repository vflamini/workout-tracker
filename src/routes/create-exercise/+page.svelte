<script lang="ts">
  import { resolve } from '$app/paths';
  import TextInput from '#lib/components/TextInput.svelte';
  import { insertExercise, insertWeight } from '#lib/db/functions/post.js';

  let { data } = $props();

  const weightTypes = ['Barbell', 'Dumbbell', 'Curl Bar', 'Hex Bar', 'Plate', 'Band'];

  let exerciseName = $state('');
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
  let status = $state<'idle' | 'saved' | 'error'>('idle');

  function reset() {
    exerciseName = '';
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
    weightProperties.weightType = weightType;
  }

  function setNumHands(numHands: number) {
    weightProperties.numHands = numHands;
  }

  async function submitExercise() {
    status = 'idle';
    let weightId: number | null = null;

    if (data.weights) {
      const weightRow = data.weights.filter(
        (weight) => weight.type === weightProperties.weightType
      );
      if (weightRow.length) {
        weightId = weightRow[0].id;
      }
    }

    if (!weightId) {
      weightId = await insertWeight({
        type: weightProperties.weightType,
        defaultBaseWeight: weightProperties.baseAmount
      });
    }

    if (weightId) {
      const exerciseId = await insertExercise({
        exerciseName,
        weighted: weightProperties.weighted,
        weightBaseAmount: weightProperties.baseAmount,
        isTimed,
        weightId,
        numHands: weightProperties.numHands,
        equipment: otherEquipment.equipment
      });

      if (exerciseId) {
        reset();
        status = 'saved';
      } else {
        status = 'error';
      }
    } else {
      status = 'error';
    }
  }
</script>

<svelte:head>
  <title>Create Exercise · Workout Tracker</title>
</svelte:head>

<header class="page-header">
  <div>
    <p class="eyebrow">Library</p>
    <h1 class="page-title">Create exercise</h1>
    <p class="page-subtitle">Add a movement once, then reuse it across every workout you build.</p>
  </div>
  <div class="page-actions">
    <a class="btn btn-ghost" href={resolve('')}>
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      Back to dashboard
    </a>
  </div>
</header>

<div class="exercise-form card">
  <div class="form-section">
    <TextInput
      id="exercise-name"
      label="Exercise name"
      placeholder="e.g. Incline dumbbell press"
      bind:bind={exerciseName}
    />
    <p class="field-help">Use the name you will recognise mid-session.</p>
  </div>

  <div class="form-section">
    <div class="section-head">
      <div>
        <h2>Tracking mode</h2>
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
        <span class="status success"><i class="fa-solid fa-circle-check"></i> Exercise created</span
        >
      {:else if status === 'error'}
        <span class="status error"
          ><i class="fa-solid fa-circle-exclamation"></i> Could not save exercise</span
        >
      {/if}
    </div>
    <button type="button" class="btn btn-primary" onclick={submitExercise}>
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      Create exercise
    </button>
  </div>
</div>

<style>
  .exercise-form {
    padding: clamp(1rem, 2.5vw, 1.5rem);
  }

  .form-section + .form-section {
    margin-top: 1.75rem;
    padding-top: 1.75rem;
    border-top: 1px solid var(--border-color);
  }

  .field-help {
    margin-top: 0.45rem;
    color: var(--muted-text-color);
    font-size: 0.75rem;
  }

  .option-rail {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 1.1rem;
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
    padding: 1rem;
    border: 0;
    border-right: 1px solid var(--border-color);
    background: transparent;
    color: var(--main-text-color);
    text-align: left;
    transition:
      background-color 160ms var(--ease-out),
      transform 160ms var(--ease-out);
  }

  .option:last-child {
    border-right: 0;
  }

  .option:hover {
    background: rgba(255, 200, 255, 0.035);
  }

  .option:active {
    transform: translateY(1px);
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
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 0.6rem;
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
    font-size: 0.86rem;
  }

  .option-copy span {
    color: var(--muted-text-color);
    font-size: 0.72rem;
    line-height: 1.35;
  }

  .config-panel {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
    margin-top: 1rem;
    padding: 1rem;
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
    min-height: 2.35rem;
    padding: 0.45rem 0.7rem;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    background: var(--surface-raised);
    color: var(--muted-text-color);
    font-size: 0.8rem;
    font-weight: 600;
    transition:
      border-color 160ms var(--ease-out),
      background-color 160ms var(--ease-out),
      color 160ms var(--ease-out);
  }

  .chip:hover {
    border-color: var(--border-strong);
    color: var(--main-text-color);
  }

  .chip.active {
    border-color: var(--accent-color);
    background: var(--accent-soft);
    color: var(--accent-color);
  }

  .hand-chip {
    min-width: 5.2rem;
    justify-content: center;
  }

  .form-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.75rem;
    padding-top: 1.25rem;
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
    color: var(--accent-color);
  }

  .status.error {
    color: var(--negative-output-color);
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
