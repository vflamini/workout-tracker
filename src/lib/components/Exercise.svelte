<script lang='ts'>
  import NumberInput from "./NumberInput.svelte";
  import TimeInput from "./TimeInput.svelte";
  
  let {
    exercise = $bindable(), addSet, removeSet
  } = $props();

</script>

<div>
  <span>{exercise.exerciseName}</span>
  {#if exercise.weighted}
    <button class='info'>
      <i class='fa-solid fa-dumbbell'></i>
      {exercise.weightName}
    </button>
  {/if}
  {#if exercise.isTimed}
    <button class='info'>
      <i class='fa-solid fa-stopwatch'></i>
      Timed
    </button>
  {/if}
  {#if exercise.equipment}
    <button class='info'>
      {exercise.equipment}
    </button>
  {/if}
  <button
    class='add-set'
    onclick={() => addSet(exercise)}
  ><i class='fa-solid fa-plus'></i> Add Set</button>
  <br>
  <div class='sets'>
    {#each exercise.sets as set, i}
      <div class='set-row'>
        <span>#{i + 1} </span>
        {#if exercise.weighted}
          <NumberInput
            id={`set-${i}-weight`}
            label={'Weight'}
            step={0.5}
            classes={['skinny', 'short']}
            bind:bind={set.weight}
          />
          <NumberInput
            id={`set-${i}-reps`}
            label={'Reps'}
            min={1}
            classes={['skinny', 'short']}
            bind:bind={set.reps}
          />
        {:else if exercise.otherEquipment}
          <NumberInput
            id={`set-${i}-reps`}
            label={'Reps'}
            min={1}
            classes={['skinny', 'short']}
            bind:bind={set.reps}
          />
        {/if}
        {#if exercise.isTimed}
          <TimeInput
            id={`set-${i}-time`}
            label={'Time'}
            bind:bind={set.time}
          />
        {/if}
        <button
          class='remove-set'
          onclick={() => removeSet(exercise, i)}>
          <i class='fa-solid fa-minus'></i>
          Remove
        </button>
      </div>
      <br>
    {/each}
  </div>
</div>

<style>
  div span {
    color: var(--main-text-color);
  }

  div button.info {
    border: 1px solid var(--border-highlight-color);
  }

  div button.add-set, button.remove-set {
    border: 1px solid gray;
  }

  div button.add-set:hover {
    border-color: var(--border-highlight-color);
    cursor: pointer;
  }

  div button.remove-set:hover {
    border-color: var(--negative-output-color);
    cursor: pointer;
  }

  button {
    outline: none;
    background: transparent;
    color: var(--main-text-color);
    padding: 5px;
    border-radius: 5px;
  }

  div {
    padding: 10px;
  }

  div.set-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>