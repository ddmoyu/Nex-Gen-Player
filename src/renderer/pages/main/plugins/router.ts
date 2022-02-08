import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { name: 'discovery', path: '/', component: () => import('../views/discovery/index.vue') },
  { name: 'download', path: '/download', component: () => import('../views/download/index.vue') },
  { name: 'favorites', path: '/favorites', component: () => import('../views/favorites/index.vue') },
  { name: 'history', path: '/history', component: () => import('../views/history/index.vue') },
  { name: 'search', path: '/search', component: () => import('../views/search/index.vue') },
  { name: 'settings', path: '/settings', component: () => import('../views/settings/index.vue') }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router