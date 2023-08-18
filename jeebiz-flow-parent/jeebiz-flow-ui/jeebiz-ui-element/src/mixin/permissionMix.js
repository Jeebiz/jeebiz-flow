import { mapGetters, mapMutations } from 'vuex'
export default {
  created () {
    console.log('permissionMix inited.')
  },
  computed: {
    ...mapGetters([
      'getTheme',
      'getToken',
      'getProfile',
      'getPermissions',
      'getSettings'
    ])
  },
  data () {
    return {

    }
  },
  methods: {
    stringToArray (string) {
      return string ? string.split(',') : ''
    },
    getTheme () {
      return this.getTheme || '20a0ff'
    },
    getToken () {
      return this.getToken || ''
    },
    getProfile () {
      return this.getProfile || {}
    },
    hasPermission (perm) {
      let perms = this.getPermissions || []
      console.log('perms', perms)
      return perms.includes(perm)
      // return this.stringToArray(sessionStorage.getItem("permission")).includes(id)
    },
    hasAnyPermission (permArr) {
      let perms = this.getPermissions || []
      console.log('perms', perms)
      for (const i in permArr) {
        if (perms.includes(permArr[i])) {
          return true
        }
      }
      return false
      // return this.stringToArray(sessionStorage.getItem("permission")).includes(id)
    },
    hasPermissions (permArr) {
      let perms = this.getPermissions || []
      console.log('perms', perms)
      for (const i in permArr) {
        if (!perms.includes(permArr[i])) {
          return false
        }
      }
      return true
      // return this.stringToArray(sessionStorage.getItem("permission")).includes(id)
    },
    ...mapMutations([
      'setTheme',
      'setToken',
      'setProfile',
      'setPermissions',
      'logout'
    ])
  }
}
