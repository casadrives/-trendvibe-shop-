// Pricing optimization strategies
export const PRICING_STRATEGIES = {
  // Dynamic pricing based on various factors
  calculateOptimalPrice: (product, marketData) => {
    const {
      competitorPrices,
      demandLevel,
      seasonality,
      stockLevel,
      customerSegment
    } = marketData

    // Base price calculation
    let optimalPrice = product.costPrice * 2.5 // Start with 60% margin

    // Competitor price adjustment (30% weight)
    const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length
    optimalPrice = optimalPrice * 0.7 + (avgCompetitorPrice * 0.3)

    // Demand adjustment (20% impact)
    const demandMultiplier = {
      high: 1.1,
      medium: 1.0,
      low: 0.9
    }
    optimalPrice *= demandMultiplier[demandLevel] || 1.0

    // Seasonality adjustment (15% impact)
    const seasonalityMultiplier = {
      peak: 1.15,
      high: 1.1,
      normal: 1.0,
      low: 0.9
    }
    optimalPrice *= seasonalityMultiplier[seasonality] || 1.0

    // Stock level adjustment (10% impact)
    const stockMultiplier = {
      low: 1.1, // Increase price when stock is low
      medium: 1.0,
      high: 0.9 // Decrease price to move inventory
    }
    optimalPrice *= stockMultiplier[stockLevel] || 1.0

    // Customer segment adjustment (10% impact)
    const segmentMultiplier = {
      premium: 1.1,
      standard: 1.0,
      price_sensitive: 0.9
    }
    optimalPrice *= segmentMultiplier[customerSegment] || 1.0

    // Ensure minimum profit margin of 40%
    const minimumPrice = product.costPrice * 1.67 // 40% margin
    optimalPrice = Math.max(optimalPrice, minimumPrice)

    // Round to nearest .99
    return Math.floor(optimalPrice) + 0.99
  },

  // Bundle pricing optimization
  calculateBundlePrice: (products, marketData) => {
    // Calculate regular total price
    const regularTotal = products.reduce((total, product) => total + product.price, 0)
    
    // Calculate cost price total
    const costTotal = products.reduce((total, product) => total + product.costPrice, 0)
    
    // Calculate minimum viable price (40% margin)
    const minimumPrice = costTotal * 1.67

    // Calculate optimal discount based on various factors
    let discountPercentage = 15 // Base discount

    // Adjust discount based on bundle size
    if (products.length >= 5) {
      discountPercentage += 5
    } else if (products.length >= 3) {
      discountPercentage += 3
    }

    // Adjust for seasonality
    if (marketData.seasonality === 'peak') {
      discountPercentage -= 5
    } else if (marketData.seasonality === 'low') {
      discountPercentage += 5
    }

    // Adjust for competition
    if (marketData.competitionLevel === 'high') {
      discountPercentage += 3
    }

    // Calculate discounted price
    let bundlePrice = regularTotal * (1 - (discountPercentage / 100))

    // Ensure minimum margin
    bundlePrice = Math.max(bundlePrice, minimumPrice)

    // Round to nearest .99
    return Math.floor(bundlePrice) + 0.99
  },

  // Promotional pricing strategies
  calculatePromotionalPrice: (product, promoType) => {
    const strategies = {
      flash_sale: {
        discount: 25,
        duration: '24h',
        minMargin: 35
      },
      weekly_deal: {
        discount: 20,
        duration: '7d',
        minMargin: 40
      },
      bulk_discount: {
        discount: 30,
        duration: 'unlimited',
        minMargin: 30,
        minQuantity: 3
      },
      new_customer: {
        discount: 15,
        duration: 'first_purchase',
        minMargin: 45
      },
      loyalty_reward: {
        discount: 10,
        duration: 'unlimited',
        minMargin: 50
      }
    }

    const strategy = strategies[promoType]
    if (!strategy) return product.price

    // Calculate promotional price
    let promoPrice = product.price * (1 - (strategy.discount / 100))
    
    // Ensure minimum margin
    const minPrice = product.costPrice / (1 - (strategy.minMargin / 100))
    promoPrice = Math.max(promoPrice, minPrice)

    // Round to nearest .99
    return Math.floor(promoPrice) + 0.99
  },

  // Psychological pricing optimization
  optimizePricePresentation: (price) => {
    return {
      mainPrice: Math.floor(price),
      cents: 99,
      displayPrice: `€${Math.floor(price)}.99`,
      marketingAngles: [
        {
          message: `Save €${Math.ceil(price * 0.2)}`,
          emphasis: 'Savings'
        },
        {
          message: 'Free Shipping',
          emphasis: 'Value Add'
        },
        {
          message: '30-Day Returns',
          emphasis: 'Risk Reversal'
        }
      ]
    }
  },

  // Competitive price monitoring
  analyzeCompetitivePricing: (product, competitorPrices) => {
    const analysis = {
      averageMarketPrice: 0,
      pricePosition: '',
      recommendedAction: '',
      potentialRevenueLift: 0
    }

    // Calculate average market price
    analysis.averageMarketPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length

    // Determine price position
    const priceRatio = product.price / analysis.averageMarketPrice
    if (priceRatio < 0.9) {
      analysis.pricePosition = 'below_market'
      analysis.recommendedAction = 'Consider gradual price increase'
      analysis.potentialRevenueLift = (analysis.averageMarketPrice * 0.9 - product.price) * estimated_monthly_sales
    } else if (priceRatio > 1.1) {
      analysis.pricePosition = 'above_market'
      analysis.recommendedAction = 'Monitor conversion rate, consider price adjustment'
      analysis.potentialRevenueLift = 0 // Conservative estimate
    } else {
      analysis.pricePosition = 'competitive'
      analysis.recommendedAction = 'Maintain current pricing'
      analysis.potentialRevenueLift = 0
    }

    return analysis
  }
}

