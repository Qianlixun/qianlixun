<template>
  <div id="gitalk" />
</template>

<script>
// gitalk 样式随本组件（懒加载视图）走，避免入口静态依赖 comment-libs 大 chunk
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

export default {
  name: 'Comment',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.renderGitalk()
  },
  methods: {
    renderGitalk() {
      const gitalk = new Gitalk({
        ...this.$config.gitalk,
        title: this.title,
      })
      gitalk.render('gitalk')
    },
  },
}
</script>
