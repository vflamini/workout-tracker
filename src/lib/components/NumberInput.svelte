<script lang='ts'>
  let {
    id, label, bind = $bindable(''), classes = [],
    min = 0, step = 1
  } = $props();
</script>

<div class={{
  input: true,
  small: classes.includes('small'),
  skinny: classes.includes('skinny'),
  short: classes.includes('short')
}}>
  <label for={id}>{label}</label>
  <input id={id} type='number' min={min} step={step} bind:value={bind}>
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

  div.input.short {
    width: 20% !important;
  }

  div.input:focus-within, div.input.skinny:focus-within {
    border-color: #7a017a;
  }

  div.input input[type=number] {
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

  div.input.small input[type=number] {
    font-size: 1rem;
  }

  div.input.skinny {
    border-color: #4e4e4e;
  }

  div.input.skinny input[type=number] {
    font-size: 1rem;
    width: 80%;
  }

  div.input.skinny label {
    font-size: 0.85rem;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    appearance: textfield;
  }
</style>