// Profit margin optimization
export const MARGIN_OPTIMIZATION = {
  calculateOptimalMargin: (product, marketData) => {
    // Base margin calculation
    let optimalMargin = 0.6 // Start with 60% margin

    // Adjust for competition
    if (marketData.competitionLevel === 'high') {
      optimalMargin -= 0.05 // Reduce margin in high competition
    } else if (marketData.competitionLevel === 'low') {
      optimalMargin += 0.05 // Increase margin in low competition
    }

    // Adjust for demand
    if (marketData.demandLevel === 'high') {
      optimalMargin += 0.05
    } else if (marketData.demandLevel === 'low') {
      optimalMargin -= 0.05
    }

    // Adjust for product uniqueness
    if (marketData.productUniqueness === 'high') {
      optimalMargin += 0.1
    }

    // Ensure margins stay within viable range
    optimalMargin = Math.max(0.4, Math.min(0.8, optimalMargin))

    return {
      margin: optimalMargin,
      recommendedPrice: product.costPrice / (1 - optimalMargin)
    }
  }
}

// Seasonal pricing calendar
export const SEASONAL_PRICING = {
  spring: {
    categories: {
      eco_friendly: 1.1, // 10% increase
      wellness_fitness: 1.15,
      home_organization: 1.1
    },
    duration: { start: '03-01', end: '05-31' }
  },
  summer: {
    categories: {
      tech_accessories: 1.05,
      pet_accessories: 1.1,
      eco_friendly: 1.1
    },
    duration: { start: '06-01', end: '08-31' }
  },
  fall: {
    categories: {
      home_organization: 1.15,
      tech_accessories: 1.1,
      wellness_fitness: 1.05
    },
    duration: { start: '09-01', end: '11-30' }
  },
  winter: {
    categories: {
      wellness_fitness: 1.15,
      home_organization: 1.1,
      tech_accessories: 1.2
    },
    duration: { start: '12-01', end: '02-28' }
  }
}
