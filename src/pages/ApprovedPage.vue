<template>
  <div class="container py-5">
    <!-- Page Header -->
    <div class="mb-4 text-center">
      <h2 class="text-success mb-3">✅ Approved Class Participation Logs</h2>
    </div>

    <!-- No Approved Logs -->
    <div v-if="approvedLogs.length === 0" class="text-muted text-center mt-5">
      No approved logs yet.
    </div>

    <!-- Approved Logs Cards -->
    <div v-for="log in approvedLogs" :key="log.id"
         class="card mb-3 shadow-sm border-success bg-success bg-opacity-10">
      <div class="card-body">
        <!-- Approved Badge -->
        <div class="mb-2">
          <span class="badge bg-success text-white">APPROVED</span>
        </div>

        <!-- Student Name -->
        <h5 class="card-title mb-2">{{ log.studentName }}</h5>

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
      <router-link to="/prof/review" class="btn btn-outline-secondary">
        ← Back to Review
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { logsStore } from '../store/logs'

// Only show approved logs
const approvedLogs = computed(() =>
  logsStore.logs.filter(log => log.status === 'approved')
)
</script>
