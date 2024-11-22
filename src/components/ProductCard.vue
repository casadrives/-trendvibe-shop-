<template>
  <div class="card product-card h-100 fade-in">
    <div class="product-image-container">
      <img :src="product.image_url" :alt="product.name" class="card-img-top">
      <div class="product-overlay">
        <button 
          @click="$emit('quickView', product)" 
          class="btn btn-light btn-sm quick-view-btn"
        >
          Quick View
        </button>
      </div>
    </div>
    <div class="card-body d-flex flex-column">
      <div class="product-category">{{ product.category }}</div>
      <h5 class="card-title">{{ product.name }}</h5>
      <p class="card-text text-truncate">{{ product.description }}</p>
      <div class="mt-auto">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="price">€{{ product.price.toFixed(2) }}</div>
          <div class="shipping-badge">
            <i class="fas fa-shipping-fast"></i> Free Shipping
          </div>
        </div>
        <div class="d-flex justify-content-between gap-2">
          <router-link 
            :to="'/product/' + product.id" 
            class="btn btn-outline-primary flex-grow-1"
          >
            Details
          </router-link>
          <button 
            @click="$emit('addToCart', product)" 
            class="btn btn-primary"
          >
            <i class="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.product-card {
  border: none;
  background: white;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-card:hover .card-img-top {
  transform: scale(1.1);
}

.quick-view-btn {
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.product-card:hover .quick-view-btn {
  transform: translateY(0);
}

.product-category {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.card-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.shipping-badge {
  font-size: 0.875rem;
  color: var(--success-color);
}

.shipping-badge i {
  margin-right: 0.25rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 0.5rem;
}

.btn-outline-primary {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
