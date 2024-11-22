import axios from 'axios'

const state = {
  profile: null,
  addresses: [],
  wishlist: [],
  notifications: [],
  loading: false,
  error: null
}

const mutations = {
  SET_PROFILE(state, profile) {
    state.profile = profile
  },

  SET_ADDRESSES(state, addresses) {
    state.addresses = addresses
  },

  ADD_ADDRESS(state, address) {
    state.addresses.push(address)
  },

  UPDATE_ADDRESS(state, updatedAddress) {
    const index = state.addresses.findIndex(addr => addr._id === updatedAddress._id)
    if (index !== -1) {
      state.addresses.splice(index, 1, updatedAddress)
    }
  },

  REMOVE_ADDRESS(state, addressId) {
    state.addresses = state.addresses.filter(addr => addr._id !== addressId)
  },

  SET_WISHLIST(state, wishlist) {
    state.wishlist = wishlist
  },

  ADD_TO_WISHLIST(state, product) {
    if (!state.wishlist.some(item => item._id === product._id)) {
      state.wishlist.push(product)
    }
  },

  REMOVE_FROM_WISHLIST(state, productId) {
    state.wishlist = state.wishlist.filter(item => item._id !== productId)
  },

  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications
  },

  ADD_NOTIFICATION(state, notification) {
    state.notifications.unshift(notification)
  },

  MARK_NOTIFICATION_READ(state, notificationId) {
    const notification = state.notifications.find(n => n._id === notificationId)
    if (notification) {
      notification.read = true
    }
  },

  CLEAR_NOTIFICATIONS(state) {
    state.notifications = []
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchProfile({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.get('/.netlify/functions/user/profile')
      commit('SET_PROFILE', response.data)

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch profile')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateProfile({ commit }, profileData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.put('/.netlify/functions/user/profile', profileData)
      commit('SET_PROFILE', response.data)

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update profile')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchAddresses({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.get('/.netlify/functions/user/addresses')
      commit('SET_ADDRESSES', response.data)

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch addresses')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addAddress({ commit }, addressData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.post('/.netlify/functions/user/addresses', addressData)
      commit('ADD_ADDRESS', response.data)

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to add address')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateAddress({ commit }, { addressId, addressData }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.put(`/.netlify/functions/user/addresses/${addressId}`, addressData)
      commit('UPDATE_ADDRESS', response.data)

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update address')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async removeAddress({ commit }, addressId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      await axios.delete(`/.netlify/functions/user/addresses/${addressId}`)
      commit('REMOVE_ADDRESS', addressId)

      return true
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to remove address')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchWishlist({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.get('/.netlify/functions/user/wishlist')
      commit('SET_WISHLIST', response.data)

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch wishlist')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addToWishlist({ commit }, productId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.post('/.netlify/functions/user/wishlist', { productId })
      commit('ADD_TO_WISHLIST', response.data)

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to add to wishlist')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async removeFromWishlist({ commit }, productId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      await axios.delete(`/.netlify/functions/user/wishlist/${productId}`)
      commit('REMOVE_FROM_WISHLIST', productId)

      return true
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to remove from wishlist')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchNotifications({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await axios.get('/.netlify/functions/user/notifications')
      commit('SET_NOTIFICATIONS', response.data)

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch notifications')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async markNotificationRead({ commit }, notificationId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      await axios.patch(`/.netlify/functions/user/notifications/${notificationId}/read`)
      commit('MARK_NOTIFICATION_READ', notificationId)

      return true
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to mark notification as read')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async clearNotifications({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      await axios.delete('/.netlify/functions/user/notifications')
      commit('CLEAR_NOTIFICATIONS')

      return true
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to clear notifications')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  profile: state => state.profile,
  addresses: state => state.addresses,
  defaultAddress: state => state.addresses.find(addr => addr.isDefault),
  wishlist: state => state.wishlist,
  notifications: state => state.notifications,
  unreadNotifications: state => state.notifications.filter(n => !n.read),
  loading: state => state.loading,
  error: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
