// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js';
import echarts from 'echarts'
import iView from 'iview'
import iViewEditor from 'iview-editor'
import iViewArea from 'iview-area'

// 使用 css
import 'iview/dist/styles/iview.css'
import 'iview-editor/dist/i-editor.css'
import 'ant-design-vue/dist/antd.css' // or 'ant-design-vue/dist/antd.less'

// 使用插件
Vue.use(iView)
Vue.use(iViewEditor)
Vue.use(iViewArea)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
