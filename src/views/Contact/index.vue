<template>
  <div id="contact">
    <Transition name="fade-transform" mode="out-in">
      <div class="page">
        <Quote :quote="$config.contactOpts.qoute" />
        <div class="content">
          <header class="contact-hero" data-aos="fade-up">
            <i class="icon icon-link hero-icon"></i>
            <h2>{{ $config.contactOpts.heading }}</h2>
            <p>{{ $config.contactOpts.intro }}</p>
          </header>

          <div class="contact-grid">
            <a
              v-for="(item, i) in $config.contactOpts.list"
              :key="item.name"
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-card cursor"
              data-aos="fade-up"
              :data-aos-delay="i * 60"
            >
              <img :src="item.icon" :alt="item.name" />
              <span class="contact-name">{{ item.name }}</span>
              <span class="contact-desc">{{ item.desc }}</span>
            </a>
          </div>

          <div class="mail-cta" data-aos="fade-up">
            <a class="btn cursor" :href="$config.contactOpts.mail"> <i class="icon icon-pencil"></i> 给我写邮件 </a>
            <p class="mail-note">合作交流、技术咨询或只是打个招呼，都会认真回复</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import AOS from 'aos'
import Quote from '@/components/Quote'

export default {
  name: 'Contact',
  components: {
    Quote,
  },
  mounted() {
    AOS.init({ duration: 800, easing: 'ease', debounceDelay: 50, throttleDelay: 100, offset: 40 })
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
