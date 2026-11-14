<script lang="ts">
  let { id, label, bind = $bindable(''), classes = '', placeholder = '' } = $props();
</script>

<div
  class={{
    input: true,
    small: classes.includes('small'),
    skinny: classes.includes('skinny')
  }}
>
  <label for={id}>{label}</label>
  <input {id} {placeholder} type="text" bind:value={bind} />
</div>

<style>
  div.input {
    border: 1px solid gray;
    border-radius: 10px;
    padding: 5px;
    display: flex;
    justify-content: space-between;
  }

  div.input label {
    color: white;
    font-size: 1.2rem;
    padding: 10px;
  }

  div.input.small label {
    font-size: 0.8rem;
  }

  div.input:focus-within,
  div.input.skinny:focus-within {
    border-color: #7a017a;
  }

  div.input input[type='text'] {
    width: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    font-size: 1.2rem;
    margin: 0;
    border-left: 1px solid gray;
    padding-left: 15px;
    color: #ffc8ff;
  }

  div.input.small input[type='text'] {
    font-size: 1rem;
  }

  div.input.skinny {
    border-color: #4e4e4e;
  }

  div.input.skinny input[type='text'] {
    font-size: 1rem;
    width: 80%;
  }

  div.input.skinny label {
    font-size: 0.85rem;
  }
</style>
