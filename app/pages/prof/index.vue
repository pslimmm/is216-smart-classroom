<script setup>

const stats = ref({
  totalStudents: 6,
  pendingReviews: 1,
  totalRewards: 8,
  coinsAwarded: 1200,
})

const activeTab = ref('review')

// Standby, cause currently using mock data
const loadStats = () => {
  // Havent thought where to pull this from
}
</script>

<template>

  <main class="container py-4 my-4 flex-grow-1">
    <div>
      <h2 class="display-1 fw-bold mb-2">Welcome back, Professor!</h2>
      <p class="fs-2 text-muted">Review participations and manage rewards</p>
    </div>


    <div class="row g-4 mb-4">

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center pb-2">
            <h6 class="fs-2 mb-0 text-muted small">Total Students</h6>
            <i class="bi bi-people-fill text-primary fs-1"></i>
          </div>
          <div class="card-body pt-0">
            <div class="fs-3 fw-bold px-1">{{ stats.totalStudents }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm border border-warning">
          <div class="card-body d-flex justify-content-between align-items-center pb-2">
            <h6 class="fs-2 mb-0 text-muted small">Pending Reviews</h6> 
            <i class="bi bi-exclamation-triangle-fill text-warning fs-1"></i>
          </div>
          <div class="card-body pt-0">
            <div class="fs-3 fw-bold">{{ stats.pendingReviews }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center pb-2">
            <h6 class="fs-2 mb-0 text-muted small">Active Rewards</h6>
            <i class="bi bi-gift text-info fs-1" style="font-size: 1.5rem;"></i>
          </div>
          <div class="card-body pt-0">
            <div class="fs-3 fw-bold">{{ stats.totalRewards }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center pb-2">
            <h6 class="fs-2 mb-0 text-muted small">Coins Awarded</h6> 
            <i class="bi bi-coin text-warning fs-1" style="font-size: 1.5rem;"></i>
          </div>
          <div class="card-body pt-0">
            <div class="fs-3 fw-bold">{{ stats.coinsAwarded }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Shifted to dedicated page -->
    <!-- <ul class="nav nav-tabs mt-4" id="dashboardTabs" role="tablist">
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
        <ProfParticipationReview @update="loadStats" />
      </div>

      <div class="tab-pane fade" :class="{ show: activeTab === 'rewards', active: activeTab === 'rewards' }">
        <ProfRewardsManagement @update="loadStats" />
      </div>
    </div> -->
  </main>
</template>


