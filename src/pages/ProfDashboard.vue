<template>
  <div>
    <ProfNavBar />
    <div class="container mt-4">
      <h1>Professor Dashboard</h1>
      <p>Welcome back, Professor! Here’s your teaching overview.</p>
      <!-- insert dashboard content below -->

    </div>
  </div>
</template>

<script>
import ProfNavBar from "../components/ProfNavBar.vue";

export default {
  name: "ProfDashboard",
  components: { ProfNavBar },
  mounted() {
    // protect route (allow only professors)
    const role = localStorage.getItem("role");
    if (role !== "prof") {
      this.$router.push("/");
    }
  }
};
</script>
