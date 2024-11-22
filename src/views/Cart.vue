<template>
  <div class="cart-view">
    <div class="container py-5">
      <h1 class="mb-4">Shopping Cart</h1>

      <!-- Empty Cart State -->
      <div v-if="!cartItems.length" class="text-center py-5">
        <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
        <h3>Your cart is empty</h3>
        <p class="text-muted mb-4">Add some products to your cart and come back!</p>
        <router-link to="/" class="btn btn-primary">
          Continue Shopping
        </router-link>
      </div>

      <div v-else class="row">
        <!-- Cart Items -->
        <div class="col-lg-8">
          <div class="cart-items">
            <div 
              v-for="item in cartItems" 
              :key="item.id"
              class="cart-item"
            >
              <div class="row align-items-center">
                <div class="col-md-2">
                  <img 
                    :src="item.image_url" 
                    :alt="item.name"
                    class="img-fluid rounded"
                  >
                </div>
                <div class="col-md-4">
                  <h5>{{ item.name }}</h5>
                  <div class="text-muted">{{ item.category }}</div>
                  <div class="shipping-badge">
                    <i class="fas fa-shipping-fast"></i> Free Shipping
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="price">€{{ item.price.toFixed(2) }}</div>
                </div>
                <div class="col-md-2">
                  <div class="quantity-selector">
                    <button 
                      class="btn btn-outline-secondary btn-sm"
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                    >
                      <i class="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      class="form-control"
                      v-model.number="item.quantity"
                      min="1"
                      max="10"
                      @change="updateQuantity(item.id, item.quantity)"
                    >
                    <button 
                      class="btn btn-outline-secondary btn-sm"
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      :disabled="item.quantity >= 10"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-2 text-end">
                  <div class="item-total mb-2">
                    €{{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                  <button 
                    @click="removeFromCart(item.id)"
                    class="btn btn-outline-danger btn-sm"
                  >
                    <i class="fas fa-trash"></i> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Actions -->
          <div class="cart-actions mt-4 d-flex justify-content-between">
            <router-link to="/" class="btn btn-outline-primary">
              <i class="fas fa-arrow-left me-2"></i>
              Continue Shopping
            </router-link>
            <button 
              @click="clearCart"
              class="btn btn-outline-danger"
            >
              <i class="fas fa-trash me-2"></i>
              Clear Cart
            </button>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="col-lg-4">
          <div class="order-summary">
            <h4 class="mb-4">Order Summary</h4>
            
            <div class="summary-item d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>€{{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="summary-item d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span class="text-success">Free</span>
            </div>
            <div class="summary-item d-flex justify-content-between mb-4">
              <span>Tax (21%)</span>
              <span>€{{ (cartTotal * 0.21).toFixed(2) }}</span>
            </div>
            
            <div class="total d-flex justify-content-between mb-4">
              <strong>Total</strong>
              <strong>€{{ (cartTotal * 1.21).toFixed(2) }}</strong>
            </div>

            <!-- PayPal Button -->
            <div v-if="isAuthenticated" class="paypal-button-container" ref="paypal"></div>
            
            <!-- Login to Checkout -->
            <div v-else>
              <p class="text-center mb-3">Please log in to complete your purchase</p>
              <button 
                @click="login"
                class="btn btn-primary w-100"
              >
                <i class="fas fa-user me-2"></i>
                Login to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Cart',
  
  setup() {
    const store = useStore()
    const router = useRouter()
    const paypal = ref(null)

    // Computed
    const cartItems = computed(() => store.getters.cartItems)
    const cartTotal = computed(() => store.getters.cartTotal)
    const isAuthenticated = computed(() => store.state.auth.isAuthenticated)

    // Methods
    const updateQuantity = (productId, quantity) => {
      if (quantity >= 1 && quantity <= 10) {
        store.dispatch('updateCartItem', { productId, quantity })
      }
    }

    const removeFromCart = (productId) => {
      store.dispatch('removeFromCart', productId)
    }

    const clearCart = () => {
      if (confirm('Are you sure you want to clear your cart?')) {
        store.dispatch('clearCart')
      }
    }

    const login = () => {
      router.push('/login')
    }

    // PayPal Integration
    const initPayPalButton = () => {
      if (window.paypal && cartTotal.value > 0) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: 'EUR',
                  value: (cartTotal.value * 1.21).toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: 'EUR',
                      value: cartTotal.value.toFixed(2)
                    },
                    tax_total: {
                      currency_code: 'EUR',
                      value: (cartTotal.value * 0.21).toFixed(2)
                    }
                  }
                },
                payee: {
                  email_address: 'wisemneifer@gmail.com'
                },
                items: cartItems.value.map(item => ({
                  name: item.name,
                  quantity: item.quantity.toString(),
                  unit_amount: {
                    currency_code: 'EUR',
                    value: item.price.toFixed(2)
                  },
                  category: 'PHYSICAL_GOODS'
                }))
              }]
            })
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture()
            // Handle successful payment
            store.dispatch('createOrder', {
              paypalOrderId: order.id,
              items: cartItems.value,
              total: cartTotal.value * 1.21,
              shipping: order.purchase_units[0].shipping
            })
            store.dispatch('clearCart')
            router.push('/order-confirmation')
          },
          onError: err => {
            console.error('PayPal Error:', err)
            // Handle error
          }
        }).render(paypal.value)
      }
    }

    // Lifecycle
    onMounted(() => {
      // Load PayPal SDK
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.VUE_APP_PAYPAL_CLIENT_ID}&currency=EUR`
      script.addEventListener('load', initPayPalButton)
      document.body.appendChild(script)
    })

    return {
      cartItems,
      cartTotal,
      isAuthenticated,
      paypal,
      updateQuantity,
      removeFromCart,
      clearCart,
      login
    }
  }
}
</script>

<style scoped>
.cart-item {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
}

.cart-item img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.shipping-badge {
  color: var(--success-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.shipping-badge i {
  margin-right: 0.25rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--secondary-color);
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-selector .form-control {
  width: 60px;
  text-align: center;
}

.item-total {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.order-summary {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  position: sticky;
  top: 2rem;
}

.summary-item {
  color: var(--text-secondary);
}

.total {
  font-size: 1.25rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.paypal-button-container {
  margin-top: 1rem;
}
</style>
