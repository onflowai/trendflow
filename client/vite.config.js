import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//This is where configurations can be made like a proxy
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
