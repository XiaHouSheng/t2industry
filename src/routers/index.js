// src/router/index.js

import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

// 路由规则（直接映射业务页面）
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../paegs/home.vue'),
    meta: { title: '终末地模拟器 - 首页' },
    children: [
      {
        path: '',
        name: 'HomeIndex',
        component: () => import('../paegs/home_child/index.vue'),
        meta: { title: '终末地模拟器 - 首页' }
      },
      {
        path: 'discover',
        name: 'HomeDiscover',
        component: () => import('../paegs/home_child/discover.vue'),
        meta: { title: '终末地模拟器 - 发现蓝图' }
      },
      {
        path: 'self',
        name: 'HomeSelf',
        component: () => import('../paegs/home_child/self.vue'),
        meta: { title: '终末地模拟器 - 个人蓝图' }
      }
    ]
  },
  {
    path: '/calculate',
    name: 'Calculate',
    component: () => import('../paegs/calculate.vue'),
    meta: { title: '物料配平计算' }
  },
  {
    path: '/editor/:hashCode?',
    name: 'Editor',
    component: () => import('../paegs/simulation.vue'),
    meta: { title: '蓝图编辑' }
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(), // 哈希模式
  routes,
  scrollBehavior() { // 路由切换时回到顶部
    return { top: 0 }
  }
})

// 全局路由守卫：设置页面标题（可选）
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'EndFieldSimulation | 终末地模拟器'
  next()
})

export default router