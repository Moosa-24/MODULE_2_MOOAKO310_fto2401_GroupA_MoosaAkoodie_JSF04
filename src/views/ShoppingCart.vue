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
            <router-link to="/wishlist" class="wishlist-btn">
              <span class="wishlist-icon">♡</span>
              <span class="wishlist-text">Wishlist</span>
            </router-link>
          </h3>
          <div class="cart">
            <a href="/cart">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cart-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
              </svg>
            </a>
            <span class="cart-badge">{{ cartCount }}</span>
          </div>
          <!-- Comparison List Link -->
          <div class="comparison">
            <a href="/comparison" class="comparison-btn">
              <span class="comparison-text">Comparison</span>
            </a>
          </div>
          <!-- Conditional Login/Logout Button -->
          <div class="login">
            <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
            <a href="#" v-else @click="logout">Logout</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Shopping Cart Content -->
    <div class="cart-content">
      <h2 class="cart-title">Shopping Cart</h2>
      <div v-if="cartItems.length === 0" class="empty-cart">Your cart is empty</div>
      <div v-else>
        <div class="cart-items">
          <div class="cart-item" v-for="item in cartItems" :key="item.id">
            <img :src="item.image" :alt="item.title" class="cart-item-image"/>
            <div class="cart-item-details">
              <h3 class="cart-item-title">{{ item.title }}</h3>
              <p class="cart-item-price">${{ item.price.toFixed(2) }}</p>
              <p class="cart-item-quantity">
                Quantity: 
                <input 
                  type="number" 
                  v-model.number="item.quantity" 
                  @change="updateQuantity(item.id, item.quantity)" 
                  min="1" 
                  class="quantity-input"
                />
              </p>
            </div>
            <button class="remove-item" @click="removeFromCart(item.id)">Remove</button>
          </div>
        </div>
        <div class="cart-total">
          <h3>Total Cost: ${{ totalCost.toFixed(2) }}</h3>
        </div>
        <button class="clear-cart" @click="clearCart">Clear Cart</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      isLoggedIn: !!localStorage.getItem('token'),
      cartCount: 0
    };
  },
  computed: {
    totalCost() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  mounted() {
    this.loadCart();
  },
  methods: {
    loadCart() {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.cartItems = cart;
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    },
    removeFromCart(productId) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.loadCart();
    },
    updateQuantity(productId, newQuantity) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(cart));
      this.loadCart();
    },
    clearCart() {
      localStorage.removeItem('cart');
      this.loadCart();
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

<style scoped>
/* Shopping Cart Styles */
.cart-content {
  padding: 20px;
}

.cart-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.empty-cart {
  font-size: 18px;
  color: #777;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

.cart-item-details {
  flex: 1;
}

.cart-item-title {
  font-size: 18px;
  margin-bottom: 5px;
}

.cart-item-price {
  font-size: 16px;
  color: #555;
  margin-bottom: 5px;
}

.cart-item-quantity {
  font-size: 14px;
  color: #888;
  display: flex;
  align-items: center;
}

.quantity-input {
  width: 60px;
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.remove-item {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.remove-item:hover {
  background-color: #c0392b;
}

.cart-total {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

.clear-cart {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.clear-cart:hover {
  background-color: #2980b9;
}
</style>
