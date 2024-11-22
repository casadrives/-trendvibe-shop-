<template>
  <footer class="footer">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-lg font-semibold mb-4">About TrendVibe</h3>
          <p class="text-gray-300">
            Discover trendy products under €50 with free shipping. Your one-stop shop for affordable fashion and lifestyle items.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><router-link to="/" class="footer-link">Home</router-link></li>
            <li><router-link to="/products" class="footer-link">Products</router-link></li>
            <li><router-link to="/trending" class="footer-link">Trending</router-link></li>
            <li><router-link to="/deals" class="footer-link">Deals</router-link></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
          <ul class="space-y-2">
            <li><router-link to="/contact" class="footer-link">Contact Us</router-link></li>
            <li><router-link to="/shipping" class="footer-link">Shipping Info</router-link></li>
            <li><router-link to="/returns" class="footer-link">Returns</router-link></li>
            <li><router-link to="/faq" class="footer-link">FAQ</router-link></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Stay Updated</h3>
          <p class="text-gray-300 mb-4">Subscribe to our newsletter for the latest trends and deals!</p>
          <form @submit.prevent="subscribeNewsletter" class="space-y-2">
            <input 
              type="email" 
              v-model="email"
              placeholder="Enter your email"
              class="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <button 
              type="submit"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-gray-700">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400">© {{ new Date().getFullYear() }} TrendVibe. All rights reserved.</p>
          <div class="flex space-x-4 mt-4 md:mt-0">
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      email: ''
    }
  },
  methods: {
    async subscribeNewsletter() {
      if (!this.email) return
      
      try {
        // TODO: Implement newsletter subscription
        console.log('Newsletter subscription for:', this.email)
        this.email = ''
        // Show success message
      } catch (error) {
        console.error('Newsletter subscription error:', error)
        // Show error message
      }
    }
  }
}
</script>
