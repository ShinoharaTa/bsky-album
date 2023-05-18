<script lang="ts">
  import { onMount } from "svelte";
  import { hasSession, getAllPosts } from "../lib/script/bsky";
  import { isLoading, message } from "../stores/Album";
  import UserField from "../components/UserField.svelte";
  import type { ViewImage } from "@atproto/api/dist/client/types/app/bsky/embed/images";

  import { writable } from 'svelte/store';

  // Lightbox store to hold the fullsize image url
  export const lightboxStore = writable("");

  let isLoaded: boolean = false;
  let images: Array<ViewImage> = [];

  onMount(async () => {
    $isLoading = true;
    const login = await hasSession();
    if (login) {
      images = await getAllPosts();
      // console.log(images);
      $isLoading = false;
      isLoaded = true;
    }
  });
</script>

{#if isLoaded}
  <!-- <h1>投稿フォーム</h1> -->
  <div class="flex justify-between items-center">
    <h1 class="h2">Bsky-Album</h1>
    <div>
      <UserField />
    </div>
  </div>
  <div class="mt-4">
    <div class="grid grid-cols-4 gap-1">
      {#each images as image}
        <div class="aspect-w-1 aspect-h-1">
          <img
            class="aspect-content object-cover"
            src={image.thumb}
            alt={image.alt}
            on:click={() => $lightboxStore = image.fullsize}
            loading="lazy"
          />
        </div>
      {/each}
    </div>
  </div>
{/if}

<!-- Lightbox overlay -->
{#if $lightboxStore !== ""}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
    on:click={() => $lightboxStore = ""}
  >
    <img class="max-w-2/3 max-h-2/3 object-contain" src={$lightboxStore} alt="" />
  </div>
{/if}

<style>
  .aspect-w-1.aspect-h-1 {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
  }
  .aspect-content {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
