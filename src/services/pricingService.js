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
        const marketData = await this.fetchMarketData(productId)
        this.marketDataCache.set(productId, {
          data: marketData,
          timestamp: Date.now()
        })
        return marketData
      } catch (error) {
        console.error('Error fetching market data:', error)
        // Return cached data if available, otherwise default values
        return this.marketDataCache.get(productId)?.data || this.getDefaultMarketData()
      }
    }
    return this.marketDataCache.get(productId).data
  }

  // Calculate optimal price for a product
  async calculateOptimalPrice(product) {
    const marketData = await this.getMarketData(product.id)
    const seasonalMultiplier = this.getSeasonalMultiplier(product.category)
    
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
    const aggregateMarketData = this.aggregateMarketData(marketDataList)

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
    const competitorPrices = await this.getCompetitorPrices(product.id)
    return PRICING_STRATEGIES.analyzeCompetitivePricing(product, competitorPrices)
  }

  // Calculate optimal margin
  async calculateOptimalMargin(product) {
    const marketData = await this.getMarketData(product.id)
    return MARGIN_OPTIMIZATION.calculateOptimalMargin(product, marketData)
  }

  // Private helper methods
  private async fetchMarketData(productId) {
    // Implement API call to get market data
    // This is a placeholder - replace with actual API endpoint
    try {
      const response = await axios.get(`/api/market-data/${productId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching market data:', error)
      return this.getDefaultMarketData()
    }
  }

  private async getCompetitorPrices(productId) {
    // Implement competitor price fetching
    // This is a placeholder - replace with actual API endpoint
    try {
      const response = await axios.get(`/api/competitor-prices/${productId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching competitor prices:', error)
      return []
    }
  }

  private getSeasonalMultiplier(category) {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

    // Find current season
    let currentSeason = null
    for (const [season, data] of Object.entries(SEASONAL_PRICING)) {
      if (this.isDateInRange(dateStr, data.duration)) {
        currentSeason = data
        break
      }
    }

    return currentSeason?.categories[category] || 1.0
  }

  private isDateInRange(dateStr, duration) {
    return dateStr >= duration.start && dateStr <= duration.end
  }

  private shouldUpdateCache(productId) {
    const cached = this.marketDataCache.get(productId)
    if (!cached) return true
    return Date.now() - cached.timestamp > this.updateInterval
  }

  private getDefaultMarketData() {
    return {
      competitorPrices: [],
      demandLevel: 'medium',
      seasonality: 'normal',
      stockLevel: 'medium',
      customerSegment: 'standard',
      competitionLevel: 'medium',
      productUniqueness: 'medium'
    }
  }

  private aggregateMarketData(marketDataList) {
    // Combine market data from multiple products
    return {
      competitorPrices: marketDataList.flatMap(d => d.competitorPrices),
      demandLevel: this.getMostFrequent(marketDataList.map(d => d.demandLevel)),
      seasonality: this.getMostFrequent(marketDataList.map(d => d.seasonality)),
      stockLevel: this.getMostFrequent(marketDataList.map(d => d.stockLevel)),
      customerSegment: this.getMostFrequent(marketDataList.map(d => d.customerSegment)),
      competitionLevel: this.getMostFrequent(marketDataList.map(d => d.competitionLevel))
    }
  }

  private getMostFrequent(arr) {
    return arr.sort((a,b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop()
  }
}

export default new PricingService()
