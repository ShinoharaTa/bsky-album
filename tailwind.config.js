/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {}
  },
  plugins: [
    // The Skeleton Tailwind Plugin
    skeleton({
      themes: [
        // Preset Theme(s)
        themes.skeleton,
      ]
    })
  ],
}
