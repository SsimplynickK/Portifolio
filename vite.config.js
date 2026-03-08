import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'   // ← Add this (Node built-in module)

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors

  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      // This restores the @ alias that Base used to provide automatically
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Optional: keep this if you want to prevent any accidental proxy spam
  server: {
    proxy: {
      "/api": "http://localhost:3001"
    }
  }
})