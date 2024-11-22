<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <!-- Logo and Main Nav -->
        <div class="flex">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-indigo-600">TrendyShop</span>
          </router-link>
          
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link 
              to="/"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-indigo-500 text-gray-900"
            >
              Home
            </router-link>
            
            <router-link 
              to="/pricing-demo"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-indigo-500 text-gray-900"
            >
              Pricing Demo
            </router-link>
          </div>
        </div>

        <!-- Right Nav -->
        <div class="flex items-center">
          <!-- Cart -->
          <router-link 
            to="/cart"
            class="p-2 text-gray-400 hover:text-gray-500 relative"
          >
            <span class="sr-only">Cart</span>
            <i class="fas fa-shopping-cart text-xl"></i>
            <span 
              v-if="cartItemCount > 0"
              class="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
            >
              {{ cartItemCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div class="ml-3 relative">
            <template v-if="isAuthenticated">
              <router-link 
                to="/profile"
                class="p-2 text-gray-400 hover:text-gray-500"
              >
                <i class="fas fa-user text-xl"></i>
              </router-link>
              <button 
                @click="logout"
                class="ml-2 p-2 text-gray-400 hover:text-gray-500"
              >
                <i class="fas fa-sign-out-alt text-xl"></i>
              </button>
            </template>
            <template v-else>
              <router-link 
                to="/login"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </router-link>
              <router-link 
                to="/register"
                class="ml-2 bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  
  setup() {
    const store = useStore()
    const router = useRouter()

    const cartItemCount = computed(() => store.state.cart.items.length)
    const isAuthenticated = computed(() => store.getters.isAuthenticated)

    const logout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    return {
      cartItemCount,
      isAuthenticated,
      logout
    }
  }
}
</script>

<style scoped>
/* Add any additional styling here */
</style>
