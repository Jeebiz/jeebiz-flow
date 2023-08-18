import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import Axios from 'axios'

Vue.use(VueRouter)
Vue.use(VueCookies)

const _import = path => require('@/components/' + (path.indexOf('/') === 0 ? path.substring(1) : path) + '.vue').default
// const _import = resolve => require(['@/components/' + resolve], resolve)
const showHeader = true
const currentStyle = '2'

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
    path: '/login',
    name: 'login',
    component: _import('login-def'),
    meta: {
      title: '登录页',
      style: currentStyle
    }
  },
  // 不存在的路由重定向到404
  {
    path: '*',
    redirect: '/404'
  }
]

// 主入口路由(需嵌套整体布局页面)
const mainRoutes = [
  /* 系统主页 */
  {
    path: '/portal',
    name: 'portal',
    component: _import('portal-def'),
    meta: {
      header: false,
      style: currentStyle
    }
  }

]

// 实例化
const createRouter = () => new VueRouter({
  base: '/web/',
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  loaded: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

const router = createRouter()

export function resetRouter () {
  console.log('reset Router begin')
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
  router.options.loaded = false
  console.log('reset Router end')
}

/* ============================================================== */
/* https://router.vuejs.org/zh/installation.html                  */
/* https://www.cnblogs.com/WQLong/p/8135553.html                  */
/* https://www.cnblogs.com/Jimc/p/10275201.html                   */
/* 1.Vue.beforeEach(function(to,form,next){})                     */
/* 2.Vue.afterEach(function(to,form))                             */
/* ============================================================== */
router.beforeEach((to, from, next) => {
  const logined = getStorage('token') !== null
  // console.log(to,'query:');
  // 如果访问路由是登录界面
  if (to.path === '/client') {
    // console.log(JSON.stringify(to.query));
    // console.log(document.cookie);
    const token = to.query.token
    const proxy = to.query.proxy || false
    console.log(proxy, 'proxy')
    // 当 to.query.proxy 的值不为false,表示该请求是由后台重定向过来的认证代理，此时的token为后台代理生成
    if (token && (proxy === 'true' || proxy === true) && to.query.target) {
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
        if (res.data.code === '0' || res.data.code === 0) {
          const data = res.data.data
          // console.error(data);
          data.profile = data.profile || {}
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
      // 第三方认证跳转，将直接请求认证接口进行认证对接
      Axios.get('/api/jeebiz-authz/authz/login/pac4j', {
        params: Object.assign({ 'client_name': '' }, to.query),
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 60000 // 超时时间 1分钟
      }).then((res) => {
        if (res.data.code === '0' || res.data.code === 0) {
          const data = res.data.data
          // console.error(data);
          data.profile = data.profile || {}
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
  }
  // 访问根路径并且已经登录，则直接进行跳转
  else if (to.path === '/') {
    if (logined === true) {
      next({
        path: '/portal'
      })
    } else {
      next({
        path: '/login'
      })
    }
  }
  // 如果访问路由是登录界面
  else if (to.path === '/login') {
    console.log('clear sessionStorage begin')
    sessionStorage.removeItem('router')
    sessionStorage.clear()
    console.log('clear sessionStorage end')
    resetRouter()
    // 执行路由跳转方法
    next()
  }
  // 404 界面
  else if (to.path === '/404') {
    // 执行路由跳转方法
    next()
  }
  // 已经登录
  else if (logined) {
    // 判断是否已经添加动态路由,或者当前为全局路由的时候。 直接访问
    if (router.options.loaded || isGlobalRoutes(to)) {
      // 执行路由跳转方法
      // console.log(4444);
      routerGo(to, from, next, true)
    } else {
      // 如果启用了记住我，则进行相关数据的检查
      if (window.$cookies.isKey('remember-me') && window.$cookies.isKey('token') && window.$cookies.isKey('router') &&
        window.$cookies.get('remember-me') === true) {
        console.log('load token from cookies')
        setStorage('token', window.$cookies.get('token'))
        console.log('load profile from cookies')
        setStorage('profile', JSON.stringify(window.$cookies.get('profile')))
        console.log('load router from cookies')
        setStorage('router', JSON.stringify(window.$cookies.get('router'))) // 存储路由到sessionStorage
      }
      // 添加动态所有(菜单)路由
      if (!getStorage('router')) {
        console.log('load router from server')
        Axios.get('/api/jeebiz-servmgt/serv/feature/tree', {
          // params:{id:this.kemuid},
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': getStorage('token') || ''
          },
          timeout: 60000 // 超时时间 1分钟
        }).then((res) => {
          // console.log(res)
          if (res.data.code === '0' || res.data.code === 0) {
            const data = res.data.data
            setStorage('router', JSON.stringify(data)) // 存储路由到sessionStorage
            // 动态添加路由
            const dynamicRoutes = mapRouter(data)
            // console.log(dynamicRoutes)
            router.addRoutes([].concat(dynamicRoutes))
            router.options.loaded = true
            // console.log(33333);
            // 执行路由跳转方法
            next({ ...to, replace: true })
          }
        }).catch((error) => {
          console.error(error)
        })
      } else {
        console.log('load router from sessionStorage')
        // 动态添加路由
        const dynamicRoutes = mapRouter(JSON.parse(getStorage('router')))
        // console.log(dynamicRoutes)
        router.addRoutes([].concat(dynamicRoutes))
        router.options.loaded = true
        // console.log(2222);
        // 执行路由跳转方法
        next({ ...to, replace: true })
      }
    }
  } else {
    // console.log(1111);
    // 执行路由跳转方法
    routerGo(to, from, next, false)
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

function routerGo (to, from, next, logined) {
  // 检查当前路由是否需要登录
  if ((to.meta && to.meta.authc === false) || logined === false) {
    // console.log(222222222222222222);
    // Token 不存在,需要登录授权
    next({
      path: '/login' // 指向为你的登录界面
    })
  } else {
    // console.log(1242154);
    // 执行路由跳转方法
    next()
  }
}

function setStorage (name, data) { // sessionStorage 存储对象的方法
  sessionStorage.setItem(name, data)
}

function getStorage (name) { // sessionStorage 获取对象的方法
  return sessionStorage.getItem(name)
}

function mapRouter (servMap) {
  servMap = servMap || []
  const accessedRouters = []
  servMap.forEach(serv => {
    try {
      const feature = serv.feature || {}
      const routeNew = {
        name: feature.code || feature.id,
        path: serv.path || feature.url || '/404',
        meta: {
          authc: serv.authc !== 'none',
          status: serv.status,
          header: showHeader,
          style: currentStyle,
          id: feature.id || serv.id,
          icon: feature.icon || serv.icon,
          abb: feature.abb || serv.abb,
          name: feature.name || serv.name,
          label: feature.label || serv.label,
          perms: feature.perms || serv.perms || [],
          tags: serv.tags || [],
          pid: feature.pid
        }
      }
      // 没有子菜单的服务
      feature.children = feature.children || []
      if (feature.leaf || feature.children.length === 0) {
        routeNew.compt = feature.compt
        routeNew.component = _import(feature.compt || serv.compt || '404')
      } else {
        // 多个子菜单，则采用左侧导航模式
        if (feature.children.length > 1) {
          routeNew.component = resolve => require(['@/components/common/nav-index'], resolve)
          routeNew.redirect = feature.children[0].path || feature.children[0].url || '/404'
          routeNew.children = mapChildrenRouter(feature, feature.children)
        } else {
          const subRoute = feature.children[0]
          routeNew.path = subRoute.path || subRoute.url || '/404'
          // console.log( routeNew.path)
          routeNew.compt = subRoute.compt
          routeNew.component = _import(subRoute.compt || '404')
        }
      }
      // console.log(routeNew)
      accessedRouters.push(routeNew)
    } catch (error) { console.error(error) }
  })
  console.log(accessedRouters)
  return accessedRouters
}

function mapChildrenRouter (parent, routerMap) {
  routerMap = routerMap || []
  const accessedRouters = []
  routerMap.forEach(route => {
    try {
      const routeNew = {
        name: route.code || route.id,
        path: route.path || route.url || '/404',
        meta: {
          authc: route.authc !== 'none',
          status: route.status,
          header: showHeader,
          style: currentStyle,
          id: route.id,
          icon: route.icon,
          abb: route.abb,
          name: route.name,
          label: route.label,
          perms: route.perms || [],
          pid: route.pid
        }
      }
      // 没有子菜单的服务
      route.children = route.children || []
      if (route.leaf || route.children.length === 0) {
        routeNew.compt = route.compt
        routeNew.component = _import(route.compt || '404')
      } else {
        // 多个子菜单，则采用左侧导航模式
        if (route.children.length > 1) {
          routeNew.redirect = route.children[0].path || route.children[0].url || '/404'
          routeNew.children = mapChildrenRouter(route, route.children)
        } else {
          const subRoute = route.children[0]
          routeNew.path = subRoute.path || subRoute.url || '/404'
          routeNew.compt = subRoute.compt
          routeNew.component = _import(subRoute.compt || '404')
        }
      }
      accessedRouters.push(routeNew)
    } catch (error) { console.error(error) }
  })
  console.log(parent.name, accessedRouters)
  return accessedRouters
}

export default router
