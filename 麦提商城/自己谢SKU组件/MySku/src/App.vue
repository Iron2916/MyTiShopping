<template>
  <Sku v-if="flag" :goods="goods" @skuChange = "getSku" />
  <button @click="console.log(skuObj)">打印结果skuObj</button>
  <MytiSKu v-if = "flag2" :products="products" @Change="getMytiSKu"/>
  <button @click="console.log(MytiSKuObj)">打印结果MytiSKuObj</button>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import Sku from '@/views/Sku.vue'
import axios from 'axios'

// 得到要发送的数据
const goods = ref({}), flag = ref(false)
const getGoods = async () => {
  // 1135076  初始化就有无库存的规格
  // 1369155859933827074 更新之后有无库存项（蓝色-20cm-中国）
  const res = await axios.get('http://pcapi-xiaotuxian-front-devtest.itheima.net/goods?id=1369155859933827074')
  goods.value = res.data.result
  flag.value = true
}
// 回调Sku组件传递过来的Sku信息
let skuObj = ref({})
function getSku(value) {
  skuObj.value = value
}
getGoods() 


// ------------------------------- MytiSku --------------------------------
import MytiSKu from '@/views/MytiSku.vue'
const products = ref(), flag2 = ref(false)
const getProducts = async () => {

  const res = await axios.get("http://localhost:8503/api/product/index/getProductDetials?productId=1")
  products.value = res.data.data
  console.log(products.value);
  flag2.value = true
}
getProducts()

// sku数据回调
const MytiSKuObj = ref()
function getMytiSKu(value) {
 MytiSKuObj.value = value 
}
</script>
<style>
</style>