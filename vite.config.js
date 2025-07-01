// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Include common PWA assets that might be in your public folder
      includeAssets: ['favicon.ico', 'logo.svg', 'masked-icon.png'],
      
      // Workbox configuration for caching strategies
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        // THIS IS THE CRUCIAL LINE TO CHECK
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // Set to 10 MB
      },

      manifest: {
        name: 'VukaLink',
        short_name: 'VukaLink',
        description: 'VukaLink: Your platform for seamless connections between students and opportunities. Connect, learn, and grow together.',
        theme_color: '#2D72F3',
        background_color: '#F8F9FA',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/src/assets/logo.svg', // Consider converting this to a PNG and updating the path
            sizes: '180x180',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
})