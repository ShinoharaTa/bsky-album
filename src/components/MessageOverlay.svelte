<script lang="ts">
  import { onDestroy } from 'svelte';
  import { message } from '../stores/Album';
  let show = false;
  let timeoutId: number;

  const unsubscribe = message.subscribe(($message) => {
    if ($message) {
      updateShow(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateShow(false);
      }, 2000);
    }
  });

  function updateShow(value: boolean) {
    show = value;
  }

  onDestroy(() => {
    clearTimeout(timeoutId);
    unsubscribe();
  });
</script>

{#if show}
  <div class="message-overlay">
    <p>{$message}</p>
  </div>
{/if}
