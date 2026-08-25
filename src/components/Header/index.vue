<template>
  <header>
    <RouterLink class="title" to="/">{{ $config.title }}</RouterLink>
    <span class="subtitle">{{ $config.subtitle }}</span>
    <nav>
      <RouterLink v-for="menu in displayMenu" :key="menu.path" :to="menu.path">
        <i :class="['icon', `icon-${menu.icon}`]" />
        {{ menu.title }}
      </RouterLink>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    const { worksOpts, archiveOpts, lifeOpts, aboutOpts, contactOpts } = this.$config
    return {
      menu: [
        { path: '/', display: true, icon: 'shop', title: '首页' },
        { path: '/works', display: worksOpts.display, icon: 'star', title: '作品集' },
        { path: '/blog', display: archiveOpts.display, icon: 'inbox', title: '博客' },
        { path: '/life', display: lifeOpts.display, icon: 'heart', title: '生活' },
        { path: '/about', display: aboutOpts.display, icon: 'universal-access', title: '关于' },
        { path: '/contact', display: contactOpts.display, icon: 'link', title: '联系' },
      ],
    }
  },
  computed: {
    displayMenu() {
      return this.menu.filter((o) => o.display)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
