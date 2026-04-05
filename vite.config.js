import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose to all network interfaces
    allowedHosts: true, // Allow connections from LAN IP addresses
  },
  build: {
    // Split vendor chunks for better long-term caching (Core Web Vitals benefit)
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Heavy animation library
          'vendor-motion': ['framer-motion'],
          // UI utilities
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge'],
          // Data fetching
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Increase chunk size warning limit slightly (framer-motion is large)
    chunkSizeWarningLimit: 600,
  },
})

