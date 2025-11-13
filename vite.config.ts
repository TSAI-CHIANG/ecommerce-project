import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy: {
      '/api': {
        target: 'http://locoalhost:3000'
      },
      '/images': {
        target: 'http://locoalhost:3000'
      }
    }
  }
    
})
