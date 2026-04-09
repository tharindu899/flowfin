import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'favicon.ico'],
      manifest: {
        name: 'FlowFin — Money Manager',
        short_name: 'FlowFin',
        description: 'Personal finance tracker with real-time sync',
        theme_color: '#6c63ff',
        background_color: '#0d0f14',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'firebase-cache' }
          }
        ]
      }
    })
  ],
  build: {
    // Split large vendors into separate chunks for faster loading
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':   ['react', 'react-dom'],
          'firebase-auth':  ['firebase/auth'],
          'firebase-store': ['firebase/firestore'],
          'firebase-app':   ['firebase/app'],
          'chartjs':        ['chart.js', 'react-chartjs-2'],
          'lucide':         ['lucide-react'],
          'utils':          ['date-fns'],
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
})
