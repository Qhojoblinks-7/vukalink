// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Keeping this as per your file
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Assuming this is correctly configured for your Tailwind version
    VitePWA({
      registerType: 'autoUpdate',
      // Include common PWA assets that might be in your public folder
      includeAssets: ['favicon.ico', 'logo.svg', 'masked-icon.png'],
      
      // Workbox configuration for caching strategies
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'], // Cache these common asset types
        // You can add more specific caching rules here if needed,
        // e.g., for API routes or external assets
        // runtimeCaching: [...]
      },

      manifest: {
        name: 'VukaLink', // Use VukaLink's full name
        short_name: 'VukaLink', // Use VukaLink's short name
        description: 'VukaLink: Your platform for seamless connections between students and opportunities. Connect, learn, and grow together.', // VukaLink's description
        theme_color: '#2D72F3', // Your VukaLink primary blue
        background_color: '#F8F9FA', // Your VukaLink background color
        display: 'standalone', // Makes it behave like a native app when installed
        scope: '/', // Scope of the PWA
        start_url: '/', // Starting URL when launched from home screen
        icons: [
          {
            src: '/pwa-192x192.png', // Path to your 192x192 icon (relative to public folder)
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png', // Path to your 512x512 icon
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // Important for adaptive icons on Android
          },
          // You might also want an apple-touch-icon for iOS
          {
            src: '/src/assets/logo.svg', // e.g., a 180x180 icon for iOS
            sizes: '180x180',
            type: 'image/png',
            // purpose: 'apple touch icon' // This purpose is automatically implied for apple-touch-icon
          },
        ],
      },
      devOptions: {
        enabled: true, // Keep PWA features enabled in development for testing
        type: 'module',
        // Optional: you can uncomment this to hide Workbox logs if they are too noisy
        // Workbox: {
        //   loglevel: 'silent',
        // },
      },
    }),
  ],
})