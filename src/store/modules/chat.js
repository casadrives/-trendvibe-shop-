import axios from 'axios'

// Predefined responses for common queries
const PREDEFINED_RESPONSES = {
  'track_order': {
    text: 'To track your order, please provide your order number and I\'ll look it up for you.',
    quickReplies: ['I don\'t have my order number', 'View all my orders']
  },
  'shipping': {
    text: 'We offer free shipping on all orders! Delivery typically takes 3-5 business days within Europe.',
    quickReplies: ['Shipping countries', 'Track my order', 'Delivery time']
  },
  'returns': {
    text: 'Our return policy is simple: If you\'re not satisfied, you have 30 days to return the item for a full refund.',
    quickReplies: ['Start a return', 'Return policy details', 'Contact support']
  },
  'recommendations': {
    text: 'I\'d be happy to recommend some products! What type of items are you interested in?',
    quickReplies: ['Trending items', 'New arrivals', 'Under €25', 'Sale items']
  }
}

// Common patterns for intent recognition
const INTENT_PATTERNS = {
  track_order: [
    /track.*order/i,
    /where.*order/i,
    /status.*order/i,
    /my.*order/i
  ],
  shipping: [
    /shipping/i,
    /delivery/i,
    /how long.*take/i,
    /when.*arrive/i
  ],
  returns: [
    /return/i,
    /refund/i,
    /money back/i,
    /exchange/i
  ],
  recommendations: [
    /recommend/i,
    /suggest/i,
    /looking for/i,
    /what.*trending/i,
    /popular/i
  ]
}

const state = {
  chatHistory: [],
  isTyping: false,
  context: {
    lastIntent: null,
    orderContext: null,
    productContext: null
  }
}

const mutations = {
  SET_CHAT_HISTORY(state, history) {
    state.chatHistory = history
  },
  ADD_MESSAGE(state, message) {
    state.chatHistory.push(message)
  },
  SET_TYPING(state, isTyping) {
    state.isTyping = isTyping
  },
  SET_CONTEXT(state, { key, value }) {
    state.context[key] = value
  }
}

const actions = {
  async sendMessage({ commit, state, rootState }, message) {
    // Detect intent from message
    let intent = null
    for (const [key, patterns] of Object.entries(INTENT_PATTERNS)) {
      if (patterns.some(pattern => pattern.test(message))) {
        intent = key
        break
      }
    }

    // Store the intent in context
    if (intent) {
      commit('SET_CONTEXT', { key: 'lastIntent', value: intent })
    }

    // Get predefined response if available
    if (intent && PREDEFINED_RESPONSES[intent]) {
      return PREDEFINED_RESPONSES[intent]
    }

    // Process order-related queries
    if (message.includes('order') && rootState.orders) {
      const orderNumber = message.match(/\b[A-Z0-9]{6,}\b/)?.[0]
      if (orderNumber) {
        const order = rootState.orders.items.find(o => o.id === orderNumber)
        if (order) {
          return {
            text: `I found your order #${orderNumber}. Status: ${order.status}. ${getOrderStatusMessage(order.status)}`,
            quickReplies: ['Track another order', 'Need help with this order', 'Return this order']
          }
        }
      }
    }

    // Process product recommendations
    if (intent === 'recommendations' || message.toLowerCase().includes('recommend')) {
      const products = rootState.products.items
        .filter(p => p.inStock && p.price <= 50)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 3)

      if (products.length > 0) {
        const recommendations = products
          .map(p => `${p.name} (€${p.price})`)
          .join(', ')

        return {
          text: `Based on our trending items, I recommend: ${recommendations}. Would you like to see any of these products?`,
          quickReplies: ['Show more recommendations', 'Filter by price', 'See trending items']
        }
      }
    }

    // Fallback response with context-aware suggestions
    return {
      text: "I'm here to help! What would you like to know about our products, orders, or shipping?",
      quickReplies: ['View trending items', 'Track my order', 'Shipping information', 'Return policy']
    }
  },

  async initializeChat({ commit }) {
    commit('SET_CHAT_HISTORY', [])
  },

  async clearChat({ commit }) {
    commit('SET_CHAT_HISTORY', [])
    commit('SET_CONTEXT', { key: 'lastIntent', value: null })
    commit('SET_CONTEXT', { key: 'orderContext', value: null })
    commit('SET_CONTEXT', { key: 'productContext', value: null })
  }
}

const getters = {
  getChatHistory: state => state.chatHistory,
  isTyping: state => state.isTyping,
  getContext: state => key => state.context[key]
}

// Helper function for order status messages
function getOrderStatusMessage(status) {
  const messages = {
    'pending': 'Your order is being processed.',
    'shipped': 'Your order is on its way!',
    'delivered': 'Your order has been delivered.',
    'cancelled': 'Your order has been cancelled.',
    'returned': 'Your return is being processed.'
  }
  return messages[status.toLowerCase()] || 'Please contact support for more information.'
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
