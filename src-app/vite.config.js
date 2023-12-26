import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Collection Agent',
        short_name: 'C Agent',
        description: 'Collection Agent for Water Supply',
        start_url: './',
        background_color: '#7e22ce',
        theme_color: '#7e22ce',
        icons: [
          {
            src: '/icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallbackDenylist: [/^\/api/]
      },
      devOptions: {
        enabled: true
      }
    }),
  ],
  build: {
    outDir: '../app_vite/',
    emptyOutDir: true
  }
})
