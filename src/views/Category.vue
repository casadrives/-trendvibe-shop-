<template>
  <div class="category-view">
    <div class="container py-5">
      <div class="row g-4">
        <!-- Filters Sidebar -->
        <div class="col-lg-3">
          <ProductFilter />
        </div>

        <!-- Products Grid -->
        <div class="col-lg-9">
          <!-- Results Header -->
          <div class="results-header mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <div class="results-count">
                {{ filteredProducts.length }} Products Found
              </div>
              <div class="view-options d-flex gap-2">
                <button 
                  class="btn btn-outline-secondary btn-sm"
                  :class="{ active: viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                >
                  <i class="fas fa-th-large"></i>
                </button>
                <button 
                  class="btn btn-outline-secondary btn-sm"
                  :class="{ active: viewMode === 'list' }"
                  @click="viewMode = 'list'"
                >
                  <i class="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>

          <!-- No Results -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-5">
            <div class="no-results">
              <i class="fas fa-search fa-3x mb-3 text-muted"></i>
              <h3>No Products Found</h3>
              <p class="text-muted">Try adjusting your search or filter criteria</p>
              <button 
                class="btn btn-outline-primary"
                @click="clearFilters"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          <!-- Products Grid View -->
          <div 
            v-else-if="viewMode === 'grid'"
            class="row g-4"
          >
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              class="col-md-6 col-lg-4"
            >
              <ProductCard 
                :product="product"
                @quickView="showQuickView"
                @addToCart="addToCart"
              />
            </div>
          </div>

          <!-- Products List View -->
          <div 
            v-else
            class="products-list"
          >
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              class="product-list-item"
            >
              <div class="row g-0">
                <div class="col-md-3">
                  <img 
                    :src="product.image_url" 
                    :alt="product.name"
                    class="img-fluid rounded"
                  >
                </div>
                <div class="col-md-9">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <div class="product-category">{{ product.category }}</div>
                        <h5 class="card-title">{{ product.name }}</h5>
                        <p class="card-text">{{ product.description }}</p>
                      </div>
                      <div class="text-end">
                        <div class="price mb-3">€{{ product.price.toFixed(2) }}</div>
                        <div class="shipping-badge mb-3">
                          <i class="fas fa-shipping-fast"></i> Free Shipping
                        </div>
                        <div class="d-flex gap-2">
                          <button 
                            @click="showQuickView(product)"
                            class="btn btn-outline-primary"
                          >
                            Quick View
                          </button>
                          <button 
                            @click="addToCart(product)"
                            class="btn btn-primary"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <QuickViewModal 
      v-if="selectedProduct"
      :product="selectedProduct"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import ProductFilter from '@/components/ProductFilter.vue'
import QuickViewModal from '@/components/QuickViewModal.vue'

export default {
  name: 'Category',
  
  components: {
    ProductCard,
    ProductFilter,
    QuickViewModal
  },

  setup() {
    const store = useStore()
    const route = useRoute()
    const viewMode = ref('grid')
    const selectedProduct = ref(null)

    // Computed
    const loading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
    const filteredProducts = computed(() => store.getters.filteredProducts)

    // Methods
    const showQuickView = (product) => {
      selectedProduct.value = product
      const modal = new bootstrap.Modal(document.getElementById('quickViewModal'))
      modal.show()
    }

    const addToCart = (product) => {
      store.dispatch('addToCart', { ...product, quantity: 1 })
    }

    const clearFilters = () => {
      store.dispatch('updateFilters', {
        category: null,
        priceRange: [0, 50],
        sortBy: 'featured',
        searchQuery: ''
      })
    }

    // Lifecycle
    onMounted(() => {
      const categoryId = route.params.id
      if (categoryId) {
        store.dispatch('updateFilters', { category: categoryId })
      }
      store.dispatch('fetchProducts')
      store.dispatch('fetchCategories')
    })

    return {
      viewMode,
      loading,
      error,
      filteredProducts,
      selectedProduct,
      showQuickView,
      addToCart,
      clearFilters
    }
  }
}
</script>

<style scoped>
.product-list-item {
  background: white;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-list-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-list-item .card-body {
  padding: 1.5rem;
}

.product-category {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary-color);
}

.shipping-badge {
  color: var(--success-color);
  font-size: 0.875rem;
}

.shipping-badge i {
  margin-right: 0.25rem;
}

.view-options .btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.results-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.no-results {
  color: var(--text-secondary);
}

.no-results i {
  opacity: 0.5;
}
</style>
