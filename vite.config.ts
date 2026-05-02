import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig } from 'vite'
import checker from 'vite-plugin-checker'

const DEV_PORT = 5173

export default defineConfig(
  ({ command }): UserConfig => ({
    base: process.env.VITE_BASE_URL ?? '/',
    plugins: [
      react(),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint . --cache',
          useFlatConfig: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@mantine/core', '@mantine/hooks', 'zustand', 'reselect', 'dexie'],
    },
    server: {
      port: DEV_PORT,
      strictPort: true,
      warmup: {
        clientFiles: ['./src/main.tsx', './src/app/index.tsx', './src/app/app-providers.tsx'],
      },
    },
    preview: {
      port: DEV_PORT,
      strictPort: true,
    },
    esbuild: {
      drop: command === 'build' ? ['debugger'] : [],
    },
    build: {
      target: 'esnext',
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'mantine-vendor': ['@mantine/core', '@mantine/hooks', 'mantine-datatable'],
            'i18n-vendor': ['i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
            'state-vendor': ['zustand', 'reselect'],
            'db-vendor': ['dexie'],
            'audio-vendor': ['music-metadata'],
          },
        },
      },
    },
    worker: {
      format: 'es',
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@use '/src/shared/ui-kit/_vars.scss' as *;`,
        },
      },
    },
  }),
)
