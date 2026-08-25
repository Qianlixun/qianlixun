<template>
  <div id="works">
    <Transition name="fade-transform" mode="out-in">
      <div class="page" v-if="loaded">
        <Quote :quote="$config.worksOpts.qoute" />
        <div class="content">
          <header class="section-head">
            <div class="section-title">
              <span class="bar"></span>
              <h2>作品集</h2>
            </div>
            <p class="section-sub">视频演示 · 源码归档 · 项目文档</p>
          </header>
          <div v-if="projects.length" class="projects-grid">
            <ProjectCard
              v-for="(post, index) in projects"
              :key="post.id"
              :post="post"
              :loadCover="index < loadInx"
              :data-aos-delay="(index % 3) * 80"
              @loadNext="loadNext"
            />
          </div>
          <div v-else class="empty">
            <div class="empty-card">
              <p class="empty-emoji">🏯</p>
              <h3>还没有作品</h3>
              <p>把 blog 仓库的文章编号映射进 config.projectResources 即可收录</p>
            </div>
          </div>
        </div>
      </div>
      <Loading v-else />
    </Transition>
  </div>
</template>

<script>
import AOS from 'aos'
import Quote from '@/components/Quote'
import Loading from '@/components/Loading'
import ProjectCard from '@/components/ProjectCard'
import config from '@/config'

export default {
  name: 'Works',
  components: {
    Quote,
    Loading,
    ProjectCard,
  },
  data() {
    return {
      loaded: false,
      projects: [],
      loadInx: 2,
    }
  },
  async created() {
    // ponytail: 一次拉 100 条 open issues 本地过滤；作品数超 100 需改分页累积
    const posts = await this.$store.dispatch('queryPosts', { page: 1, pageSize: 100 })
    this.projects = (posts || []).filter((p) => !!config.projectResources[p.number])
    this.loaded = true
    this.$nextTick(() => {
      AOS.init({ duration: 800, easing: 'ease', debounceDelay: 50, throttleDelay: 100, offset: 40 })
    })
  },
  methods: {
    loadNext() {
      this.loadInx += 1
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
