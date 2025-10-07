<template>
    <h1>Welcome to Student Dashboard</h1>
    <button @click="logout">Logout</button>
</template>

<script>
export default {
  name: "StudentDashboard",
  mounted() {
    const role = localStorage.getItem("role");
    if (role !== "student") {
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
