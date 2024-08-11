<template>
  <div>
    <!-- Header Component -->
    <header class="header">
      <div class="header-content">
        <div class="brand">
          <img src="../images/shop.png" alt="Brand Logo" class="brand-logo">
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
          <!-- Conditional Login/Logout Button -->
          <div class="login">
            <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
            <a href="#" v-else @click="logout">Logout</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Filter and Sort Wrapper -->
    <div class="filter-sort-container">
      <!-- Filter Component -->
      <div class="filter">
        <select class="filter-select" v-model="selectedCategory" @change="filterProducts">
          <option value="">Select Category</option>
          <option value="all">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
      <!-- Sort Component -->
      <div class="sort">
        <label for="sort-select" class="sort-label">Sort by:</label>
        <select id="sort-select" class="sort-select" v-model="selectedSort" @change="sortProducts">
          <option value="">Default</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>
    </div>

    <!-- Loading State and Product List -->
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else class="product-list">
      <div class="product-container">
        <div class="product-card" v-for="product in displayedProducts" :key="product.id" @click="goToProduct(product.id)">
          <img :src="product.image" :alt="product.title" class="product-image"/>
          <h2 class="product-title">{{ product.title }}</h2>
          <p class="product-price">${{ product.price }}</p>
          <button class="add-to-cart" @click.stop="addToCart(product)">Add to Cart</button>
          <button class="favorites-btn">
            <span class="favorites-icon"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      categories: [],
      selectedCategory: '',
      selectedSort: '',
      cartCount: 0,
      loading: false,
      originalProducts: [], // To store the initial order of products
      isLoggedIn: !!localStorage.getItem('token') // Check if the user is logged in
    };
  },
  mounted() {
    // Read query parameters and apply filters and sorting
    const params = new URLSearchParams(this.$route.query);
    this.selectedCategory = params.get('category') || '';
    this.selectedSort = params.get('sort') || '';
    
    this.fetchCategories();
    this.fetchProducts(this.selectedCategory);
  },
  methods: {
    async fetchProducts(category) {
      this.loading = true;
      let url = 'https://fakestoreapi.com/products';
      if (category && category !== 'all') {
        url += `/category/${category}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      this.products = data.map(product => ({
        ...product,
        rating: Math.floor(Math.random() * 5) + 1 // Random rating between 1 and 5
      }));
      this.originalProducts = [...this.products]; // Store the original order of products
      this.sortProducts();
      
      // Delay hiding the loading state by 2 seconds
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
    async fetchCategories() {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      const data = await response.json();
      this.categories = data;
    },
    filterProducts() {
      this.updateQueryParams();
      this.fetchProducts(this.selectedCategory);
    },
    sortProducts() {
      if (this.selectedSort === 'asc') {
        this.products.sort((a, b) => a.price - b.price);
      } else if (this.selectedSort === 'desc') {
        this.products.sort((a, b) => b.price - a.price);
      } else {
        this.products = [...this.originalProducts]; // Revert to original order
      }
    },
    goToProduct(id) {
      this.$router.push({
        name: 'ProductDetail',
        params: { id },
        query: {
          category: this.selectedCategory,
          sort: this.selectedSort
        }
      });
    },
    addToCart(product) {
      this.cartCount++;
    },
    updateQueryParams() {
      this.$router.push({
        query: {
          category: this.selectedCategory,
          sort: this.selectedSort
        }
      });
    },
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push('/');
    }
  },
  computed: {
    displayedProducts() {
      return this.loading ? [] : this.products;
    }
  }
}
</script>
