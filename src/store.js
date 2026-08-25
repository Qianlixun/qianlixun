import { createStore } from 'vuex'
import {
  queryArchivesCount,
  queryFilterArchivesCount,
  queryPosts,
  queryPost,
  queryTag,
  queryCategory,
  queryPage,
  queryLife,
} from './utils/services'
import { formatPost, formatCategory, formatPage } from './utils/format'

let tipsTimer = ''

export default createStore({
  state: {
    tips: '',
    tipsUpdateAt: '',
    totalCount: 0,
    tags: null, // 标签列表（首次访问时拉取）
  },
  mutations: {
    // 设置一言
    setTips(state, tips) {
      state.tips = tips
      state.tipsUpdateAt = new Date()
    },
    // 设置文章总数
    setTotalCount(state, totalCount) {
      state.totalCount = totalCount
    },
    // 设置标签列表
    setTags(state, tags) {
      state.tags = tags || []
    },
  },
  actions: {
    // 显示一言
    async showTips({ commit }, { tips }) {
      clearTimeout(tipsTimer)
      commit('setTips', tips)
      tipsTimer = setTimeout(() => {
        commit('setTips', '')
      }, 6000)
    },
    // 获取文章总数
    async queryArchivesCount({ commit }) {
      const data = await queryArchivesCount()
      // 仓库缺失/API 异常时 GraphQL 返回 repository=null，兜底为 0
      commit('setTotalCount', data?.repository?.issues?.totalCount || 0)
    },
    // 获取分类 & 标签筛选文章数量（REST 计数，已弃用 GraphQL）
    async queryFilterArchivesCount(context, payload) {
      return await queryFilterArchivesCount(payload)
    },
    // 获取归档
    async queryPosts(context, payload) {
      const data = await queryPosts(payload)
      ;(data || []).forEach((p) => {
        try {
          formatPost(p)
        } catch (e) {
          console.warn('formatPost fail', p?.number, e)
        }
      })
      return data || []
    },
    // 获取文章详情
    async queryPost(context, { number }) {
      const post = await queryPost(number)
      return formatPost(post)
    },
    // 获取分类
    async queryCategory() {
      const data = await queryCategory()
      return formatCategory(data || [])
    },
    // 获取标签
    async queryTag({ commit }) {
      const data = await queryTag()
      // 过滤非文章类标签（历史板块与生活标签不进标签云）
      const filterLabel = ['Inspiration', 'Friend', 'Book', 'About', 'Life']
      const tags = (data || []).filter((o) => !filterLabel.includes(o.name))
      commit('setTags', tags)
      return tags
    },
    // 获取书单 & 友链 & 关于
    async queryPage(context, { type }) {
      const data = await queryPage(type)
      return formatPage(data, type)
    },
    // 获取生活记事（私有仓库 + 用户 token，见 services.queryLife）
    async queryLife(context, { token }) {
      return await queryLife(token)
    },
  },
})
