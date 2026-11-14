<script lang="ts">
  const today = new Date();
  const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  let { id = 'date-field', label = 'Date', bind = $bindable(todayValue), classes = '' } = $props();

  const sizes = $derived(
    Array.isArray(classes) ? classes : String(classes).split(/\s+/).filter(Boolean)
  );
</script>

<div class={['field', { compact: sizes.includes('skinny') || sizes.includes('short') }]}>
  {#if label}
    <label class="field-label" for={id}>{label}</label>
  {/if}
  <input class="field-input date-input" {id} type="date" bind:value={bind} />
</div>

<style>
  .date-input {
    cursor: pointer;
  }

  .date-input::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.7;
  }
</style>
