import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * This is where configurations can be made like a proxy
 * Further Implementations:
 * Bundle Splitting: Use Vite's Rollup configuration to split bundles more effectively, reducing the size of any single chunk
 * Dynamic Imports: For large pages or components, use dynamic imports to split your JavaScript into smaller chunks. This helps load only the necessary code for the initial page load.
 * Lazy Loading: Implement lazy loading for non-critical SVGs and images to defer their loading until they are needed.
 */
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
  define: {
    'process.env': {},
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         vendor: ['react', 'react-dom'], // splitting React libraries into a separate chunk
  //         icons: [
  //           'src/assets/icons', // example: Splitting icons into a separate chunk
  //           'path/to/another/icons/directory',
  //         ],
  //         utils: ['src/utils'], // Splitting utility functions into a separate chunk
  //         largeLib: ['some-large-library'], // Example: Any large library you want to separate
  //       },
  //     },
  //   },
  //   chunkSizeWarningLimit: 1000, // Increase the limit to suppress warnings (adjust as necessary)
  // },
});
