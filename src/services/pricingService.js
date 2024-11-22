import { PRICING_STRATEGIES, MARGIN_OPTIMIZATION, SEASONAL_PRICING } from '../utils/pricingOptimizer'
import axios from 'axios'

class PricingService {
  constructor() {
    this.marketDataCache = new Map()
    this.competitorDataCache = new Map()
    this.lastUpdate = null
    this.updateInterval = 1000 * 60 * 60 // 1 hour
  }

  // Get real-time market data for a product
  async getMarketData(productId) {
    if (this.shouldUpdateCache(productId)) {
      try {
        // Fetch latest market data
        const marketData = await this._fetchMarketData(productId)
        this.marketDataCache.set(productId, {
          data: marketData,
          timestamp: Date.now()
        })
        return marketData
      } catch (error) {
        console.error('Error fetching market data:', error)
        // Return cached data if available, otherwise default values
        return this.marketDataCache.get(productId)?.data || this._getDefaultMarketData()
      }
    }
    return this.marketDataCache.get(productId).data
  }

  // Calculate optimal price for a product
  async calculateOptimalPrice(product) {
    const marketData = await this.getMarketData(product.id)
    const seasonalMultiplier = this._getSeasonalMultiplier(product.category)
    
    // Get base optimal price
    let optimalPrice = PRICING_STRATEGIES.calculateOptimalPrice(product, marketData)
    
    // Apply seasonal adjustment
    optimalPrice *= seasonalMultiplier

    // Get psychological pricing optimization
    const pricePresentation = PRICING_STRATEGIES.optimizePricePresentation(optimalPrice)

    return {
      ...pricePresentation,
      rawPrice: optimalPrice,
      marketData
    }
  }

  // Calculate bundle pricing
  async calculateBundlePrice(products) {
    // Get market data for all products
    const marketDataPromises = products.map(p => this.getMarketData(p.id))
    const marketDataList = await Promise.all(marketDataPromises)

    // Combine market data
    const aggregateMarketData = this._aggregateMarketData(marketDataList)

    // Calculate bundle price
    const bundlePrice = PRICING_STRATEGIES.calculateBundlePrice(products, aggregateMarketData)

    return {
      ...PRICING_STRATEGIES.optimizePricePresentation(bundlePrice),
      rawPrice: bundlePrice,
      totalSavings: products.reduce((sum, p) => sum + p.price, 0) - bundlePrice
    }
  }

  // Get promotional price
  async getPromotionalPrice(product, promoType) {
    const marketData = await this.getMarketData(product.id)
    const promoPrice = PRICING_STRATEGIES.calculatePromotionalPrice(product, promoType)

    return {
      ...PRICING_STRATEGIES.optimizePricePresentation(promoPrice),
      rawPrice: promoPrice,
      savings: product.price - promoPrice,
      marketData
    }
  }

  // Analyze competitive position
  async analyzeCompetitivePosition(product) {
    const competitorPrices = await this._getCompetitorPrices(product.id)
    return PRICING_STRATEGIES.analyzeCompetitivePricing(product, competitorPrices)
  }

  // Calculate optimal margin
  async calculateOptimalMargin(product) {
    const marketData = await this.getMarketData(product.id)
    return MARGIN_OPTIMIZATION.calculateOptimalMargin(product, marketData)
  }

  // Helper methods (prefixed with _ to indicate they're internal)
  async _fetchMarketData(productId) {
    try {
      const response = await axios.get(`/.netlify/functions/market-data/${productId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching market data:', error)
      return this._getDefaultMarketData()
    }
  }

  async _getCompetitorPrices(productId) {
    try {
      const response = await axios.get(`/.netlify/functions/competitor-prices/${productId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching competitor prices:', error)
      return []
    }
  }

  _getDefaultMarketData() {
    return {
      averagePrice: 0,
      demandLevel: 'medium',
      competitorPrices: [],
      marketTrend: 'stable'
    }
  }

  _getSeasonalMultiplier(category) {
    return SEASONAL_PRICING.getMultiplier(category, new Date())
  }

  _aggregateMarketData(marketDataList) {
    return {
      averagePrice: marketDataList.reduce((sum, data) => sum + data.averagePrice, 0) / marketDataList.length,
      demandLevel: this._aggregateDemandLevel(marketDataList.map(data => data.demandLevel)),
      marketTrend: this._aggregateMarketTrend(marketDataList.map(data => data.marketTrend))
    }
  }

  _aggregateDemandLevel(demandLevels) {
    const levels = { low: 0, medium: 1, high: 2 }
    const average = demandLevels.reduce((sum, level) => sum + levels[level], 0) / demandLevels.length
    if (average < 0.5) return 'low'
    if (average > 1.5) return 'high'
    return 'medium'
  }

  _aggregateMarketTrend(trends) {
    const trendCounts = trends.reduce((counts, trend) => {
      counts[trend] = (counts[trend] || 0) + 1
      return counts
    }, {})
    return Object.entries(trendCounts).sort((a, b) => b[1] - a[1])[0][0]
  }

  shouldUpdateCache(productId) {
    const cached = this.marketDataCache.get(productId)
    if (!cached) return true
    return Date.now() - cached.timestamp > this.updateInterval
  }
}

export default new PricingService()
