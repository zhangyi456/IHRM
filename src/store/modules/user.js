import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken() // !初始状态就先从本地里面取到token
  },
  mutations: {
    setToken(state, token) {
      state.token = token // !这里只是state设置token
      setToken(token)
    },
    removeToken(state) {
      state.token = null // !先删除vuex里面的token
      removeToken() // !在删除token同步到缓存
    }
  },
  actions: {
    async login(context, data) {
      // !调用接口，发起请求
      const result = await login(data)
      // !只有登录状态成功才改变state的token并存在本地
      context.commit('setToken', result)
    }
  }
}
