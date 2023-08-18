import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    theme: '20a0ff', // 默认为20a0ff
    token: sessionStorage.getItem('token'),
    profile: sessionStorage.getItem('profile'),
    permissions: []
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
    logout (state) {
      state.token = ''
      state.profile = ''
      state.permissions = []
    }
  },
  actions: {
    setPermissions: ({commit}, permissions) => commit('permissions', permissions),
    setToken: ({commit}, token) => commit('token', token),
    setProfile: ({commit}, profile) => commit('profile', profile)
  },
  getters: {
    getPermissions: state => state.permissions,
    getToken: state => state.token,
    getProfile: state => state.profile
  }
})
export default store
