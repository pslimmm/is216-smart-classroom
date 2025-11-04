<template>
    <div class="overlay">
        <div class="modal-wrapper bg-white rounded-5 p-4 m-3">
            <div class="d-flex flex-row justify-content-between align-items-center">
                <h3>Approve class participation</h3>
                <button class="btn btn-close" @click="showApproveModal = false"></button>
            </div>

            <!-- Student Name with Dropdown -->
            <label for="student" class="form-label">Student Name:</label>
            <input type="text" disabled class="form-control" :value="props.student_name">

            <label for="description" class="form-label mt-3">Description:</label>
            <textarea id="description" :value="props.transaction.contribution" class="form-control" rows="5"
                disabled></textarea>

            <label class="form-label mt-3 d-block">Rating</label>
            <div>
                <i v-for="n in 5" :key="n" class="bi star-rating" :class="[
                    n <= (props.transaction.rating) ? 'bi-star-fill text-warning bounce' : 'bi-star text-secondary'
                ]" style="font-size: 2rem; "></i>
            </div>

            <label for="coins-awarded" class="mt-3">Coins Awarded</label>
            <input type="number" class="form-control" v-model="coins_awarded">

            <label for="remarks" class="mt-3">Additional Remarks</label>
            <textarea name="remarks" id="remarks" class="form-control" rows="5" v-model="remarks"></textarea>
            <button type="submit" class="btn btn-success w-100 fs-3 mt-4" @click="handleSubmit()">
                Approve
            </button>
        </div>
    </div>
</template>

<script setup>
const showApproveModal = defineModel("showApproveModal");
const props = defineProps(['transaction', 'student_name', 'student_id'])
const { userID } = useAuthState();
// Reactive data
const coins_awarded = ref(0);
const remarks = ref('');
const route = useRoute();

const handleSubmit = async () => {

    const response = await $fetch('/api/update-cp', {
        method: "POST",
        body: {
            prof_id: userID.value,
            transaction_id: props.transaction.transaction_id,
            remarks: remarks.value,
            coins_awarded: coins_awarded.value,
            student_id: props.student_id,
            course_id: route.params.course_id,
            action: 'approved'
        }
    });

    if (response) {
        console.error(response.error);
    }
    showApproveModal.value = false;
}

</script>

<style scoped>
.overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.2);
}

.modal-wrapper {
    width: min(90vw, 500px);
    max-height: 90vh;
    overflow-y: auto;
}

.star-rating {
    transform: translateY(0);
}

.bounce {
    animation: bounce 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    transform: translateY(2rem) !important;
}

@keyframes bounce {
    0% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-15px) scale(1.15);
    }

    100% {
        transform: translateY(-10px) scale(1.1);
    }
}

/* Input group styling */
.input-group {
    z-index: 1001;
}

.suggestions-dropdown {
    border: 1px solid #dee2e6;
}

.suggestion-item:hover {
    background-color: #f8f9fa !important;
}
</style>