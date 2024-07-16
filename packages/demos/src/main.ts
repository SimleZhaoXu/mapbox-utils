import { createApp } from 'vue'
import App from './App.vue'
import Router from '@/router/index'
import { createPinia } from 'pinia'
import '@vue/repl/style.css'
import ElementPlus from 'element-plus'
// @ts-ignore
import '@/assets/style/main.scss'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
createApp(App).use(createPinia()).use(Router).use(ElementPlus).mount('#app')
