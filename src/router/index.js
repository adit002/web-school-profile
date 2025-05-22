import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/auth/LoginPage.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import NotFound from '@/views/NotFound.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import PublicPage from '@/views/PublicPage.vue'
import NewsPage from '@/views/NewsPage.vue'
import RegisterPublic from '@/views/RegisterPublic.vue'
import NewsPublic from '@/views/NewsPublic.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'

const routes = [
  {
    path: '/dashboard',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Beranda',
        component: HomePage,
      },
      {
        path: '/Pendaftaran',
        name: 'Pendaftaran',
        component: RegisterPage,
      },
      {
        path: '/Berita',
        name: 'Berita',
        component: NewsPage,
      },
    ],
  },
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'Public',
        component: PublicPage,
      },
      {
        path: '/Public/Register',
        name: 'Public/Register',
        component: RegisterPublic,
      },
      {
        path: '/Public/News',
        name: 'Public/News',
        component: NewsPublic,
      },
    ],
  },
  {
    path: '/login',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginPage,
      },
    ],
  },
  {
    path: '/Notfound',
    name: 'Notfound',
    component: NotFound,
  },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) {
    return next({ name: 'Login' })
  }

  if (to.name === 'Login' && authStore.token) {
    return next({ name: 'Home' })
  }

  next()
})

export default router
