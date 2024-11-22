import axios from 'axios'

const state = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  error: null,
  loading: false
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

const actions = {
  async register({ commit }, credentials) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await axios.post('/.netlify/functions/auth/register', credentials)
      const { user, token } = response.data
      
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Registration failed')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async login({ commit }, credentials) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await axios.post('/.netlify/functions/auth/login', credentials)
      const { user, token } = response.data
      
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Login failed')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async logout({ commit }) {
    try {
      await axios.post('/.netlify/functions/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    }
  },

  async fetchUser({ commit, state }) {
    if (!state.token) return
    
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/.netlify/functions/auth/user')
      commit('SET_USER', response.data)
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch user')
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateProfile({ commit }, userData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await axios.put('/.netlify/functions/auth/profile', userData)
      commit('SET_USER', response.data)
      
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Profile update failed')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user,
  error: state => state.error,
  loading: state => state.loading
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
