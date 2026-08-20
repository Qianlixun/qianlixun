import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Vite 取代 vue.config.js（Vue CLI 已移除）。
// - base '/' 对应 GitHub Pages 用户站点根域名
// - @ 别名保持与原有 @/ 引用一致
// - SCSS 全局变量/混入通过 additionalData 注入（沿用原 vue.config 的 sass 配置）
export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    // .vue：兼容原 webpack 风格的无扩展名导入（如 @/components/APlayer）
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";\n@import "@/styles/mixin.scss";\n`,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
