<template>
  <div id="life">
    <Transition name="fade-transform" mode="out-in">
      <div class="page">
        <Quote :quote="$config.lifeOpts.qoute" />
        <div class="content">
          <!-- 未解锁 / 令牌无效：粘贴令牌 -->
          <div v-if="status === 'gate' || status === 'invalid'" class="gate-card" data-aos="fade-up">
            <i :class="['icon gate-icon', status === 'invalid' ? 'icon-cancel-outline' : 'icon-heart']"></i>
            <h3>生活记事 · 仅站长可见</h3>
            <p>这里是千里寻的私人生活记录，粘贴访问令牌解锁。</p>
            <p v-if="status === 'invalid'" class="gate-error">令牌无效或已过期，请重新粘贴。</p>
            <form class="gate-form" @submit.prevent="unlock">
              <input
                v-model="tokenInput"
                class="gate-input"
                type="password"
                aria-label="GitHub 访问令牌"
                placeholder="粘贴 GitHub 访问令牌（github_pat_…）"
                autocomplete="off"
              />
              <button class="btn cursor" type="submit"><i class="icon icon-link"></i> 解锁</button>
            </form>
            <p class="gate-help">
              令牌生成：<a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                >Fine-grained token</a
              >
              仅选 <code>life</code> 仓库，权限 <code>Issues: Read-only</code>
            </p>
          </div>

          <!-- 令牌有效但无权访问 -->
          <div v-else-if="status === 'denied'" class="gate-card" data-aos="fade-up">
            <i class="icon icon-emo-devil gate-icon"></i>
            <h3>仅站长可见</h3>
            <p>当前令牌没有访问权限，换个令牌试试？</p>
            <button class="btn cursor" @click="doLogout"><i class="icon icon-cancel-outline"></i> 清除令牌</button>
          </div>

          <!-- 站长令牌但私有仓库不可见（未建仓库 / 未授权该仓库） -->
          <div v-else-if="status === 'setup'" class="gate-card" data-aos="fade-up">
            <i class="icon icon-pencil gate-icon"></i>
            <h3>生活仓库还未就绪</h3>
            <p>
              请创建私有仓库 <code>{{ $config.username }}/{{ $config.lifeOpts.repository }}</code>
              并为令牌授权该仓库（Issues 只读），在其中添加 open issue 即为一条生活记录。
            </p>
            <button class="btn cursor" @click="fetchLife"><i class="icon icon-comment"></i> 我已配置，刷新看看</button>
          </div>

          <Loading v-else-if="status === 'loading'" />

          <!-- 正常内容流 -->
          <template v-else>
            <div class="life-toolbar">
              <span class="life-hint"><i class="icon icon-heart"></i> 私密记事 · 共 {{ posts.length }} 篇</span>
              <button class="logout-btn cursor" @click="doLogout">
                <i class="icon icon-cancel-outline"></i> 退出登录
              </button>
            </div>
            <ul v-if="posts.length" class="life-list">
              <li v-for="post in posts" :key="post.number" class="life-item" data-aos="fade-up">
                <button class="life-head cursor" @click="toggle(post.number)">
                  <span class="life-date">{{ shortDate(post.created_at) }}</span>
                  <span class="life-title">{{ post.title }}</span>
                  <i :class="['icon', open === post.number ? 'icon-cancel-outline' : 'icon-comment']"></i>
                </button>
                <div v-show="open === post.number" class="life-body">
                  <MarkDown :content="post.body" target="#life" />
                </div>
              </li>
            </ul>
            <div v-else class="gate-card" data-aos="fade-up">
              <i class="icon icon-comment gate-icon"></i>
              <h3>还没有生活记录</h3>
              <p>在私有仓库里写下第一条 issue 吧。</p>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import AOS from 'aos'
import Quote from '@/components/Quote'
import Loading from '@/components/Loading'
import MarkDown from '@/components/MarkDown'
import { getToken, saveToken, logout, isOwner } from '@/utils/auth'

export default {
  name: 'Life',
  components: {
    Quote,
    Loading,
    MarkDown,
  },
  data() {
    return {
      status: 'loading',
      posts: [],
      open: 0,
      tokenInput: '',
    }
  },
  async created() {
    await this.fetchLife()
  },
  mounted() {
    // 门禁卡片也带 data-aos，须无条件初始化 AOS 否则保持 opacity:0 不可见
    AOS.init({ duration: 800, easing: 'ease', debounceDelay: 50, throttleDelay: 100, offset: 40 })
  },
  methods: {
    async unlock() {
      const token = this.tokenInput.trim()
      if (!token) return
      saveToken(token)
      await this.fetchLife()
    },
    doLogout() {
      logout()
      this.tokenInput = ''
      this.posts = []
      this.status = 'gate'
    },
    async fetchLife() {
      const token = getToken()
      if (!token) {
        this.status = 'gate'
        return
      }
      this.status = 'loading'
      // 私有仓库 ACL 兜底：非拥有者的令牌同样 404，数据不落浏览器
      const res = await this.$store.dispatch('queryLife', { token })
      if (res.ok) {
        this.posts = res.data || []
        this.status = 'ok'
        return
      }
      if (res.status === 401) {
        logout()
        this.status = 'invalid'
        return
      }
      // 拉取失败：站长本人 → 仓库未建/未授权；其他账号 → 无权限
      this.status = (await isOwner(token)) ? 'setup' : 'denied'
    },
    toggle(number) {
      this.open = this.open === number ? 0 : number
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
