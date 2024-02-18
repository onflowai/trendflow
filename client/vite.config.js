import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//This is where configurations can be made like a proxy
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5100/api',
        changeOrigin: true, //CORS policy temporary fix
        rewrite: (path) => path.replace(/^\/api/, ''), //removing the api prefix
      },
    },
  },
});
