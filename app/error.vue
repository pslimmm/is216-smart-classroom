<script setup>

const props = defineProps({
  error: {},
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="d-flex flex-column text-center justify-content-center align-items-center" style="min-height: 100vh;">
    <h1 class="text-danger">{{ error?.statusCode }}</h1>
    <h4>{{ error?.statusMessage }}</h4>
    <button @click="handleError" class="btn btn-success">Clear errors</button>
  </div>
</template>

<style scoped>
h1{
    font-weight: bolder;
    font-size: 10rem;
}
</style>