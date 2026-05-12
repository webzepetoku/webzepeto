// vite.config.ts
import { defineConfig } from 'vite'
import honox from 'honox/vite'
import buildClient from 'honox/vite/client'

export default defineConfig(({ mode }) => {
  // Jika sedang mem-build komponen interaktif (Islands) untuk sisi klien
  if (mode === 'client') {
    return {
      plugins: [buildClient()]
    }
  }
  
  // Build utama untuk sisi server
  return {
    plugins: [
      honox()
    ]
  }
})
