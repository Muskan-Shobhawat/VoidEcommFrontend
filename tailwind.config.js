/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  // Bootstrap's reboot handles the base reset; avoid double-resets and the `.container` clash.
  corePlugins: { preflight: false, container: false },
  theme: {
    extend: {
      colors: {
        // Theme tokens flip with [data-theme] (see globals.css): void = page, ink = surface, bone = foreground.
        void: 'rgb(var(--void-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        bone: 'rgb(var(--bone-rgb) / <alpha-value>)',
        mute: 'rgb(var(--mute-rgb) / <alpha-value>)',
        // Fixed light/dark for text on surfaces that look the same in both themes.
        snow: '#f2efe9',
        night: '#0a0a0c',
        signal: '#ff5a1f',
        lilac: '#c9b6ff',
        acid: '#c6ff3d',
        ice: '#9fe8ff',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        pulseGlow: { '0%,100%': { opacity: 0.6 }, '50%': { opacity: 1 } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        spinSlow: 'spinSlow 18s linear infinite',
      },
    },
  },
  plugins: [],
};
