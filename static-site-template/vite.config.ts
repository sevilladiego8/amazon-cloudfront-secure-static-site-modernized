import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Here you should define build settings for your website
 */
export default defineConfig({
  plugins: [tailwindcss(), react()],
})
