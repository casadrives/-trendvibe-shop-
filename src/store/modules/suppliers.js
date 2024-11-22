import axios from 'axios'

const state = {
  suppliers: [],
  selectedSupplier: null,
  loading: false,
  error: null,
  supplierProducts: {},
  supplierInventory: {}
}

const getters = {
  allSuppliers: state => state.suppliers,
  selectedSupplier: state => state.selectedSupplier,
  supplierProducts: state => supplierId => state.supplierProducts[supplierId] || [],
  supplierInventory: state => (supplierId, productId) => {
    return state.supplierInventory[`${supplierId}-${productId}`] || { stock: 0, price: 0 }
  },
  isLoading: state => state.loading,
  error: state => state.error
}

const actions = {
  async fetchSuppliers({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/.netlify/functions/suppliers')
      commit('SET_SUPPLIERS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchSupplierProducts({ commit }, supplierId) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get(`/.netlify/functions/suppliers/${supplierId}/products`)
      commit('SET_SUPPLIER_PRODUCTS', { 
        supplierId, 
        products: response.data
      })
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async checkProductAvailability({ commit }, { supplierId, productId }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get(
        `/.netlify/functions/suppliers/${supplierId}/products/${productId}/inventory`
      )
      commit('SET_SUPPLIER_INVENTORY', {
        supplierId,
        productId,
        inventory: response.data
      })
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      return { stock: 0, price: 0 }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async placeSupplierOrder({ commit }, orderData) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post(
        `/.netlify/functions/suppliers/${orderData.supplierId}/orders`,
        orderData
      )
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  selectSupplier({ commit }, supplier) {
    commit('SET_SELECTED_SUPPLIER', supplier)
  },

  // Import products from supplier
  async importProducts({ commit, dispatch }, { supplierId, products }) {
    try {
      commit('SET_LOADING', true)
      
      // Transform supplier products to your store format
      const transformedProducts = products.map(product => ({
        name: product.name,
        description: product.description,
        price: product.price * 1.5, // 50% markup
        image: product.image,
        category: product.category,
        supplierId: supplierId,
        supplierProductId: product.id,
        stock: product.stock,
        createdAt: new Date().toISOString()
      }))

      // Add products to your store
      const response = await axios.post('/.netlify/functions/products/bulk', transformedProducts)
      
      // Refresh products list
      dispatch('products/fetchProducts', null, { root: true })
      
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Sync inventory with supplier
  async syncInventory({ commit, state, dispatch }) {
    try {
      commit('SET_LOADING', true)
      
      const updates = []
      for (const supplier of state.suppliers) {
        const products = await dispatch('fetchSupplierProducts', supplier.id)
        
        for (const product of products) {
          const inventory = await dispatch('checkProductAvailability', {
            supplierId: supplier.id,
            productId: product.id
          })
          
          updates.push({
            supplierId: supplier.id,
            productId: product.id,
            stock: inventory.stock,
            price: inventory.price * 1.5 // 50% markup
          })
        }
      }

      // Bulk update inventory
      await axios.post('/.netlify/functions/products/sync-inventory', updates)
      
      // Refresh products
      dispatch('products/fetchProducts', null, { root: true })
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_SUPPLIERS(state, suppliers) {
    state.suppliers = suppliers
  },

  SET_SELECTED_SUPPLIER(state, supplier) {
    state.selectedSupplier = supplier
  },

  SET_SUPPLIER_PRODUCTS(state, { supplierId, products }) {
    state.supplierProducts = {
      ...state.supplierProducts,
      [supplierId]: products
    }
  },

  SET_SUPPLIER_INVENTORY(state, { supplierId, productId, inventory }) {
    state.supplierInventory = {
      ...state.supplierInventory,
      [`${supplierId}-${productId}`]: inventory
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
