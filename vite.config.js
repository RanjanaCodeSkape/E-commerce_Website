import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['react-helmet'] // Ensure react-helmet is included for SSR
  }
})
