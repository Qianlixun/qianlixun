import { createRouter, createWebHistory } from 'vue-router'

// ponytail: 路由懒加载——按需下载视图 chunk，首屏只加载当前页代码。
// 已知上限：多视图共享的第三方库（marked/katex 等）已由 manualChunks 分包，
// 若仍需细粒度可再按视图拆分。
export default createRouter({
  // 显式传 base：GitHub Pages 子路径（/qianlixun/）下须剥离前缀匹配路由
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home'),
    },
    {
      path: '/works',
      name: 'works',
      component: () => import('@/views/Works'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/Archive'),
    },
    // 旧链接兼容：归档页已并入博客
    { path: '/archive', redirect: '/blog' },
    {
      path: '/life',
      name: 'life',
      component: () => import('@/views/Life'),
    },
    {
      path: '/post/:number',
      name: 'post',
      component: () => import('@/views/Post'),
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
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/Contact'),
    },
  ],
})
