import { createRouter, createWebHistory } from 'vue-router'

// ponytail: 路由懒加载——按需下载视图 chunk，首屏只加载当前页代码。
// 已知上限：多视图共享的第三方库（marked/katex 等）已由 manualChunks 分包，
// 若仍需细粒度可再按视图拆分。
export const router = createRouter({
  // 显式传 base：GitHub Pages 子路径（/qianlixun/）下须剥离前缀匹配路由
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home'),
      meta: { title: '首页' },
    },
    {
      path: '/works',
      name: 'works',
      component: () => import('@/views/Works'),
      meta: { title: '作品集' },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/Archive'),
      meta: { title: '博客' },
    },
    // 旧链接兼容：归档页已并入博客
    { path: '/archive', redirect: '/blog' },
    {
      path: '/life',
      name: 'life',
      component: () => import('@/views/Life'),
      meta: { title: '生活' },
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
      meta: { title: '分类' },
    },
    {
      path: '/tag',
      name: 'tag',
      component: () => import('@/views/Tag'),
      meta: { title: '标签' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About'),
      meta: { title: '关于' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/Contact'),
      meta: { title: '联系' },
    },
  ],
})

// 路由级页面标题（Post 页加载后自行覆盖为文章标题）
const BASE_TITLE = '千里寻 | 寻遍千山，终见灯火'
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | 千里寻` : BASE_TITLE
})

export default router
