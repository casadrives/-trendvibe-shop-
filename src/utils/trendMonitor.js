import axios from 'axios'

// Social media trend monitoring
export const TREND_SOURCES = {
  tiktok: {
    weight: 0.35,
    trendingHashtags: [
      '#amazonfinds', '#tiktokmademebuyit', '#smallbusiness',
      '#ecolife', '#petsoftiktok', '#homehacks', '#fitnesstips'
    ]
  },
  instagram: {
    weight: 0.25,
    trendingHashtags: [
      '#sustainableliving', '#petlife', '#homedecor',
      '#techessentials', '#fitnessmotivation', '#organizationhacks'
    ]
  },
  pinterest: {
    weight: 0.20,
    categories: [
      'Home Organization', 'Eco-Friendly Products',
      'Pet Accessories', 'Fitness Equipment', 'Tech Gadgets'
    ]
  },
  google: {
    weight: 0.20,
    trendingSearches: [
      'sustainable products', 'home office organization',
      'pet care essentials', 'home workout equipment',
      'tech accessories'
    ]
  }
}

// Advanced trend scoring system
export const calculateTrendScore = (product) => {
  let score = 0
  const {
    socialMentions,
    searchVolume,
    competitorPrices,
    seasonality,
    profitMargin
  } = product.metrics

  // Social media impact (35%)
  score += (socialMentions / 1000) * 0.35

  // Search volume trend (25%)
  score += (searchVolume / 100) * 0.25

  // Price competitiveness (20%)
  const priceCompetitiveness = 1 - (product.price / competitorPrices.average)
  score += priceCompetitiveness * 0.20

  // Seasonality factor (10%)
  score += seasonality * 0.10

  // Profit margin (10%)
  score += (profitMargin / 100) * 0.10

  return score.toFixed(2)
}

// Seasonal trend prediction
export const SEASONAL_TRENDS = {
  spring: {
    categories: ['fitness', 'eco_friendly', 'home_organization'],
    boost: 1.2,
    duration: { start: 2, end: 4 } // March-May
  },
  summer: {
    categories: ['tech_accessories', 'pet_accessories', 'eco_friendly'],
    boost: 1.3,
    duration: { start: 5, end: 7 } // June-August
  },
  fall: {
    categories: ['home_organization', 'tech_accessories', 'wellness_fitness'],
    boost: 1.1,
    duration: { start: 8, end: 10 } // September-November
  },
  winter: {
    categories: ['wellness_fitness', 'home_organization', 'tech_accessories'],
    boost: 1.4,
    duration: { start: 11, end: 1 } // December-February
  }
}

// Competition analysis
export const analyzeCompetitors = async (product) => {
  try {
    // Simulate API call to price comparison service
    const competitors = [
      { name: 'Amazon', price: product.price * 1.2 },
      { name: 'eBay', price: product.price * 1.1 },
      { name: 'AliExpress', price: product.price * 0.7 }
    ]

    const averagePrice = competitors.reduce((acc, curr) => acc + curr.price, 0) / competitors.length
    const pricePosition = competitors.filter(c => c.price > product.price).length / competitors.length

    return {
      competitors,
      averagePrice,
      pricePosition,
      isPriceCompetitive: product.price <= averagePrice
    }
  } catch (error) {
    console.error('Error analyzing competitors:', error)
    return null
  }
}

