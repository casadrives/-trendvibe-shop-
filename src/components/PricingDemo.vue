<!-- Demo interface for pricing optimization system -->
<template>
  <div class="pricing-demo">
    <h2 class="text-2xl font-bold mb-6">Pricing Optimization Demo</h2>

    <!-- Product Selection -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">Select Demo Product</h3>
      <select v-model="selectedProduct" class="w-full p-2 border rounded">
        <option v-for="product in demoProducts" :key="product.id" :value="product">
          {{ product.name }} (Cost: €{{ product.costPrice }})
        </option>
      </select>
    </div>

    <!-- Optimization Controls -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Single Product Optimization -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Single Product Optimization</h3>
        <button 
          @click="optimizePrice" 
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          :disabled="!selectedProduct"
        >
          Optimize Price
        </button>
        
        <div v-if="optimizedPrice" class="mt-4">
          <div class="text-lg font-bold text-indigo-600">
            {{ optimizedPrice.displayPrice }}
          </div>
          <div class="text-sm text-gray-600 mt-2">
            <div v-for="(angle, idx) in optimizedPrice.marketingAngles" :key="idx">
              {{ angle.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Promotional Pricing -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Promotional Pricing</h3>
        <select v-model="selectedPromo" class="w-full p-2 border rounded mb-4">
          <option value="flash_sale">Flash Sale (24h)</option>
          <option value="weekly_deal">Weekly Deal</option>
          <option value="bulk_discount">Bulk Discount</option>
          <option value="new_customer">New Customer</option>
        </select>
        <button 
          @click="calculatePromo" 
          class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          :disabled="!selectedProduct || !selectedPromo"
        >
          Calculate Promo
        </button>
        
        <div v-if="promoPrice" class="mt-4">
          <div class="text-lg font-bold text-orange-600">
            {{ promoPrice.displayPrice }}
          </div>
          <div class="text-sm text-gray-600">
            Save {{ promoPrice.savings.toFixed(2) }}€
          </div>
        </div>
      </div>
    </div>

    <!-- Bundle Demo -->
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <h3 class="text-lg font-semibold mb-4">Bundle Pricing Demo</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div v-for="product in demoProducts.slice(0, 3)" :key="product.id"
             class="p-3 border rounded">
          <label class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              :value="product" 
              v-model="selectedBundle"
              class="form-checkbox"
            >
            <span>{{ product.name }}</span>
          </label>
        </div>
      </div>
      
      <button 
        @click="calculateBundle" 
        class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        :disabled="selectedBundle.length < 2"
      >
        Calculate Bundle Price
      </button>

      <div v-if="bundlePrice" class="mt-4">
        <div class="text-lg font-bold text-purple-600">
          {{ bundlePrice.displayPrice }}
        </div>
        <div class="text-sm text-gray-600">
          Save {{ bundlePrice.totalSavings.toFixed(2) }}€
        </div>
      </div>
    </div>

    <!-- Market Analysis -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">Competitive Analysis</h3>
      <button 
        @click="analyzeMarket" 
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        :disabled="!selectedProduct"
      >
        Analyze Market
      </button>

      <div v-if="marketAnalysis" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">Position</div>
            <div class="text-gray-600">{{ marketAnalysis.pricePosition }}</div>
          </div>
          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">Avg. Market Price</div>
            <div class="text-gray-600">€{{ marketAnalysis.averageMarketPrice.toFixed(2) }}</div>
          </div>
        </div>
        <div class="mt-3 text-sm text-gray-600">
          {{ marketAnalysis.recommendedAction }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Mock data and simplified pricing logic for demo
const mockMarketData = {
  competitorPrices: [19.99, 24.99, 22.99, 21.99],
  demandLevel: 'high',
  seasonality: 'peak',
  stockLevel: 'medium',
  customerSegment: 'standard',
  competitionLevel: 'medium',
  productUniqueness: 'medium'
}

export default {
  name: 'PricingDemo',
  
  data() {
    return {
      demoProducts: [
        { id: 1, name: 'Eco-Friendly Water Bottle', costPrice: 8.50, category: 'eco_friendly' },
        { id: 2, name: 'Bamboo Cutlery Set', costPrice: 6.75, category: 'eco_friendly' },
        { id: 3, name: 'Drawer Organizer', costPrice: 7.25, category: 'home_organization' },
        { id: 4, name: 'Mini Massage Gun', costPrice: 12.50, category: 'wellness_fitness' },
        { id: 5, name: 'Pet Water Bottle', costPrice: 5.50, category: 'pet_accessories' }
      ],
      selectedProduct: null,
      selectedPromo: 'flash_sale',
      selectedBundle: [],
      optimizedPrice: null,
      promoPrice: null,
      bundlePrice: null,
      marketAnalysis: null
    }
  },

  methods: {
    // Demo version of price optimization
    optimizePrice() {
      const basePrice = this.selectedProduct.costPrice * 2.5
      const seasonalMultiplier = 1.1 // Peak season
      const finalPrice = basePrice * seasonalMultiplier

      this.optimizedPrice = {
        mainPrice: Math.floor(finalPrice),
        cents: 99,
        displayPrice: `€${Math.floor(finalPrice)}.99`,
        marketingAngles: [
          {
            message: `Save €${Math.ceil(finalPrice * 0.2)}`,
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

    // Demo version of promotional pricing
    calculatePromo() {
      const regularPrice = this.selectedProduct.costPrice * 2.5
      const promoDiscounts = {
        flash_sale: 0.25,
        weekly_deal: 0.20,
        bulk_discount: 0.30,
        new_customer: 0.15
      }
      
      const discount = promoDiscounts[this.selectedPromo]
      const promoPrice = regularPrice * (1 - discount)

      this.promoPrice = {
        displayPrice: `€${Math.floor(promoPrice)}.99`,
        savings: regularPrice - promoPrice
      }
    },

    // Demo version of bundle pricing
    calculateBundle() {
      const regularTotal = this.selectedBundle.reduce(
        (sum, product) => sum + (product.costPrice * 2.5), 
        0
      )
      const bundleDiscount = 0.15 + (this.selectedBundle.length >= 3 ? 0.05 : 0)
      const finalPrice = regularTotal * (1 - bundleDiscount)

      this.bundlePrice = {
        displayPrice: `€${Math.floor(finalPrice)}.99`,
        totalSavings: regularTotal - finalPrice
      }
    },

    // Demo version of market analysis
    analyzeMarket() {
      const avgMarketPrice = mockMarketData.competitorPrices.reduce(
        (sum, price) => sum + price, 
        0
      ) / mockMarketData.competitorPrices.length

      const currentPrice = this.selectedProduct.costPrice * 2.5
      const priceRatio = currentPrice / avgMarketPrice

      let position, action
      if (priceRatio < 0.9) {
        position = 'below_market'
        action = 'Consider gradual price increase'
      } else if (priceRatio > 1.1) {
        position = 'above_market'
        action = 'Monitor conversion rate, consider price adjustment'
      } else {
        position = 'competitive'
        action = 'Maintain current pricing'
      }

      this.marketAnalysis = {
        pricePosition: position,
        averageMarketPrice: avgMarketPrice,
        recommendedAction: action
      }
    }
  }
}
</script>

<style scoped>
.pricing-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Add any additional styling here */
</style>
