<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark w-100 fixed-top">
    <div class="container-fluid">
      <!-- Brand -->
      <router-link to="/ta" class="navbar-brand fw-bold">
        🧑‍🏫 Teaching Assistant Portal
      </router-link>

      <!-- Mobile toggle -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#taNavbar"
        aria-controls="taNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav links -->
      <div class="collapse navbar-collapse" id="taNavbar">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/ta" class="nav-link" active-class="active">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <!-- clicking on Action#1 will just bring back to /ta webpage -->
            <router-link to="/ta/submit" class="nav-link" active-class="active">Submit CP</router-link>
          </li>
          <li class="nav-item">
            <!-- clicking on Action#2 will just bring back to /ta webpage -->
            <router-link to="/ta" class="nav-link" active-class="active">Actions#2</router-link>
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
  name: "TANavBar",
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
