import Axios from 'axios'

function setStorage (name, data) { // sessionStorage 存储对象的方法
  sessionStorage.setItem(name, data)
}

function getStorage (name) { // sessionStorage 获取对象的方法
  return sessionStorage.getItem(name)
}

export default {
  // 14535 - 浙江音乐学院
  '14535': {
    login: (to, from, next) => {
      Axios.get('http://172.16.70.31:8080/yyxy_uniauth/ser/vaildTocken.action', {
        params: {
          'tocken': to.query.tocken,
          'syskey': 'V+yUhswUbJ2FaDOH6gumdTbNUyOOfD7+/AXBuiQo8JyzxTaHlFJJRxb+436eay0oMvA16WoUDIdi72RoaKRDJSFUkn9eaxkYQBXwkC0xC2HC4r8AQlYmg4SYPMjoTOWdiKZum+5ToE8PfEX+8V8E4lBAxYg1uva3JHBi0/J85ak='
        },
        timeout: 60000 // 超时时间 1分钟
      }).then((res) => {
        console.error(res)
        const data = JSON.parse(res)
        if (data.status === 'succ') {
          // 第三方认证跳转，将直接请求认证接口进行认证对接
          Axios.get('/api/jeebiz-authz/authz/login/pac4j', {
            params: Object.assign({
              'client_name': '',
              'signature': 'none'
            }, to.query),
            data: data.pinfo || {},
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 60000 // 超时时间 1分钟
          }).then((res) => {
            if (res.data.code === '0' || res.data.code === 0) {
              const data = res.data.data
              // console.error(data);
              data.profile = data.profile || {}
              setStorage('token', data.token)
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
          console.error(data.msg || '')
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    logout: (to, from, next) => {

    }
  }
}
