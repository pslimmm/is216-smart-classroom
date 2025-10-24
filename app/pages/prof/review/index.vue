  <template>
    <div class="container py-5">
      <!-- header -->
      <div class="mb-4 text-center">
        <h2 class="text-primary mb-3">Review Class Participation Logs</h2>

        <div class="d-flex justify-content-center gap-3">
          <NuxtLink to="/prof/review/approved" class="btn btn-success btn-lg">View Approved</NuxtLink>
          <NuxtLink to="/prof/review/rejected" class="btn btn-danger btn-lg">View Rejected</NuxtLink>
        </div>
      </div>

      <!-- back btn -->
      <div class="text-center mb-4">
        <NuxtLink to="/prof" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Back
        </NuxtLink>
      </div>

      <!-- search bar -->
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

              <!-- show dropdown suggestions -->
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

        <!-- selected students -->
        <div v-if="filteredStudents.length > 0" class="mt-4 text-center">
          <p class="mb-1 text-muted">Showing logs for:</p>
          <h5 v-for="s in filteredStudents" :key="s.user_id" class="fw-bold mb-0">{{ s.profiles.name }}</h5>
        </div>
      </div>

      <!-- no logs -->
      <div v-if="filteredLogs.length === 0" class="text-muted text-center mt-5">
        <i class="bi bi-journal-x display-4"></i>
        <p class="mt-3">No pending participations to review</p>
      </div>

      <!-- there is logs -->
      <div v-else>
        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="card mb-3 shadow-sm border-warning bg-warning bg-opacity-10"
        >
          <div class="card-body">
            <div class="mb-2">
              <span class="badge bg-warning text-dark">PENDING</span>
            </div>

            <h5 class="card-title mb-2">{{ log.studentName }}</h5>
            <p class="card-text">{{ log.description }}</p>

            <div class="text-center mb-3">
              <span v-for="n in 5" :key="n" style="font-size:1.5rem;">
                {{ n <= log.rating ? '⭐' : '☆' }}
              </span>
            </div>

            <div class="d-flex gap-2">
              <button @click="approve(log.id)" class="btn btn-outline-success d-flex align-items-center">
                <i class="bi bi-check-circle me-2"></i> Approve
              </button>
              <button @click="showRejectPrompt(log.id)" class="btn btn-outline-danger d-flex align-items-center">
                <i class="bi bi-x-circle me-2"></i> Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, computed } from 'vue'

  /* all student list TO BE TAKEN FROM DB  */
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
  const approvedStudents = ref(new Set())

  const pendingLogs = computed(() => logsStore.logs.filter(log => log.status === 'pending'))

  /* suggestion dropdown */
  const searchSuggestions = computed(() => {
    if (!searchQuery.value.trim()) return []
    const query = searchQuery.value.toLowerCase()
    return mockStudents.filter(
      s =>
        !approvedStudents.value.has(s.profiles.name) &&
        s.profiles.name.toLowerCase().includes(query)
    )
  })

  /* select suggestions */
  const selectSuggestion = (student) => {
    searchQuery.value = student.profiles.name
    filteredStudents.value = [student]
    showSuggestions.value = false
  }

  /* enter key */
  const handleSearch = () => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) {
      filteredStudents.value = []
      return
    }

    // check if student is already approved
    const approvedMatch = Array.from(approvedStudents.value).find(name =>
      name.toLowerCase().includes(query)
    )
    if (approvedMatch) {
      alert(`"${approvedMatch}" has already been approved and cannot be searched again.`)
      searchQuery.value = ''
      return
    }

    // filter from mockStudents
    filteredStudents.value = mockStudents.filter(s =>
      !approvedStudents.value.has(s.profiles.name) &&
      s.profiles.name.toLowerCase().includes(query)
    )

    if (filteredStudents.value.length === 0) {
      alert('No matching students found')
    }

    showSuggestions.value = false
  }

  /* approve or reject */
  const approve = (id) => {
    const log = logsStore.logs.find(l => l.id === id)
    if (log) {
      logsStore.approveLog(id)
      approvedStudents.value.add(log.studentName)
      alert(`${log.studentName} has been approved and removed from search.`)
    }
  }

  const showRejectPrompt = (id) => {
    const reason = prompt('Enter rejection reason:')
    if (reason) logsStore.rejectLog(id, reason)
  }

  /* filter logs dynamically */
  const filteredLogs = computed(() => {
    if (filteredStudents.value.length === 0) return pendingLogs.value
    const names = filteredStudents.value.map(s => s.profiles.name)
    return pendingLogs.value.filter(log => names.includes(log.studentName))
  })
  </script>

  <style scoped>
  .suggestion-item {
    transition: background-color 0.2s;
  }
  </style>
