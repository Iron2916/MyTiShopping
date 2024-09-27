import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'   // 登录页面
import Layout from '@/views/Layout/index.vue' // 主页
import Home from '@/views/Home/index.vue'     // Home页面
import Category from '@/views/Category/index.vue' // 一级分类页面
import SubCategory from '@/views/Category/components/SubCategory.vue' // 二级分类页面
import Detail from '@/views/Detail/index.vue'   // 商品详情页面，即加入购物车页面
import CartList from '@/views/CartList/index.vue' // 商品购物车列表页面
import Checkout from '@/views/Checkout/index.vue' // 导入订单生成页面(填写地址，快递)
import Pay from '@/views/Pay/index.vue' // 导入支付模块
import PayBack from '@/views/Payback/index.vue' // 支付回调提示模块
import Member from '@/views/Member/index.vue' // 用户中心
import MemberInfo from '@/views/Member/components/UserInfo.vue' //用户中心子路由：个人中心
import MemberOrder from '@/views/Member/components/OrderInfo.vue' // 用户中心子路由：我的订单

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,            // 主页面
      children: [
        {                           // 主页面的home页面
          path: '',
          name: 'home',
          component: Home
        },
        {
          path: 'category/:id',      // 这里是得到以及标签的id(header导航栏进行跳转category)
          name: 'category',
          component: Category
        },
        {
          path: 'category/sub/:id',   // 这里配置的是得到二级标签的id(category进行跳转到subcategory)
          name: 'subCategory',
          component: SubCategory
        },    
        {
          path: 'detail/:id',        // 这里时商品详细页面
          component: Detail
        },
        {
          path: 'cartlist',         // 购物车列表
          component: CartList
        },
        {                           // 订单生成页
          path: 'checkout',
          component: Checkout
        },
        {                           // 点击提交订单后，到达支付页面
          path: 'pay',
          component:Pay
        },
        {
          path: 'paycallback',     // 支付完成之后，回到一个反馈页面
          component: PayBack
        },
        {
          path: '/member',        // 用户中心
          component: Member,
          redirect:'/member/user',
          children:[
            {
              path: 'user',
              component: MemberInfo
            },
            {
              path: 'order',
              component: MemberOrder
            }
          ]
      }
      ]
    },
    {                               // 一级路由登录模块
      path: '/login',
      name: 'login',
      component: Login
    },
  ],

})

export default router