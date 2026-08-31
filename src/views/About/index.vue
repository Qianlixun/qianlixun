<template>
  <div id="about">
    <Transition name="fade-transform" mode="out-in">
      <div class="page" v-if="about">
        <Quote :quote="$config.aboutOpts.qoute" />
        <div class="content">
          <div class="header">
            <div class="info">
              <span>
                <i class="icon icon-fort-awesome"></i>
                {{ $config.title }}
              </span>
              <span>
                <i class="icon icon-pagelines"></i>
                {{ $config.subtitle }}
              </span>
              <span v-if="$config.aboutOpts.graduated">
                <i class="icon icon-graduation-cap"></i>
                {{ $config.aboutOpts.graduated }}
              </span>
              <span v-if="$config.aboutOpts.college">
                <i class="icon icon-tripadvisor"></i>
                {{ $config.aboutOpts.college }}
              </span>
            </div>
          </div>
          <div class="contact">
            <a
              v-for="item in $config.contactOpts.list"
              :key="item.name"
              :href="item.link"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img :alt="item.name" :src="item.icon" />
            </a>
          </div>
          <a
            v-if="$config.aboutOpts.resume && $config.aboutOpts.resume.url"
            class="resume btn cursor"
            :href="$config.aboutOpts.resume.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="icon icon-inbox"></i> {{ $config.aboutOpts.resume.label }}
          </a>

          <!-- 结构化简历区段（来自 config.resumeData，空数组不渲染） -->
          <Segment v-if="rd.education.length" :title="'教育经历'" :color="c(0)">
            <div class="timeline">
              <div v-for="(e, i) in rd.education" :key="i" class="timeline-item">
                <div class="period">{{ e.period }}</div>
                <div class="detail">
                  <div class="title">{{ e.school }} · {{ e.major }} · {{ e.degree }}</div>
                  <ul v-if="descLines(e.desc).length" class="desc-list">
                    <li v-for="(line, li) in descLines(e.desc)" :key="li" v-html="boldHtml(line)"></li>
                  </ul>
                </div>
              </div>
            </div>
          </Segment>
          <Segment v-if="rd.work.length" :title="'工作经历'" :color="c(1)">
            <div class="timeline">
              <div v-for="(w, i) in rd.work" :key="i" class="timeline-item">
                <div class="period">{{ w.period }}</div>
                <div class="detail">
                  <div class="title">{{ w.company }} · {{ w.position }}</div>
                  <ul v-if="descLines(w.desc).length" class="desc-list">
                    <li v-for="(line, li) in descLines(w.desc)" :key="li" v-html="boldHtml(line)"></li>
                  </ul>
                </div>
              </div>
            </div>
          </Segment>
          <Segment v-if="projectsData.length" :title="'项目经历'" :color="c(2)">
            <div class="timeline">
              <div v-for="(p, i) in projectsData" :key="i" class="timeline-item">
                <div class="period">{{ p.period }}</div>
                <div class="detail">
                  <div class="title">{{ p.name }}<span v-if="p.role"> · {{ p.role }}</span></div>
                  <ul v-if="descLines(p.desc).length" class="desc-list">
                    <li v-for="(line, li) in descLines(p.desc)" :key="li" v-html="boldHtml(line)"></li>
                  </ul>
                </div>
              </div>
            </div>
          </Segment>
          <Segment v-if="rd.skills.length" :title="'技能'" :color="c(3)">
            <div class="skills">
              <div v-for="(s, i) in rd.skills" :key="i" class="skill">
                <div class="name">{{ s.name }}</div>
                <div class="bar">
                  <div class="fill" :style="{ width: s.level + '%', backgroundColor: c(3) }"></div>
                </div>
                <div class="level">{{ s.level }}%</div>
              </div>
            </div>
          </Segment>
          <Segment v-if="rd.awards.length" :title="'获奖证书'" :color="c(4)">
            <div class="awards">
              <div v-for="(a, i) in rd.awards" :key="i" class="award-item">
                <span class="period">{{ a.period }}</span>
                <span class="title">{{ a.title }}</span>
                <span v-if="a.desc" class="desc">{{ a.desc }}</span>
              </div>
            </div>
          </Segment>

          <Segment v-for="(item, i) in about" :key="item.title" :title="item.title" :color="c(i + 5)">
            <MarkDown :content="item.content" />
          </Segment>
        </div>
      </div>
      <Loading v-else />
    </Transition>

    <Comment v-if="$config.aboutOpts.enableComment && initComment" title="关于" />
  </div>
</template>

<script>
import MarkDown from '@/components/MarkDown'
import Loading from '@/components/Loading'
import Comment from '@/components/Comment'
import Quote from '@/components/Quote'
import Segment from '@/components/Segment'
import { shuffle } from '@/utils'

export default {
  name: 'About',
  components: {
    MarkDown,
    Loading,
    Comment,
    Quote,
    Segment,
  },
  data() {
    return {
      colors: shuffle(this.$config.themeColors),
      about: '',
      projects: [], // 项目经历（优先从 Issues 拉，空则 fallback 到 config.resumeData.projects）
      initComment: false,
    }
  },
  computed: {
    // 简历数据（resumeData 不存在或字段缺失时返回空对象，渲染时 v-if 兜底）
    rd() {
      return this.$config.aboutOpts.resumeData || {}
    },
    // 项目经历展示数据：Issues 拉到了用 Issues，否则 fallback 到 config.resumeData.projects
    projectsData() {
      if (this.projects && this.projects.length) return this.projects
      return (this.rd.projects && this.rd.projects.length) ? this.rd.projects : []
    },
  },
  async created() {
    await Promise.all([this.queryAbout(), this.queryProject()])
    this.initComment = true
  },
  methods: {
    // colors 越界兜底（取模循环主题色）
    c(i) {
      return this.colors[i % this.colors.length]
    },
    // 获取关于详情
    async queryAbout() {
      this.about = await this.$store.dispatch('queryPage', { type: 'about' })
    },
    // 获取项目经历（blog 仓库 closed issue with label=Project），失败不阻塞
    async queryProject() {
      try {
        this.projects = await this.$store.dispatch('queryPage', { type: 'project' })
      } catch (e) {
        this.projects = []
      }
    },
    // desc 按行切分成要点（兼容 \n / \r\n / \n 三种，空跳过，去「·/1./-」前缀）
    descLines(desc) {
      if (!desc) return []
      return String(desc)
        .split(/\r?\n/)
        .map((s) => s.replace(/^\s*[\u00b7\u2022\u25CF\-*]+\s*/, '').replace(/^\s*\d+[\.、\)]\s*/, '').trim())
        .filter(Boolean)
    },
    // 轻量行内富文本：**加粗** → <b>、`代码` → <code>（仅处理已在 config 里使用的语法）
    // 输入仅来自站长 config / Issue，信任边界安全
    boldHtml(line) {
      return String(line)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*([^*]+?)\*\*/g, '<b>$1</b>')
        .replace(/`([^`]+?)`/g, '<code>$1</code>')
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
