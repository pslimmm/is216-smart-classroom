<template>
  <div class="register">
    <h1>Register</h1>

    <form @submit.prevent="handleRegister">
      <input v-model="username" type="text" placeholder="Username" />
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <select v-model="role">
        <option disabled value="">Select role</option>
        <option value="student">Student</option>
        <option value="prof">Professor</option>
        <option value="ta">Teaching Assistant</option>
      </select>
      <button type="submit">Register</button>
    </form>

    <p>Already have an account? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script>
export default {
  name: "RegisterPage",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      role: ""
    };
  },
  methods: {
    handleRegister() {
      if (!this.username || !this.email || !this.password || !this.role) {
        alert("Please fill in all fields");
        return;
      }

      // for now: simulate registration (later, use an API or smth)
      const user = {
        username: this.username,
        email: this.email,
        password: this.password,
        role: this.role
      };

      console.log("✅ Registered user:", user);

      // save user locally (temporary demo)
      localStorage.setItem("user", JSON.stringify(user));

      alert("🎉 Registration successful! Redirecting to login...");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.register {
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

input, select {
  padding: 8px;
  font-size: 1rem;
}

button {
  padding: 10px;
  background-color: teal;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
