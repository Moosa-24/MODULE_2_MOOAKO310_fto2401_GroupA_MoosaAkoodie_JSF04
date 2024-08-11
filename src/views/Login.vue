<template>
  <div class="login-container">
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input :type="passwordFieldType" v-model="password" id="password" required />
        <button type="button" @click="togglePasswordVisibility">
          {{ passwordFieldType === 'password' ? 'Show' : 'Hide' }} Password
        </button>
      </div>
      <button type="submit">Log In</button>
    </form>
    <div v-if="loading">Authenticating...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      error: null,
      passwordFieldType: 'password',
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    async login() {
      if (!this.username || !this.password) {
        this.error = "Username and password cannot be empty.";
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('https://fakestoreapi.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          this.$router.push('/');
        } else {
          this.error = "Login failed. Please check your credentials.";
        }
      } catch (err) {
        this.error = "An error occurred. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
