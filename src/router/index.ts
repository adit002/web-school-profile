import { createRouter, createWebHistory } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import HomePage from '@/views/public/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [{ path: '', name: 'Home', component: HomePage }],
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [],
      meta: { requiresAuth: true },
    },
  ],
})

export default router
