<template>
  <div id="about">
    <Transition name="fade-transform" mode="out-in">
      <div class="page" v-if="about">
        <Quote :quote="$config.aboutOpts.qoute" />

        <!-- 简历 Hero：姓名、角色、数据名片、联系方式 -->
        <div class="about-hero">
          <div class="hero-main">
            <div class="hero-titles">
              <h1 class="hero-name">{{ $config.title }}</h1>
              <p class="hero-role">3D 研发工程师 / 虚拟仿真系统架构</p>
              <p class="hero-tagline">{{ $config.subtitle }}</p>
            </div>
            <div class="hero-actions">
              <a
                v-if="$config.aboutOpts.resume && $config.aboutOpts.resume.url"
                class="hero-resume btn cursor"
                :href="$config.aboutOpts.resume.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i class="icon icon-inbox"></i> {{ $config.aboutOpts.resume.label }}
              </a>
              <div class="contact-bar">
                <a
                  v-for="item in $config.contactOpts.list"
                  :key="item.name"
                  :href="item.link"
                  :title="item.name"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img :alt="item.name" :src="item.icon" />
                </a>
              </div>
            </div>
          </div>

          <div class="hero-stats">
            <div v-for="(stat, i) in highlights" :key="i" class="stat-card">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <div class="content">
          <!-- 技能专长：分组关键词卡片（进度条仅应届生；3 年+ 用分组更专业） -->
          <Segment v-if="rd.skills && rd.skills.length" :title="'技能专长'" :color="c(3)">
            <div class="skill-groups">
              <div v-for="(g, i) in rd.skills" :key="i" class="skill-group">
                <div class="group-header" :style="{ color: c(3) }">
                  <span class="dot">◦</span>{{ g.group }}
                </div>
                <div class="group-chips">
                  <span
                    v-for="(item, ii) in g.items"
                    :key="ii"
                    class="chip"
                    :style="{ borderColor: c(3) + '33', color: c(3) }"
                    >{{ item }}</span
                  >
                </div>
              </div>
            </div>
          </Segment>

          <!-- 结构化简历区段（来自 config.resumeData，空数组不渲染） -->
          <Segment v-if="rd.education.length" :title="'教育经历'" :color="c(0)">
            <div class="timeline">
              <div v-for="(e, i) in rd.education" :key="i" class="timeline-item">
                <div class="period-tag" :style="{ borderColor: c(0), color: c(0) }">{{ e.period }}</div>
                <div class="detail">
                  <div class="title-wrap">
                    <div class="company">{{ e.school }}</div>
                    <div class="role">{{ e.major }} · {{ e.degree }}</div>
                  </div>
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
                <div class="period-tag" :style="{ borderColor: c(1), color: c(1) }">{{ w.period }}</div>
                <div class="detail">
                  <div class="title-wrap">
                    <div class="company">{{ w.company }}</div>
                    <div class="role">{{ w.position }}</div>
                  </div>
                  <ul v-if="descLines(w.desc).length" class="desc-list">
                    <li v-for="(line, li) in descLines(w.desc)" :key="li" v-html="boldHtml(line)"></li>
                  </ul>
                  <div v-if="w.stacks && w.stacks.length" class="chips">
                    <span
                      v-for="(s, si) in w.stacks"
                      :key="si"
                      class="chip"
                      :style="{ borderColor: c(1) + '33', color: c(1) }"
                      >{{ s }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </Segment>

          <Segment v-if="projectsData.length" :title="'项目经历'" :color="c(2)">
            <div class="timeline">
              <div v-for="(p, i) in projectsData" :key="i" class="timeline-item">
                <div class="period-tag" :style="{ borderColor: c(2), color: c(2) }">{{ p.period }}</div>
                <div class="detail">
                  <div class="title-wrap">
                    <div class="company">{{ p.name }}</div>
                    <div v-if="p.role" class="role">{{ p.role }}</div>
                  </div>
                  <ul v-if="descLines(p.desc).length" class="desc-list">
                    <li v-for="(line, li) in descLines(p.desc)" :key="li" v-html="boldHtml(line)"></li>
                  </ul>
                  <div
                    v-if="(p.worksLink && p.worksLink.trim()) || (p.videoLink && p.videoLink.trim())"
                    class="project-links"
                  >
                    <router-link
                      v-if="p.worksLink && p.worksLink.trim()"
                      :to="p.worksLink.trim()"
                      class="btn-link"
                      :style="{ '--accent': c(2) }"
                    >
                      查看作品页
                    </router-link>
                    <a
                      v-if="p.videoLink && p.videoLink.trim() && p.videoLink !== p.worksLink"
                      :href="p.videoLink.trim()"
                      target="_blank"
                      rel="noopener"
                      class="btn-link"
                      :style="{ '--accent': c(2) }"
                    >
                      观看成果视频
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Segment>

          <Segment v-if="rd.awards.length" :title="'获奖证书'" :color="c(4)">
            <div class="awards">
              <div v-for="(a, i) in rd.awards" :key="i" class="award-item">
                <span class="period-tag" :style="{ borderColor: c(4), color: c(4) }">{{ a.period }}</span>
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
      return this.rd.projects && this.rd.projects.length ? this.rd.projects : []
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
        .map((s) =>
          s
            .replace(/^\s*[\u00b7\u2022\u25CF\-*]+\s*/, '')
            .replace(/^\s*\d+[\.、\)]\s*/, '')
            .trim()
        )
        .filter(Boolean)
    },
    // 轻量行内富文本：**加粗** → <b>、`代码` → <code>（仅处理已在 config 里使用的语法）
    // 输入仅来自站长 config / Issue，信任边界安全
    boldHtml(line) {
      return String(line)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*([^*]+?)\*\*/g, '<b>$1</b>')
        .replace(/`([^`]+?)`/g, '<code>$1</code>')
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
