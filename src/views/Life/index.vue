<template>
  <div id="life">
    <Transition name="fade-transform" mode="out-in">
      <div class="page">
        <Quote :quote="$config.lifeOpts.qoute" />
        <div class="content">
          <!-- 未登录：引导登录 -->
          <div v-if="!logged" class="gate-card" data-aos="fade-up">
            <i class="icon icon-heart gate-icon"></i>
            <h3>生活记事 · 仅站长可见</h3>
            <p>这里是千里寻的私人生活记录，站长本人登录 GitHub 后可阅读。</p>
            <button class="btn cursor" @click="doLogin"><i class="icon icon-link"></i> 登录 GitHub</button>
          </div>

          <!-- 已登录但无权访问 -->
          <div v-else-if="status === 'denied'" class="gate-card" data-aos="fade-up">
            <i class="icon icon-emo-devil gate-icon"></i>
            <h3>仅站长可见</h3>
            <p>当前 GitHub 账号没有访问权限，换个账号试试？</p>
            <button class="btn cursor" @click="doLogout"><i class="icon icon-cancel-outline"></i> 退出登录</button>
          </div>

          <!-- 站长已登录但私有仓库尚未创建 -->
          <div v-else-if="status === 'setup'" class="gate-card" data-aos="fade-up">
            <i class="icon icon-pencil gate-icon"></i>
            <h3>生活仓库还未创建</h3>
            <p>
              请创建私有仓库
              <code>{{ $config.username }}/{{ $config.lifeOpts.repository }}</code>
              ，在其中添加 open issue 即为一条生活记录（标题 + 正文 Markdown）。
            </p>
            <button class="btn cursor" @click="fetchLife"><i class="icon icon-comment"></i> 我已创建，刷新看看</button>
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
import { isLogged, login, logout, getToken, isOwner } from '@/utils/auth'

export default {
  name: 'Life',
  components: {
    Quote,
    Loading,
    MarkDown,
  },
  data() {
    return {
      logged: isLogged(),
      status: 'loading',
      posts: [],
      open: 0,
    }
  },
  async created() {
    if (this.logged) {
      await this.fetchLife()
    }
  },
  mounted() {
    // 未登录门禁卡片也带 data-aos，须无条件初始化 AOS 否则保持 opacity:0 不可见
    AOS.init({ duration: 800, easing: 'ease', debounceDelay: 50, throttleDelay: 100, offset: 40 })
  },
  methods: {
    doLogin() {
      login()
    },
    doLogout() {
      logout()
      this.logged = false
      this.posts = []
      this.status = 'loading'
    },
    async fetchLife() {
      this.status = 'loading'
      this.logged = isLogged()
      const token = getToken()
      // 私有仓库 ACL 兜底：非拥有者即便登录也拿不到数据（GitHub 对无权私有库返回 404）
      const res = await this.$store.dispatch('queryLife', { token })
      if (res.ok) {
        this.posts = res.data || []
        this.status = 'ok'
        return
      }
      // 拉取失败：站长本人 → 仓库未建；其他账号 → 无权限
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
