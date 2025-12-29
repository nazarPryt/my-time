import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    webExtension({
      manifest: () => ({
        manifest_version: 3,
        name: 'My Time',
        version: '1.0.0',

        description: 'A Chrome extension for time management',
        action: {
          default_popup: 'index.html',
          default_title: 'My Time',
        },
        permissions: [],
      }),
      browser: 'chrome',
    }),
  ],
})
