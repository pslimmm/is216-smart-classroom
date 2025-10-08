<template>
  <div>
    <!-- navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div class="container-fluid">
        <!-- brand, for now we are Smart Classroom? -->
        <a class="navbar-brand fw-bold" href="#">Smart Classroom</a>

        <!-- toggle for mobile view -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- menu items -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="nav-link" active-class="active">Register</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- welcome Section -->
    <div class="container text-center mt-5">
      <h1 class="text-primary fw-bold">🎓 Welcome to Smart Classroom</h1>
      <p class="lead">Empowering Students and Professors with technology.</p>

      <div class="d-flex justify-content-center gap-3 mt-4">
        <router-link to="/login" class="btn btn-success btn-lg">Login</router-link>
        <router-link to="/register" class="btn btn-outline-primary btn-lg">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WelcomePage"
};
</script>

<style scoped>
/* optional: subtle shadow for navbar */
.navbar {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
