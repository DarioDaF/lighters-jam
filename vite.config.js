import { defineConfig } from 'vite'

import zipPack from 'vite-plugin-zip-pack'

import packageJson from './package.json' assert { type: 'json' }

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor_babylon: [ '@babylonjs/core' ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  plugins: [
    zipPack({
      outFileName: `dist-${packageJson.version}.zip`,
    }),
  ],
})
