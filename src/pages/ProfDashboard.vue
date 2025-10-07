<template>
    <h1>Welcome to Professor's Dashboard</h1>
    <button @click="logout">Logout</button>
    <router-link to="/prof-report" class="btn">View Reports</router-link>
</template>

<script>
export default {
  name: "ProfDashboard",
  mounted() {
    const role = localStorage.getItem("role");
    if (role !== "prof") {
      this.$router.push('/'); // go back to login
    }
  },

  methods: {
    logout() {
      localStorage.removeItem("role");
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.btn {
  display: inline-block;
  background-color: #004080;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 20px;
}
.btn:hover {
  background-color: #0066cc;
}
</style>
