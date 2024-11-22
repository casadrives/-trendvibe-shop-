<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="text-2xl font-bold text-blue-600">
            TrendVibe
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link inline-flex items-center px-1 pt-1 border-b-2"
            :class="[$route.path === item.path ? 'border-blue-500' : 'border-transparent']"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Right Side Menu -->
        <div class="flex items-center">
          <!-- Search -->
          <div class="relative mx-4">
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="Search products..."
              class="w-full sm:w-64 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

          <!-- Cart -->
          <router-link to="/cart" class="relative p-2 text-gray-600 hover:text-blue-600">
            <i class="fas fa-shopping-cart text-xl"></i>
            <span v-if="cartItemCount > 0" class="cart-badge">
              {{ cartItemCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div class="ml-4 relative">
            <template v-if="isAuthenticated">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  :src="user.avatar || 'https://ui-avatars.com/api/?name=' + user.name"
                  alt="User avatar"
                  class="h-8 w-8 rounded-full"
                >
                <span class="hidden md:block">{{ user.name }}</span>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-show="showUserMenu"
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              >
                <div class="py-1">
                  <router-link
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </router-link>
                  <router-link
                    to="/orders"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </router-link>
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </template>

            <template v-else>
              <router-link
                to="/login"
                class="btn-primary"
              >
                Sign in
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'NavBar',
  setup() {
    const store = useStore()
    const route = useRoute()
    const searchQuery = ref('')
    const showUserMenu = ref(false)

    const navItems = [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: 'Trending', path: '/trending' },
      { name: 'Deals', path: '/deals' }
    ]

    const isAuthenticated = computed(() => store.state.auth.isAuthenticated)
    const user = computed(() => store.state.auth.user)
    const cartItemCount = computed(() => store.state.cart.items.length)

    const handleSearch = () => {
      // Implement search functionality
      store.dispatch('products/searchProducts', searchQuery.value)
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const logout = () => {
      store.dispatch('auth/logout')
    }

    // Close user menu when clicking outside
    const closeUserMenu = (e) => {
      if (!e.target.closest('.user-menu')) {
        showUserMenu.value = false
      }
    }

    // Add click event listener
    window.addEventListener('click', closeUserMenu)

    return {
      navItems,
      searchQuery,
      showUserMenu,
      isAuthenticated,
      user,
      cartItemCount,
      handleSearch,
      toggleUserMenu,
      logout,
      route
    }
  }
}
</script>