// Marketing strategy generator
export const generateMarketingStrategy = (product) => {
  const strategies = {
    social: [
      {
        platform: 'TikTok',
        content: [
          'Create unboxing videos',
          'Before/after demonstrations',
          'User testimonials',
          'Product hacks and tips',
          'Trending sound integration'
        ],
        frequency: 'Daily',
        budget: '€20-30/day'
      },
      {
        platform: 'Instagram',
        content: [
          'Product lifestyle photos',
          'Instagram Stories with swipe-up',
          'Influencer collaborations',
          'User-generated content reposts',
          'Behind-the-scenes content'
        ],
        frequency: 'Daily',
        budget: '€15-25/day'
      },
      {
        platform: 'Pinterest',
        content: [
          'Product pins with rich descriptions',
          'How-to guides',
          'Lifestyle integration pins',
          'Season-specific content',
          'Shopping catalogs'
        ],
        frequency: '3-4 times/week',
        budget: '€10-15/day'
      }
    ],
    email: [
      {
        type: 'Welcome Series',
        content: [
          'Introduction and brand story',
          'First purchase discount',
          'Product care guides',
          'Social proof and reviews'
        ],
        timing: 'Immediate after signup'
      },
      {
        type: 'Abandoned Cart',
        content: [
          'Reminder with product image',
          'Social proof',
          'Limited time discount',
          'Free shipping offer'
        ],
        timing: '1 hour, 24 hours, 72 hours'
      },
      {
        type: 'Post-Purchase',
        content: [
          'Order confirmation',
          'Shipping updates',
          'Product care instructions',
          'Review request',
          'Cross-sell recommendations'
        ],
        timing: 'Various triggers'
      }
    ],
    advertising: [
      {
        platform: 'Facebook/Instagram Ads',
        strategy: [
          'Lookalike audiences',
          'Retargeting campaigns',
          'Dynamic product ads',
          'Collection ads',
          'Story ads'
        ],
        budget: '€30-50/day'
      },
      {
        platform: 'Google Shopping',
        strategy: [
          'Product listing ads',
          'Dynamic remarketing',
          'Smart shopping campaigns'
        ],
        budget: '€20-40/day'
      },
      {
        platform: 'TikTok Ads',
        strategy: [
          'In-feed ads',
          'Hashtag challenges',
          'Brand takeovers',
          'Spark ads'
        ],
        budget: '€25-45/day'
      }
    ],
    contentMarketing: [
      {
        type: 'Blog Posts',
        topics: [
          'How-to guides',
          'Product comparisons',
          'Lifestyle integration',
          'Problem-solving content',
          'Trend analysis'
        ],
        frequency: '2-3 times/week'
      },
      {
        type: 'Video Content',
        formats: [
          'Product demonstrations',
          'Unboxing videos',
          'Customer testimonials',
          'Behind-the-scenes',
          'How-to tutorials'
        ],
        frequency: '3-4 times/week'
      },
      {
        type: 'User-Generated Content',
        strategy: [
          'Photo contests',
          'Review incentives',
          'Hashtag campaigns',
          'Customer spotlight series'
        ],
        frequency: 'Ongoing'
      }
    ]
  }

  return {
    ...strategies,
    productSpecific: generateProductSpecificStrategy(product)
  }
}

// Generate product-specific marketing strategy
const generateProductSpecificStrategy = (product) => {
  const strategies = {
    eco_friendly: {
      uniqueSellingPoints: [
        'Sustainable materials',
        'Reduced carbon footprint',
        'Zero waste packaging',
        'Environmental impact statistics'
      ],
      targetAudience: [
        'Environmentally conscious consumers',
        'Zero waste community',
        'Sustainable lifestyle advocates'
      ],
      contentThemes: [
        'Environmental impact',
        'Sustainable living tips',
        'Zero waste journey'
      ]
    },
    tech_accessories: {
      uniqueSellingPoints: [
        'Universal compatibility',
        'Premium materials',
        'Enhanced functionality',
        'Modern design'
      ],
      targetAudience: [
        'Tech enthusiasts',
        'Remote workers',
        'Digital nomads'
      ],
      contentThemes: [
        'Tech tips and tricks',
        'Productivity hacks',
        'Gadget reviews'
      ]
    },
    wellness_fitness: {
      uniqueSellingPoints: [
        'Premium quality',
        'Workout effectiveness',
        'Compact design',
        'Versatile use'
      ],
      targetAudience: [
        'Fitness enthusiasts',
        'Home workout fans',
        'Wellness-focused individuals'
      ],
      contentThemes: [
        'Workout routines',
        'Fitness challenges',
        'Health tips'
      ]
    },
    pet_accessories: {
      uniqueSellingPoints: [
        'Pet safety',
        'Comfort focus',
        'Durable materials',
        'Practical design'
      ],
      targetAudience: [
        'Pet owners',
        'Pet care enthusiasts',
        'Animal lovers'
      ],
      contentThemes: [
        'Pet care tips',
        'Pet lifestyle',
        'Product demonstrations'
      ]
    },
    home_organization: {
      uniqueSellingPoints: [
        'Space optimization',
        'Aesthetic design',
        'Practical solutions',
        'Quality materials'
      ],
      targetAudience: [
        'Home organization enthusiasts',
        'Interior design fans',
        'Minimalists'
      ],
      contentThemes: [
        'Organization tips',
        'Before/after transformations',
        'Space-saving hacks'
      ]
    }
  }

  return strategies[product.category] || {
    uniqueSellingPoints: [
      'Quality materials',
      'Practical design',
      'Great value'
    ],
    targetAudience: [
      'Value-conscious consumers',
      'Quality seekers'
    ],
    contentThemes: [
      'Product benefits',
      'User testimonials',
      'How-to guides'
    ]
  }
}
