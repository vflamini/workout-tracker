<script lang="ts">
  let {
    id,
    label,
    bind = $bindable(''),
    classes = '',
    placeholder = '',
    type = 'text',
    autocomplete = undefined
  } = $props();

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
  <input class="field-input" {id} {placeholder} {type} {autocomplete} bind:value={bind} />
</div>
