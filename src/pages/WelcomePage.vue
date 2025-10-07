<template>
  <div class="welcome">
    <h1>🎓 Welcome to Smart Classroom</h1>
    <p>
      Your interactive learning hub — where students earn coins 💰 and professors
      manage content easily.
    </p>

    <div class="buttons">
      <router-link to="/login" class="btn login">Login</router-link>
      <router-link to="/register" class="btn register">Register</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "WelcomePage"
};
</script>

<style scoped>
.welcome {
  text-align: center;
  margin-top: 100px;
  padding: 20px;
  color: #333;
}

h1 {
  font-size: 2rem;
  color: teal;
}

p {
  max-width: 600px;
  margin: 20px auto;
  line-height: 1.6;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

.btn.login {
  background-color: teal;
  color: white;
}

.btn.register {
  background-color: #00aaff;
  color: white;
}

.btn:hover {
  opacity: 0.85;
}
</style>
