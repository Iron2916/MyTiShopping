// 商品详情页面

<template>
  <div class="xtx-goods-page">

    <div class="container" v-if="goods.skus">

      <!-- 部分一：最顶部得面包屑 -->
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <!-- 
            错误原因：goods一开始{}  {}.categories -> undefined  -> undefined[1]
            1. 可选链的语法?. 
            2. v-if手动控制渲染时机 保证只有数据存在才渲染
           -->
          <el-breadcrumb-item :to="{ path: `/category/${goods.category1Id}` }">{{ goods.category1Name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/category/sub/${goods.category2Id}` }">{{
            goods.category2Name
          }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ goods.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 部分二：商品信息 -->
      <div class="info-container">
        <div>
          <!-- 顶部一大块 -->
          <div class="goods-info">
            <div class="media">
              <!-- 图片预览区 -->
              <ImagView :imageList="goods.sliderUrlsList.slice(0, 5)"/>
              <!-- 统计数量 -->
              <ul class="goods-sales">
                <li>
                  <p>销量人气</p>
                  <p> {{ goods.saleSum }}+ </p>
                  <p><i class="iconfont icon-task-filling"></i>销量人气</p>
                </li>
                <li>
                  <p>商品评价</p>
                  <p>100+</p>
                  <p><i class="iconfont icon-comment-filling"></i>查看评价</p>
                </li>
                <li>
                  <p>收藏人气</p>
                  <p>100+</p>
                  <p><i class="iconfont icon-favorite-filling"></i>收藏商品</p>
                </li>
                <li>
                  <p>品牌信息</p>
                  <p>{{ goods.brand.name }}</p>
                  <p><i class="iconfont icon-dynamic-filling"></i>品牌主页</p>
                </li>
              </ul>
            </div>
            <div class="spec">
              <!-- 商品信息区 -->
              <p class="g-name"> {{ goods.name }} </p>
              <p class="g-desc">{{ goods.desc }} </p>
              <p class="g-price">
                <!-- <span>{{ goods.oldPrice }}</span> -->
                <span> {{ goods.price }}</span>
              </p>
              <div class="g-service">
                <dl>
                  <dt>促销</dt>
                  <dd>12月好物放送，App领券购买直降120元</dd>
                </dl>
                <dl>
                  <dt>服务</dt>
                  <dd>
                    <span>无忧退货</span>
                    <span>快速退款</span>
                    <span>免费包邮</span>
                    <a href="javascript:;">了解详情</a>
                  </dd>
                </dl>
              </div>
              <!-- sku组件 -->
              <MytiSku :products="goods" @Change="getMytiSKu"/>
              <!-- 数据组件 -->
              <el-input-number v-model="count" :min="0" @change="countChange" />
              <!-- 按钮组件 -->
              <div>
                <el-button size="large" class="btn" @Click="AddtoCart">
                  加入购物车
                </el-button>
              </div>

            </div>
          </div>

          <!-- 底部一大整块 -->
          <div class="goods-footer">
            <div class="goods-article">
              <!-- 商品详情 -->
              <div class="goods-tabs">
                <nav>
                  <a>商品详情</a>
                </nav>
                <div class="goods-detail">
                  <!-- 属性 -->
                  <ul class="attrs">
                    <li>
                      <span class="dt">商品分类</span>
                      <span class="dd">{{ goods.category3Name }}</span>
                    </li>
                    <li>
                      <span class="dt">商品重量</span>
                      <span class="dd">{{ goods.skus[0].weight }} kg</span>
                    </li>
                    <li>
                      <span class="dt">商品重量</span>
                      <span class="dd">{{ goods.skus[0].volume }} Cm ³</span>
                    </li>
                    <li>
                      <span class="dt">商品活动：</span>
                      <span class="dd">限时促销，下单就送礼品！</span>
                    </li>
                  </ul>
                  <!-- 图片 -->
                  <img v-for="img in goods.detailsImageUrlList" :src="img" :key="img" alt="">
                </div>
              </div>
            </div>
            <!-- 24热榜+专题推荐 -->
            <div class="goods-aside">
              <!-- 24小时热榜 -->
              <GoodHot :type="1" />
              <!-- 周热榜 -->
              <GoodHot :type="2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getDetail } from '@/apis/detail'
import { onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'
import GoodHot from '@/views/Detail/components/GoodHot.vue' // 热点商品组件
import ImagView from './components/ImagView.vue'            //商品图片预览组件
import { onBeforeRouteUpdate } from 'vue-router'
import {useCartStore} from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'
import MytiSku from './components/MytiSku/index.vue'

// 获取商品基本信息(根据路由中的信息)
const goods = ref({})
const route = useRoute()
const getGoods = async() => {
  const res = await getDetail(route.params.id)
  goods.value = res.data
  console.log(goods.value.skus[0]);
}
onMounted(() => getGoods())

  // 目标:路由参数变化的时候 可以把分类数据接口重新发送
  onBeforeRouteUpdate( async(to) => {
    const res = await getDetail(to.params.id)
    goods.value = res.data
  })

// Sku插件的回调(返回选择的数据配合加入购物车按钮)
let skuObj = {}
const getMytiSKu = (sku) => {
  skuObj = sku
  console.log(skuObj)
}

// 数量控件
const count = ref(1); 
const countChange = () => {
  console.log("得到了sku数据" + count.value);
}
// 加入sku信息到购物车里面
const cartStore = useCartStore()
const userStore = useUserStore()
const AddtoCart = () => {
  if (skuObj != null) {

    // 选择了对应的格式，封装数据进行触发action加入到 store
    const cartInfo = {
      userId: '',                  // 猴拳融合的时候进行设置
      skuId: skuObj.id,
      cartPrice: skuObj.salePrice, // 这里的图片后续进行优化
      skuNum: count.value,
      imgUrl: skuObj.thumbImg,
      skuName: skuObj.skuName,
      isChecked: 0, // 1: 选中，0：未选中
    }
    cartStore.addCart(cartInfo)
    console.log(cartInfo);
    ElMessage.success("购买成功！")
  } else {
    // 没有选择对应商品格式
    ElMessage.warning("请选择格式再购买！")
  }
}
</script>
<style lang="scss">
.xtx-goods-page {
  .goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;

    .media {
      width: 580px;
      height: 600px;
      padding: 30px 50px;
    }

    .spec {
      flex: 1;
      padding: 30px 30px 30px 0;
    }
  }

  .goods-footer {
    display: flex;
    margin-top: 20px;

    .goods-article {
      width: 940px;
      margin-right: 20px;
    }

    .goods-aside {
      width: 280px;
      min-height: 1000px;
    }
  }

  .goods-tabs {
    min-height: 600px;
    background: #fff;
  }

  .goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
  }

  .number-box {
    display: flex;
    align-items: center;

    .label {
      width: 60px;
      color: #999;
      padding-left: 10px;
    }
  }

  .g-name {
    font-size: 22px;
  }

  .g-desc {
    color: #999;
    margin-top: 10px;
  }

  .g-price {
    margin-top: 10px;

    span {
      &::before {
        content: "¥";
        font-size: 14px;
      }

      &:first-child {
        color: $priceColor;
        margin-right: 10px;
        font-size: 22px;
      }

      // &:last-child {
      //   color: #999;
      //   text-decoration: line-through;
      //   font-size: 16px;
      // }
    }
  }

  .g-service {
    background: #f5f5f5;
    width: 500px;
    padding: 20px 10px 0 10px;
    margin-top: 10px;

    dl {
      padding-bottom: 20px;
      display: flex;
      align-items: center;

      dt {
        width: 50px;
        color: #999;
      }

      dd {
        color: #666;

        &:last-child {
          span {
            margin-right: 10px;

            &::before {
              content: "•";
              color: $xtxColor;
              margin-right: 2px;
            }
          }

          a {
            color: $xtxColor;
          }
        }
      }
    }
  }

  .goods-sales {
    display: flex;
    width: 400px;
    align-items: center;
    text-align: center;
    height: 140px;

    li {
      flex: 1;
      position: relative;

      ~li::after {
        position: absolute;
        top: 10px;
        left: 0;
        height: 60px;
        border-left: 1px solid #e4e4e4;
        content: "";
      }

      p {
        &:first-child {
          color: #999;
        }

        &:nth-child(2) {
          color: $priceColor;
          margin-top: 10px;
        }

        &:last-child {
          color: #666;
          margin-top: 10px;

          i {
            color: $xtxColor;
            font-size: 14px;
            margin-right: 2px;
          }

          &:hover {
            color: $xtxColor;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      >span {
        color: $priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
}

.goods-detail {
  padding: 40px;

  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;

    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%;

      .dt {
        width: 100px;
        color: #999;
      }

      .dd {
        flex: 1;
        color: #666;
      }
    }
  }

  >img {
    width: 100%;
  }
}

.btn {
  margin-top: 20px;

}

.bread-container {
  padding: 25px 0;
}
</style>