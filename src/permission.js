// !权限拦截，导航守卫，路由守卫
import router from '@/router' // !引入路由
import store from '@/store'
import Nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
// 前置守卫
router.beforeEach(async(to, from, next) => {
  Nprogress.start() // 开启进度条
  // 首先判断有没有token
  if (store.getters.token) {
    //! 只有有token的情况下才去获取用户资料
    // 如果有token继续判断是不是去登录页
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        // !这里要强制将异步任务变成同步任务，否则就会出现还有获取完资料就放行的状态
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // !在白名单放行
      next()
    } else {
      // !不在白名单就跳转登陆页面
      next('/login')
    }
  }
  Nprogress.done() // !手动关闭进度条,为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(() => {
  Nprogress.done() // 关闭进度条
})
