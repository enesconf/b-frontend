import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    'process.env': {
      NEXT_PUBLIC_API_URL: JSON.stringify(process.env.NEXT_PUBLIC_API_URL)
    }
  }
}) 