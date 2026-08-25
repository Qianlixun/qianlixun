import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages 用户站点根域名部署（dist 推送到 Qianlixun/qianlixun.github.io）
const base = '/'

// Vite 取代 vue.config.js（Vue CLI 已移除）。
// - base '/' 对应 GitHub Pages 用户站点根域名（qianlixun.github.io）
// - @ 别名保持与原有 @/ 引用一致
// - SCSS 全局变量/混入通过 additionalData 注入（沿用原 vue.config 的 sass 配置）
export default defineConfig({
  base,
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
        additionalData: `$base-url: '${base}';\n@import "@/styles/variables.scss";\n@import "@/styles/mixin.scss";\n`,
      },
    },
  },
  build: {
    outDir: 'dist',
    // ponytail: 显式 vendor 分包——按库域各自独立 chunk，利于浏览器长效缓存；
    // 已知上限：gitalk 等评论库仍集中在 Post 懒加载 chunk，后续可再按需拆分
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!/node_modules/.test(id)) return
          if (/[/\\](vue|vue-router|vuex|@vue)[/\\]/.test(id)) return 'vue-vendor'
          if (/[/\\](marked|katex|highlight\.js|zooming|clipboard|github-markdown)[/\\]/.test(id)) return 'markdown-libs'
          if (/[/\\](gitalk|leancloud-storage|axios|github)[/\\]/.test(id)) return 'comment-libs'
          if (/[/\\](aos|nprogress|timeago\.js)[/\\]/.test(id)) return 'ui-vendor'
        },
      },
    },
  },
})
