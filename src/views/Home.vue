<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div class="absolute inset-0 bg-pattern opacity-10"></div>
      <div class="container mx-auto px-4 py-20 relative">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h1 class="text-5xl md:text-6xl font-bold leading-tight">
              Welcome to <span class="text-yellow-400">TrendVibe</span>
            </h1>
            <p class="text-xl md:text-2xl text-indigo-100">
              Discover curated trends that won't break the bank. Everything under €50 with free shipping!
            </p>
            <div class="flex space-x-4">
              <router-link 
                to="/categories" 
                class="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold hover:bg-yellow-400 hover:text-white transition duration-300"
              >
                Start Shopping
              </router-link>
              <a 
                href="#trending" 
                class="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
              >
                View Trending
              </a>
            </div>
            <div class="flex items-center space-x-8 text-sm">
              <div class="flex items-center">
                <i class="fas fa-truck text-yellow-400 mr-2"></i>
                Free Shipping
              </div>
              <div class="flex items-center">
                <i class="fas fa-shield-alt text-yellow-400 mr-2"></i>
                Secure Payments
              </div>
              <div class="flex items-center">
                <i class="fas fa-undo text-yellow-400 mr-2"></i>
                Easy Returns
              </div>
            </div>
          </div>
          <div class="relative">
            <div 
              class="rounded-lg shadow-2xl transform hover:scale-105 transition duration-500 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8 aspect-square flex items-center justify-center"
            >
              <div class="text-center text-white">
                <i class="fas fa-shopping-bag text-6xl mb-4"></i>
                <h3 class="text-2xl font-bold">Amazing Deals</h3>
                <p class="mt-2">Everything under €50</p>
              </div>
            </div>
            <div class="absolute -bottom-6 -right-6 bg-yellow-400 text-indigo-900 rounded-full px-6 py-3 font-bold shadow-lg transform rotate-12">
              Up to 70% Off!
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Categories -->
    <section id="trending" class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trending Categories</h2>
          <p class="text-gray-600">Discover what's hot right now</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="category in categories" :key="category.id" 
               class="group relative overflow-hidden rounded-xl shadow-lg bg-white hover:shadow-2xl transition duration-300">
            <router-link :to="'/category/' + category.id">
              <div class="aspect-w-1 aspect-h-1">
                <img 
                  :src="category.image" 
                  :alt="category.name"
                  class="object-cover w-full h-full group-hover:scale-110 transition duration-500"
                >
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-6">
                  <h3 class="text-xl font-bold text-white mb-2">{{ category.name }}</h3>
                  <p class="text-yellow-400">{{ category.productCount }} Products</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p class="text-gray-600">Handpicked for you</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="product in featuredProducts" :key="product.id" 
               class="group">
            <ProductCard 
              :product="product"
              @quickView="showQuickView"
              @addToCart="addToCart"
              class="h-full"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-20 bg-indigo-900 text-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Why Choose TrendVibe?</h2>
          <p class="text-indigo-200">We make trendy shopping simple and affordable</p>
        </div>
        <div class="grid md:grid-cols-3 gap-12">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <i class="fas fa-tags text-2xl text-indigo-900"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">Best Prices</h3>
            <p class="text-indigo-200">All products under €50 with unbeatable value</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <i class="fas fa-shipping-fast text-2xl text-indigo-900"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">Fast Delivery</h3>
            <p class="text-indigo-200">Free shipping on all orders with quick delivery</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <i class="fas fa-star text-2xl text-indigo-900"></i>
            </div>
            <h3 class="text-xl font-bold mb-4">Curated Selection</h3>
            <p class="text-indigo-200">Hand-picked trending products just for you</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Stay Trendy</h2>
          <p class="text-gray-600 mb-8">Subscribe to get the latest trends and exclusive offers</p>
          <form class="flex gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="flex-1 px-6 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
            <button 
              type="submit" 
              class="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Quick View Modal -->
    <QuickViewModal 
      v-if="selectedProduct"
      :product="selectedProduct"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import ProductCard from '@/components/ProductCard.vue'
import QuickViewModal from '@/components/QuickViewModal.vue'

export default {
  name: 'Home',
  components: {
    ProductCard,
    QuickViewModal
  },
  setup() {
    const store = useStore()
    const selectedProduct = ref(null)

    const featuredProducts = computed(() => store.getters.featuredProducts)
    const categories = computed(() => store.getters.categories)

    const showQuickView = (product) => {
      selectedProduct.value = product
      const modal = new bootstrap.Modal(document.getElementById('quickViewModal'))
      modal.show()
    }

    const addToCart = (product) => {
      store.dispatch('addToCart', { ...product, quantity: 1 })
    }

    return {
      featuredProducts,
      categories,
      selectedProduct,
      showQuickView,
      addToCart
    }
  }
}
</script>

<style scoped>
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-section {
  background-size: cover;
  background-position: center;
}

/* Add smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Add hover effects */
.category-card:hover img {
  transform: scale(1.1);
}

/* Enhance transitions */
.transition {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
