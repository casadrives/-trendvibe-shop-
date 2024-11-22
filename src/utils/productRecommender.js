// Enhanced product recommendations with AI-driven insights
export const PRODUCT_BUNDLES = {
  eco_friendly: {
    starter: {
      name: 'Eco Essentials Starter Kit',
      products: [
        {
          name: 'Reusable Produce Bags Set',
          price: 16.99,
          costPrice: 4.90,
          description: '5 mesh bags for grocery shopping'
        },
        {
          name: 'Bamboo Cutlery Set',
          price: 19.99,
          costPrice: 5.80,
          description: 'Portable utensil set with case'
        },
        {
          name: 'Collapsible Coffee Cup',
          price: 22.99,
          costPrice: 6.70,
          description: 'Silicone reusable coffee cup'
        }
      ],
      bundlePrice: 49.99, // 17% discount
      description: 'Start your zero-waste journey',
      targetAudience: 'Eco-conscious beginners'
    },
    premium: {
      name: 'Zero Waste Pro Kit',
      products: [
        {
          name: 'Glass Food Container Set',
          price: 34.99,
          costPrice: 10.50,
          description: '3 leak-proof containers'
        },
        {
          name: 'Beeswax Food Wraps',
          price: 24.99,
          costPrice: 7.50,
          description: 'Reusable food wraps set'
        },
        {
          name: 'Bamboo Dish Brush',
          price: 12.99,
          costPrice: 3.90,
          description: 'Biodegradable cleaning brush'
        }
      ],
      bundlePrice: 59.99, // 18% discount
      description: 'Complete zero-waste kitchen solution',
      targetAudience: 'Committed eco-warriors'
    }
  },
  tech_accessories: {
    mobile: {
      name: 'Mobile Photography Kit',
      products: [
        {
          name: 'Phone Camera Lens Kit',
          price: 19.99,
          costPrice: 7.50,
          description: 'Wide-angle and macro lenses'
        },
        {
          name: 'Phone Tripod Stand',
          price: 24.99,
          costPrice: 8.30,
          description: 'Adjustable with remote'
        },
        {
          name: 'LED Ring Light',
          price: 29.99,
          costPrice: 9.90,
          description: 'USB-powered with 3 modes'
        }
      ],
      bundlePrice: 64.99, // 15% discount
      description: 'Professional mobile photography setup',
      targetAudience: 'Content creators'
    },
    workstation: {
      name: 'Home Office Pro Bundle',
      products: [
        {
          name: 'Laptop Stand',
          price: 29.99,
          costPrice: 9.90,
          description: 'Ergonomic aluminum stand'
        },
        {
          name: 'Cable Management Kit',
          price: 19.99,
          costPrice: 6.60,
          description: 'Complete desk organization'
        },
        {
          name: 'Wireless Charger',
          price: 24.99,
          costPrice: 8.30,
          description: 'Fast-charging pad'
        }
      ],
      bundlePrice: 59.99, // 20% discount
      description: 'Ultimate desk setup solution',
      targetAudience: 'Remote workers'
    }
  },
  wellness_fitness: {
    yoga: {
      name: 'Yoga Essentials Kit',
      products: [
        {
          name: 'Premium Yoga Mat',
          price: 39.99,
          costPrice: 13.30,
          description: 'Non-slip, eco-friendly'
        },
        {
          name: 'Yoga Block Set',
          price: 19.99,
          costPrice: 6.60,
          description: 'Cork yoga blocks pair'
        },
        {
          name: 'Resistance Bands Set',
          price: 24.99,
          costPrice: 8.30,
          description: '3 resistance levels'
        }
      ],
      bundlePrice: 69.99, // 17% discount
      description: 'Complete yoga practice kit',
      targetAudience: 'Yoga enthusiasts'
    },
    fitness: {
      name: 'Home Workout Pro Kit',
      products: [
        {
          name: 'Adjustable Dumbbell Pair',
          price: 49.99,
          costPrice: 16.60,
          description: '2.5-5kg each'
        },
        {
          name: 'Exercise Mat',
          price: 29.99,
          costPrice: 9.90,
          description: 'High-density foam'
        },
        {
          name: 'Resistance Bands',
          price: 24.99,
          costPrice: 8.30,
          description: 'Full body workout set'
        }
      ],
      bundlePrice: 89.99, // 15% discount
      description: 'Complete home gym starter',
      targetAudience: 'Home fitness enthusiasts'
    }
  },
  pet_accessories: {
    catCare: {
      name: 'Cat Care Essential Bundle',
      products: [
        {
          name: 'Interactive Laser Toy',
          price: 19.99,
          costPrice: 6.60,
          description: 'USB rechargeable'
        },
        {
          name: 'Grooming Kit',
          price: 24.99,
          costPrice: 8.30,
          description: 'Complete grooming set'
        },
        {
          name: 'Collapsible Bowl Set',
          price: 16.99,
          costPrice: 5.60,
          description: 'Travel-friendly bowls'
        }
      ],
      bundlePrice: 49.99, // 19% discount
      description: 'Complete cat care solution',
      targetAudience: 'Cat owners'
    },
    dogCare: {
      name: 'Dog Care Pro Kit',
      products: [
        {
          name: 'No-Pull Harness',
          price: 29.99,
          costPrice: 9.90,
          description: 'Comfortable control'
        },
        {
          name: 'Training Treat Pouch',
          price: 19.99,
          costPrice: 6.60,
          description: 'Belt-clip treat holder'
        },
        {
          name: 'Portable Water Bottle',
          price: 16.99,
          costPrice: 5.60,
          description: 'One-handed operation'
        }
      ],
      bundlePrice: 54.99, // 18% discount
      description: 'Essential dog walking kit',
      targetAudience: 'Dog owners'
    }
  },
  home_organization: {
    closet: {
      name: 'Closet Organization System',
      products: [
        {
          name: 'Hanging Organizer',
          price: 29.99,
          costPrice: 9.90,
          description: '6 shelves, reinforced'
        },
        {
          name: 'Drawer Divider Set',
          price: 19.99,
          costPrice: 6.60,
          description: 'Adjustable bamboo'
        },
        {
          name: 'Vacuum Storage Bags',
          price: 24.99,
          costPrice: 8.30,
          description: 'Set of 6 bags'
        }
      ],
      bundlePrice: 59.99, // 20% discount
      description: 'Complete closet solution',
      targetAudience: 'Organization enthusiasts'
    },
    desk: {
      name: 'Desk Organization Pro Kit',
      products: [
        {
          name: 'Monitor Stand Organizer',
          price: 34.99,
          costPrice: 11.60,
          description: 'Bamboo with storage'
        },
        {
          name: 'Cable Management Box',
          price: 24.99,
          costPrice: 8.30,
          description: 'Hide power strips'
        },
        {
          name: 'Desk Accessories Set',
          price: 29.99,
          costPrice: 9.90,
          description: 'Complete desk set'
        }
      ],
      bundlePrice: 74.99, // 16% discount
      description: 'Professional desk setup',
      targetAudience: 'Home office workers'
    }
  }
}

