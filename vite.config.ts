import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteMdx from './src'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteMdx(),
    vue(),
    vueJsx({
      include: /\.(jsx|tsx|mdx)$/
    })
  ],
  resolve: {
    alias: {
      'vite-mdx': '/src'
    }
  }
})
