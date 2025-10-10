<template>
  <div class="container py-5 d-flex justify-content-center">
    <!-- Card wrapper -->
    <div class="card shadow-sm w-100" style="max-width: 600px;">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">📝 Submit Class Participation Log</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitLog">
          <!-- Student Name Dropdown -->
          <div class="mb-3">
            <label class="form-label">Student Name</label>
            <select v-model="studentName" class="form-select" required>
              <option value="" disabled>Select a student</option>
              <option v-for="name in students" :key="name" :value="name">{{ name }}</option>
            </select>
          </div>

          <!-- Class Participation Description -->
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea v-model="description" class="form-control" rows="3" required></textarea>
          </div>

          <!-- Rating with Stars -->
          <div class="mb-3">
            <label class="form-label">Rating</label>
            <div>
              <span
                v-for="n in 5"
                :key="n"
                @click="rating = n"
                style="font-size: 2rem; cursor: pointer;"
              >
                {{ n <= rating ? '⭐' : '☆' }}
              </span>
            </div>
          </div>

          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Submit</button>
            <NuxtLink to="/ta" class="btn btn-outline-secondary">
              ← Back
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>

// Hardcoded student list
const students = ['Alice', 'Bob', 'Charlie', 'David', 'Eve']

const studentName = ref('')
const description = ref('')
const rating = ref(0)

const submitLog = () => {
  if (!studentName.value || !description.value || rating.value === 0) {
    alert('Please select a student, fill in the description, and give a rating!')
    return
  }

  const newLog = {
    id: Date.now(),
    studentName: studentName.value,
    description: description.value,
    rating: rating.value,
    status: 'pending'
  }

  logsStore.logs.push(newLog)
  localStorage.setItem('logs', JSON.stringify(logsStore.logs))

  // Reset form
  studentName.value = ''
  description.value = ''
  rating.value = 0

  alert('✅ Participation submitted (pending approval)')
}
</script>
