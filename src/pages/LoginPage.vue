<template>
  <div class="login">
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <input v-model="username" type="text" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>

    <p>Don't have an account? <router-link to="/register">Register here</router-link></p>

    <router-link to="/" class="back-link">← Back to Welcome</router-link>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    handleLogin() {
      if (!this.username || !this.password) {
        alert("Please fill in all fields");
        return;
      }

      // fake logic — customize this with real API later or smth
      if (this.username === 'prof') {
        localStorage.setItem("role", "prof");
        this.$router.push('/prof');
      } else if (this.username === 'student') {
        localStorage.setItem("role", "student");
        this.$router.push('/student');
      } else if (this.username === 'ta') {
        localStorage.setItem("role", "ta");
        this.$router.push("/ta");
      } else {
        alert("Invalid username. Try 'prof' or 'student' or 'ta'.");
      }
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  background-color: teal;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}

button:hover {
  background-color: #007777;
}

.back-link {
  display: inline-block;
  margin-top: 15px;
  color: #007777;
  text-decoration: none;
  font-weight: bold;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
