<script lang="ts">
import { onMount } from "svelte";
import { bluesky } from "../lib/script/bsky";
import { Avatar } from "@skeletonlabs/skeleton-svelte";

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

</script>

{#if isLoaded}
  <div class="w-12 me-3">
    <Avatar name="" src={icon ?? ""} size="12" rounded="rounded-full" />
  </div>
  <button class="btn preset-filled" on:click={clickLogout}>Logout</button>
{:else}
  <div class="w-12">
    <Avatar name="icon" src="" size="12" rounded="rounded-full" />
  </div>
{/if}
