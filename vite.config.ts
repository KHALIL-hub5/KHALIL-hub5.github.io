import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    dedupe: ['react', 'react-dom', 'three', '@react-three/fiber'],
  },
  optimizeDeps: {
    include: ['@react-three/fiber', '@react-three/drei/core/Preload'],
  },
  build: {
    // Three's core chunk compresses to 177 KB; its minified size exceeds Vite's default warning threshold.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three-vendor'
          if (id.includes('/node_modules/@react-three/drei/')) return 'drei-vendor'
          if (id.includes('/node_modules/@react-three/fiber/')) return 'fiber-vendor'
        },
      },
    },
  },
})
