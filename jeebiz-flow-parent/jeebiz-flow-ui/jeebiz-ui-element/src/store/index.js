import Vue from 'vue'
import Vuex from 'vuex'
import VueXAlong from 'vuex-along'
// https://www.cnblogs.com/webtaotao/p/11361868.html

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    theme: '20a0ff', // 默认为20a0ff
    token: sessionStorage.getItem('token'),
    profile: sessionStorage.getItem('profile'),
    permissions: [],
    settings: {}
  },
  mutations: {
    setTheme (state, theme) {
      state.theme = theme
    },
    setToken (state, token) {
      state.token = token
    },
    setProfile (state, profile) {
      state.profile = profile
    },
    setPermissions (state, permissions) {
      state.permissions = permissions
    },
    setSettings (state, settings) {
      state.settings = settings
    },
    logout (state) {
      state.token = ''
      state.profile = ''
      state.permissions = []
    }
  },
  actions: {
    setPermissions: ({commit}, permissions) => commit('permissions', permissions),
    setToken: ({commit}, token) => commit('token', token),
    setProfile: ({commit}, profile) => commit('profile', profile),
    setSettings: ({commit}, settings) => commit('settings', settings)
  },
  getters: {
    getPermissions: state => state.permissions,
    getToken: state => state.token,
    getProfile: state => state.profile,
    getSettings: state => state.settings

  },
  plugins: [VueXAlong({
    name: 'along', // 存放在localStroage或者sessionStroage 中的名字
    local: false, // 是否存放在local中  false 不存放 如果存放按照下面session的配置配
    session: { list: [], isFilter: true } // 如果值不为false 那么可以传递对象 其中 当isFilter设置为true时， list 数组中的值就会被过滤调,这些值不会存放在seesion或者local中
  })]
})
export default store
