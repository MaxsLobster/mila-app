import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // For GitHub Pages: repo is MaxsLobster/mila-app → served at /mila-app/
  base: command === 'build' ? '/mila-app/' : '/',
  server: {
    host: true,
    port: 5173,
  },
}))
