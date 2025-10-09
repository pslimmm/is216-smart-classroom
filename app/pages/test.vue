<template>

  <div>
    <p>{{ data.msg }}</p>
  </div>
  
</template>

<script setup>

const { data } = await useFetch('/api/hello')


</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
