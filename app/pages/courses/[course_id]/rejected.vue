<template>
  <div class="container py-5">
    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-4 shadow-sm mb-5">
      <!-- Page Header -->
      <div class="mb-4 text-center">
        <h2 class="text-danger fw-bold mb-3" style="font-size: 3.5rem;">Rejected Class Participation Logs</h2>
      </div>
      <h4 class="mb-3 text-navy text-center fs-3 mb-5">Search Students</h4>
      <div class="row g-3 justify-content-center">
        <div class="col-md-8">
          <div class="input-group position-relative">
            <span class="input-group-text"><i class="bi bi-search fs-1"></i></span>
            <input v-model="searchQuery" @focus="showSuggestions = searchQuery.length > 0"
              @input="showSuggestions = searchQuery.length > 0" @blur="setTimeout(() => showSuggestions = false, 200)"
              @keyup.enter="handleSearch" type="text" class="form-control fs-2"
              placeholder="Press Enter to search (e.g., Alice)" />

            <!-- Suggestions dropdown -->
            <div v-if="showSuggestions && searchSuggestions.length > 0"
              class="suggestions-dropdown position-absolute w-100 bg-white border rounded shadow-sm"
              style="top: 100%; z-index: 1000; max-height: 200px; overflow-y: auto;">
              <div v-for="student in searchSuggestions" :key="student.user_id" @click="selectSuggestion(student)"
                class="suggestion-item p-2 border-bottom fs-3" style="cursor: pointer;"
                @mouseenter="$event.target.style.backgroundColor = '#f8f9fa'"
                @mouseleave="$event.target.style.backgroundColor = 'white'">
                <strong>{{ student.student.full_name }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Student Label -->
      <div v-if="filteredStudents.length > 0" class="mt-4 text-center">
        <p class="mb-1 text-muted fs-3">Showing rejected logs for:</p>
        <div v-for="s in filteredStudents" :key="s.student_id" class="fw-bold fs-3">{{ s.student.full_name }}</div>
      </div>
      <div class="text-center mt-3">
        <NuxtLink :to="'/courses/' + course_id" class="btn btn-navy fs-3 fw-semibold mb-3">
          ← Back to Course
        </NuxtLink>
      </div>

      <!-- No rejected Logs -->
      <div v-if="rejectedLogs.length === 0" class="text-muted text-center mt-5">
        <i class="bi bi-journal-check display-1"></i>
        <p class="mt-3 fs-1">No rejected logs found</p>
      </div>

      <!-- rejected Logs Cards -->
      <div v-for="log in rejectedLogs" :key="log.id" class="card mb-3 shadow-sm border-danger bg-danger bg-opacity-10">
        <div class="card-body">
          <!-- rejected Badge -->
          <div class="mb-2">
            <span class="badge bg-danger text- fs-4">REJECTED</span>
          </div>

          <!-- Student Name -->
          <h5 class="card-title mb-2 fs-2">{{ log.student.full_name }}</h5>

          <!-- Description -->
          <p class="card-text fs-3">{{ log.description }}</p>

          <!-- Rating Centered -->
          <div class="text-start mt-2">
            <i v-for="n in 5" :key="n" style="font-size:2rem; margin: 3px;" :class="[
              'bi',
              n <= log.rating ? 'bi-star-fill' : 'bi-star',
              n <= log.rating ? 'text-warning' : 'text-muted'
            ]">
            </i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const course_id = route.params.course_id;
const { allStudents, classParticipationData } = await $fetch('/api/course-report', {
  method: "POST",
  body: {
    course_id
  }
})


/* reactive search states */
const searchQuery = ref('')
const showSuggestions = ref(false)
const filteredStudents = ref([])

/* computed list of rejected logs */
const rejectedLogs = computed(() => {
  if (!searchQuery.value) return classParticipationData.filter(s => s.status == 'rejected');
  return classParticipationData.filter(s => s.status == 'rejected').filter(s => s.student.full_name == searchQuery.value.trim())
});


/* suggestions dropdown */
const searchSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase()
  return allStudents.filter(s =>
    s.student.full_name.toLowerCase().includes(query)
  )
})

/* select from dropdown */
const selectSuggestion = (student) => {
  searchQuery.value = student.student.full_name
  filteredStudents.value = [student]
  showSuggestions.value = false
}

/* enter key search */
const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    filteredStudents.value = []
    return
  }

  filteredStudents.value = allStudents.filter(s =>
    s.student.full_name.toLowerCase().includes(query)
  )

  if (filteredStudents.value.length === 0) {
    alert('No matching students found')
  }

  showSuggestions.value = false
}

</script>

<style scoped>
.suggestion-item {
  transition: background-color 0.2s;
}
</style>
