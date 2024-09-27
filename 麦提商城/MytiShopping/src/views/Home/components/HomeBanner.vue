<!-- 顶部右侧的轮播图: 点击轮播图进行跳转 -->
<template>
  <div class="home-banner">
    <el-carousel height="500px">
      <el-carousel-item v-for="item in bannerList" :key="item">
        <img :src="item.imgUrl" alt="" @click="$router.push(item.hrefUrl)">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
  import {getBannerAPI} from '@/apis/home'
  import {onMounted, ref} from 'vue'
  
  const bannerList = ref([])
  const getBanenr = async() => {

    const res = await getBannerAPI(0)
    bannerList.value = res.data
    console.log(bannerList);
  }
  onMounted(() => {
    getBanenr()
  })
</script>


<style scoped lang='scss'>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;

  img {
    width: 100%;
    height: 500px;
  }
}
</style>