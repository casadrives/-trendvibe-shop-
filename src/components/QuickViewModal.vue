<template>
  <div 
    class="modal fade" 
    id="quickViewModal" 
    tabindex="-1" 
    aria-labelledby="quickViewModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="quickViewModalLabel">{{ product.name }}</h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <!-- Product Image -->
            <div class="col-md-6">
              <div class="quick-view-image">
                <img 
                  :src="product.image_url" 
                  :alt="product.name" 
                  class="img-fluid rounded"
                >
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="col-md-6">
              <div class="product-category mb-2">{{ product.category }}</div>
              <h4 class="mb-3">{{ product.name }}</h4>
              <p class="description mb-4">{{ product.description }}</p>
              
              <div class="price-container mb-4">
                <div class="current-price">€{{ product.price.toFixed(2) }}</div>
                <div class="shipping-info">
                  <i class="fas fa-shipping-fast"></i> Free Shipping
                </div>
              </div>

              <div class="quantity-selector mb-4">
                <label class="form-label">Quantity</label>
                <div class="input-group" style="width: 150px;">
                  <button 
                    class="btn btn-outline-secondary" 
                    @click="decreaseQuantity"
                  >-</button>
                  <input 
                    type="number" 
                    class="form-control text-center" 
                    v-model="quantity"
                    min="1"
                    max="10"
                  >
                  <button 
                    class="btn btn-outline-secondary" 
                    @click="increaseQuantity"
                  >+</button>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button 
                  @click="addToCart" 
                  class="btn btn-primary btn-lg"
                >
                  Add to Cart
                </button>
                <router-link 
                  :to="'/product/' + product.id" 
                  class="btn btn-outline-primary"
                  data-bs-dismiss="modal"
                >
                  View Full Details
                </router-link>
              </div>

              <!-- Additional Info -->
              <div class="additional-info mt-4">
                <div class="supplier-info">
                  <small class="text-muted">Supplier:</small>
                  <span>{{ product.supplier_name }}</span>
                </div>
                <div class="stock-info">
                  <small class="text-muted">Stock:</small>
                  <span>{{ product.stock }} available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'QuickViewModal',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const quantity = ref(1)

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
        ...props.product,
        quantity: quantity.value
      })
      // Close modal after adding to cart
      const modal = document.getElementById('quickViewModal')
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
    }

    return {
      quantity,
      decreaseQuantity,
      increaseQuantity,
      addToCart
    }
  }
}
</script>

<style scoped>
.quick-view-image {
  background: var(--background-light);
  padding: 2rem;
  border-radius: 1rem;
}

.quick-view-image img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.product-category {
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.shipping-info {
  color: var(--success-color);
  font-size: 0.875rem;
}

.shipping-info i {
  margin-right: 0.5rem;
}

.description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.additional-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.additional-info small {
  display: block;
  margin-bottom: 0.25rem;
}

.modal-content {
  border: none;
  border-radius: 1rem;
}

.modal-header {
  padding: 1.5rem 1.5rem 0.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.btn-close {
  background-color: var(--background-light);
  padding: 1rem;
  border-radius: 50%;
}

.btn-close:hover {
  background-color: var(--border-color);
}
</style>
