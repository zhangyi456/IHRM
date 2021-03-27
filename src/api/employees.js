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
// 删除员工的接口
export function deleteEmployees(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}
/** **
 *  新增员工的接口
 * **/
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
/** *
 *  封装一个导入员工的接口
 *
 * ***/
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
// 封装保存员工信息的接口
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}
/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
