// 二级分类商品种类跳转
<template>
  <div class="container ">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/category/${filterData.parentId}`}">{{ filterData.parentName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ filterData.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 商品展示 element组件v-infinite-scroll触底触发 -->
    <div class="sub-container" v-infinite-scroll="load" infinite-scroll-delay="600">  
      <el-tabs v-model="reqData.order" @tab-change="tabChange" class="demo-tabs">
        <el-tab-pane label="商品销量" name="1"></el-tab-pane>
        <el-tab-pane label="价格升序" name="2"></el-tab-pane>
        <el-tab-pane label="价格降序" name="3"></el-tab-pane>
      </el-tabs>
      <div class="body">
        <!-- 商品列表 -->
        <GoodsItem v-for="good in goodList" :goods="good" :key="good.id" />
      </div>
    </div>
  </div>

</template>

<script setup>

import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import { searchCategory2Childrens, findeProduct, getBrands} from '@/apis/category'
import GoodsItem from '@/components/GoodsItem.vue'
import { ElMessage } from 'element-plus'

// 查询传递过来的二级分类
const filterData = ref([])  //根据二级分类categoryId查询对应的数据
const route = useRoute()    // 通过路由获得传递进行的路由信息
const getFilterData = async() => {
  const res = await searchCategory2Childrens(route.params.id);
  filterData.value = res.data
  console.log(filterData.value);
  reqData.value.category2Id = res.data.id
  getGoodList()
}


// 获取基础列表数据渲染
const goodList = ref([])
const reqData = ref({
  "brandId": 0,
  "category2Id": filterData.value.id,
  "order": "1",
}), pageNum = ref(1), pageSize = ref(20)
const getGoodList = async() => {
  const res = await findeProduct(reqData.value, pageNum.value, pageSize.value)
  goodList.value = res.data.list
  console.log(reqData.value);
}

onMounted(() => {
  pageNum.value = 0;
  getFilterData()
})

// tab切换回调（根据tab进行条件查询）
const tabChange = () => {
  reqData.value.page = 1  // 重新从第一条数据开始查询
  pageNum.value = 1
  getGoodList()
}

// 查询出当前三级category所有的品牌

// 加载更多
const disabled = ref(false)
const load = async() => {
  // 到顶了进行返回
  if (disabled.value) {
    return; 
  }
  // 获取下一页的数据, 测试的时候因为数据不够可以进行注释
  pageNum.value ++;

  const res = await findeProduct(reqData.value, pageNum.value, pageSize.value)
  goodList.value = [...goodList.value, ...res.data.list]

  // 加载完毕 停止监听
  if (res.data.list.length === 0) {
    disabled.value = true
    ElMessage.warning("已经到顶了哦！")
  }
}
</script>


<style lang="scss" scoped>

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


}
</style>