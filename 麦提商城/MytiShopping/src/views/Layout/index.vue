<!-- 主界面整体布局页面 -->
<template>
  <LayoutFiexd/>
  <LayoutNav />
  <LayoutHeader />
  <RouterView />    // 这里是预留的位置
  <LayoutFooter />
</template>

<script setup>
import LayoutFiexd from './components/LayoutFiexd.vue'
import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'

// 激活categoryStore
import {onMounted} from 'vue'
import { useCategoryStore } from '@/stores/categoryStore';
const categoryStore = useCategoryStore()
onMounted(() => {
  categoryStore.getCategory()
})


</script>

<style lang="scss">
</style>