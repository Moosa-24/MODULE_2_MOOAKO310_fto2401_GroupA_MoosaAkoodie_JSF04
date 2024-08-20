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
            <a href="/wishlist" class="wishlist-btn">
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
          <p class="product-category">{{ product.category }}</p>
          <p class="product-price">${{ product.price }}</p>
          <button class="add-to-cart" @click.stop="addToCart(product)">Add to Cart</button>
          <button class="favorites-btn" @click.stop="addToWishlist(product)">
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
      products: [], // List of products fetched from the API
      categories: [], // List of product categories
      selectedCategory: '', // Currently selected category for filtering
      selectedSort: '', // Currently selected sort order
      cartCount: 0, // Number of items in the cart
      loading: false, // Indicates if data is being loaded
      originalProducts: [], // Original list of products before sorting
      isLoggedIn: !!localStorage.getItem('token') // Check if the user is logged in
    };
  },
  mounted() {
    this.selectedCategory = new URLSearchParams(this.$route.query).get('category') || '';
    this.selectedSort = new URLSearchParams(this.$route.query).get('sort') || '';
    
    this.fetchCategories();
    this.fetchProducts(this.selectedCategory);
    this.loadCart();
  },
  methods: {
    /**
     * Fetch products based on the selected category.
     * @param {string} category - The category to filter products by.
     */
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
        rating: Math.floor(Math.random() * 5) + 1 // Add random rating to each product
      }));
      this.originalProducts = [...this.products];
      this.sortProducts();
      
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
    
    /**
     * Fetch product categories from the API.
     */
    async fetchCategories() {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      this.categories = await response.json();
    },
    
    /**
     * Filter products based on the selected category.
     */
    filterProducts() {
      this.updateQueryParams();
      this.fetchProducts(this.selectedCategory);
    },
    
    /**
     * Sort products based on the selected sort order.
     */
    sortProducts() {
      if (this.selectedSort === 'asc') {
        this.products.sort((a, b) => a.price - b.price);
      } else if (this.selectedSort === 'desc') {
        this.products.sort((a, b) => b.price - a.price);
      } else {
        this.products = [...this.originalProducts];
      }
    },
    
    /**
     * Navigate to the product detail page.
     * @param {number} id - The ID of the product to view.
     */
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
    
    /**
     * Add a product to the shopping cart.
     * @param {Object} product - The product to add to the cart.
     */
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
    
    /**
     * Add a product to the wishlist.
     * @param {Object} product - The product to add to the wishlist.
     */
    addToWishlist(product) {
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (!wishlist.find(item => item.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
    },
    
    /**
     * Load the number of items in the cart from local storage.
     */
    loadCart() {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    },
    
    /**
     * Update query parameters in the URL for filtering and sorting.
     */
    updateQueryParams() {
      this.$router.push({
        query: {
          category: this.selectedCategory,
          sort: this.selectedSort
        }
      });
    },
    
    /**
     * Handle user logout by clearing local storage and redirecting to home page.
     */
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      this.isLoggedIn = false;
      this.cartCount = 0;
      this.$router.push('/');
    },
    
    /**
     * Navigate to the wishlist page.
     */
    goToWishlist() {
      this.$router.push('/wishlist');
    }
  },
  computed: {
    /**
     * Get the list of displayed products, which is empty while loading.
     * @returns {Array} - List of products to display.
     */
    displayedProducts() {
      return this.loading ? [] : this.products;
    }
  }
}
</script>
