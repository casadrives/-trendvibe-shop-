<template>
  <div class="product-detail">
    <div class="container mt-5">
      <div class="row">
        <!-- Product Image -->
        <div class="col-md-6">
          <div class="product-image-container">
            <img :src="product.image_url" :alt="product.name" class="img-fluid rounded">
          </div>
        </div>

        <!-- Product Info -->
        <div class="col-md-6">
          <h1 class="mb-3">{{ product.name }}</h1>
          <p class="price mb-4">€{{ product.price.toFixed(2) }}</p>
          <p class="description mb-4">{{ product.description }}</p>

          <!-- Quantity Selector -->
          <div class="quantity-selector mb-4">
            <label for="quantity" class="form-label">Quantity</label>
            <div class="input-group" style="width: 150px;">
              <button class="btn btn-outline-secondary" @click="decreaseQuantity">-</button>
              <input 
                type="number" 
                class="form-control text-center" 
                v-model="quantity"
                min="1"
                max="10"
              >
              <button class="btn btn-outline-secondary" @click="increaseQuantity">+</button>
            </div>
          </div>

          <!-- Add to Cart Button -->
          <button 
            @click="addToCart" 
            class="btn btn-primary btn-lg mb-4"
            :disabled="!product.stock"
          >
            Add to Cart
          </button>

          <!-- Product Details -->
          <div class="product-details mt-4">
            <h4>Product Details</h4>
            <ul class="list-unstyled">
              <li><strong>Category:</strong> {{ product.category }}</li>
              <li><strong>Stock:</strong> {{ product.stock }} available</li>
              <li><strong>Shipping:</strong> Free</li>
              <li><strong>Supplier:</strong> {{ product.supplier_name }}</li>
            </ul>
          </div>

          <!-- Supplier Link -->
          <a 
            :href="product.supplier_url" 
            target="_blank" 
            class="btn btn-outline-secondary mt-3"
          >
            <i class="fas fa-external-link-alt"></i> View on Supplier Site
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'ProductDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const route = useRoute()
    const quantity = ref(1)

    const product = computed(() => {
      return store.state.products.find(p => p.id === props.id) || {}
    })

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const increaseQuantity = () => {
      if (quantity.value < 10) {
        quantity.value++
      }
    }

    const addToCart = () => {
      store.dispatch('addToCart', {
        ...product.value,
        quantity: quantity.value
      })
    }

    return {
      product,
      quantity,
      decreaseQuantity,
      increaseQuantity,
      addToCart
    }
  }
}
</script>

<style scoped>
.product-image-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.product-image-container img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
}

.product-details {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.product-details li {
  margin-bottom: 10px;
}
</style>
