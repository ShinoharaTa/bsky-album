import { skeleton, contentPath } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    contentPath(import.meta.url, 'svelte')
  ],
  theme: {
    extend: {}
  },
  plugins: [
    // The Skeleton Tailwind Plugin
    skeleton({
      themes: [
        // Preset Theme(s)
        themes.rocket,
      ]
    })
  ],
}
