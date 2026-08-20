<template>
  <!-- 原生 aplayer 挂载容器；class 等透传属性由 Vue3 自动继承到根节点 -->
  <div ref="container"></div>
</template>

<script>
// 原 @moefe/vue-aplayer 仅支持 Vue2，这里用原生 aplayer 包一层，API 尽量保持兼容：
// 支持 audio / fixed / mini / preload 属性，并在 mini 状态变化时 emit update:mini
import APlayer from 'aplayer'
import 'aplayer/dist/APlayer.min.css'

export default {
  name: 'APlayer',
  props: {
    audio: { type: [Array, Object], required: true },
    fixed: Boolean,
    mini: Boolean,
    preload: { type: String, default: 'none' },
  },
  mounted() {
    this.player = new APlayer({
      container: this.$refs.container,
      audio: this.audio,
      fixed: this.fixed,
      mini: this.mini,
      preload: this.preload,
    })
    // 部分 aplayer 版本会派发 updatemini 事件，用于与 Footer 的 isMini 双向同步
    if (this.player && typeof this.player.on === 'function') {
      this.player.on('updatemini', (isMini) => this.$emit('update:mini', isMini))
    }
  },
  beforeUnmount() {
    if (this.player && typeof this.player.destroy === 'function') {
      this.player.destroy()
    }
  },
}
</script>
