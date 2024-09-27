<!-- 用户支付界面：点击提交订单之后 -->
<template>
  <div class="xtx-pay-page">
    <div class="container">
      <!-- 付款信息 -->
      <div class="pay-info">
        <span class="icon iconfont icon-chenggong"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <p>支付还剩 <span>{{ timeDown.formatTime }}</span>, 超时后将取消订单</p>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <span>¥{{ payInfo.totalAmount?.toFixed(2) }}</span>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a class="btn wx" href="javascript:;"></a>
          <!-- <a class="btn alipay" :href="payUrl"></a> -->
          <a class="btn alipay"  @click="payByAli"></a>
          
        </div>
        <div class="item">
          <p>支付方式</p>
          <a class="btn" href="javascript:;">招商银行</a>
          <a class="btn" href="javascript:;">工商银行</a>
          <a class="btn" href="javascript:;">建设银行</a>
          <a class="btn" href="javascript:;">农业银行</a>
          <a class="btn" href="javascript:;">交通银行</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { getOrderAPI, updateOrder} from '@/apis/pay'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter} from 'vue-router'
  import { useCountDown } from '@/composables/timer';


  // 倒计时逻辑及函数
  const timeDown = useCountDown()

  // 更新本地购物车数据
  import {useCartStore} from '@/stores/cartStore.js'
  const cartStore = useCartStore()


  // 获取订单数据
  const route = useRoute()
  const payInfo = ref({})
  const getPayInfo = async() => {
    const res = await getOrderAPI(route.query.id)
    payInfo.value = res.data
    console.log(payInfo.value);
    timeDown.start(36000)
  }

  onMounted(() => {
    getPayInfo()
    cartStore.updateNewList()
  })

  // 支付宝支付
  const router = useRouter()
  const payByAli = async() => {

    // 更改支付方式，并更新(orderId, status:1代表已支付待发货， type:2代表支付宝付款)
    await updateOrder(payInfo.value.id, 1, 2)
    router.push({
    path: '/paycallback',
    query: {
      orderId: payInfo.value.id,
      payResult: true
    }
  })
  }


</script>

<style scoped lang="scss">
.xtx-pay-page {
  margin-top: 20px;
}

.pay-info {

  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;

  .icon {
    font-size: 80px;
    color: #1dc779;
  }

  .tip {
    padding-left: 10px;
    flex: 1;

    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }

      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }

  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }

      &:last-child {
        color: $priceColor;
        font-size: 20px;
      }
    }
  }
}

.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;

  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;

    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }

  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;

    &.active,
    &:hover {
      border-color: $xtxColor;
    }

    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat center / contain;
    }

    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg) no-repeat center / contain;
    }
  }
}
</style>