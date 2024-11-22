import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'

// Views
import Home from '../views/Home.vue'
import Category from '../views/Category.vue'
import Cart from '../views/Cart.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import PricingDemo from '../components/PricingDemo.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/pricing-demo',
    name: 'PricingDemo',
    component: PricingDemo,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated

  // Check for protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Check for guest-only routes (login, register)
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router
