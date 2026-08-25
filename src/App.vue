<template>
  <div id="app">
    <Transition name="header-transform" mode="out-in">
      <Header v-show="showHeader" />
    </Transition>
    <main class="main">
      <Transition name="fade-transform" mode="out-in">
        <keep-alive :exclude="['Post']" :max="10">
          <RouterView />
        </keep-alive>
      </Transition>
    </main>
    <Footer />
    <ScrollTop />
  </div>
</template>

<script>
import NProgress from 'nprogress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollTop from '@/components/ScrollTop'
import { isMobile } from '@/utils'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    ScrollTop,
  },
  data() {
    return {
      showHeader: true,
      lastResizeTimer: '',
      lastResizeAt: new Date(),
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(val) {
        if (this.$isMobile.value) {
          this.showHeader = val.name !== 'post'
        }
        if (val.name === 'post') {
          setTimeout(this.scrollTop, 500)
        }
      },
    },
    '$isMobile.value': {
      immediate: true,
      handler(val) {
        if (val) {
          this.showHeader = this.$route && this.$route.name !== 'post'
        } else {
          this.showHeader = true
        }
      },
    },
  },
  created() {
    this.initProgress()
  },
  mounted() {
    // 顶部进度条：原 vue-progressbar 已替换为 nprogress
    NProgress.done()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // 窗口监听
    handleResize() {
      const now = new Date()
      if (now - this.lastResizeAt <= 150) return
      this.lastResizeAt = now
      this.$isMobile.value = isMobile()

      clearTimeout(this.lastResizeTimer)
      this.lastResizeTimer = setTimeout(() => {
        this.$isMobile.value = isMobile()
      }, 300)
    },
    // 注册顶部进度条（nprogress 替代 vue-progressbar）
    initProgress() {
      NProgress.start()
      this.$router.beforeEach((to, from, next) => {
        NProgress.start()
        next()
      })
      this.$router.afterEach(() => {
        NProgress.done()
      })
    },
    // 滚动到顶部
    scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
}
</script>

<style lang="scss" scoped>
#app {
  position: relative;
  @include pc-layout {
    padding-bottom: 100px;
  }
  @include sp-layout {
    padding-bottom: 60px;
  }

  .main {
    margin: 0 auto;
    max-width: $page-desktop;
    user-select: text;
  }
}
</style>
