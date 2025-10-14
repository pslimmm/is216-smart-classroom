<template>
  <div class="container py-5">
    <!-- Page Header -->
    <div class="mb-4 text-center">
      <h2 class="text-primary mb-3">Review Class Participation Logs</h2>

      <!-- View Approved / Rejected Buttons -->
      <div class="d-flex justify-content-center gap-3">
        <NuxtLink to="/prof/review/approved" class="btn btn-success btn-lg">View Approved</NuxtLink>
        <NuxtLink to="/prof/review/rejected" class="btn btn-danger btn-lg">View Rejected</NuxtLink>
      </div>
    </div>

    <!-- Back Button -->
    <div class="text-center mb-4">
      <NuxtLink to="/prof" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left"></i> Back
      </NuxtLink>
    </div>

    <!-- Loading -->
    <!-- <div v-if="loading" class="text-center text-muted py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">Loading participations...</p>
    </div> -->

    <!-- No Pending Logs -->
    <div v-if="pendingLogs.length === 0" class="text-muted text-center mt-5">
      <i class="bi bi-journal-x display-4"></i>
      <p class="mt-3">No pending participations to review</p>
    </div>

    <!-- Pending Logs Cards -->
    <div v-for="log in pendingLogs" :key="log.id" class="card mb-3 shadow-sm border-warning bg-warning bg-opacity-10">
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
            {{ n <= log.rating ? '⭐' : '☆' }} </span>
        </div>

        <!-- Approve / Reject Buttons Centered -->
        <div class="d-flex gap-2">
          <button @click="approve(log.id)" class="btn btn-outline-success d-flex align-items-center">
            Approve <i class="bi bi-check-circle me-2"></i> </button>
          <button @click="showRejectPrompt(log.id)" class="btn btn-outline-danger d-flex align-items-center">
            Reject <i class="bi bi-x-circle me-2"></i> </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// Only show pending logs
const loading = ref(true)
const pendingLogs = computed(() => logsStore.logs.filter(log => log.status === 'pending'))

const approve = (id) => logsStore.approveLog(id)

const showRejectPrompt = (id) => {
  const reason = prompt('Enter rejection reason:')
  if (reason) logsStore.rejectLog(id, reason)
}
</script>
