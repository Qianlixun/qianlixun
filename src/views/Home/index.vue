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
            <span class="stat-label">个项目</span>
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
      <!-- 精选项目区 -->
      <section v-if="projects.length" class="section section-projects">
        <header class="section-head">
          <div class="section-title">
            <span class="bar"></span>
            <h2>我的项目</h2>
          </div>
          <p class="section-sub">视频演示 · 源码下载 · 技术文档</p>
        </header>
        <div class="projects-grid">
          <article
            v-for="(post, index) in projects"
            :key="post.id"
            class="project-card"
            data-aos="fade-up"
            :data-aos-delay="index * 80"
          >
            <router-link :to="{ name: 'post', params: { number: post.number, post } }">
              <div class="card-cover">
                <Cover :src="post.cover.src" :alt="post.cover.title" :loadCover="index < 2" @loadNext="loadNext" />
                <span class="badge"><i class="icon icon-folder"></i>项目</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">{{ post.title }}</h3>
                <div class="card-excerpt">
                  <MarkDown :content="excerpt(post.description, 90)" />
                </div>
                <div class="card-actions">
                  <span v-if="config.projectResources[post.number]?.bvid" class="act-btn">
                    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                      <path fill="currentColor" d="M3 2v8l7-4z" />
                    </svg>视频演示
                  </span>
                  <span class="act-btn">
                    <i class="icon icon-download"></i> 源码下载
                  </span>
                </div>
              </div>
            </router-link>
          </article>
        </div>
      </section>

      <!-- 最新文章区 -->
      <section v-if="articles.length" class="section section-articles">
        <header class="section-head">
          <div class="section-title">
            <span class="bar"></span>
            <h2>近期记录</h2>
          </div>
          <p class="section-sub">踩坑笔记、技术记录与项目文档</p>
        </header>
        <ul class="article-list">
          <li v-for="(post, index) in articles" :key="post.id" data-aos="fade-up" :data-aos-delay="index * 50">
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

      <div class="btn-group" v-if="!isDisabledPrev || !isDisabledNext">
        <Pagination
          :loading="loading"
          :isDisabledPrev="isDisabledPrev"
          :isDisabledNext="isDisabledNext"
          @handlePage="queryPosts"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AOS from 'aos'
import MarkDown from '@/components/MarkDown'
import Pagination from '@/components/Pagination'
import Cover from '@/components/Cover'
import config from '@/config'

export default {
  name: 'Home',
  components: { MarkDown, Pagination, Cover },
  data() {
    return {
      loading: false,
      page: 0,
      pageSize: 12,
      posts: [],
      list: [],
      LOAD_INX: 2,
    }
  },
  computed: {
    ...mapState({ totalCount: (s) => s.totalCount, tags: (s) => s.tags }),
    maxPage() {
      return Math.ceil(this.totalCount / this.pageSize)
    },
    isDisabledPrev() {
      return this.page <= 1
    },
    isDisabledNext() {
      return this.page >= this.maxPage
    },
    // 精选项目：open issue 且在 projectResources 映射里
    projects() {
      return this.posts.filter((p) => !!config.projectResources[p.number])
    },
    // 其余文章
    articles() {
      return this.posts.filter((p) => !config.projectResources[p.number])
    },
    stats() {
      return {
        projects: this.projects.length,
        articles: this.articles.length,
        tags: (this.tags || []).length,
      }
    },
    config() {
      return config
    },
  },
  async created() {
    if (!this.totalCount) await this.$store.dispatch('queryArchivesCount')
    if (!this.$store.state.tags) await this.$store.dispatch('queryTag')
    await this.queryPosts()
    AOS.init({ duration: 800, easing: 'ease', debounceDelay: 50, throttleDelay: 100, offset: 40 })
  },
  methods: {
    async queryPosts(type = 'next') {
      if (this.loading) return
      const q = type === 'prev' ? this.page - 1 : this.page + 1
      this.page = q
      this.LOAD_INX = 2
      if (this.list[q]) {
        this.scrollTop(() => (this.posts = this.list[q]))
        return
      }
      this.loading = true
      const posts = await this.$store.dispatch('queryPosts', { page: q, pageSize: this.pageSize })
      this.loading = false
      this.scrollTop(() => {
        this.posts = posts
        this.list[q] = posts
      })
    },
    scrollTop(cb) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      const d = this.$isMobile.value ? 200 : 0
      setTimeout(cb, 700 + d)
      setTimeout(AOS.refresh, 1100 + d)
    },
    loadNext() {
      this.LOAD_INX += 1
    },
    excerpt(md, n) {
      const s = (md || '').replace(/[#>*_`\[\]()!\n]/g, ' ').trim()
      return s.length > n ? s.slice(0, n) + '…' : s
    },
    shortDate(s) {
      return (s || '').slice(0, 10)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
