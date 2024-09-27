import request from '@/utils/http'

export function loginAPI(username, password) {
  return request({
    url: '/api/user/userInfo/login',
    method: 'post',
    data:{
        username: username, 
        password: password
    }
  })
}