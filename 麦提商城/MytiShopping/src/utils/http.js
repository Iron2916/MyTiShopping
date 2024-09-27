
// 操作文件：utils/http 
import axios from 'axios'
import router from '@/router'                 // 非 vue3 写法,此处为JS写法          
import { useUserStore } from '@/stores/userStore'  // 导入登录用户信息store
import { ElMessage } from 'element-plus'

// 创建axios实例
const http = axios.create({
  baseURL: 'http://localhost:8503/',
  timeout: 5000
})

// axios请求拦截器(全局携带token)
http.interceptors.request.use(config => {

  // 1. 从pinia获取token数据
  const userStore = useUserStore()

  // 2. // 如果不是登录接口且token存在，则在请求头中加入token（即将token加入到请求头中)
  if (config.url !== 'api/user/userInfo/login' && userStore.userInfo) {
    const token = userStore.userInfo.token
    config.headers.token = `${token}`;
}

return config
}, e => Promise.reject(e))

// axios响应式拦截器
http.interceptors.response.use(
  res => {
    
    // 这里配合后端实现响应拦截器
    if (res.data.code !== 200) {
      console.log(res.data.message);
      ElMessage.warning(res.data.message)

      // 如果是未登录，直接回到登陆界面，停止任何操作
      if (res.data.code === 208) {
        router.push("/login") 
      }
    }
    return res.data
  }, 

  e => {
    // 返回响应失败的的拦截器
    // 统一错误提示
    ElMessage.warning(e.response.data.message)
    return Promise.reject(e)
})


export default http