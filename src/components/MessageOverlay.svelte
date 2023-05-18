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

<style>
  .message-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }

  p {
    /* color: white; */
    font-size: 2rem;
    padding: 1rem 2rem;
    border-radius: 5px;
  }
</style>
