import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { splitVendorChunkPlugin } from 'vite';
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig({
  // Changed from '/' to '/ai-autopilot/' for GitHub Pages deployment
  base: '/ai-autopilot/',
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    compression({
      include: [/\.(js|css|html|svg|json)$/],
      threshold: 1024,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({
      include: [/\.(js|css|html|svg|json)$/],
      threshold: 1024,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 
        'robots.txt', 
        'apple-touch-icon.png',
        '404.html',
      ],
      manifest: {
        name: 'Scopa Scorer',
        short_name: 'Scopa',
        description: 'Score tracker for the Italian card game Scopa',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        categories: ['games', 'utilities', 'entertainment'],
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
          },
          {
            src: 'maskable-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Scopa Scorer Desktop View'
          },
          {
            src: 'screenshot-mobile.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Scopa Scorer Mobile View'
          }
        ],
        // Updated to reflect the correct base URL
        start_url: '/',
        display: 'standalone',
        orientation: 'any',
        display_override: ['window-controls-overlay', 'standalone'],
        launch_handler: {
          client_mode: ['navigate-existing', 'auto']
        },
        handle_links: 'preferred',
        shortcuts: [
          {
            name: 'New Game',
            short_name: 'New',
            // Updated URLs
            url: '/?action=new',
            description: 'Start a new game'
          },
          {
            name: 'Match History',
            short_name: 'History',
            // Updated URLs
            url: '/history',
            description: 'View match history'
          }
        ],
        edge_side_panel: {
          preferred_width: 480
        },
        // Updated ID
        id: '/'
      },
      workbox: {
        // Force development service worker in all modes to ensure proper testing
        // should be false in actual production
        // devOptions: {
        //   enabled: true,
        //   type: 'module',
        // },
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
          },
          {
            // Match any same-origin route
            urlPattern: ({ url }) => {
              return url.origin === window.location.origin;
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-runtime-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 3
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,json,webp,woff2,ttf}',
          'manifest.webmanifest'
        ],
        navigateFallback: "/index.html",
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ],
  build: {
    sourcemap: process.env.NODE_ENV !== 'production', // Only in dev
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'i18n': ['i18next', 'react-i18next'],
          'animations': ['framer-motion']
        },
        // Add content hash to file names for better caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    target: 'esnext',
    assetsInlineLimit: 4096, // 4kb
    chunkSizeWarningLimit: 1500,
    reportCompressedSize: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production'
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    host: true, // Listen on all local IPs
  },
  preview: {
    port: 3000,
    strictPort: true,
    open: true,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'redux-persist',
      '@mui/material',
      '@mui/icons-material',
      'i18next',
      'react-i18next',
      'framer-motion'
    ]
  }
});
