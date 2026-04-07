import { createRouter, createWebHistory } from 'vue-router'
import FeedView from '@/views/FeedView.vue'
import HomeView from '@/views/HomeView.vue'
import ProcessView from '@/views/ProcessView.vue'

const routes = [
  {
    path: '/',
    name: 'Feed',
    component: FeedView,
  },
  {
    path: '/search',
    name: 'Search',
    component: HomeView,
  },
  {
    path: '/processo/:id',
    name: 'Process',
    component: ProcessView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

