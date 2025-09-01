<script lang='ts'>
  import TextInput from "../TextInput.svelte";

  let { exercises, close, addExercise } = $props();

</script>

<div class='modal-container'>
  <div class='modal'>
    <TextInput 
      id='search-exercises-to-add' 
      label=''
      placeholder='Search...'
    />
    <div class='exercises-list'>
      {#each exercises as exercise}
      <button onclick={() => addExercise(exercise)}>
        <div>
          <span class='name'>
            {exercise.exerciseName}
          </span>
          <span>
            {#if exercise.weighted}
              {exercise.weightName}
            {:else if exercise.isTimed}
              Timed
            {:else if exercise.equipment}
              {exercise.equipment}
            {/if}
          </span>
        </div>
      </button><br>
      {/each}
    </div>
    <button class='close' onclick={close}>Close</button>
  </div>
</div>

<style>
  div.modal-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.70)
  }

  div.modal {
    border: 2px solid white;
    width: 50vw;
    height: 90vh;
    border-radius: 5px;
    margin: auto;
    margin-top: 5vh;
    background-color: var(--background-color);
    padding: 5px;
  }

  div.exercises-list {
    height: 85%;
    overflow-y: auto;
    margin: 5px;
  }

  div.exercises-list button {
    padding: 10px;
    margin-top: 10px;
    outline: none;
    border: 1px solid gray;
    border-radius: 5px;
    background-color: transparent;
    color: white;
    cursor: pointer;
    width: 90%;
    text-align: left;
  }

  div.exercises-list button:hover {
    border-color: var(--border-highlight-color);
  }

  div.exercises-list button span.name {
    border-right: 1px solid var(--border-highlight-color);
    padding: 5px;
  }

  button.close {
    padding: 10px 35px 10px 35px;
    background-color: transparent;
    outline: none;
    border: 1px solid gray;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }

  button.close:hover {
    border-color: red;
    color: red;
  }
</style>