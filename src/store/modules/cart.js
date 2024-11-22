const state = {
  items: [],
  loading: false,
  error: null
}

const getters = {
  cartItems: state => state.items,
  
  cartTotal: state => {
    return state.items.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0)
  },

  cartItemCount: state => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  },

  vatAmount: state => {
    const subtotal = state.items.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0)
    return subtotal * 0.21 // 21% VAT
  },

  shippingCost: state => {
    const subtotal = state.items.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
    // Free shipping for orders over €50
    return subtotal >= 50 ? 0 : 4.95;
  },

  orderTotal: (state, getters) => {
    return getters.cartTotal + getters.vatAmount + getters.shippingCost;
  },

  hasDiscountedItems: state => {
    return state.items.some(item => item.discountedPrice);
  }
}

const actions = {
  addToCart({ commit, state, dispatch }, { product, quantity = 1 }) {
    try {
      commit('SET_LOADING', true)
      const existingItem = state.items.find(item => item.id === product.id)

      if (existingItem) {
        commit('UPDATE_ITEM_QUANTITY', {
          id: product.id,
          quantity: existingItem.quantity + quantity
        })
      } else {
        // Check for promotional pricing
        dispatch('pricing/checkPromotionalPrice', product.id, { root: true });
        commit('ADD_TO_CART', {
          ...product,
          quantity
        })
      }

      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  removeFromCart({ commit, state }, productId) {
    try {
      commit('SET_LOADING', true)
      commit('REMOVE_FROM_CART', productId)
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  updateQuantity({ commit, state }, { productId, quantity }) {
    try {
      commit('SET_LOADING', true)
      commit('UPDATE_ITEM_QUANTITY', { id: productId, quantity })
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  clearCart({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('CLEAR_CART')
      // Clear cart from localStorage
      localStorage.removeItem('cart')
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Load cart from localStorage on app initialization
  initializeCart({ commit }) {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        commit('SET_CART', JSON.parse(savedCart))
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
    }
  }
}

const mutations = {
  ADD_TO_CART(state, item) {
    state.items.push(item)
  },

  REMOVE_FROM_CART(state, productId) {
    state.items = state.items.filter(item => item.id !== productId)
  },

  UPDATE_ITEM_QUANTITY(state, { id, quantity }) {
    const item = state.items.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
      // Remove item if quantity is 0
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== id)
      }
    }
  },

  CLEAR_CART(state) {
    state.items = []
  },

  SET_CART(state, items) {
    state.items = items
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
