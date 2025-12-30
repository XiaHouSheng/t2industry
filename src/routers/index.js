// src/router/index.js

import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

// 导入业务页面组件（均基于 Root 容器开发）
import home from '../paegs/home.vue'
import calculate from '../paegs/calculate.vue'
import simulation from '../paegs/simulation.vue'
// 路由规则（直接映射业务页面）
const routes = [
  {
    path: '/home',
    name: 'Home',
    component: home,
    meta: { title: '终末地模拟器 - 首页' }
  },
  {
    path: '/calculate',
    name: 'Calculate',
    component: calculate,
    meta: { title: '物料配平计算' }
  },
  {
    path: '/editor',
    name: 'Editor',
    component: simulation,
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