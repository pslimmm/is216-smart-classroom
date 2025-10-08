<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark w-100 fixed-top">
    <div class="container-fluid">
      <router-link to="/student" class="navbar-brand fw-bold">
        🎓 Student Portal
      </router-link>

      <!-- toggle for mobile view -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#studentNavbar"
        aria-controls="studentNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- navbar Items -->
      <div class="collapse navbar-collapse" id="studentNavbar">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/student" class="nav-link" active-class="active">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/student-coins" class="nav-link" active-class="active">My Coins</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/student-courses" class="nav-link" active-class="active">Courses</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/student-quizzes" class="nav-link" active-class="active">Quizzes</router-link>
          </li>
          <li class="nav-item">
            <button @click="logout" class="btn btn-outline-light btn-sm ms-3">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "StudentNavBar",
  methods: {
    logout() {
      localStorage.removeItem("role");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.nav-link.active {
  text-decoration: underline;
  font-weight: bold;
}
</style>
