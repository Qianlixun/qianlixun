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
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
