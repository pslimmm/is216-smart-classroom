<template>
  <div class="container py-5">
    <!-- Page Header -->
    <div class="mb-4 text-center">
      <h2 class="text-primary mb-3">📋 Review Class Participation Logs</h2>
      
      <!-- View Approved / Rejected Buttons -->
      <div class="d-flex justify-content-center gap-3">
        <router-link to="/prof/review/approved" class="btn btn-success btn-lg">View Approved</router-link>
        <router-link to="/prof/review/rejected" class="btn btn-danger btn-lg">View Rejected</router-link>
      </div>
    </div>

    <!-- Back Button -->
    <div class="text-center mb-4">
      <router-link to="/prof" class="btn btn-outline-secondary">← Back</router-link>
    </div>

    <!-- No Pending Logs -->
    <div v-if="pendingLogs.length === 0" class="text-muted text-center mt-5">
      No pending logs.
    </div>

    <!-- Pending Logs Cards -->
    <div v-for="log in pendingLogs" :key="log.id"
         class="card mb-3 shadow-sm border-warning bg-warning bg-opacity-10">
      <div class="card-body">
        <!-- Pending Badge -->
        <div class="mb-2">
          <span class="badge bg-warning text-dark">PENDING</span>
        </div>

        <!-- Student Name -->
        <h5 class="card-title mb-2">{{ log.studentName }}</h5>

        <!-- Description -->
        <p class="card-text">{{ log.description }}</p>

        <!-- Rating Centered -->
        <div class="text-center mb-3">
          <span v-for="n in 5" :key="n" style="font-size:1.5rem;">
            {{ n <= log.rating ? '⭐' : '☆' }}
          </span>
        </div>

        <!-- Approve / Reject Buttons Centered -->
        <div class="text-center">
          <button @click="approve(log.id)" class="btn btn-success me-2">✅ Approve</button>
          <button @click="showRejectPrompt(log.id)" class="btn btn-danger">❌ Reject</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { logsStore } from '../store/logs'

// Only show pending logs
const pendingLogs = computed(() => logsStore.logs.filter(log => log.status === 'pending'))

const approve = (id) => logsStore.approveLog(id)

const showRejectPrompt = (id) => {
  const reason = prompt('Enter rejection reason:')
  if (reason) logsStore.rejectLog(id, reason)
}
</script>
