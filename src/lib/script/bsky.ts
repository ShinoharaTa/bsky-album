// src/lib/auth.ts
import { browser } from "$app/environment";
import { goto } from "$app/navigation";

import { BskyAgent } from "@atproto/api";
import type { AtpSessionData, AppBskyFeedGetAuthorFeed } from "@atproto/api";
import { setMessage } from "../../stores/Album";

let self: any;
const agent = new BskyAgent({
  service: "https://bsky.social",
  persistSession: (evt, sess) => {
    localStorage.setItem("sess", JSON.stringify(sess));
  },
});

export async function login(username: string, password: string): Promise<void> {
  if (browser) {
    self = await agent.login({
      identifier: username,
      password: password,
    });
    return;
  }
}

export async function hasSession(): Promise<boolean> {
  if (browser) {
    let session = localStorage.getItem("sess") ?? null;
    if (!session) {
      localStorage.removeItem("sess");
      self = null;
      setMessage("Please Login.");
      goto("/login");
      return false;
    }
    try {
      let sess: AtpSessionData = JSON.parse(session);
      const { data } = await agent.resumeSession(sess);
      self = data;
    } catch {
      self = null;
      setMessage("Please Login.");
      goto("/login");
      return false;
    }
    return true;
  }
  return false;
}

export function logout(): void {
  if (browser) {
    localStorage.removeItem("sess");
    self = null;
    goto("/login");
  }
}

export async function getProfile() {
  if (browser) {
    try {
      const { data } = await agent.getProfile({ actor: self.handle });
      return data;
    } catch {
      return null;
    }
  }
}

export async function getAllPosts(cursor: string | null = null, maxRecursiveCalls: number = 30): Promise<Array<any>> {
  if (maxRecursiveCalls < 0) {
    throw new Error('Max recursion limit reached');
  }
  if (browser) {
    try {
      const params: { actor: string; limit: number; cursor?: string } = { actor: self.handle, limit: 100 };
      if (cursor) {
        params.cursor = cursor;
      }

      const data: AppBskyFeedGetAuthorFeed.Response = await agent.getAuthorFeed(params);

      const filterdFeed = data.data.feed
        .filter(item => !item.reason)
        .filter(item => {
          return (
            item.post.embed?.$type === "app.bsky.embed.images#view"
            // || item.post.embed?.$type === "app.bsky.embed.recordWithMedia#view"
          )
        })
        .map(item => {
          if (item.post.embed?.$type === "app.bsky.embed.images#view") {
            return item.post.embed?.images
          }
          // if (item.post.embed?.$type === "app.bsky.embed.recordWithMedia#view") {
          //   // @ts-ignore
          //   return item.post.embed?.media?.images
          // }
        })
        .flat()

      if (data.data.cursor) {
        const nextData = await getAllPosts(data.data.cursor, maxRecursiveCalls - 1);
        return filterdFeed.concat(nextData);
      } else {
        return filterdFeed;
      }

    } catch (error) {
      console.error(error);
      return [];
    }
  }
  return [];
}
