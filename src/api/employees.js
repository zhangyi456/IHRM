import request from '@/utils/request'
// 获取简单员工列表
export function getEmployeesSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

// 获取员工详情的接口
export function getEmployeesInfo(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}
