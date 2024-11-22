// Import axios for API calls
import axios from 'axios'

const state = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    priceRange: null,
    sortBy: 'newest'
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0
  }
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },

  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },

  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  },

  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(p => p._id === updatedProduct._id)
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct)
    }
  }
}

const actions = {
  async fetchProducts({ commit, state }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const { page, limit } = state.pagination
      const { category, priceRange, sortBy } = state.filters
      
      const response = await axios.get('/.netlify/functions/products', {
        params: {
          page,
          limit,
          category,
          priceRange,
          sortBy
        }
      })

      commit('SET_PRODUCTS', response.data.products)
      commit('SET_PAGINATION', {
        total: response.data.total,
        page: response.data.page
      })

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch products')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchProductById({ commit }, productId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.get(`/.netlify/functions/products/${productId}`)
      commit('SET_CURRENT_PRODUCT', response.data)

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch product')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createProduct({ commit }, productData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.post('/.netlify/functions/products', productData)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to create product')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateProduct({ commit }, { productId, productData }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.put(`/.netlify/functions/products/${productId}`, productData)
      commit('UPDATE_PRODUCT', response.data)
      
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update product')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteProduct({ commit }, productId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      await axios.delete(`/.netlify/functions/products/${productId}`)
      return true
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to delete product')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  setFilters({ commit, dispatch }, filters) {
    commit('SET_FILTERS', filters)
    commit('SET_PAGINATION', { page: 1 }) // Reset to first page when filters change
    return dispatch('fetchProducts')
  },

  setPage({ commit, dispatch }, page) {
    commit('SET_PAGINATION', { page })
    return dispatch('fetchProducts')
  }
}

const getters = {
  allProducts: state => state.products,
  currentProduct: state => state.currentProduct,
  loading: state => state.loading,
  error: state => state.error,
  filters: state => state.filters,
  pagination: state => state.pagination,
  
  filteredProducts: state => {
    let filtered = [...state.products]
    
    if (state.filters.category) {
      filtered = filtered.filter(p => p.category === state.filters.category)
    }
    
    if (state.filters.priceRange) {
      const [min, max] = state.filters.priceRange
      filtered = filtered.filter(p => p.price >= min && p.price <= max)
    }
    
    switch (state.filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'popularity':
        filtered.sort((a, b) => b.popularity - a.popularity)
        break
    }
    
    return filtered
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
