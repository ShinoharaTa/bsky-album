<script lang="ts">
import { goto } from "$app/navigation";
import { bluesky } from "../../lib/script/bsky";
import { isLoading } from "../../stores/Album";

let username = "";
let password = "";
let message = "";

async function handleLogin(): Promise<void> {
	// try {
	$isLoading = true;
	await bluesky.login(username, password);
	$isLoading = false;
	goto("/");
	// } catch (ex) {
	//   $isLoading = false;
	//   message = ex.message;
	// }
}
</script>

<div class="max-width mx-auto">
  <h1 class="h1">Bsky Album</h1>
  <!-- <p class="mt-7">
    "Unleash your words into the vast expanse of the Bluesky universe with this
    powerful tool."
  </p> -->
  <p class="mt-3">
    あなたの過去画像を振り返ります。
  </p>
  <form on:submit|preventDefault={handleLogin}>
    <div class="mt-10">
      <input
        class="input"
        type="text"
        bind:value={username}
        placeholder="handle.bsky.social"
        required
      />
    </div>
    <div class="mt-3">
      <input
        class="input"
        type="password"
        bind:value={password}
        placeholder="password"
        required
      />
    </div>
    <p class="mt-3 text-error-600">{message}</p>
    <div class="flex justify-end">
      <button class="btn variant-filled-primary"
        >Login</button
      >
    </div>
  </form>
</div>
