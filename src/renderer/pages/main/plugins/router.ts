import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { name: 'discovery', path: '/', component: () => import('../views/discovery/index.vue') },
  { name: 'iptv', path: '/iptv', component: () => import('../views/iptv/index.vue') },
  { name: 'play', path: '/play', component: () => import('../views/play/index.vue') },
  { name: 'download', path: '/download', component: () => import('../views/download/index.vue') },
  { name: 'favorites', path: '/favorites', component: () => import('../views/favorites/index.vue') },
  { name: 'history', path: '/history', component: () => import('../views/history/index.vue') },
  { name: 'about', path: '/about', component: () => import('../views/menu/about.vue') },
  { name: 'settings', path: '/settings', component: () => import('../views/menu/settings.vue') },
  { name: 'siteManager', path: '/siteManager', component: () => import('../views/menu/siteManager.vue') },
  { name: 'liveManager', path: '/liveManager', component: () => import('../views/menu/liveManager.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
