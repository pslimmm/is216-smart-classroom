<script setup>
import { ref, onMounted } from 'vue'

// Mock rewards (May need a database for this also?)
const rewards = ref([])
const formData = ref({
    title: '',
    description: '',
    coin_cost: 10,
    quantity_available: 1,
})

// Simulate API load
onMounted(() => {
    setTimeout(() => {
        rewards.value = [
            {
                id: 'rwd1',
                title: 'Extra Credit Quiz',
                description: 'Redeem for 5 bonus points on next quiz.',
                coin_cost: 20,
                quantity_available: 10,
            },
            {
                id: 'rwd2',
                title: 'Late Submission Pass',
                description: 'Submit one assignment late without penalty.',
                coin_cost: 50,
                quantity_available: 5,
            },
        ]
    }, 800)
})

// Simulate Create Reward (If grabbing reward from database, will have to change this logic)
const handleSubmit = () => {
    const newReward = {
        id: Date.now().toString(),
        ...formData.value,
    }
    rewards.value.unshift(newReward)
    resetForm()
    closeModal()
}

// Simulate Delete Reward (Likewise, change logic if from database)
const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this reward?')) {
        rewards.value = rewards.value.filter((r) => r.id !== id)
    }
}

const resetForm = () => {
    formData.value = {
        title: '',
        description: '',
        coin_cost: 10,
        quantity_available: 1,
    }
}

// Close Bootstrap modal programmatically
const modalRef = ref(null)
const closeModal = () => {
    const modalEl = modalRef.value
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl)
        modalInstance?.hide()
    }
}
</script>

<template>
    <div class="d-flex flex-column gap-4">

        <div class="d-flex justify-content-between align-items-center">
            <h3 class="h5 fw-semibold mb-0">Rewards</h3>
            <button class="btn btn-primary d-flex align-items-center" data-bs-toggle="modal"
                data-bs-target="#createRewardModal">
                <i class="bi bi-plus-lg me-2"></i>
                Create Reward
            </button>
        </div>

        <div class="row g-4">
            <!-- Same as ParticipationReview, using for-loop through rewardsArray to generate rewards -->
            <div v-for="reward in rewards" :key="reward.id" class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-header d-flex justify-content-between align-items-start">
                        <div class="d-flex align-items-start gap-2">
                            <i class="bi bi-gift text-info fs-5 mt-1"></i>
                            <div>
                                <h5 class="mb-1">{{ reward.title }}</h5>
                                <p class="text-muted small mb-0">{{ reward.description }}</p>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-outline-danger border-0" title="Delete"
                            @click="handleDelete(reward.id)">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>

                    <div class="card-body">
                        <div class="d-flex justify-content-between small mb-1">
                            <span class="text-muted">Cost:</span>
                            <span class="fw-semibold text-info">{{ reward.coin_cost }} coins</span>
                        </div>
                        <div class="d-flex justify-content-between small">
                            <span class="text-muted">Available:</span>
                            <span class="fw-semibold">{{ reward.quantity_available }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="rewards.length === 0" class="card text-center shadow-sm">
            <div class="card-body text-muted py-4">
                No rewards created yet. Create your first reward!
            </div>
        </div>

        <!-- This is to create a new Reward, but it is only for UI testing purposes. Will need to change logic for this -->
         <!-- This code "activates" when clicking on the "Create Reward button" -->
        <div class="modal fade" id="createRewardModal" tabindex="-1" aria-labelledby="createRewardLabel"
            aria-hidden="true" ref="modalRef">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form @submit.prevent="handleSubmit">
                        <div class="modal-header">
                            <h5 class="modal-title" id="createRewardLabel">Create New Reward</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="rewardTitle" class="form-label">Title</label>
                                <input id="rewardTitle" type="text" class="form-control" v-model="formData.title"
                                    required />
                            </div>

                            <div class="mb-3">
                                <label for="rewardDesc" class="form-label">Description</label>
                                <textarea id="rewardDesc" class="form-control" rows="3" v-model="formData.description"
                                    required></textarea>
                            </div>

                            <div class="mb-3">
                                <label for="coinCost" class="form-label">Coin Cost</label>
                                <input id="coinCost" type="number" min="1" class="form-control"
                                    v-model.number="formData.coin_cost" required />
                            </div>

                            <div class="mb-3">
                                <label for="quantity" class="form-label">Quantity Available</label>
                                <input id="quantity" type="number" min="1" class="form-control"
                                    v-model.number="formData.quantity_available" required />
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary w-100">
                                Create Reward
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>