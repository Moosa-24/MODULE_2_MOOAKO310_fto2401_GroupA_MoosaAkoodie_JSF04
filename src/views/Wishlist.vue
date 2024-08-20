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
              <span class="wishlist-count">{{ wishlistCount }}</span>
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

    <!-- Wishlist Content -->
    <div class="wishlist-content">
      <div v-if="wishlistItems.length === 0" class="empty-wishlist">Your wishlist is empty</div>
      <div v-else>
        <!-- Filter and Sort Wrapper -->
        <div class="filter-sort-container">
          <!-- Filter Component -->
          <div class="filter">
            <select class="filter-select" v-model="selectedCategory" @change="applyFilters">
              <option value="">Select Category</option>
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
          <!-- Sort Component -->
          <div class="sort">
            <label for="sort-select" class="sort-label">Sort by:</label>
            <select id="sort-select" class="sort-select" v-model="selectedSort" @change="applySort">
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        <div class="wishlist-items">
          <div class="wishlist-item" v-for="item in filteredAndSortedWishlistItems" :key="item.id">
            <img :src="item.image" :alt="item.title" class="wishlist-item-image"/>
            <div class="wishlist-item-details">
              <h3 class="wishlist-item-title">{{ item.title }}</h3>
              <p class="wishlist-item-price">${{ item.price.toFixed(2) }}</p>
              <button class="remove-item" @click="removeFromWishlist(item.id)">Remove</button>
              <button class="add-to-cart" @click="addToCart(item)">Add to Cart</button>
            </div>
          </div>
        </div>
        <button class="clear-wishlist" @click="clearWishlist">Clear Wishlist</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /**
       * Array of wishlist items.
       * @type {Array<Object>}
       */
      wishlistItems: [],

      /**
       * Flag indicating whether the user is logged in.
       * @type {boolean}
       */
      isLoggedIn: !!localStorage.getItem('token'),

      /**
       * Count of items in the shopping cart.
       * @type {number}
       */
      cartCount: 0,

      /**
       * Count of items in the wishlist.
       * @type {number}
       */
      wishlistCount: 0,

      /**
       * Array of categories fetched from the API.
       * @type {Array<string>}
       */
      categories: [],

      /**
       * Selected category for filtering wishlist items.
       * @type {string}
       */
      selectedCategory: '',

      /**
       * Selected sorting option for wishlist items.
       * @type {string}
       */
      selectedSort: 'price-asc' // Default sorting option
    };
  },
  computed: {
    /**
     * Returns the wishlist items filtered and sorted based on the selected options.
     * @returns {Array<Object>}
     */
    filteredAndSortedWishlistItems() {
      let filteredItems = this.wishlistItems;
      if (this.selectedCategory) {
        filteredItems = filteredItems.filter(item => item.category === this.selectedCategory);
      }
      // Apply sorting
      switch (this.selectedSort) {
        case 'price-asc':
          filteredItems.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredItems.sort((a, b) => b.price - a.price);
          break;
        default:
          // Default sorting logic, if any
          break;
      }
      return filteredItems;
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.loadWishlist();
      this.loadCart();
      this.loadCategories();
    } else {
      this.$router.push('/login');
    }
  },
  methods: {
    /**
     * Loads the wishlist items from local storage and updates the wishlist count.
     */
    loadWishlist() {
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      this.wishlistItems = wishlist;
      this.wishlistCount = wishlist.length;
    },

    /**
     * Loads the cart items from local storage and updates the cart count.
     */
    loadCart() {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    },

    /**
     * Fetches product categories from the API and updates the categories array.
     */
    loadCategories() {
      fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(json => {
          this.categories = json;
        });
    },

    /**
     * Removes an item from the wishlist based on its ID.
     * @param {number} productId - The ID of the product to remove.
     */
    removeFromWishlist(productId) {
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      wishlist = wishlist.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this.loadWishlist();
    },

    /**
     * Adds a product to the cart. If the product already exists in the cart, increases its quantity.
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
     * Clears all items from the wishlist.
     */
    clearWishlist() {
      localStorage.removeItem('wishlist');
      this.loadWishlist();
    },

    /**
     * Applies the selected category filter to the wishlist items.
     */
    applyFilters() {
      this.loadWishlist();
    },

    /**
     * Applies the selected sorting option to the wishlist items.
     */
    applySort() {
      this.loadWishlist();
    },

    /**
     * Logs out the user by removing the token, cart, and wishlist from local storage.
     */
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
      this.isLoggedIn = false;
      this.cartCount = 0;
      this.wishlistCount = 0;
      this.$router.push('/');
    },

    /**
     * Navigates to the home page.
     */
    goToHomePage() {
      this.$router.push('/');
    }
  }
}
</script>
