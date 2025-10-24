<template>
  <div class="container py-5 d-flex justify-content-center">
    <div class="card shadow-sm w-100 h-100">
      <div class="card-header bg-gradient-primary">
        <h4 class="card-title mb-0 display-2">Record Student Participation</h4>
      </div>

      <div class="card-body display-5">
        <form @submit.prevent="submitLog" class="vstack gap-3">

          <!-- Student Search -->
          <div>
            <label for="student" class="form-label">Student Name:</label>
            <div class="position-relative">
              <input
                id="student"
                type="text"
                v-model="studentName"
                @focus="showSuggestions = studentName.length > 0"
                @input="showSuggestions = studentName.length > 0"
                @blur="setTimeout(() => showSuggestions = false, 200)"
                @keyup.enter="handleSearch"
                class="form-control"
                placeholder="Search a student"
                required
              />

              <!-- Suggestions Dropdown -->
              <div
                v-if="showSuggestions && searchSuggestions.length > 0"
                class="suggestions-dropdown position-absolute w-100 bg-white border rounded shadow-sm"
                style="top: 100%; z-index: 1000; max-height: 200px; overflow-y: auto;"
              >
                <div
                  v-for="student in searchSuggestions"
                  :key="student.user_id"
                  @click="selectSuggestion(student)"
                  class="p-2 border-bottom"
                  style="cursor: pointer;"
                  @mouseenter="$event.target.style.backgroundColor = '#f8f9fa'"
                  @mouseleave="$event.target.style.backgroundColor = 'white'"
                >
                  {{ student.profiles.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Date -->
          <div>
            <label for="date" class="form-label">Date:</label>
            <input id="date" type="date" class="form-control" v-model="dateForm" required />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="form-label">Description:</label>
            <textarea id="description" v-model="description" class="form-control" rows="5" required
              placeholder="Describe the student's participation . . ."></textarea>
          </div>

          <!-- Rating -->
          <div>
            <label class="form-label">Rating</label>
            <div>
              <i v-for="n in 5" :key="n" @click="rating = n" class="bi"
                :class="n <= rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'"
                style="font-size: 2rem; cursor: pointer;"></i>
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn btn-primary w-100 fs-3">Submit</button>
          <NuxtLink to="/ta" class="btn text-primary fs-3">Back</NuxtLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const students = ref([])
const studentName = ref('')
const dateForm = ref('')
const description = ref('')
const rating = ref(0)
const loading = ref(false)
const showSuggestions = ref(false)
const emit = defineEmits(['success'])

const mockStudents = [
  { user_id: '1', profiles: { name: 'Alice' } },
  { user_id: '2', profiles: { name: 'Bob' } },
  { user_id: '3', profiles: { name: 'Charlie' } },
  { user_id: '4', profiles: { name: 'Davis' } },
  { user_id: '5', profiles: { name: 'Peter' } },
  { user_id: '6', profiles: { name: 'Yichen' } },
]

onMounted(() => {
  setTimeout(() => {
    students.value = mockStudents
  }, 300)
})

// Suggestions dropdown
const searchSuggestions = computed(() => {
  if (!studentName.value.trim()) return []
  const query = studentName.value.toLowerCase()
  return students.value.filter(s =>
    s.profiles.name.toLowerCase().includes(query)
  )
})

// Select a student from dropdown
const selectSuggestion = (student) => {
  studentName.value = student.profiles.name
  showSuggestions.value = false
}

// Handle Enter key
const handleSearch = () => {
  const query = studentName.value.trim().toLowerCase()
  if (!query) {
    return
  }

  const matches = students.value.filter(s =>
    s.profiles.name.toLowerCase().includes(query)
  )

  if (matches.length === 0) {
    alert('No matching students found')
  } else {
    studentName.value = matches[0].profiles.name
  }

  showSuggestions.value = false
}

// Submit log function (existing)
const submitLog = () => {
  if (!studentName.value || !dateForm.value || !description.value || rating.value === 0) {
    alert('Please ensure the following:\n1) Selected a student\n2) Selected a date\n3) Fill in the description\n4) Give a rating')
    return
  }

  loading.value = true
  const newLog = {
    id: Date.now(),
    studentName: studentName.value,
    description: description.value,
    rating: rating.value,
    status: 'pending'
  }

  logsStore.logs.push(newLog)
  localStorage.setItem('logs', JSON.stringify(logsStore.logs))

  setTimeout(() => {
    studentName.value = ''
    description.value = ''
    dateForm.value = ''
    rating.value = 0
    loading.value = false
    emit('success')
  }, 1000)
}
</script>

<style scoped>
.suggestions-dropdown {
  transition: background-color 0.2s;
}
</style>
