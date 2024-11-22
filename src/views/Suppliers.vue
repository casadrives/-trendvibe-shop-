<template>
  <div class="suppliers">
    <div class="container mt-5">
      <h1 class="mb-4">Our Suppliers</h1>

      <!-- Suppliers Grid -->
      <div class="row">
        <div 
          v-for="supplier in suppliers" 
          :key="supplier.id" 
          class="col-md-4 mb-4"
        >
          <div class="card supplier-card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ supplier.name }}</h5>
              <p class="card-text">{{ supplier.description }}</p>
              
              <!-- Supplier Stats -->
              <div class="supplier-stats mb-3">
                <div class="row">
                  <div class="col-6">
                    <div class="stat-item">
                      <small class="text-muted">Products</small>
                      <div class="stat-value">{{ supplier.productCount }}</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="stat-item">
                      <small class="text-muted">Avg. Price</small>
                      <div class="stat-value">€{{ supplier.averagePrice.toFixed(2) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Shipping Info -->
              <div class="shipping-info mb-3">
                <i class="fas fa-shipping-fast text-success"></i>
                <span class="ms-2">Free Shipping Available</span>
              </div>

              <!-- Categories -->
              <div class="categories mb-3">
                <h6>Categories:</h6>
                <div class="category-tags">
                  <span 
                    v-for="category in supplier.categories" 
                    :key="category"
                    class="badge bg-light text-dark me-2 mb-2"
                  >
                    {{ category }}
                  </span>
                </div>
              </div>

              <!-- View Products Button -->
              <a 
                :href="supplier.url" 
                target="_blank" 
                class="btn btn-primary w-100"
              >
                View Products
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!suppliers.length" class="text-center py-5">
        <i class="fas fa-store fa-3x mb-3 text-muted"></i>
        <h3>No suppliers found</h3>
        <p class="text-muted">Check back later for updates</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Suppliers',
  setup() {
    const store = useStore()

    onMounted(() => {
      store.dispatch('fetchSuppliers')
    })

    const suppliers = computed(() => {
      return store.state.suppliers.map(supplier => {
        const products = store.state.products.filter(p => p.supplier_id === supplier.id)
        const totalPrice = products.reduce((sum, p) => sum + p.price, 0)
        
        return {
          ...supplier,
          productCount: products.length,
          averagePrice: products.length ? totalPrice / products.length : 0,
          categories: [...new Set(products.map(p => p.category))]
        }
      })
    })

    return {
      suppliers
    }
  }
}
</script>

<style scoped>
.supplier-card {
  transition: transform 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.supplier-card:hover {
  transform: translateY(-5px);
}

.stat-item {
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
}

.shipping-info {
  color: #28a745;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
}

.badge {
  padding: 8px 12px;
  font-weight: normal;
}
</style>
