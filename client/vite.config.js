import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

/**
 * This is where configurations can be made like a proxy
 * Further Implementations:
 * Bundle Splitting: Use Vite's Rollup configuration to split bundles more effectively, reducing the size of any single chunk
 * Dynamic Imports: For large pages or components, use dynamic imports to split your JavaScript into smaller chunks. This helps load only the necessary code for the initial page load.
 * Lazy Loading: Implement lazy loading for non-critical SVGs and images to defer their loading until they are needed.
 */
// https://vitejs.dev/config/
<<<<<<< HEAD


// This doesn't seem to be working. I think we need to follow this to allow the variable to be set in the Vite config
// https://vite.dev/config/#using-environment-variables-in-config
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5100';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: false, // Enables named exports like ReactComponent
      svgrOptions: {
        // Optional: Customize SVGR options if needed
      },
    }),
  ],

  server: {
    proxy: {
      '/api': {
        target: `${SERVER_URL}/api`,
        changeOrigin: true, //CORS policy temporary fix
        rewrite: (path) => path.replace(/^\/api/, ''), //removing the api prefix
      },
      '/assets': {
        target: SERVER_URL,
        changeOrigin: true,
        rewrite: (path) => path, // no rewrite needed
      },
      '/sitemap.xml': {
        target: SERVER_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/sitemap\.xml$/, '/sitemap.xml'),
      },
      '/robots.txt': {
        target: SERVER_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/robots\.txt$/, '/robots.txt'),
=======
export default defineConfig(({ ssrBuild }) => {
  // custom filenames for the client build only
  const isClient = !ssrBuild;

  return {
    plugins: [
      react({
        babel: {
          plugins: [
            [
              'babel-plugin-styled-components',
              { ssr: true, displayName: true },
            ],
          ],
        },
      }),
      svgr({ exportAsDefault: false }),
      {
        name: 'stub-micromark-attention',
        resolveId(source) {
          if (source === 'micromark-core-commonmark/lib/attention.js') {
            return source;
          }
          return null;
        },
        load(id) {
          if (id === 'micromark-core-commonmark/lib/attention.js') {
            return 'export default {}';
          }
          return null;
        },
      },
    ],

    resolve: {
      alias: {
        'micromark-core-commonmark/lib/attention.js': path.resolve(
          __dirname,
          'stubs/micromark-core-commonmark-attention.js'
        ),
>>>>>>> bf596c4 (initial ssr implementation)
      },
    },

    ssr: {
      format: 'esm',
      entry: 'src/entry-server.jsx',
      noExternal: [
        /^micromark-core-commonmark(\/|$)/,
        'styled-components',
        'stylis',
      ],
      external: [
        'react-helmet-async',
        '@uiw/react-markdown-editor',
        '@uiw/react-codemirror',
        '@uiw/codemirror-extensions-basic-setup',
      ],
    },

    build: {
      // SSR build bo file naming, client build will check if isClient here
      rollupOptions: {
        output: isClient
          ? {
              //client build produce a stable file
              entryFileNames: 'entry-client.js',
              chunkFileNames: 'chunk-[name].js',
              assetFileNames: 'assets/[name].[ext]',
              interop: 'auto',
              format: 'esm',
            }
          : {
              // SSR build
              interop: 'auto',
              format: 'esm',
            },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5100/api',
          changeOrigin: true, //CORS policy temporary fix
          rewrite: (path) => path.replace(/^\/api/, ''), //removing the api prefix
        },
        '/assets': {
          target: 'http://localhost:5100',
          changeOrigin: true,
        },
        '/sitemap.xml': {
          target: 'http://localhost:5100',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/sitemap\.xml$/, '/sitemap.xml'),
        },
        '/robots.txt': {
          target: 'http://localhost:5100',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/robots\.txt$/, '/robots.txt'),
        },
      },
    },
  };
});
