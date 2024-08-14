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
              <span>Wishlist</span>
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

    <!-- Comparison List Content -->
    <div v-if="isLoggedIn">
      <h2>Comparison List</h2>
      <button @click="clearComparisonList">Clear Comparison List</button>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in comparisonList" :key="item.id">
            <td><img :src="item.image" :alt="item.title" class="product-image"/></td>
            <td>{{ item.title }}</td>
            <td>{{ item.description }}</td>
            <td>${{ item.price }}</td>
            <td>{{ item.rating }}</td>
            <td><button @click="removeFromComparison(item.id)">Remove</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>You need to be logged in to view the comparison list.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comparisonList: [],
      isLoggedIn: !!localStorage.getItem('token'),
      cartCount: 0
    };
  },
  async mounted() {
    if (this.isLoggedIn) {
      this.comparisonList = JSON.parse(localStorage.getItem('comparisonList')) || [];
      this.loadCart();
    } else {
      this.$router.push('/login');
    }
  },
  methods: {
    clearComparisonList() {
      localStorage.removeItem('comparisonList');
      this.comparisonList = [];
    },
    removeFromComparison(productId) {
      this.comparisonList = this.comparisonList.filter(item => item.id !== productId);
      localStorage.setItem('comparisonList', JSON.stringify(this.comparisonList));
    },
    loadCart() {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      localStorage.removeItem('comparisonList');
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

.comparison-icon {
  margin-right: 0.5rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

.product-image {
  width: 100px;
  height: auto;
}
</style>
