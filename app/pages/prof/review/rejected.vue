<template>
  <div class="container py-5">
    <!-- Page Header -->
    <div class="mb-4 text-center">
      <h2 class="text-danger mb-3">❌ Rejected Class Participation Logs</h2>
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-4 shadow-sm mb-5">
      <h4 class="mb-3 text-center">Search Student</h4>
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
              placeholder="Press Enter to search (e.g., Bob)"
            />

            <!-- Dropdown Suggestions -->
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
                <strong>{{ student.profiles.name }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Students -->
      <div v-if="filteredStudents.length > 0" class="mt-4 text-center">
        <p class="mb-1 text-muted">Showing logs for:</p>
        <h5 v-for="s in filteredStudents" :key="s.user_id" class="fw-bold mb-0">{{ s.profiles.name }}</h5>
      </div>
    </div>

    <!-- No Logs -->
    <div v-if="filteredLogs.length === 0" class="text-muted text-center mt-5">
      <i class="bi bi-journal-x display-4"></i>
      <p class="mt-3">No rejected logs found</p>
    </div>

    <!-- Rejected Logs Cards -->
    <div v-else>
      <div v-for="log in filteredLogs" :key="log.id"
           class="card mb-3 shadow-sm border-danger bg-danger bg-opacity-10">
        <div class="card-body">
          <!-- Rejected Badge -->
          <div class="mb-2">
            <span class="badge bg-danger text-white">REJECTED</span>
          </div>

          <!-- Student Name -->
          <h5 class="card-title mb-2">{{ log.studentName }}</h5>

          <!-- Description -->
          <p class="card-text">{{ log.description }}</p>

          <!-- Reason -->
          <p v-if="log.reason" class="text-danger mb-2">
            <strong>Reason:</strong> {{ log.reason }}
          </p>

          <!-- Rating -->
          <div class="text-center mt-2">
            <span v-for="n in 5" :key="n" style="font-size:1.5rem;">
              {{ n <= log.rating ? '⭐' : '☆' }}
            </span>
          </div>
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
import { ref, computed } from 'vue'

// Mock student list (replace with DB data in production)
const mockStudents = [
  { user_id: '1', profiles: { name: 'Alice' } },
  { user_id: '2', profiles: { name: 'Bob' } },
  { user_id: '3', profiles: { name: 'Charlie' } },
  { user_id: '4', profiles: { name: 'Davis' } },
  { user_id: '5', profiles: { name: 'Peter' } },
  { user_id: '6', profiles: { name: 'Yichen' } },
]

const searchQuery = ref('')
const showSuggestions = ref(false)
const filteredStudents = ref([])

// Filter rejected logs
const rejectedLogs = computed(() =>
  logsStore.logs.filter(log => log.status === 'rejected')
)

// Suggestions for dropdown
const searchSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase()
  return mockStudents.filter(s =>
    s.profiles.name.toLowerCase().includes(query)
  )
})

// Select student from dropdown
const selectSuggestion = (student) => {
  searchQuery.value = student.profiles.name
  filteredStudents.value = [student]
  showSuggestions.value = false
}

// Handle Enter key
const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    filteredStudents.value = []
    return
  }

  const matches = mockStudents.filter(s =>
    s.profiles.name.toLowerCase().includes(query)
  )

  if (matches.length === 0) {
    alert('No matching students found')
    filteredStudents.value = []
  } else {
    filteredStudents.value = matches
  }

  showSuggestions.value = false
}

// Filter logs dynamically based on selected students
const filteredLogs = computed(() => {
  if (filteredStudents.value.length === 0) return rejectedLogs.value
  const names = filteredStudents.value.map(s => s.profiles.name)
  return rejectedLogs.value.filter(log => names.includes(log.studentName))
})
</script>

<style scoped>
.suggestion-item {
  transition: background-color 0.2s;
}
</style>
