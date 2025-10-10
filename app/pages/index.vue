<script setup>
const { role } = useRole();

</script>
<template>
  <div>
    <!-- welcome Section -->
      <h1 class="text-primary fw-bold">🎓 Welcome to Smart Classroom</h1>
      <p class="lead">Empowering Students and Professors with technology.</p>

      <div v-if="!role" class="d-flex justify-content-center gap-3 mt-4">
        <NuxtLink to="/login" class="btn btn-success btn-lg">Login</NuxtLink>
        <NuxtLink to="/register" class="btn btn-outline-primary btn-lg">Register</NuxtLink>
      </div>
    </div>
</template>


