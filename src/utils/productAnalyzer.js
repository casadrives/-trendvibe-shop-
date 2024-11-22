// Product categories with high profit potential and low competition
export const TRENDING_CATEGORIES = {
  'tech_accessories': {
    profitMargin: 65,
    averagePrice: 25,
    trending: [
      {
        name: 'Phone Camera Lens Kit',
        price: 19.99,
        costPrice: 7.50,
        description: 'Universal clip-on camera lenses for smartphones',
        tags: ['photography', 'mobile', 'instagram']
      },
      {
        name: 'Foldable Phone Stand',
        price: 14.99,
        costPrice: 4.20,
        description: 'Adjustable aluminum phone/tablet holder',
        tags: ['work from home', 'mobile', 'desk accessories']
      },
      {
        name: 'Wireless Earbuds Case',
        price: 12.99,
        costPrice: 3.80,
        description: 'Protective silicone case with carabiner',
        tags: ['audio', 'protection', 'lifestyle']
      }
    ]
  },
  'wellness_fitness': {
    profitMargin: 70,
    averagePrice: 30,
    trending: [
      {
        name: 'Resistance Bands Set',
        price: 24.99,
        costPrice: 8.20,
        description: '5-piece exercise bands with carry bag',
        tags: ['fitness', 'home workout', 'yoga']
      },
      {
        name: 'Massage Gun Mini',
        price: 49.99,
        costPrice: 18.50,
        description: 'Portable muscle massage device',
        tags: ['recovery', 'sports', 'wellness']
      },
      {
        name: 'Yoga Mat Strap',
        price: 15.99,
        costPrice: 4.80,
        description: 'Adjustable carrying strap with storage',
        tags: ['yoga', 'fitness', 'accessories']
      }
    ]
  },
  'eco_friendly': {
    profitMargin: 75,
    averagePrice: 20,
    trending: [
      {
        name: 'Reusable Produce Bags',
        price: 16.99,
        costPrice: 4.90,
        description: 'Set of 5 mesh bags for grocery shopping',
        tags: ['sustainable', 'shopping', 'kitchen']
      },
      {
        name: 'Bamboo Cutlery Set',
        price: 19.99,
        costPrice: 5.80,
        description: 'Portable utensil set with case',
        tags: ['zero waste', 'travel', 'kitchen']
      },
      {
        name: 'Collapsible Coffee Cup',
        price: 22.99,
        costPrice: 6.70,
        description: 'Silicone reusable coffee cup',
        tags: ['coffee', 'sustainable', 'travel']
      }
    ]
  },
  'home_organization': {
    profitMargin: 72,
    averagePrice: 28,
    trending: [
      {
        name: 'Drawer Organizer Set',
        price: 29.99,
        costPrice: 9.80,
        description: '6-piece adjustable drawer dividers',
        tags: ['organization', 'home', 'storage']
      },
      {
        name: 'Cable Management Box',
        price: 24.99,
        costPrice: 7.90,
        description: 'Hide messy cables and power strips',
        tags: ['tech', 'organization', 'home office']
      },
      {
        name: 'Floating Wall Shelf',
        price: 34.99,
        costPrice: 11.20,
        description: 'Modern invisible mounting shelf',
        tags: ['decor', 'storage', 'home']
      }
    ]
  },
  'pet_accessories': {
    profitMargin: 68,
    averagePrice: 25,
    trending: [
      {
        name: 'Pet Water Bottle',
        price: 19.99,
        costPrice: 6.40,
        description: 'Portable dog water dispenser',
        tags: ['dogs', 'travel', 'outdoor']
      },
      {
        name: 'Cat Grooming Glove',
        price: 16.99,
        costPrice: 5.20,
        description: 'Gentle deshedding brush glove',
        tags: ['cats', 'grooming', 'pet care']
      },
      {
        name: 'Slow Feeder Bowl',
        price: 14.99,
        costPrice: 4.80,
        description: 'Anti-gulping pet food bowl',
        tags: ['dogs', 'cats', 'feeding']
      }
    ]
  }
}

// Market analysis functions
export const analyzeMarketTrends = () => {
  const trends = []
  
  for (const [category, data] of Object.entries(TRENDING_CATEGORIES)) {
    const avgProfitMargin = data.profitMargin
    const bestSellers = data.trending.map(product => ({
      ...product,
      profitMargin: ((product.price - product.costPrice) / product.price * 100).toFixed(1),
      category
    }))
    
    trends.push({
      category,
      avgProfitMargin,
      averagePrice: data.averagePrice,
      bestSellers
    })
  }
  
  return trends.sort((a, b) => b.avgProfitMargin - a.avgProfitMargin)
}

// Calculate potential profit
export const calculatePotentialProfit = (product, estimatedMonthlySales) => {
  const profit = (product.price - product.costPrice) * estimatedMonthlySales
  const roi = ((profit / (product.costPrice * estimatedMonthlySales)) * 100).toFixed(1)
  
  return {
    monthlySales: estimatedMonthlySales,
    monthlyProfit: profit.toFixed(2),
    roi: `${roi}%`,
    breakevenUnits: Math.ceil(product.costPrice / (product.price - product.costPrice))
  }
}

// Get product recommendations based on trends and profitability
export const getRecommendedProducts = (budget = 500, minProfitMargin = 60) => {
  const allProducts = []
  
  for (const [category, data] of Object.entries(TRENDING_CATEGORIES)) {
    data.trending.forEach(product => {
      const profitMargin = ((product.price - product.costPrice) / product.price * 100)
      if (product.costPrice <= budget && profitMargin >= minProfitMargin) {
        allProducts.push({
          ...product,
          category,
          profitMargin: profitMargin.toFixed(1)
        })
      }
    })
  }
  
  return allProducts.sort((a, b) => b.profitMargin - a.profitMargin)
}

// Analyze competition level
export const analyzeCompetition = (category) => {
  const competitionLevels = {
    tech_accessories: {
      level: 'High',
      differentiation: 'Focus on unique designs and bundles',
      marketingTips: ['Target tech enthusiasts', 'Create how-to content', 'Partner with tech reviewers']
    },
    wellness_fitness: {
      level: 'Medium',
      differentiation: 'Emphasize quality and workout guides',
      marketingTips: ['Create workout content', 'Partner with fitness influencers', 'Offer workout plans']
    },
    eco_friendly: {
      level: 'Medium-Low',
      differentiation: 'Focus on sustainability and zero waste',
      marketingTips: ['Highlight environmental impact', 'Partner with eco-influencers', 'Create educational content']
    },
    home_organization: {
      level: 'Medium',
      differentiation: 'Focus on space-saving solutions',
      marketingTips: ['Create organization tips', 'Before/after content', 'Target home improvement audience']
    },
    pet_accessories: {
      level: 'Medium-High',
      differentiation: 'Focus on pet safety and comfort',
      marketingTips: ['Partner with pet influencers', 'Create pet care guides', 'Target pet owners']
    }
  }
  
  return competitionLevels[category] || {
    level: 'Unknown',
    differentiation: 'Research needed',
    marketingTips: ['Conduct market research', 'Analyze competitors', 'Test different approaches']
  }
}
