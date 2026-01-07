import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@extension': path.resolve(__dirname, './src/extension'),
    },
  },
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
