import PricingService from '@/services/pricingService'

// Initial state
const state = {
  optimizedPrices: {},
  bundlePrices: {},
  promotionalPrices: {},
  competitiveAnalysis: {},
  loading: false,
  error: null
}

// Getters
const getters = {
  getOptimizedPrice: (state) => (productId) => {
    return state.optimizedPrices[productId]
  },
  getBundlePrice: (state) => (bundleId) => {
    return state.bundlePrices[bundleId]
  },
  getPromotionalPrice: (state) => (productId, promoType) => {
    return state.promotionalPrices[`${productId}-${promoType}`]
  },
  getCompetitiveAnalysis: (state) => (productId) => {
    return state.competitiveAnalysis[productId]
  },
  isLoading: (state) => state.loading,
  getError: (state) => state.error
}

// Actions
const actions = {
  async optimizePrice({ commit }, product) {
    try {
      commit('SET_LOADING', true)
      const optimizedPrice = await PricingService.calculateOptimalPrice(product)
      commit('SET_OPTIMIZED_PRICE', { productId: product.id, price: optimizedPrice })
      return optimizedPrice
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async calculateBundlePrice({ commit }, { products, bundleId }) {
    try {
      commit('SET_LOADING', true)
      const bundlePrice = await PricingService.calculateBundlePrice(products)
      commit('SET_BUNDLE_PRICE', { bundleId, price: bundlePrice })
      return bundlePrice
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async getPromotionalPrice({ commit }, { product, promoType }) {
    try {
      commit('SET_LOADING', true)
      const promoPrice = await PricingService.getPromotionalPrice(product, promoType)
      commit('SET_PROMOTIONAL_PRICE', { 
        key: `${product.id}-${promoType}`, 
        price: promoPrice 
      })
      return promoPrice
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async analyzeCompetition({ commit }, product) {
    try {
      commit('SET_LOADING', true)
      const analysis = await PricingService.analyzeCompetitivePosition(product)
      commit('SET_COMPETITIVE_ANALYSIS', { 
        productId: product.id, 
        analysis 
      })
      return analysis
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async optimizeMargin({ commit }, product) {
    try {
      commit('SET_LOADING', true)
      return await PricingService.calculateOptimalMargin(product)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Batch optimization for multiple products
  async optimizeBatchPrices({ dispatch }, products) {
    try {
      const optimizationPromises = products.map(product => 
        dispatch('optimizePrice', product)
      )
      return await Promise.all(optimizationPromises)
    } catch (error) {
      console.error('Batch optimization failed:', error)
      throw error
    }
  }
}

// Mutations
const mutations = {
  SET_OPTIMIZED_PRICE(state, { productId, price }) {
    state.optimizedPrices = {
      ...state.optimizedPrices,
      [productId]: price
    }
  },

  SET_BUNDLE_PRICE(state, { bundleId, price }) {
    state.bundlePrices = {
      ...state.bundlePrices,
      [bundleId]: price
    }
  },

  SET_PROMOTIONAL_PRICE(state, { key, price }) {
    state.promotionalPrices = {
      ...state.promotionalPrices,
      [key]: price
    }
  },

  SET_COMPETITIVE_ANALYSIS(state, { productId, analysis }) {
    state.competitiveAnalysis = {
      ...state.competitiveAnalysis,
      [productId]: analysis
    }
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  CLEAR_ERROR(state) {
    state.error = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
