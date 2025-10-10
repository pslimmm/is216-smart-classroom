<template>
  <div class="container py-5">
    <!-- Page Header -->
    <div class="mb-4 text-center">
      <h2 class="text-danger mb-3">❌ Rejected Class Participation Logs</h2>
    </div>

    <!-- No Rejected Logs -->
    <div v-if="rejectedLogs.length === 0" class="text-muted text-center mt-5">
      No rejected logs yet.
    </div>

    <!-- Rejected Logs Cards -->
    <div v-for="log in rejectedLogs" :key="log.id"
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

        <!-- Reason (if any) -->
        <p v-if="log.reason" class="text-danger mb-2">
          <strong>Reason:</strong> {{ log.reason }}
        </p>

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

// Only show rejected logs
const rejectedLogs = computed(() =>
  logsStore.logs.filter(log => log.status === 'rejected')
)
</script>
