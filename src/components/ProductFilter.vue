<template>
  <div class="product-filter">
    <!-- Search Bar -->
    <div class="search-bar mb-4">
      <div class="input-group">
        <span class="input-group-text">
          <i class="fas fa-search"></i>
        </span>
        <input 
          type="text" 
          class="form-control" 
          placeholder="Search products..."
          v-model="searchQuery"
          @input="updateFilters"
        >
      </div>
    </div>

    <!-- Category Filter -->
    <div class="filter-section mb-4">
      <h5 class="filter-title">Categories</h5>
      <div class="category-list">
        <button 
          class="btn btn-filter"
          :class="{ active: !selectedCategory }"
          @click="selectCategory(null)"
        >
          All Categories
        </button>
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="btn btn-filter"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
          <span class="badge bg-secondary ms-2">{{ category.productCount }}</span>
        </button>
      </div>
    </div>

    <!-- Price Range Filter -->
    <div class="filter-section mb-4">
      <h5 class="filter-title">Price Range</h5>
      <div class="price-range">
        <div class="range-inputs d-flex gap-2 align-items-center">
          <div class="input-group">
            <span class="input-group-text">€</span>
            <input 
              type="number" 
              class="form-control" 
              v-model.number="priceRange[0]"
              min="0"
              max="50"
              @change="updateFilters"
            >
          </div>
          <span>-</span>
          <div class="input-group">
            <span class="input-group-text">€</span>
            <input 
              type="number" 
              class="form-control" 
              v-model.number="priceRange[1]"
              min="0"
              max="50"
              @change="updateFilters"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Sort Options -->
    <div class="filter-section">
      <h5 class="filter-title">Sort By</h5>
      <select 
        class="form-select" 
        v-model="sortBy"
        @change="updateFilters"
      >
        <option value="featured">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="newest">Newest First</option>
      </select>
    </div>

    <!-- Clear Filters -->
    <button 
      class="btn btn-outline-secondary w-100 mt-4"
      @click="clearFilters"
    >
      Clear All Filters
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProductFilter',
  
  setup() {
    const store = useStore()
    
    // Local state
    const searchQuery = ref('')
    const selectedCategory = ref(null)
    const priceRange = ref([0, 50])
    const sortBy = ref('featured')

    // Computed
    const categories = computed(() => store.getters.categories)

    // Methods
    const updateFilters = () => {
      store.dispatch('updateFilters', {
        searchQuery: searchQuery.value,
        category: selectedCategory.value,
        priceRange: priceRange.value,
        sortBy: sortBy.value
      })
    }

    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId
      updateFilters()
    }

    const clearFilters = () => {
      searchQuery.value = ''
      selectedCategory.value = null
      priceRange.value = [0, 50]
      sortBy.value = 'featured'
      updateFilters()
    }

    return {
      searchQuery,
      selectedCategory,
      priceRange,
      sortBy,
      categories,
      selectCategory,
      updateFilters,
      clearFilters
    }
  }
}
</script>

<style scoped>
.product-filter {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.filter-section {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.filter-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.btn-filter:hover {
  background: var(--background-light);
  color: var(--text-primary);
}

.btn-filter.active {
  background: var(--primary-color);
  color: white;
}

.btn-filter.active .badge {
  background: white !important;
  color: var(--primary-color);
}

.price-range {
  padding: 0 0.5rem;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.1);
}

.input-group-text {
  background: var(--background-light);
  border-color: var(--border-color);
}
</style>
