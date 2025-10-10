<script setup>
import TopBar from '~/components/topBar.vue';
import ParticipationReview from '~/components/professor/ParticipationReview.vue';
import RewardsManagement from '~/components/professor/RewardsManagement.vue';

const stats = ref({
  totalStudents: 32,
  pendingReviews: 8,
  totalRewards: 5,
  coinsAwarded: 1200,
})

const activeTab = ref('review')

// Standby, cause currently using mock data
const loadStats = () => {
  // Havent thought where to pull this from
}
</script>

<template>
  <TopBar />

  <main class="container py-4 flex-grow-1">
    <div>
      <h2 class="h3 fw-bold mb-2">Professor Dashboard</h2>
      <p class="text-muted">Review participations and manage rewards</p>
    </div>


    <div class="row g-4 mb-4">

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center pb-2">
            <h6 class="mb-0 text-muted small">Total Students</h6>
            <i class="bi bi-people text-muted"></i>
          </div>
          <div class="card-body pt-0">
            <div class="fs-4 fw-bold">{{ stats.totalStudents }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center pb-2">
            <h6 class="mb-0 text-muted small">Pending Reviews</h6> <i class="bi bi-graph-up text-warning"></i>
          </div>
          <div class="card-body pt-0">
            <div class="fs-4 fw-bold">{{ stats.pendingReviews }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center pb-2">
            <h6 class="mb-0 text-muted small">Active Rewards</h6> <i class="bi bi-gift text-info"></i>
          </div>
          <div class="card-body pt-0">
            <div class="fs-4 fw-bold">{{ stats.totalRewards }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center pb-2">
            <h6 class="mb-0 text-muted small">Coins Awarded</h6> <i class="bi bi-award text-secondary"></i>
          </div>
          <div class="card-body pt-0">
            <div class="fs-4 fw-bold">{{ stats.coinsAwarded }}</div>
          </div>
        </div>
      </div>

    </div>

    <ul class="nav nav-tabs mt-4" id="dashboardTabs" role="tablist">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'review' }" @click="activeTab = 'review'">
          Review Participations
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'rewards' }" @click="activeTab = 'rewards'">
          Manage Rewards
        </button>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <div class="tab-pane fade" :class="{ show: activeTab === 'review', active: activeTab === 'review' }">
        <ParticipationReview />
        <!-- <ParticipationReview @update="loadStats" /> -->
      </div>

      <div class="tab-pane fade" :class="{ show: activeTab === 'rewards', active: activeTab === 'rewards' }">
        <RewardsManagement />
        <!-- <RewardsManagement @update="loadStats" /> -->
      </div>
    </div>
  </main>
</template>