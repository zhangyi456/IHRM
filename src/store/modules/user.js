import { getToken, setToken, removeToken, setTimeStamp /* 存入时间戳*/ } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken(), // !初始状态就先从本地里面取到token
    userInfo: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token // !这里只是state设置token
      setToken(token)
    },
    removeToken(state) {
      state.token = null // !先删除vuex里面的token
      removeToken() // !在删除token同步到缓存
    },
    // 设置用户信息
    setUserInfo(state, result) {
      state.userInfo = result
      // state.userInfo = { ...result } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
    },
    // 删除用户信息
    reomveUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async login(context, data) {
      // !调用接口，发起请求
      const result = await login(data)
      // !只有登录状态成功才改变state的token并存在本地
      context.commit('setToken', result)
      setTimeStamp() // !在用户登录以后存入一个时间戳
    },
    async getUserInfo(context) {
      const result = await getUserInfo()
      const baseInfo = await getUserDetailById(result.userId)
      context.commit('setUserInfo', { ...result, ...baseInfo })
      return result // 这里为什么要返回 为后面埋下伏笔
    },
    // 登出功能
    logout(context) {
      context.commit('removeToken')
      context.commit('reomveUserInfo')
    }
  }
}
