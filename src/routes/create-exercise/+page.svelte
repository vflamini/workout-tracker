<script lang='ts'>
  import TextInput from '$lib/components/TextInput.svelte';
  import { insertExercise, insertWeight } from '$lib/db/functions/post.js';

  let { data } = $props();

  let exerciseName = $state('');
  let weightProperties = $state({
    weighted: false,
    numHands: 0,
    baseAmount: 0,
    weightType: ''
  })

  let otherEquipment = $state({
    exists: false,
    equipment: ''
  })

  let isTimed = $state(false);

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
    }

    isTimed = false
  }

  function toggleWeighted() {
    weightProperties.weighted = !weightProperties.weighted;
  }

  function toggleTimed() {
    isTimed = !isTimed;
  }

  function toggleOtherEquipment() {
    otherEquipment.exists = !otherEquipment.exists;
  }

  function setWeightType(weightType: string) {
    weightProperties.weightType = weightType
  }

  function setNumHands(numHands: number) {
    weightProperties.numHands = numHands;
  }

  async function submitExercise() {
    let weightId: number | null = null;
    if (data.weights) {
      const weightRow = data.weights.filter(weight => weight.type === weightProperties.weightType);
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
        exerciseName: exerciseName,
        weighted: weightProperties.weighted,
        weightBaseAmount: weightProperties.baseAmount,
        isTimed: isTimed,
        weightId: weightId,
        numHands: weightProperties.numHands,
        equipment: otherEquipment.equipment
      });
      reset();
    }
  }
</script>

{#snippet weightTypeSelectButton(weightType: string)}
  <button 
    class={{selected: weightProperties.weightType === weightType}}
    onclick={() => setWeightType(weightType)}
  >{weightType}
  </button>
{/snippet}

{#snippet handSelectButton(numHands: number)}
  <button
    aria-label={`${numHands == 1 ? 'one' : 'two'} hand`}
    class={{selected: weightProperties.numHands === numHands}}
    onclick={() => setNumHands(numHands)}
  >
    <i class={`fa-solid fa-hand${numHands === 2 ? 's' : ''}`}></i>
  </button>
{/snippet}

<div>
  <TextInput
    id={'exercise-name'}
    label={'Name'}
    bind:bind={exerciseName}
  />
  <div class='property-toggles'>
    <div class='property'>
      <button 
        class={{selected: weightProperties.weighted}}
        onclick={toggleWeighted}
      >
        <i class="fa-solid fa-dumbbell"></i>
        <br><br>
        <span>{weightProperties.weighted ? 'Weighted' : 'Not Weighted'}</span>
      </button>
      {#if weightProperties.weighted}
        <div class='property-inputs'>
          <div class='weight-type'>
            {@render weightTypeSelectButton('Barbell')}
            {@render weightTypeSelectButton('Dumbbell')}
            {@render weightTypeSelectButton('Curl Bar')}
            {@render weightTypeSelectButton('Hex Bar')}
            {@render weightTypeSelectButton('Plate')}
            {@render weightTypeSelectButton('Band')}
          </div>
          <div class='num-hands'>
            {@render handSelectButton(1)}
            {@render handSelectButton(2)}
          </div>
        </div>
      {/if}
    </div>
    <div class='property'>
      <button 
        class={{selected: isTimed}}
        onclick={toggleTimed}
      >
        <i class="fa-solid fa-stopwatch"></i>
        <br><br>
        <span>{isTimed ? 'Timed' : 'Not Timed'}</span>
      </button>
    </div>
    <div class='property'>
      <button 
        class={{selected: otherEquipment.exists}}
        onclick={toggleOtherEquipment}
      >
        <i class="fa-solid fa-toolbox"></i>
        <br><br>
        <span>{otherEquipment.exists ? 'Involves Other Equipment' : 'No Other Equipment'}</span>
      </button>
      {#if otherEquipment.exists}
        <div class='property-inputs'>
          <TextInput
            id={'other-equipment-name'}
            label={'Equipment'}
            classes={'small'}
            bind:bind={otherEquipment.equipment}
          />
        </div>
      {/if}
    </div>
  </div>
  <div class='muscle-target'>
    
  </div>
  <div class='submit-btn-container'>
    <button onclick={submitExercise} class='submit'>
      Create Exercise
    </button>
  </div>
</div>

<style>
  div.property-toggles {
    padding: 15px;
    display: flex;
    justify-content: space-between;
  }
  
  div.property {
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  div.property button {
    width: 40vh;
    height: 30vh;
    background-color: transparent;
    border: 1px solid gray;
    border-radius: 5px;
    color: gray;
  }

  div.property button:hover {
    cursor: pointer;
    background-color: #2a262c;
  }

  div.property button.selected {
    background-color: #463e49;
    border-color: #0d5c21;
    color: white;
  }

  div.property-toggles button i {
    font-size: 4rem;
  }

  div.property-inputs {
    padding: 5px;
  }

  div.property div.property-inputs button {
    height: 5vh;
    width: 17vh;
    padding: 1px;
  }

  div.property div.property-inputs div.weight-type {
    text-align: center;
  }

  div.property div.property-inputs div.weight-type button {
    margin: 5px;
  }

  div.property div.property-inputs div.num-hands {
    display: flex;
    justify-content: center;
    margin: 5px;
  }

  div.property div.property-inputs div.num-hands button {
    margin: 5px;
    width: 5vh;
  }

  div.property div.property-inputs div.num-hands button i {
    font-size: 1.2rem;
  }

  div button.submit {
    background-color: transparent;
    cursor: pointer;
    outline: none;
    border: 1px solid gray;
    color: white;
    border-radius: 5px;
    padding: 5px;
  }

  div button.submit:hover {
    color: #ffc8ff;
    border-color: #7a017a;
  }

  div.submit-btn-container {
    width: 100%;
    text-align: center;
  }

</style>