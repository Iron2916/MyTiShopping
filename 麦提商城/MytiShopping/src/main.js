
import { createApp } from 'vue'


import App from './App.vue'
import router from './router'



// // 引入element样式
import 'element-plus/dist/index.css'

// 引入自定义的样式文件
import '@/styles/common.scss'

// 引入 pinia 持久化插件,并挂载到pinia上
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)



const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

// 全局指令注册（实现图片懒加载）
import { directivePlugin } from '@/directives'
app.use(directivePlugin)

// 全局注册element-plush图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}