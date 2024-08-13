<template>
  <div>
    <!-- Header Component -->
    <header class="header">
      <div class="header-content">
        <div class="brand">
          <img src="../images/shop.png" alt="Brand Logo" class="brand-logo">
          <h1 class="header-title" @click="goToHomePage">SwiftCart</h1>
        </div>
        <div class="header-right">
          <h3 class="wishlist">
            <a href="#" class="wishlist-btn">
              <span class="wishlist-icon">♡</span>
              <span class="wishlist-text">Wishlist</span>
            </a>
          </h3>
          <div class="cart">
            <a href="/cart">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cart-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
              </svg>
            </a>
            <span class="cart-badge">{{ cartCount }}</span>
          </div>
          <!-- Conditional Login/Logout Button -->
          <div class="login">
            <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
            <a href="#" v-else @click="logout">Logout</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Product Detail Content -->
    <div class="product-detail">
      <img :src="product.image" :alt="product.title" class="product-image">
      <h2 class="product-title">{{ product.title }}</h2>
      <p class="product-category">{{ product.category }}</p>
      <p class="product-price">${{ product.price }}</p>
      <p class="product-description">{{ product.description }}</p>
      <button class="add-to-cart" @click="addToCart(product)">Add to Cart</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {},
      isLoggedIn: !!localStorage.getItem('token'),
      cartCount: 0
    };
  },
  async mounted() {
    const productId = this.$route.params.id;
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    this.product = await response.json();
    this.loadCart();
  },
  methods: {
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      this.loadCart();
    },
    loadCart() {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      this.isLoggedIn = false;
      this.cartCount = 0;
      this.$router.push('/');
    },
    goToHomePage() {
      this.$router.push('/');
    }
  }
}
</script>
