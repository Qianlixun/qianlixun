<template>
  <div id="post">
    <Transition name="fade-transform" mode="out-in">
      <article v-if="post">
        <div class="post-header">
          <Cover :src="post.cover.src" :alt="post.cover.title" loadCover maskHeight="0.8rem" />
          <div class="post-head">
            <div class="post-title">
              <h1>{{ post.title }}</h1>
              <span>{{ post.cover.title }}</span>
            </div>
            <div class="post-meta">
              <span>
                <i class="icon icon-calendar"></i>
                {{ post.created_at }}
              </span>
              <span>
                <i class="icon icon-bookmark-empty"></i>
                {{ post.milestone ? post.milestone.title : '未分类' }}
              </span>
              <span>
                <i class="icon icon-tag"></i>
                <span v-for="label in post.labels" :key="label.id">{{ label.name }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="post-body">
          <MarkDown :content="post.body" target="#post" />
        </div>
        <!-- 项目资源：视频演示（B站嵌入）与源码下载（软限制） -->
        <ProjectResource :project="projectResource" />
      </article>
      <Loading v-else />
    </Transition>

    <Comment v-if="initComment" :title="post.title" />
  </div>
</template>

<script>
import MarkDown from '@/components/MarkDown'
import Loading from '@/components/Loading'
import Comment from '@/components/Comment'
import Cover from '@/components/Cover'
import ProjectResource from '@/components/ProjectResource'

export default {
  name: 'Post',
  components: {
    MarkDown,
    Loading,
    Comment,
    Cover,
    ProjectResource,
  },
  data() {
    return {
      post: '',
      initComment: false,
    }
  },
  computed: {
    // 从 config.projectResources 取当前项目的资源映射（repo/bvid）
    projectResource() {
      if (!this.post) return {}
      return (this.$config.projectResources || {})[this.post.number] || {}
    },
  },
  async created() {
    const { number, post } = this.$route.params
    if (post) {
      this.post = post
    } else {
      await this.queryPost(number)
    }
    this.$nextTick(() => {
      this.initComment = true
    })
  },
  methods: {
    // 获取文章详情
    async queryPost(number) {
      this.post = await this.$store.dispatch('queryPost', { number })
    },
  },
}
</script>

<style lang="scss" scope>
@import './index.scss';
</style>
