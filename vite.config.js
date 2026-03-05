import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Ikkala plaginni bitta massiv (array) ichiga joylashtiramiz
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})