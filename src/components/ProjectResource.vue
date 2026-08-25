<template>
  <div v-if="project" class="project-resource">
    <div class="pr-head">
      <i class="icon icon-folder"></i>
      <span>项目资源</span>
    </div>
    <!-- 视频演示：B 站外链嵌入播放 -->
    <div v-if="project.bvid" class="video">
      <iframe
        :src="`https://player.bilibili.com/player.html?bvid=${project.bvid}&page=1&high_quality=1&danmaku=0`"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
      ></iframe>
    </div>
    <!-- 源码下载：软限制，登录后才显示入口 -->
    <div v-if="project.repo" class="download">
      <a v-if="logged && downloadUrl" class="btn cursor" :href="downloadUrl" target="_blank" rel="noopener noreferrer">
        <i class="icon icon-download"></i> 下载源码
      </a>
      <button v-else-if="!logged" class="btn cursor" @click="doLogin">
        <i class="icon icon-github"></i> 登录 GitHub 后下载
      </button>
    </div>
  </div>
</template>

<script>
// 项目资源展示：B 站视频嵌入 + 公开仓库源码下载（软限制）
import { isLogged, login } from '@/utils/auth'

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
      logged: isLogged(),
      downloadUrl: '',
    }
  },
  async created() {
    if (this.logged && this.project.repo) await this.fetchRepo()
  },
  methods: {
    doLogin() {
      login()
    },
    // 获取仓库默认分支，构造 zip 下载地址
    async fetchRepo() {
      const { username } = this.$config
      try {
        const res = await fetch(`https://api.github.com/repos/${username}/${this.project.repo}`)
        const data = await res.json()
        this.downloadUrl = `https://github.com/${username}/${this.project.repo}/archive/refs/heads/${data.default_branch}.zip`
      } catch (e) {
        console.log(e)
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
