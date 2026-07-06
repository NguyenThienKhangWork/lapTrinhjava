import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Provide polyfill for global object used by stompjs/sockjs
    global: 'window',
  }
})
