<template>
  <div :class="[theme, 'app-container']" id="app">
    <!-- Router View -->
    <router-view/>

    <!-- Fixed Theme Toggle Button -->
    <button @click="toggleTheme" class="theme-toggle-btn">
      Toggle Theme
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartCount: 0,
      theme: localStorage.getItem('theme') || 'light', // Default to light theme
    };
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', this.theme);
    },
  },
  watch: {
    theme(newTheme) {
      document.documentElement.setAttribute('data-theme', newTheme);
    },
  },
  mounted() {
    document.documentElement.setAttribute('data-theme', this.theme);
  },
}
</script>

<style>
@import './assets/css/styles.css';

.app-container {
  transition: background-color 0.3s ease;
}

/* Light Theme */
[data-theme='light'] .app-container {
  background-color: #ffffff;
  color: #000000;
}

/* Dark Theme */
[data-theme='dark'] .app-container {
  background-color: #333333;
  color: #ffffff;
}

/* Fixed Theme Toggle Button */
.theme-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #e74c3c;
  color: white;
  font-size: 16px;
  cursor: pointer;
  z-index: 1000; /* Ensure the button is above other content */
  transition: background-color 0.3s;
}

.theme-toggle-btn:hover {
  background-color: #c0392b;
}
</style>
