// 用户登录的store，存入用户登录信息和token

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/apis/user'
// 实现用户退出登录清除本地LocalStore里面的数据 以及 合并购物车数据(用户登录加载购物车数据)
import { useCartStore } from './cartStore'  
import { merge } from '@/apis/cart'

export const useUserStore = defineStore('userStore', () => {
  // 1. 定义管理用户数据的state
  const userInfo = ref({})
  const code = ref()
  const cartStore = useCartStore()
  
  // 2. 定义获取接口数据的action函数
  const getUserInfo = async(account, password) => {
    const res = await loginAPI(account, password)
    userInfo.value = res.data
    code.value = res.code
    // 合并购物车数据
    console.log(cartStore.cartList);
    const data = cartStore.cartList.map(item => {
            return {
              skuId: item.skuId,
              isChecked: item.isChecked,
              skuNum: item.skuNum
            }
          })
    console.log(data)     
    await merge(data)
    cartStore.updateNewList()
  }
  // 3. 退出时清除用户信息和购物车里面的数据
  const clearUserInfo = () => {
    userInfo.value = {}   // 清除用户信息
    cartStore.clearCart() // 清除本地购物车中数据
  }
  
  // 4. 以对象的格式把state和action return
  return {
    userInfo,
    code,
    getUserInfo,
    clearUserInfo
  }
}, 
{
  persist: true,    // 设置持久化保存
})