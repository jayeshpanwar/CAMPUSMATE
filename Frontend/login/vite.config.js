// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add a proxy to redirect API requests from the frontend to the backend.
  // This is crucial for local development to avoid Cross-Origin Resource Sharing (CORS) issues.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Your Django backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // This is optional if your backend routes start with /api
      },
    },
  },
});

