import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import Axios from 'axios'

Vue.use(VueRouter)
Vue.use(VueCookies)

const _import = path => require('@/components/' + path + '.vue').default
// const _import = resolve => require(['@/components/' + resolve], resolve)

// 全局路由(无需嵌套)
const globalRoutes = [
  /* 404页面 */
  {
    path: '/404',
    component: _import('404'),
    name: '404',
    meta: { title: '404' }
  },
  /* 登录页面 */
  {
    path: '/',
    name: 'login',
    component: _import('login-def'),
    meta: {
      'title': '登录页'
    }
  },
  /* 系统主页 */
  {
    path: '/portal',
    name: 'portal',
    component: _import('portal-def'),
    meta: {
      header: true
    }
  }
]
// 主入口路由(需嵌套整体布局页面)
const mainRoutes = {
  path: '/', component: _import('login-def'), name: 'login', children: []
}

// 实例化
const router = new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  loaded: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

/* ============================================================== */
/* https://router.vuejs.org/zh/installation.html                  */
/* https://www.cnblogs.com/WQLong/p/8135553.html                  */
/* https://www.cnblogs.com/Jimc/p/10275201.html                   */
/* 1.Vue.beforeEach(function(to,form,next){})                     */
/* 2.Vue.afterEach(function(to,form))                             */
/* ============================================================== */
router.beforeEach((to, from, next) => {
  // console.log(to,'query:');
  // 如果访问路由是登录界面
  if (to.path === '/client') {
    // console.log(JSON.stringify(to.query));
    // console.log(document.cookie);
    const token = to.query.token
    if (token && to.query.target) {
      // console.log(to.query.target);
      setStorage('token', token)
      // 请求单点登录接口
      Axios.get('/api/jeebiz-authz/authz/login/detail', {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token || ''
        },
        timeout: 60000 // 超时时间 1分钟
      }).then((res) => {
        // console.error(res);
        if (res.data.code === 0) {
          const data = res.data.data
          // console.error(data);
          data.profile = data.profile || {}
          data.profile.info = data.profile.info || {}
          setStorage('profile', data.profile)
        }
      }).catch((error) => {
        console.error(error)
      }).finally(() => {
        // 执行路由跳转方法
        next({
          path: to.query.target
        })
      })
    } else {
      // 请求单点登录接口
      Axios.get('/api/jeebiz-authz/authz/login/pac4j', {
        params: Object.assign({
          'client_name': '',
          'uid': ''
        }, to.query),
        headers: {
          platform: 'web'
        }
      }).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.data
          // console.error(data);
          data.profile = data.profile || {}
          data.profile.info = data.profile.info || {}
          setStorage('profile', data.profile)
          setStorage('token', data.token)
        }
      }).catch((error) => {
        console.error(error)
      }).finally(() => {
        // 执行路由跳转方法
        next({
          path: to.query.target
        })
      })
    }
  } else if (to.path === '/portal') {
    // 如果启用了记住我，则进行相关数据的检查
    if (this.$cookies.isKey('remember-me') && this.$cookies.isKey('token') && this.$cookies.isKey('router') && this.$cookies.get('remember-me') === true) {
      setStorage('token', this.$cookies.get('token'))
      setStorage('profile', JSON.stringify(this.$cookies.get('profile')))
      setStorage('router', JSON.stringify(this.$cookies.get('router'))) // 存储路由到localStorage
      // 动态添加路由
      mainRoutes.children = mapRouter(getStorage('router'))
      router.addRoutes(mainRoutes)
      router.options.loaded = true
    }

    // 判断是否已经添加动态路由,或者当前为全局路由的时候。 直接访问
    if (router.options.loaded || isGlobalRoutes(to)) {
      // 执行路由跳转方法
      routerGo(to, from, next)
    } else {
      // 添加动态(菜单)路由
      if (!getStorage('router')) {
        Axios.get('/api/jeebiz-servmgt/serv/info/list', {
          // params:{id:this.kemuid},
          headers: {
            token: this.$cookies.get('token'),
            platform: 'web'
          }
        }).then((res) => {
          console.log(res)
          setStorage('router', JSON.stringify(res.data)) // 存储路由到localStorage
          // 动态添加路由
          mainRoutes.children = mapRouter(res.data)
          router.addRoutes([
            mainRoutes, {
              path: '404',
              name: '404',
              redirect: '/404'}
          ])
          router.options.isAdd = true
          // 执行路由跳转方法
          routerGo(to, from, next)
        }).catch((error) => {
          console.error(error)
        })
      } else {
        // 从localStorage拿到了路由
        const	routers = JSON.parse(getStorage('router')) // 拿到路由
        // 动态添加路由
        mainRoutes.children = mapRouter(routers)
        router.addRoutes([
          mainRoutes, {
            path: '404',
            name: '404',
            redirect: '/404'}
        ])
        router.options.isAdd = true
        // 执行路由跳转方法
        routerGo(to, from, next)
      }
    }
  } else {
    // 执行路由跳转方法
    return routerGo(to, from, next)
  }
})

// 判断当前是否全局路由
function isGlobalRoutes (to) {
  for (let i in globalRoutes) {
    if (globalRoutes[i].path === to.path) {
      return true
    }
  }
  return false
}

function routerGo (to, from, next) {
  // 如果访问路由是登录界面
  if (to.path === '/login') {
    // 获取本地存储的Token
    let token = localStorage.getItem('token')
    // Token 存在则进入页面
    if (token) {
      return next({
        path: from.fullPath
      })
    } else {
      // 执行路由跳转方法
      return next({ ...to, replace: true })
    }
  }
  // 检查当前路由是否需要登录
  if (to.meta.authc) {
    // 获取本地存储的Token
    let token = getStorage('token')
    // Token 存在则进入页面
    if (token) {
      return next()
    } else {
      // Token 不存在,需要登录授权
      return next({
        path: '/login' // 指向为你的登录界面
      })
    }
  } else {
    return next({ ...to, replace: true })
  }
}

function setStorage (name, data) { // localStorage 存储对象的方法
  sessionStorage.setItem(name, data)
}

function getStorage (name) { // localStorage 获取对象的方法
  return sessionStorage.getItem(name)
}

function mapRouter (routerMap) {
  const accessedRouters = routerMap.filter(route => {
    if (route.component) {
      route.component = _import(route.component || route.path)
    }
    route.meta = {
      authc: route.authc !== 'none',
      status: route.status,
      header: true
    }
    if (route.children && route.children.length) {
      route.children = mapRouter(route.children)
    }
    return true
  })
  return accessedRouters
}

export default router
