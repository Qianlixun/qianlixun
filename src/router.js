import { createRouter, createWebHistory } from 'vue-router'

// ponytail: 路由懒加载——按需下载视图 chunk，首屏只加载当前页代码。
// 已知上限：多视图共享的第三方库（marked/katex 等）仍会进入公共 chunk，
// 若主 chunk 仍超 500KB 需再 manualChunks 显式分包。
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home'),
    },
    {
      path: '/post/:number',
      name: 'post',
      component: () => import('@/views/Post'),
    },
    {
      path: '/archive',
      name: 'archive',
      component: () => import('@/views/Archive'),
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('@/views/Category'),
    },
    {
      path: '/tag',
      name: 'tag',
      component: () => import('@/views/Tag'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About'),
    },
  ],
})
