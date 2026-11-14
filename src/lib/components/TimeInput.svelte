<script lang="ts">
  let {
    id,
    label = '',
    ariaLabel = '',
    bind = $bindable(''),
    classes = [],
    placeholder = '00:00'
  } = $props();

  const sizes = $derived(
    Array.isArray(classes) ? classes : String(classes).split(/\s+/).filter(Boolean)
  );

  function formatTime(value: string) {
    const digits = value.replace(/\D/g, '').slice(-4).padStart(4, '0');
    if (digits === '0000') return '';
    const minutes = digits.slice(0, digits.length - 2);
    const seconds = digits.slice(-2);
    return `${minutes}:${seconds}`;
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    bind = formatTime(target.value);
  }
</script>

<div
  class={[
    'field',
    {
      compact: sizes.includes('compact') || sizes.includes('skinny') || sizes.includes('short'),
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
    {placeholder}
    type="text"
    inputmode="numeric"
    maxlength="5"
    aria-label={!label && ariaLabel ? ariaLabel : undefined}
    value={bind}
    oninput={handleInput}
  />
</div>
