// 封装购物车模块
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'
import { addToCart, delteCart, getCartList, allCheckCart, checkCart} from '@/apis/cart'


export const useCartStore = defineStore('cartStore', () => {
  
  // 获得用户token判断是否登录(用户判断使用本地或者后端购物车)
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.userInfo.token)
  
  // state 区域

  const cartList = ref([])

  // active 区域

  const updateNewList = async() => {
      const res = await getCartList()
      cartList.value = res.data
  }

  const addCart = async(goods) => {

      if (isLogin.value) {

          console.log("后端");
          await addToCart(goods.skuId, goods.skuNum)
          updateNewList()
      } else {
          // 本地购物车
          console.log("本地购物车");
          const item = cartList.value.find((item) => goods.skuId === item.skuId)
          if (item) {
          // 找到了
          item.skuNum += goods.skuNum
          } else {
          // 没找到
          cartList.value.push(goods)
          }
      }

  }

  const delCart = async(id) => {

      if (isLogin.value) {

          await delteCart(id)
          updateNewList()
      } else {

          const idx = cartList.value.findIndex((item) => id === item.id)
          cartList.value.splice(idx, 1)
      }
  }

  const singleCheck = async(skuId, isChecked) => {


      if (isLogin.value) {
  
        await checkCart(skuId, isChecked)
        updateNewList()
      } else {
  
        const item = cartList.value.find((item) => item.skuId === skuId)
        item.isChecked = isChecked
      }
    }
  
  const allCheck = async(isChecked) => {

    if (isLogin.value) {

      await allCheckCart(isChecked)   // 1: 选中，0：未选中
      updateNewList()
    } else {
    // 把cartList中的每一项的selected都设置为当前的全选框状态
    cartList.value.forEach(item => item.isChecked = isChecked)
    }

  }

    const clearCart = () => {

        cartList.value = []
        console.log(cartList.value);
    }

    const allCount = computed(() => cartList.value.reduce((a, c) => a + c.skuNum, 0))

    const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.skuNum * c.cartPrice, 0))

    const isAll = computed(() => cartList.value.every((item) => item.isChecked === 1))

    const selectedCount = computed(() => cartList.value.filter(item => item.isChecked === 1).reduce((a, c) => a + c.skuNum, 0))

    const selectedPrice = computed(() => cartList.value.filter(item => item.isChecked === 1).reduce((a, c) => a + c.skuNum * c.cartPrice, 0))
    
  
    return {
        allCount,
        allPrice,
        isAll,
        selectedCount,
        selectedPrice,

        updateNewList,
        cartList,
        addCart,
        delCart,
        singleCheck,
        allCheck,
        clearCart
    }
}, {
  persist: true,
})