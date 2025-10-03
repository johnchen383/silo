import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

import { execSync } from 'child_process';

const gitHash = execSync('git rev-parse --short HEAD').toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'Silo',
        short_name: 'Silo',
        description: 'Scriptural notetaking, reimagined.',
        theme_color: '#FAF9F6',
        background_color: '#FAF9F6',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/silo_icon_book_small.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/silo_icon_book_small.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/silo_icon_book_small.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  define: {
    __COMMIT_HASH__: JSON.stringify(gitHash),
  },
})
