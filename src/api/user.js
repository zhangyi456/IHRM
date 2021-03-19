import request from '@/utils/request'
// !设置登录的接口
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data // !要注意：data是请求体参数，params是路径参数
  })
}

export function getInfo(token) {

}

export function logout() {

}
