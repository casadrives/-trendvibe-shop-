const state = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  loading: false,
  error: null
}

const getters = {
  cartItems: state => state.items,
  cartTotal: state => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
  cartCount: state => state.items.reduce((count, item) => count + item.quantity, 0),
  isCartEmpty: state => state.items.length === 0,
  loading: state => state.loading,
  error: state => state.error,
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

const mutations = {
  ADD_TO_CART(state, product) {
    const existingItem = state.items.find(item => item._id === product._id)
    
    if (existingItem) {
      existingItem.quantity++
    } else {
      state.items.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(state.items))
  },

  REMOVE_FROM_CART(state, productId) {
    state.items = state.items.filter(item => item._id !== productId)
    localStorage.setItem('cart', JSON.stringify(state.items))
  },

  UPDATE_QUANTITY(state, { productId, quantity }) {
    const item = state.items.find(item => item._id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
      localStorage.setItem('cart', JSON.stringify(state.items))
    }
  },

  CLEAR_CART(state) {
    state.items = []
    localStorage.removeItem('cart')
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  addToCart({ commit }, product) {
    try {
      commit('SET_ERROR', null)
      commit('ADD_TO_CART', product)
    } catch (error) {
      commit('SET_ERROR', 'Failed to add item to cart')
      throw error
    }
  },

  removeFromCart({ commit }, productId) {
    try {
      commit('SET_ERROR', null)
      commit('REMOVE_FROM_CART', productId)
    } catch (error) {
      commit('SET_ERROR', 'Failed to remove item from cart')
      throw error
    }
  },

  updateQuantity({ commit }, { productId, quantity }) {
    try {
      commit('SET_ERROR', null)
      commit('UPDATE_QUANTITY', { productId, quantity })
    } catch (error) {
      commit('SET_ERROR', 'Failed to update quantity')
      throw error
    }
  },

  clearCart({ commit }) {
    try {
      commit('SET_ERROR', null)
      commit('CLEAR_CART')
    } catch (error) {
      commit('SET_ERROR', 'Failed to clear cart')
      throw error
    }
  },

  async checkout({ commit, state }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      // Call checkout API endpoint
      const response = await fetch('/.netlify/functions/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: state.items })
      })

      if (!response.ok) {
        throw new Error('Checkout failed')
      }

      const data = await response.json()
      commit('CLEAR_CART')
      return data

    } catch (error) {
      commit('SET_ERROR', error.message || 'Checkout failed')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
