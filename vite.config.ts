import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import webExtension from 'vite-plugin-web-extension'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@app': path.resolve(__dirname, './src/application'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infra': path.resolve(__dirname, './src/infrastructure'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@extension': path.resolve(__dirname, './src/extension'),
    },
  },
  optimizeDeps: {
    exclude: ['pg', 'pg-hstore'],
  },
  plugins: [
    react(),
    tailwindcss(),
    // Temporarily disabled for basic web build
    // webExtension({
    //   manifest: () => ({
    //     manifest_version: 3,
    //     name: 'My Time',
    //     version: '1.0.0',
    //     description: 'A Chrome extension for time management',
    //     action: {
    //       default_popup: 'index.html',
    //       default_title: 'My Time',
    //     },
    //     permissions: [],
    //   }),
    //   browser: 'chrome',
    // }),
  ],
})
