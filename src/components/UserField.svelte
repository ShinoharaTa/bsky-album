<script lang="ts">
  import { onMount } from "svelte";
  import { bluesky } from "../lib/script/bsky";
  import { Avatar } from "@skeletonlabs/skeleton-svelte";
  // import { popup } from "@skeletonlabs/skeleton-svelte";
  // import type { PopupSettings } from "@skeletonlabs/skeleton-svelte";

  let isLoaded = false;
  let icon: string | null = null;
  onMount(async () => {
    const profile = await bluesky.getProfile();
    if (profile) {
      icon = profile.avatar ?? null;
    }
    isLoaded = true;
  });

  function clickLogout() {
    bluesky.logout();
    return;
  }

  // const popupClick: PopupSettings = {
  //   event: "click",
  //   target: "popupClick",
  //   placement: "top",
  // };
</script>

{#if isLoaded}
  <Avatar name="icon" src={icon ?? ``} size="16" rounded="rounded-full" />
  <!-- <button use:popup={popupClick}>
  </button> -->
{:else}
  <Avatar name="icon" src="" size="16" rounded="rounded-full" />
{/if}
<div class="card p-4" data-popup="popupClick">
  <div>
    <button on:click={clickLogout}> Logout </button>
  </div>
  <div class="arrow bg-surface-100-800-token" />
</div>
