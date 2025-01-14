// src/lib/auth.ts
import { browser } from "$app/environment";
import { goto } from "$app/navigation";

import {AtpAgent} from "@atproto/api";
import type { AtpSessionData, AppBskyFeedGetAuthorFeed } from "@atproto/api";
import { setMessage } from "../../stores/Album";
import { writable, type Writable } from 'svelte/store'

export interface SessionState {
  isLoggedIn: boolean
  handle?: string
  error?: string
}

export class Bluesky {
  private agent: AtpAgent
  public sessionStore: Writable<SessionState>
  private initializationPromise: Promise<boolean>

  constructor() {
    this.agent = new AtpAgent({
      service: 'https://bsky.social',
      persistSession: (evt, sess) => {
        if(evt === "create" || evt === "update"){
          localStorage.setItem('bsky-session', JSON.stringify(sess))
        }
        else {
          this.logout();
        }
      }
    })

    this.sessionStore = writable({
      isLoggedIn: false
    })
    this.initializationPromise = this.initializeSession()
  }

  private async initializeSession(): Promise<boolean> {
    if (!browser) return false

    try {
      const savedSession = localStorage.getItem('bsky-session')
      if (!savedSession) {
        setMessage("Please Login.");
        goto("/login");
        return false
      }

      const session = JSON.parse(savedSession) as AtpSessionData
      await this.agent.resumeSession(session)

      this.sessionStore.set({
        isLoggedIn: true,
        handle: this.agent.session?.handle
      })

      return true
    } catch (error) {
      console.error('Session initialization error:', error)
      localStorage.removeItem('bsky-session')

      this.sessionStore.set({
        isLoggedIn: false,
        error: error instanceof Error ? error.message : 'Session initialization failed'
      })

      setMessage("Please Login.");
      goto("/login");
      return false
    }
  }

  async login(identifier: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.agent.login({
        identifier,
        password
      })

      this.sessionStore.set({
        isLoggedIn: true,
        handle: this.agent.session?.handle
      })

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Login failed'

      this.sessionStore.set({
        isLoggedIn: false,
        error: errorMessage
      })

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async logout() {
    if (!browser) return
    try {
      localStorage.removeItem('bsky-session')
      await this.agent.logout()
      this.sessionStore.set({
        isLoggedIn: false
      })
      setMessage("Please Login.");
      goto("/login");
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  checkSession(): boolean {
    if (!browser) return true;
    return this.agent.session !== null
  }

  async getProfile() {
    if (browser) {
      try {
        const { data } = await this.agent.getProfile();
        return data;
      } catch {
        return null;
      }
    }
  }

  // // APIリクエストのためのメソッドを追加
  // getAgent(): AtpAgent {
  //   return this.agent
  // }

  // フォローしているユーザーの投稿を取得
  async getFollowingFeed(limit = 50) {
    try {
      const response = await this.agent.getTimeline({
        limit: limit
      })
      return response.data.feed
    } catch (error) {
      console.error('Feed error:', error)
      throw error
    }
  }
}

export const bluesky = new Bluesky()

// export async function getAllPosts(cursor: string | null = null, maxRecursiveCalls: number = 30): Promise<Array<any>> {
//   if (maxRecursiveCalls < 0) {
//     throw new Error('Max recursion limit reached');
//   }
//   if (browser) {
//     try {
//       const params: { actor: string; limit: number; cursor?: string } = { actor: self.handle, limit: 100 };
//       if (cursor) {
//         params.cursor = cursor;
//       }

//       const data: AppBskyFeedGetAuthorFeed.Response = await agent.getAuthorFeed(params);

//       const filterdFeed = data.data.feed
//         .filter(item => !item.reason)
//         .filter(item => {
//           return (
//             item.post.embed?.$type === "app.bsky.embed.images#view"
//             // || item.post.embed?.$type === "app.bsky.embed.recordWithMedia#view"
//           )
//         })
//         .map(item => {
//           if (item.post.embed?.$type === "app.bsky.embed.images#view") {
//             return item.post.embed?.images
//           }
//           // if (item.post.embed?.$type === "app.bsky.embed.recordWithMedia#view") {
//           //   // @ts-ignore
//           //   return item.post.embed?.media?.images
//           // }
//         })
//         .flat()

//       if (data.data.cursor) {
//         const nextData = await getAllPosts(data.data.cursor, maxRecursiveCalls - 1);
//         return filterdFeed.concat(nextData);
//       } else {
//         return filterdFeed;
//       }

//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   }
//   return [];
// }
