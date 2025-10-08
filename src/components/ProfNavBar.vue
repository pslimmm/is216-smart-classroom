<!-- This will be displayed on all Prof-related pages -->
 <template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <!-- brand -->
      <router-link to="/prof" class="navbar-brand fw-bold">
        👨‍🏫 Professor Portal
      </router-link>

      <!-- toggle for mobile view -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#profNavbar"
        aria-controls="profNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- menu -->
      <div class="collapse navbar-collapse" id="profNavbar">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/prof" class="nav-link" active-class="active">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/prof-report" class="nav-link" active-class="active">Reports</router-link>
          </li>
          <li class="nav-item">
            <button @click="logout" class="btn btn-outline-light btn-sm ms-2">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "ProfNavBar",
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
