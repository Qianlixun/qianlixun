<template>
  <article class="project-card" data-aos="fade-up">
    <router-link :to="{ name: 'post', params: { number: post.number, post } }">
      <div class="card-cover">
        <Cover :src="post.cover.src" :alt="post.cover.title" :loadCover="loadCover" @loadNext="$emit('loadNext')" />
        <span class="badge"><i class="icon icon-star"></i>作品</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ post.title }}</h3>
        <div class="card-excerpt">
          <!-- ponytail: 摘要已剥掉 markdown 语法，纯文本输出即可，
               不引入 MarkDown 渲染器（marked/katex/highlight）污染列表页 bundle -->
          <span class="excerpt-text">{{ excerpt }}</span>
        </div>
        <div class="card-actions">
          <span v-if="resource.bvid" class="act-btn">
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
              <path fill="currentColor" d="M3 2v8l7-4z" /></svg
            >视频演示
          </span>
          <span v-if="resource.repo" class="act-btn"><i class="icon icon-gift"></i> 源码归档</span>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script>
import Cover from '@/components/Cover'
import config from '@/config'

export default {
  name: 'ProjectCard',
  components: { Cover },
  props: {
    post: {
      type: Object,
      required: true,
    },
    loadCover: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['loadNext'],
  computed: {
    // 从 config.projectResources 取该项目的资源映射（repo/bvid）
    resource() {
      return (config.projectResources || {})[this.post.number] || {}
    },
    excerpt() {
      const s = String(this.post.description || '')
        .replace(/[#>*_`[\]()!\n]/g, ' ')
        .trim()
      return s.length > 90 ? s.slice(0, 90) + '…' : s
    },
  },
}
</script>

<style lang="scss" scoped>
.project-card {
  border-radius: $radius;
  border: 1px solid $border-soft;
  overflow: hidden;
  background: $surface;
  box-shadow: $shadow-1;
  transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.4s;

  > a {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: $shadow-3;

    .card-cover :deep(img) {
      transform: scale(1.06);
    }
  }

  .card-cover {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: $gradient-soft;

    :deep(.wrapper),
    :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.6, 0.2, 0.1, 1);
    }

    .badge {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      font-size: $font-size-small;
      color: white;
      border-radius: $radius-pill;
      background-image: $gradient-primary;
      box-shadow: $shadow-1;
    }
  }

  .card-body {
    padding: 14px 16px 16px;
  }

  .card-title {
    margin: 0 0 6px;
    font-size: $font-size-large;
    font-weight: $font-weight-bold;
    color: $text-color;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-excerpt {
    min-height: 3.4em;
    margin-bottom: 12px;
    color: $text-secondary;
    font-size: $font-size-base;
    line-height: 1.65;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .act-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 12px;
    font-size: $font-size-small;
    color: $purple-deep;
    border-radius: $radius-pill;
    background: rgba($purple, 0.1);
    border: 1px solid rgba($purple, 0.25);

    .icon {
      font-size: $font-size-small;
    }
  }
}
</style>
