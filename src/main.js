import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import * as filters from '@/filters' // 引入工具类

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as directives from '@/directives'
import Component from '@/components'
import Print from 'vue-print-nb'
import checkPermission from '@/mixin/cheeckPermission'

import '@/icons' // icon
import '@/permission' // permission control
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

Vue.mixin(checkPermission) // !全局注册混入检查对象
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(Component) // 注册自己的插件
Vue.config.productionTip = false
Vue.use(Print) // 打印组件

// window.getSelection? window.getSelection().removeAllRanges()
//   : document.selection.empty()
// !这里是解决使用disabled以后出现的这个可以选中文字的问题，直接获取节点操作ducument
if (document.all) {
  document.onselectstart = function() {
    return false
  } // for ie
} else {
  document.onmousedown = function() {
    return true
  }
  document.onmouseup = function() {
    return true
  }
}
document.onselectstart = new Function('event.returnValue=false;')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
