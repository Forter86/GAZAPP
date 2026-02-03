import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Отключаем проверку TypeScript во время сборки
      typescript: {
        tsconfigPath: './tsconfig.app.json',
        check: false
      }
    }),
    tailwindcss()
  ],
  server: {
    host: true,
    allowedHosts: [
      'gazapp.loca.lt',
      '.loca.lt', // Разрешаем все поддомены loca.lt
      'jennell-interpenetrable-unspiritedly.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok-free.app',
      '.ngrok.io',
      '.ngrok.app'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/send-application': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
