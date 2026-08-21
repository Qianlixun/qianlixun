<template>
  <footer>
    <div class="site-info">
      <p>
        <i class="icon icon-copyright"></i>2016-2027
        <i class="icon icon-heart"></i>
        {{ $config.title }}
      </p>
      <p>
        Theme -
        <a rel="noopener noreferrer" target="_blank" href="https://github.com/Qianlixun/qianlixun">千里寻</a>
        | {{ $config.subtitle }}
      </p>
    </div>
    <img
      v-if="!$isMobile.value"
      class="sakura cursor"
      :src="sakura"
      @click="dropPanel"
      alt="sakura"
    />
  </footer>
</template>

<script>
import images from '@/assets/images'

const { sakura } = images

export default {
  name: 'Footer',
  data() {
    return {
      sakura,
    }
  },
  methods: {
    dropPanel() {
      this.$store.commit('setShowPanel', true)
    },
  },
}
</script>

<style lang="scss" scope>
@import './index.scss';
</style>
