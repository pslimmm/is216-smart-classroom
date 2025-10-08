<template>
  <div class="ta-dashboard">
    <h1>Teaching Assistant Dashboard</h1>
    <p>Welcome, TA 👋 Here’s your teaching overview:</p>

    <ul>
      <li>Assigned courses: {{ courses.length }}</li>
      <li>Pending reviews: {{ pendingReviews }}</li>
      <li>Active students: {{ activeStudents }}</li>
    </ul>

    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  name: "TaDashboard",
  data() {
    return {
      courses: ["Math 101", "Science 202"],
      pendingReviews: 3,
      activeStudents: 45
    };
  },
  mounted() {
    // protect route: redirect if not a TA
    const role = localStorage.getItem("role");
    if (role !== "ta") {
      this.$router.push("/");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("role");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.ta-dashboard {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #004080;
}

ul {
  list-style: none;
  padding: 0;
  line-height: 1.8;
}

button {
  background-color: #004080;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0059b3;
}
</style>
