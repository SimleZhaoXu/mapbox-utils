/*
 * @Author: 汤凡
 * @Date: 2024-05-30 11:01:25
 * @LastEditors: 汤凡
 * @LastEditTime: 2024-07-12 14:18:02
 */
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/home/index.vue'
import menuList from '@/config/menu-config'
const modules = import.meta.glob('../views/**/**/*.vue')
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home,
    redirect: 'circle-point',
    children: [
      ...menuList.map((menu) => {
        return {
          path: menu.path,
          component: modules[`../views/${menu.path}/index.vue`],
          meta: {
            code: menu.path
          }
        }
      })
    ]
  },
  ...menuList
    .filter((menu) => menu.code)
    .map((menu) => {
      return {
        path: `/${menu.path}/code/:id`,
        component: modules[`../views/${menu.path}/code/index.vue`]
      }
    }),
  ...menuList
    .filter((menu) => menu.gui)
    .map((menu) => {
      return {
        path: `/${menu.path}/gui/:id?`,
        component: modules[`../views/${menu.path}/gui/index.vue`]
      }
    }),
  // {
  //   path: '/test',
  //   component: () => import('@/views/test/index.vue')
  // },
  {
    path: '/geometry-picker',
    component: () => import('@/views/geometry-picker/index.vue')
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router
