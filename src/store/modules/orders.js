import axios from 'axios'

const state = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
}

const mutations = {
  SET_ORDERS(state, orders) {
    state.orders = orders
  },

  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  },

  UPDATE_ORDER_STATUS(state, { orderId, status }) {
    const order = state.orders.find(o => o._id === orderId)
    if (order) {
      order.status = status
    }
  }
}

const actions = {
  async fetchOrders({ commit, state }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const { page, limit } = state.pagination
      const response = await axios.get('/.netlify/functions/orders', {
        params: { page, limit }
      })

      commit('SET_ORDERS', response.data.orders)
      commit('SET_PAGINATION', {
        total: response.data.total,
        page: response.data.page
      })

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch orders')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOrderById({ commit }, orderId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.get(`/.netlify/functions/orders/${orderId}`)
      commit('SET_CURRENT_ORDER', response.data)

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch order')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createOrder({ commit }, orderData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.post('/.netlify/functions/orders', orderData)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to create order')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateOrderStatus({ commit }, { orderId, status }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.patch(`/.netlify/functions/orders/${orderId}/status`, { status })
      commit('UPDATE_ORDER_STATUS', { orderId, status: response.data.status })

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update order status')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async cancelOrder({ commit }, orderId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.post(`/.netlify/functions/orders/${orderId}/cancel`)
      commit('UPDATE_ORDER_STATUS', { orderId, status: 'cancelled' })

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to cancel order')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  setPage({ commit, dispatch }, page) {
    commit('SET_PAGINATION', { page })
    return dispatch('fetchOrders')
  }
}

const getters = {
  allOrders: state => state.orders,
  currentOrder: state => state.currentOrder,
  loading: state => state.loading,
  error: state => state.error,
  pagination: state => state.pagination,
  
  ordersByStatus: state => status => {
    return state.orders.filter(order => order.status === status)
  },
  
  totalRevenue: state => {
    return state.orders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + order.total, 0)
  },
  
  orderCount: state => {
    return state.orders.length
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
