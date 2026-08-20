import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home'
import Post from './views/Post'
import Archive from './views/Archive'
import Category from './views/Category'
import Tag from './views/Tag'
import Inspiration from './views/Inspiration'
import Book from './views/Book'
import Friend from './views/Friend'
import About from './views/About'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/post/:number',
      name: 'post',
      component: Post,
    },
    {
      path: '/archive',
      name: 'archive',
      component: Archive,
    },
    {
      path: '/category',
      name: 'category',
      component: Category,
    },
    {
      path: '/tag',
      name: 'tag',
      component: Tag,
    },
    {
      path: '/inspiration',
      name: 'inspiration',
      component: Inspiration,
    },
    {
      path: '/book',
      name: 'book',
      component: Book,
    },
    {
      path: '/friend',
      name: 'friend',
      component: Friend,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
  ],
})
