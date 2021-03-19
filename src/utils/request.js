// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Promise } from 'core-js'
import Message from 'element-ui'
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
}) // 创建一个axios的实例
service.interceptors.request.use() // 请求拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    // !业务逻辑错了，才会走这一步
    Message.error(message)
    return Message.error(new Error(message))
  }
}, error => {
  // !如果是200错误状态码意外的错误，要求返回这一段，后面的请求的catch，才会收到错误信息
  Message.error(error.Message)
  return Promise.reject(error)
}) // 响应拦截器
export default service
