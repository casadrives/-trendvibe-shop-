import { createStore } from 'vuex'
import axios from 'axios'

// Import modules
import auth from './modules/auth'
import cart from './modules/cart'
import products from './modules/products'
import orders from './modules/orders'
import pricing from './modules/pricing'

// Auth state
const authModule = {
  namespaced: true,
  state: {
    user: null,
    token: null,
    loading: false,
    error: null
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    error: state => state.error,
    loading: state => state.loading
  },
  actions: {
    async register({ commit }, credentials) {
      try {
        commit('SET_LOADING', true)
        const response = await axios.post('/.netlify/functions/auth/register', credentials)
        
        const { user, token } = response.data
        commit('SET_USER', user)
        commit('SET_TOKEN', token)
        
        // Store token in localStorage
        localStorage.setItem('token', token)
        
        return user
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async login({ commit }, credentials) {
      try {
        commit('SET_LOADING', true)
        const response = await axios.post('/.netlify/functions/auth/login', credentials)
        
        const { user, token } = response.data
        commit('SET_USER', user)
        commit('SET_TOKEN', token)
        
        // Store token in localStorage
        localStorage.setItem('token', token)
        
        return user
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateProfile({ commit, state }, profileData) {
      try {
        commit('SET_LOADING', true)
        const response = await axios.put(
          '/.netlify/functions/auth/profile',
          profileData,
          {
            headers: {
              Authorization: `Bearer ${state.token}`
            }
          }
        )
        
        commit('SET_USER', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    logout({ commit }) {
      // Remove token from localStorage
      localStorage.removeItem('token')
      
      // Clear user data
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    },

    // Initialize auth state from localStorage
    initAuth({ commit, dispatch }) {
      const token = localStorage.getItem('token')
      if (token) {
        commit('SET_TOKEN', token)
        // Fetch user data
        dispatch('fetchUser')
      }
    },

    async fetchUser({ commit, state }) {
      if (!state.token) return

      try {
        commit('SET_LOADING', true)
        const response = await axios.get('/.netlify/functions/auth/user', {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        })
        commit('SET_USER', response.data)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message)
        // If token is invalid, logout
        if (error.response?.status === 401) {
          dispatch('logout')
        }
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  }
}

// Create store
const store = createStore({
  modules: {
    auth: authModule,
    cart,
    products,
    orders,
    pricing
  }
})

// Initialize auth state
store.dispatch('auth/initAuth')

// Initialize cart state
store.dispatch('cart/initializeCart')

// Set up axios interceptors for authentication
axios.interceptors.request.use(
  config => {
    const token = store.state.auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      store.dispatch('auth/logout')
    }
    return Promise.reject(error)
  }
)

export default store
