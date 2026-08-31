<template>
  <div v-if="project" class="project-resource">
    <div class="pr-head">
      <i class="icon icon-folder"></i>
      <span>项目资源</span>
    </div>
    <!-- HLS 多视频播放（推荐）：project.hls = [{name, src}] -->
    <div v-if="hlsVideos.length" class="video-hls">
      <video ref="hlsVideo" controls preload="metadata" crossorigin="anonymous"></video>
      <div v-if="hlsVideos.length > 1" class="hls-playlist">
        <button
          v-for="(v, i) in hlsVideos"
          :key="i"
          class="hls-track"
          :class="{ active: i === activeHlsIdx }"
          @click="switchHls(i)"
        >
          {{ v.name }}
        </button>
      </div>
    </div>
    <!-- 兼容旧版：本地 mp4 单视频（可在线播 + 可下载） -->
    <div v-else-if="project.mp4" class="video mp4">
      <video :src="project.mp4" controls preload="metadata"></video>
    </div>
    <!-- 兼容旧版：B 站外链 -->
    <div v-else-if="project.bvid" class="video">
      <iframe
        :src="`https://player.bilibili.com/player.html?bvid=${project.bvid}&page=1&high_quality=1&danmaku=0`"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
      ></iframe>
    </div>
    <a
      v-if="project.mp4"
      class="btn cursor video-download"
      :href="project.mp4"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i class="icon icon-inbox"></i> 下载演示视频
    </a>
    <!-- 源码下载：zip 压缩包直链优先，否则公开仓库默认分支 zip -->
    <div v-if="sourceUrl" class="download">
      <a class="btn cursor" :href="sourceUrl" target="_blank" rel="noopener noreferrer">
        <i class="icon icon-gift"></i> 下载源码
      </a>
    </div>
  </div>
</template>

<script>
// 项目资源展示：HLS 多视频（首选）/ 本地 mp4 / B 站外链 + 公开仓库源码下载
// HLS 段切分见 .workbuddy/redesign/src/hls-split-upload.mjs；hls.js 动态 import 不进首屏
let Hls = null // ponytail: 模块级缓存避免重复加载（单例足够，多组件实例共享）
export default {
  name: 'ProjectResource',
  props: {
    project: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      downloadUrl: '',
      activeHlsIdx: 0,
      hlsInstance: null,
    }
  },
  computed: {
    sourceUrl() {
      return this.project.zip || this.downloadUrl
    },
    hlsVideos() {
      return Array.isArray(this.project.hls) ? this.project.hls : []
    },
  },
  async mounted() {
    if (this.project.repo && !this.project.zip) await this.fetchRepo()
    // HLS 首个视频自动加载
    if (this.hlsVideos.length) {
      await this.ensureHls()
      this.loadHls(0)
    }
  },
  beforeUnmount() {
    this.destroyHls()
  },
  methods: {
    async ensureHls() {
      if (Hls) return
      const mod = await import('hls.js')
      Hls = mod.default
    },
    loadHls(idx) {
      const video = this.$refs.hlsVideo
      if (!video || !Hls) return
      this.destroyHls()
      const src = this.hlsVideos[idx]?.src
      if (!src) return
      // Safari 原生支持 HLS
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
        return
      }
      // 其他浏览器用 hls.js
      if (Hls.isSupported()) {
        const hls = new Hls({ maxBufferLength: 30, maxMaxBufferLength: 60 })
        hls.loadSource(src)
        hls.attachMedia(video)
        this.hlsInstance = hls
      }
    },
    switchHls(idx) {
      if (idx === this.activeHlsIdx) return
      this.activeHlsIdx = idx
      this.loadHls(idx)
    },
    destroyHls() {
      if (this.hlsInstance) {
        this.hlsInstance.destroy()
        this.hlsInstance = null
      }
    },
    async fetchRepo() {
      const { username } = this.$config
      const repo = this.project.repo
      try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repo}`)
        const data = await res.json()
        this.downloadUrl = `https://github.com/${username}/${repo}/archive/refs/heads/${
          data.default_branch || 'main'
        }.zip`
      } catch (e) {
        this.downloadUrl = `https://github.com/${username}/${repo}/archive/refs/heads/main.zip`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.project-resource {
  margin: 1.5rem 0 0.5rem;
  padding: 18px 20px 20px;
  border-radius: $radius;
  border: 1px solid $border-soft;
  background-color: $surface;
  box-shadow: $card-shadow-light;

  .pr-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    font-size: $font-size-large;
    font-weight: $font-weight-bold;
    color: $text-color;

    .icon {
      color: $purple-deep;
    }

    &::before {
      content: '';
      width: 4px;
      height: 18px;
      border-radius: $radius-pill;
      background-image: $gradient-primary;
    }
  }

  .video {
    position: relative;
    width: 100%;
    padding-top: 56.25%; // 16:9
    margin-bottom: 1rem;
    border-radius: $radius;
    overflow: hidden;
    box-shadow: $shadow-2;
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
  }

  // HLS 多视频：video 占满 + 下方播放列表
  .video-hls {
    margin-bottom: 1rem;
    video {
      display: block;
      width: 100%;
      max-height: 480px;
      background: #000;
      border-radius: $radius;
    }
    .hls-playlist {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .hls-track {
      padding: 6px 14px;
      border-radius: $radius-pill;
      border: 1px solid $border-soft;
      background: rgba($purple, 0.04);
      color: $text-color;
      font-size: $font-size-small;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        border-color: rgba($purple, 0.5);
        color: $purple-deep;
      }
      &.active {
        background-image: $gradient-primary;
        border-color: transparent;
        color: #18181c; // 金底深字
      }
    }
  }

  // 本地 mp4：载入即占满，不套 16:9 容块
  .video.mp4 {
    padding-top: 0;
    background: #000;
    video {
      display: block;
      width: 100%;
      max-height: 480px;
      background: #000;
    }
  }

  .video-download {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 20px;
    margin-bottom: 1rem;
    border-radius: $radius-pill;
    border: 1px solid rgba($purple, 0.4);
    color: $purple-deep;
    background: rgba($purple, 0.06);
    font-size: $font-size-normal;
    transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-2;
      opacity: 0.95;
    }
    .icon {
      font-size: $font-size-normal;
    }
  }

  .download {
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      border-radius: $radius-pill;
      background-image: $gradient-primary;
      color: #18181c; // 金底深字
      font-size: $font-size-normal;
      box-shadow: $shadow-1;
      transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-2;
        opacity: 0.95;
      }
      .icon {
        font-size: $font-size-normal;
      }
    }
  }
}
</style>
