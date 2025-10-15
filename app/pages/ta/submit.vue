<script setup>
import { ref, onMounted } from 'vue'

// Instances
const students = ref([])
const studentName = ref('')
const dateForm = ref('')
const description = ref('')
const rating = ref(0)
const loading = ref(false)
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

const submitLog = () => {
  if (!studentName.value || !dateForm.value || !description.value || rating.value === 0) {
    alert('Please ensure the following:\n1) Selected a student\n2) Selected a date\n3) Fill in the description\n4) Give a rating')
    return
  } else {

    loading.value = true;
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
      console.log('Participation recorded:', {
        student_id: studentName.value,
        date: dateForm.value,
        description: description.value,
        rating: rating.value,
        status: 'Pending',
      })

      studentName.value = ''
      description.value = ''
      dateForm.value = ''
      loading.value = false
      emit('success')
    }, 1000);
  }
}
</script>

<template>
  <div class="container py-5 d-flex justify-content-center">

    <!-- <div class="card shadow-sm w-100" style="max-width: 600px;"> -->
    <div class="card shadow-sm w-100 h-100">
      <div class="card-header bg-gradient-primary">
        <h4 class="card-title mb-0 display-2">Record Student Participation</h4>
      </div>

      <div class="card-body display-5">
        <form @submit.prevent="submitLog" class="vstack gap-3">

          <div>
            <label for="student" class="form-label">Student Name:</label>
            <select id="student" v-model="studentName" class="form-select" required>
              <option value="" disabled>Select a student</option>
              <option v-for="student in students" :key="student.user_id" :value="student.profiles.name">{{
                student.profiles.name }}</option>
            </select>
          </div>

          <div>
            <label for="date" class="form-label">Date:</label>
            <input id="date" type="date" class="form-control" v-model="dateForm" required />
          </div>

          <div>
            <label for="description" class="form-label">Description:</label>
            <textarea id="description" v-model="description" class="form-control" rows="5" required
              placeholder="Describe the student's participation . . ."></textarea>
          </div>

          <div>
            <label class="form-label">Rating</label>
            <div>
              <i v-for="n in 5" :key="n" @click="rating = n" class="bi"
                :class="n <= rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'"
                style="font-size: 2rem; cursor: pointer;"></i>
            </div>
          </div>


          <button type="submit" class="btn btn-primary w-100 fs-3">Submit</button>
          <NuxtLink to="/ta" class="btn text-primary fs-3">Back</NuxtLink>

        </form>
      </div>
    </div>
  </div>
</template>