import axios from 'axios'

const state = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
}

const getters = {
  allOrders: state => state.orders,
  currentOrder: state => state.currentOrder,
  ordersByStatus: state => status => {
    return state.orders.filter(order => order.status === status)
  },
  isLoading: state => state.loading,
  error: state => state.error
}

const actions = {
  async fetchOrders({ commit, rootState }) {
    if (!rootState.auth.token) return

    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/.netlify/functions/orders', {
        headers: {
          Authorization: `Bearer ${rootState.auth.token}`
        }
      })
      commit('SET_ORDERS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createOrder({ commit, rootState, dispatch }, orderData) {
    try {
      commit('SET_LOADING', true)
      
      // Add user information if authenticated
      if (rootState.auth.token) {
        orderData.userId = rootState.auth.user.id
      }

      // Add VAT calculation
      const subtotal = orderData.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
      
      orderData.vat = subtotal * 0.21 // 21% VAT
      orderData.total = subtotal + orderData.vat
      orderData.status = 'pending'
      orderData.createdAt = new Date().toISOString()

      const response = await axios.post('/.netlify/functions/orders', orderData, {
        headers: rootState.auth.token ? {
          Authorization: `Bearer ${rootState.auth.token}`
        } : {}
      })

      commit('SET_CURRENT_ORDER', response.data)
      
      // Clear the cart after successful order
      dispatch('cart/clearCart', null, { root: true })
      
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOrderById({ commit, rootState }, orderId) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get(`/.netlify/functions/orders/${orderId}`, {
        headers: rootState.auth.token ? {
          Authorization: `Bearer ${rootState.auth.token}`
        } : {}
      })
      commit('SET_CURRENT_ORDER', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateOrderStatus({ commit, rootState }, { orderId, status }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.patch(
        `/.netlify/functions/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        }
      )
      commit('UPDATE_ORDER_STATUS', { orderId, status: response.data.status })
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Handle successful payment
  async handlePaymentSuccess({ commit, dispatch }, { orderId, paymentDetails }) {
    try {
      commit('SET_LOADING', true)
      
      // Update order status to processing after successful payment
      await dispatch('updateOrderStatus', {
        orderId,
        status: 'processing'
      })

      // You might want to store payment details or trigger other actions
      // such as sending confirmation emails, updating inventory, etc.
      
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_ORDERS(state, orders) {
    state.orders = orders
  },

  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order
  },

  UPDATE_ORDER_STATUS(state, { orderId, status }) {
    const order = state.orders.find(o => o.id === orderId)
    if (order) {
      order.status = status
    }
    if (state.currentOrder && state.currentOrder.id === orderId) {
      state.currentOrder.status = status
    }
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
