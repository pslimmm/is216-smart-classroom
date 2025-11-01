<script setup>

const { role } = useAuthState();
const route = useRoute();
const courseId = computed(() => route.params.course_id);
</script>
<template>
    <div>
        <!-- Navigation Buttons - Sticky -->
        <div class="sticky-header d-flex justify-content-between align-items-center py-3 bg-white">
            <button @click="navigateTo('/courses')" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left me-2"></i>Back to Courses
            </button>
            <button @click="navigateTo(`/courses/${courseId}/notes`)" class="btn btn-primary">
                <i class="bi bi-journal-text me-2"></i>View Notes
            </button>
        </div>

        <!-- Dashboard Content -->
        <div class="container-fluid">
            <ClassReport v-if="['prof', 'ta'].includes(role)"/>
            <StudentDashboard v-else-if="role == 'student'"/>
        </div>
    </div>
</template>

<style scoped>
.sticky-header {
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 100%;
}

/* Responsive: Stack buttons on mobile */
@media (max-width: 768px) {
    .sticky-header {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .sticky-header button {
        width: 100%;
    }
}
</style>