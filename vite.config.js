import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vue CLI 4 / webpack 4 → Vite 迁移配置
export default defineConfig({
  // 部署到 GitHub Pages 用户站点（根域名），资源前缀为 /
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // 兼容原有 webpack 的目录导入（如 import X from '@/components/Panel' 解析到 index.vue）
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 与原先 sass-loader additionalData 一致：全局注入变量与 mixin
        additionalData: `@import "@/styles/variables.scss";\n@import "@/styles/mixin.scss";\n`,
      },
    },
  },
  build: {
    // 与 vue.config.js 原 productionSourceMap: false 保持一致
    sourcemap: false,
    // 大图/素材保持相对引用，避免静态资源超限告警
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // 拆分 vendor chunk，避免单文件过大影响首屏加载
        manualChunks: {
          vue: ['vue', 'vue-router', 'vuex'],
        },
      },
    },
  },
})
