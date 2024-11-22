// Import axios for API calls
import axios from 'axios'

const state = {
  products: [],
  featuredProducts: [],
  trendingProducts: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    priceRange: [0, 50],
    sortBy: 'featured',
    searchQuery: '',
    inStock: true,
    freeShipping: false,
    onSale: false
  }
}

const getters = {
  allProducts: state => state.products,
  featuredProducts: state => state.featuredProducts,
  trendingProducts: state => state.trendingProducts,
  filteredProducts: state => {
    let filtered = [...state.products]

    // Apply category filter
    if (state.filters.category) {
      filtered = filtered.filter(product => 
        product.category === state.filters.category
      )
    }

    // Apply price range filter
    filtered = filtered.filter(product => {
      const price = product.discountedPrice || product.price;
      return price >= state.filters.priceRange[0] &&
             price <= state.filters.priceRange[1];
    })

    // Apply search query
    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply in stock filter
    if (state.filters.inStock) {
      filtered = filtered.filter(product => product.stockQuantity > 0)
    }

    // Apply free shipping filter
    if (state.filters.freeShipping) {
      filtered = filtered.filter(product => product.freeShipping)
    }

    // Apply on sale filter
    if (state.filters.onSale) {
      filtered = filtered.filter(product => product.discountedPrice)
    }

    // Apply sorting
    switch (state.filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.discountedPrice || a.price;
          const priceB = b.discountedPrice || b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.discountedPrice || a.price;
          const priceB = b.discountedPrice || b.price;
          return priceB - priceA;
        });
        break;
      case 'trending':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Featured sorting (default)
        filtered.sort((a, b) => b.featured - a.featured);
    }

    return filtered;
  },
  isLoading: state => state.loading,
  error: state => state.error
}

const actions = {
  async fetchProducts({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/api/products')
      commit('SET_PRODUCTS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchFeaturedProducts({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/api/products/featured')
      commit('SET_FEATURED_PRODUCTS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTrendingProducts({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/api/products/trending')
      commit('SET_TRENDING_PRODUCTS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async incrementProductView({ commit }, productId) {
    try {
      await axios.post(`/api/products/${productId}/view`)
    } catch (error) {
      console.error('Failed to increment product view:', error)
    }
  },

  updateFilters({ commit }, filters) {
    commit('SET_FILTERS', filters)
  },

  async searchProducts({ commit }, query) {
    try {
      commit('SET_LOADING', true)
      commit('SET_FILTERS', { ...state.filters, searchQuery: query })
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },

  SET_FEATURED_PRODUCTS(state, products) {
    state.featuredProducts = products
  },

  SET_TRENDING_PRODUCTS(state, products) {
    state.trendingProducts = products
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
