<script setup>
const courses = [
  {
    course_id: 1,
    course_name: "Programming Fundamentals I",
    course_code: "CS101",
  },
  {
    course_id: 2,
    course_name: "Programming Fundamentals II",
    course_code: "CS102",
  },
  {
    course_id: 3,
    course_name: "Coloring",
    course_code: "BIZ101",
  }
]
import { useAuthState } from '~/composables/useAuthState.js'
const { role } = useAuthState();
</script>

<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h2 class="text-primary">My Courses</h2>
      <p class="text-muted">Select a coursex</p>
    </div>

    <div class="row g-4">
      <div class="col-md-4" v-for="course in courses" :key="course.course_id">
        <!-- Card as Button -->
         
        <button class="card h-100 shadow-sm text-start p-0 border-0 bg-white" style="cursor: pointer;" @click="navigateTo('/' + role)">
          <img 
            :src="'/img/' + course.course_code + '.jpg'"
            class="card-img-top" 
            :alt="course.course_name"
            style="width: 32rem;">
          <div class="card-body">
            <h6 class="text-muted mb-1">{{ course.course_code }}</h6>
            <h5 class="card-title mb-0">{{ course.course_name }}</h5>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>



<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
}

button.card:hover {
  transform: scale(1.03);
  transition: transform 0.2s;
}
</style>
