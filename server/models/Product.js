const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 50 // Maximum price €50
  },
  category: {
    type: String,
    required: true,
    enum: ['Eco-Friendly', 'Home Organization', 'Wellness & Fitness', 'Pet Accessories', 'Tech Accessories']
  },
  imageUrl: {
    type: String,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  freeShipping: {
    type: Boolean,
    default: false
  },
  discountedPrice: {
    type: Number,
    min: 0,
    max: 50
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for savings percentage
productSchema.virtual('savingsPercentage').get(function() {
  if (this.discountedPrice && this.price > this.discountedPrice) {
    return Math.round(((this.price - this.discountedPrice) / this.price) * 100);
  }
  return 0;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
  return this.stockQuantity > 0;
};

// Method to check if product qualifies for free shipping
productSchema.methods.hasFreeShipping = function() {
  return this.freeShipping || this.price >= 50;
};

module.exports = mongoose.model('Product', productSchema);
