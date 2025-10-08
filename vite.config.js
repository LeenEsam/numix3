
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // يمكنك تغييره إذا كان مشغولًا
  },
  css: {
    postcss: './postcss.config.js', // تأكد أن هذا الملف موجود
  },
})
