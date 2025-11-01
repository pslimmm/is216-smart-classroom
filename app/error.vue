<script setup>
const { role } = useAuthState();
const props = defineProps({
  error: {},
})

const handleError = () => {
    clearError({ redirect: role.value ? `/${role.value}` : '/' });
}
</script>

<template>
  <div class="d-flex flex-column text-center justify-content-center align-items-center" style="min-height: 100vh;">
    <h1>{{ error?.statusCode }}</h1>
    <h4>{{ error?.statusMessage || "Something has gone wrong"}}</h4>
    <button @click="handleError" class="btn btn-success mt-3">{{ role ? 'Go back to dashboard' : 'Go back to homepage' }}</button>
  </div>
</template>

<style scoped>
h1{
    font-weight: bolder;
    font-size: 10rem;
}
</style>