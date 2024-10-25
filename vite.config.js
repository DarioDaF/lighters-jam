import { defineConfig } from 'vite'

import zipPack from 'vite-plugin-zip-pack'

import packageJson from './package.json' assert { type: 'json' }

export default defineConfig({
  plugins: [
    zipPack({
      outFileName: `dist-${packageJson.version}.zip`,
    }),
  ],
})
