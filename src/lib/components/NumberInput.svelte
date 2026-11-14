<script lang="ts">
  let { id, label, bind = $bindable(''), classes = [], min = 0, step = 1 } = $props();

  const sizes = $derived(
    Array.isArray(classes) ? classes : String(classes).split(/\s+/).filter(Boolean)
  );
</script>

<div
  class={[
    'field',
    {
      compact: sizes.includes('skinny') || sizes.includes('short'),
      small: sizes.includes('small')
    }
  ]}
>
  {#if label}
    <label class="field-label" for={id}>{label}</label>
  {/if}
  <input
    class="field-input"
    {id}
    type="number"
    {min}
    {step}
    inputmode="decimal"
    bind:value={bind}
  />
</div>

<style>
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    appearance: textfield;
  }
</style>
