<script lang="ts">
  const today = $state(new Date());
  const year = $derived(today.getFullYear());
  const month = $derived(String(today.getMonth() + 1).padStart(2, '0')); // Month is 0-indexed
  const day = $derived(String(today.getDate()).padStart(2, '0'));
  const formattedDate = $derived(`${year}-${month}-${day}`);
</script>

<div>
  <input type="date" value={formattedDate} />
</div>

<style>
  div input[type='date'] {
    background-color: transparent;
    color: white;
    outline: none;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
  }
</style>
