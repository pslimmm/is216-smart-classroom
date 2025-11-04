<template>
  <div class="container py-5">
    <!-- Page Header -->
    <div class="mb-4 text-center">
      <h2 class="text-success mb-3">✅ Approved Class Participation Logs</h2>
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-4 shadow-sm mb-5">
      <h4 class="mb-3 text-center">Search Approved Students</h4>
      <div class="row g-3 justify-content-center">
        <div class="col-md-8">
          <div class="input-group position-relative">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input
              v-model="searchQuery"
              @focus="showSuggestions = searchQuery.length > 0"
              @input="showSuggestions = searchQuery.length > 0"
              @blur="setTimeout(() => showSuggestions = false, 200)"
              @keyup.enter="handleSearch"
              type="text"
              class="form-control"
              placeholder="Press Enter to search (e.g., Alice)"
            />

            <!-- Suggestions dropdown -->
            <div
              v-if="showSuggestions && searchSuggestions.length > 0"
              class="suggestions-dropdown position-absolute w-100 bg-white border rounded shadow-sm"
              style="top: 100%; z-index: 1000; max-height: 200px; overflow-y: auto;"
            >
              <div
                v-for="student in searchSuggestions"
                :key="student.user_id"
                @click="selectSuggestion(student)"
                class="suggestion-item p-2 border-bottom"
                style="cursor: pointer;"
                @mouseenter="$event.target.style.backgroundColor = '#f8f9fa'"
                @mouseleave="$event.target.style.backgroundColor = 'white'"
              >
                <strong>{{ student.profile.full_name }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Student Label -->
      <div v-if="filteredStudents.length > 0" class="mt-4 text-center">
        <p class="mb-1 text-muted">Showing approved logs for:</p>
        <h5 v-for="s in filteredStudents" :key="s.student_id" class="fw-bold mb-0">{{ s.profile.full_name }}</h5>
      </div>
    </div>

    <!-- No Approved Logs -->
    <div v-if="approvedLogs.length === 0" class="text-muted text-center mt-5">
      <i class="bi bi-journal-check display-4"></i>
      <p class="mt-3">No approved logs found</p>
    </div>

    <!-- Approved Logs Cards -->
    <div
      v-for="log in approvedLogs"
      :key="log.id"
      class="card mb-3 shadow-sm border-success bg-success bg-opacity-10"
    >
      <div class="card-body">
        <!-- Approved Badge -->
        <div class="mb-2">
          <span class="badge bg-success text-white">APPROVED</span>
        </div>

        <!-- Student Name -->
        <h5 class="card-title mb-2">{{ log.student.full_name }}</h5>

        <!-- Description -->
        <p class="card-text">{{ log.description }}</p>

        <!-- Rating Centered -->
        <div class="text-center mt-2">
          <span v-for="n in 5" :key="n" style="font-size:1.5rem;">
            {{ n <= log.rating ? '⭐' : '☆' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Back Button -->
    <div class="text-center mt-3">
      <NuxtLink to="/prof/review" class="btn btn-outline-secondary">
        ← Back to Review
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const course_id = route.params.course_id;
const { allStudents, classParticipationData } = await $fetch('/api/course-report',{
    method: "POST",
    body: {
        course_id
    }
})


/* reactive search states */
const searchQuery = ref('')
const showSuggestions = ref(false)
const filteredStudents = ref([])

/* computed list of approved logs */
const approvedLogs = classParticipationData.filter(s => s.status == 'approved')

/* suggestions dropdown */
const searchSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase()
  return allStudents.filter(s =>
    s.profile.full_name.toLowerCase().includes(query)
  )
})

/* select from dropdown */
const selectSuggestion = (student) => {
  searchQuery.value = student.profiles.name
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
    s.profile.full_name.toLowerCase().includes(query)
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
