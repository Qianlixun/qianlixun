<template>
  <div id="home">
    <!-- Hero 区：精简为一行引子 + 数据胶囊 -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-row">
          <span class="quote-line"></span>
          <span class="quote-text">个人项目资源站 · 用 GitHub Issues 做内容</span>
          <span class="quote-line"></span>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">{{ stats.projects }}</span>
            <span class="stat-label">个作品</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">{{ stats.articles }}</span>
            <span class="stat-label">篇文章</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">{{ stats.tags }}</span>
            <span class="stat-label">个标签</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体 -->
    <div class="content">
      <!-- 精选作品区 -->
      <section v-if="projects.length" class="section section-projects">
        <header class="section-head">
          <div class="section-title">
            <span class="bar"></span>
            <h2>我的作品</h2>
            <RouterLink class="more-link" to="/works">全部作品 <i class="icon icon-right-open-outline"></i></RouterLink>
          </div>
          <p class="section-sub">视频演示 · 源码下载 · 技术文档</p>
        </header>
        <div class="projects-grid">
          <ProjectCard
            v-for="(post, index) in featuredProjects"
            :key="post.id"
            :post="post"
            :loadCover="index < loadInx"
            :data-aos-delay="index * 80"
            @loadNext="loadNext"
          />
        </div>
      </section>

      <!-- 最新文章区 -->
      <section v-if="articles.length" class="section section-articles">
        <header class="section-head">
          <div class="section-title">
            <span class="bar"></span>
            <h2>近期记录</h2>
            <RouterLink class="more-link" to="/blog">全部文章 <i class="icon icon-right-open-outline"></i></RouterLink>
          </div>
          <p class="section-sub">踩坑笔记、技术记录与项目文档</p>
        </header>
        <ul class="article-list">
          <li v-for="post in featuredArticles" :key="post.id" data-aos="fade-up">
            <router-link :to="{ name: 'post', params: { number: post.number, post } }">
              <span class="article-date">{{ shortDate(post.created_at) }}</span>
              <span class="article-title">{{ post.title }}</span>
              <span class="article-ms">{{ post.milestone ? post.milestone.title : '未分类' }}</span>
            </router-link>
          </li>
        </ul>
      </section>

      <!-- 完全空态 -->
      <section v-if="!projects.length && !articles.length" class="empty">
        <div class="empty-card">
          <p class="empty-emoji">🏯</p>
          <h3>还没有任何内容</h3>
          <p>在 blog 仓库创建 open issue 后，会自动显示在这里</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AOS from 'aos'
import ProjectCard from '@/components/ProjectCard'
import config from '@/config'

// 首页一次拉取的条数（精选 + 近期记录共用）
const HOME_PAGE_SIZE = 30

export default {
  name: 'Home',
  components: {
    ProjectCard,
  },
  data() {
    return {
      loading: false,
      posts: [],
      loadInx: 2,
    }
  },
  computed: {
    ...mapState({ totalCount: (s) => s.totalCount, tags: (s) => s.tags }),
    // 作品：open issue 且在 projectResources 映射里
    projects() {
      return this.posts.filter((p) => !!config.projectResources[p.number])
    },
    // 其余为技术文章
    articles() {
      return this.posts.filter((p) => !config.projectResources[p.number])
    },
    featuredProjects() {
      return this.projects.slice(0, 3)
    },
    featuredArticles() {
      return this.articles.slice(0, 8)
    },
    // ponytail: 作品数按首页拉取的一页（≤30）统计，文章超量时计数偏低，个人站够用
    stats() {
      return {
        projects: this.projects.length,
        articles: Math.max(this.totalCount - this.projects.length, this.articles.length),
        tags: (this.tags || []).length,
      }
    },
  },
  async created() {
    if (!this.totalCount) await this.$store.dispatch('queryArchivesCount')
    if (!this.$store.state.tags) await this.$store.dispatch('queryTag')
    await this.queryPosts()
    AOS.init({ duration: 800, easing: 'ease', debounceDelay: 50, throttleDelay: 100, offset: 40 })
  },
  methods: {
    async queryPosts() {
      this.loading = true
      const posts = await this.$store.dispatch('queryPosts', { page: 1, pageSize: HOME_PAGE_SIZE })
      this.loading = false
      this.posts = posts || []
    },
    loadNext() {
      this.loadInx += 1
    },
    shortDate(s) {
      return String(s || '').slice(0, 10)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
