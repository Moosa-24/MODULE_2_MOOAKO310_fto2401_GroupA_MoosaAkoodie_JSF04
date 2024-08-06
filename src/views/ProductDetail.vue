<template>
  <div v-if="product">
    <!-- Header Component -->
    <header class="header">
      <div class="header-content">
        <div class="brand">
          <img src="" alt="Brand Logo" class="brand-logo">
          <h1 class="header-title">SwiftCart</h1>
        </div>
        <div class="header-right">
          <h3 class="wishlist">
            <a href="#" class="wishlist-btn">
              <span class="wishlist-icon">♡</span>
              <span class="wishlist-text">Wishlist</span>
            </a>
          </h3>
          <div class="cart">
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cart-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
              </svg>
            </a>
            <span class="cart-badge">{{ cartCount }}</span>
          </div>
          <div class="login"><a href="#">Login</a></div>
        </div>
      </div>
    </header>

    <!-- Product Detail Component -->
    <div class="product-detail">
      <img :src="product.image" :alt="product.title" class="product-image"/>
      <h1 class="product-title">{{ product.title }}</h1>
      <p class="product-description">{{ product.description }}</p>
      <div class="stars">
        <span class="star" :class="{ 'filled': product.rating >= 1 }">&#9733;</span>
        <span class="star" :class="{ 'filled': product.rating >= 2 }">&#9733;</span>
        <span class="star" :class="{ 'filled': product.rating >= 3 }">&#9733;</span>
        <span class="star" :class="{ 'filled': product.rating >= 4 }">&#9733;</span>
        <span class="star" :class="{ 'filled': product.rating >= 5 }">&#9733;</span>
      </div>
      <p class="product-price">${{ product.price }}</p>
      <button class="add-to-cart" @click="addToCart(product)">Add to Cart</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      product: null,
      cartCount: 0,
    };
  },
  mounted() {
    this.fetchProduct();
  },
  methods: {
    /**
     * Fetches the product details from the API.
     */
    async fetchProduct() {
      const response = await fetch(`https://fakestoreapi.com/products/${this.id}`);
      const data = await response.json();
      this.product = {
        ...data,
        rating: Math.floor(Math.random() * 5) + 1 // Random rating between 1 and 5
      };
    },
    /**
     * Adds a product to the cart.
     * @param {Object} product - The product to add to the cart.
     */
    addToCart(product) {
      // Implement add to cart functionality
      this.cartCount++;
    }
  }
}
</script>
