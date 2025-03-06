import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/ai-autopilot/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Scopa Scorer',
        short_name: 'Scopa',
        description: 'Score tracker for the Italian card game Scopa',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        start_url: '/ai-autopilot/',
        display: 'standalone',
        orientation: 'any'
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          'mui': ['@mui/material', '@mui/icons-material']
        }
      }
    },
    target: 'esnext',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true
  },
  server: {
    port: 3000,
    strictPort: true
  },
  preview: {
    port: 3000,
    strictPort: true
  }
});
