import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   manifest: {
    //     name: 'Kyobo Hottracks Inventory',
    //     short_name: 'Hottracks',
    //     description: 'Kyobo Hottracks Inventory Management System',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: '/favicon.ico',
    //         sizes: '64x64',
    //         type: 'image/x-icon'
    //       },
    //       {
    //         src: '/favicon.ico',
    //         sizes: '192x192',
    //         type: 'image/x-icon'
    //       },
    //       {
    //         src: '/favicon.ico',
    //         sizes: '512x512',
    //         type: 'image/x-icon'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}']
    //   }
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3002,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    fs: {
      strict: false,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 프로덕션 빌드 시 소스맵 비활성화
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@tanstack/react-query', 'axios', 'react-router-dom', 'lucide-react'],
  },
});
