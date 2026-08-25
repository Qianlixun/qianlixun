<template>
  <div v-if="project" class="project-resource">
    <div class="pr-head">
      <i class="icon icon-folder"></i>
      <span>项目资源</span>
    </div>
    <!-- 视频演示：本地 mp4（可在线播 + 可下载）或 B 站外链二选一 -->
    <div v-if="project.mp4" class="video mp4">
      <video :src="project.mp4" controls preload="metadata"></video>
    </div>
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
    <!-- 源码下载：公开仓库 zip 直链 -->
    <div v-if="project.repo && downloadUrl" class="download">
      <a class="btn cursor" :href="downloadUrl" target="_blank" rel="noopener noreferrer">
        <i class="icon icon-gift"></i> 下载源码
      </a>
    </div>
  </div>
</template>

<script>
// 项目资源展示：B 站视频嵌入 + 公开仓库源码下载
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
    }
  },
  async created() {
    if (this.project.repo) await this.fetchRepo()
  },
  methods: {
    // 获取仓库默认分支，构造 zip 下载地址；api 不可达时兜底 main 分支
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

<style lang="scss" scope>
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
      color: white;
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