// Trending products with high profit margins
export const TRENDING_PRODUCTS = [
  {
    category: 'eco_friendly',
    products: [
      {
        name: 'Silicone Food Storage Bags',
        price: 24.99,
        costPrice: 7.50,
        profitMargin: 70,
        description: 'Reusable zip-lock bags',
        tags: ['kitchen', 'food storage', 'eco-friendly']
      },
      {
        name: 'Bamboo Toothbrush Set',
        price: 14.99,
        costPrice: 4.50,
        profitMargin: 70,
        description: '4-pack with charcoal bristles',
        tags: ['bathroom', 'personal care', 'zero waste']
      }
    ]
  },
  {
    category: 'tech_accessories',
    products: [
      {
        name: 'Magnetic Phone Mount',
        price: 19.99,
        costPrice: 6.00,
        profitMargin: 70,
        description: 'Universal car mount',
        tags: ['car accessories', 'phone holder', 'travel']
      },
      {
        name: 'UV Phone Sanitizer',
        price: 29.99,
        costPrice: 9.00,
        profitMargin: 70,
        description: 'Portable UV-C cleaner',
        tags: ['health', 'tech', 'cleaning']
      }
    ]
  }
]

// Product bundle recommendations
export const recommendBundles = (customerPreferences) => {
  const { category, budget, interests } = customerPreferences
  const recommendations = []

  // Get category-specific bundles
  if (category && PRODUCT_BUNDLES[category]) {
    Object.values(PRODUCT_BUNDLES[category]).forEach(bundle => {
      if (bundle.bundlePrice <= budget) {
        recommendations.push(bundle)
      }
    })
  }

  // Get bundles based on interests
  if (interests && interests.length > 0) {
    interests.forEach(interest => {
      if (PRODUCT_BUNDLES[interest]) {
        Object.values(PRODUCT_BUNDLES[interest]).forEach(bundle => {
          if (bundle.bundlePrice <= budget && !recommendations.includes(bundle)) {
            recommendations.push(bundle)
          }
        })
      }
    })
  }

  return recommendations.sort((a, b) => {
    // Sort by best value (highest discount percentage)
    const aDiscount = (getTotalPrice(a.products) - a.bundlePrice) / getTotalPrice(a.products)
    const bDiscount = (getTotalPrice(b.products) - b.bundlePrice) / getTotalPrice(b.products)
    return bDiscount - aDiscount
  })
}

// Helper function to calculate total price
const getTotalPrice = (products) => {
  return products.reduce((total, product) => total + product.price, 0)
}

// Calculate bundle savings
export const calculateBundleSavings = (bundle) => {
  const totalPrice = getTotalPrice(bundle.products)
  const savings = totalPrice - bundle.bundlePrice
  const savingsPercentage = (savings / totalPrice * 100).toFixed(1)

  return {
    originalPrice: totalPrice,
    bundlePrice: bundle.bundlePrice,
    savings,
    savingsPercentage: `${savingsPercentage}%`
  }
}

// Get trending products with high margins
export const getTrendingProducts = (category = null, minProfitMargin = 65) => {
  let products = []

  TRENDING_PRODUCTS.forEach(categoryProducts => {
    if (!category || categoryProducts.category === category) {
      products = products.concat(
        categoryProducts.products.filter(product => 
          ((product.price - product.costPrice) / product.price * 100) >= minProfitMargin
        )
      )
    }
  })

  return products.sort((a, b) => b.profitMargin - a.profitMargin)
}
