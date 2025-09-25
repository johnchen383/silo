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
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Silo',
        short_name: 'Silo',
        description: 'A place to share theological ideas.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/temp.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/temp.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/temp.png',
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
