<script lang="ts">
  import { isLoading } from "../stores/Album";
</script>

{#if $isLoading}
  <div class="overlay">
    <div class="loader" />
  </div>
{/if}
