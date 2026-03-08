import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Use IP instead of "localhost" so auth extensions (e.g. Cerby) are less likely to intercept
    strictPort: false,
  },
})
