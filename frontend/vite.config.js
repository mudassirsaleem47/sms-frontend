import { defineConfig } from 'vite'
// reload trigger
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Normalized absolute paths for aliases
      "@tabler/icons-react": path.resolve(__dirname, "node_modules/@tabler/icons-react/dist/esm/tabler-icons-react.mjs").replace(/\\/g, '/'),
      "react-to-print": path.resolve(__dirname, "node_modules/react-to-print/lib/index.js").replace(/\\/g, '/'),
      "react-draggable": path.resolve(__dirname, "node_modules/react-draggable/build/cjs/cjs.js").replace(/\\/g, '/'),
    },
  },
  server: {
    host: true
  }
})