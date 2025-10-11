<template>

  <div class="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
    <i class="bi bi-coin fs-1 text-warning" :class="{ 'animate-coin-flip': flipped }" @animationend="flipped = false"
      style="font-size: 80px"></i>

    <button class="btn btn-success mt-4" @click="flipCoin">
      Flip Coin
    </button>
  </div>

  <div>
    <!-- <p>{{ data.msg }}</p> -->
  </div>

</template>

<script setup>
import { ref } from 'vue'

const flipped = ref(false)

const flipCoin = () => {
  flipped.value = true
}

// const { data } = await useFetch('/api/hello')


</script>

<style setup>
.read-the-docs {
  color: #888;
}
</style>