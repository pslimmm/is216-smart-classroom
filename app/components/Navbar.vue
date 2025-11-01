<template>
    <nav class="navbar navbar fixed-top custom-navbar">
        <div class="container-fluid">
            <!-- Logo -->
            <NuxtLink to="/" class="navbar-brand">
                <h2 class="mb-0">ClassParti</h2>
            </NuxtLink>
            <div class="navbar-nav ms-auto d-flex flex-row align-items-center">
                <div v-if="role == 'student' && route.params.course_id" class="me-3 coin-info-wrapper" role="button" title="Marketplace" @click="navigateTo('/courses/'+ course_id + '/marketplace')">
                    <i class="bi bi-coin me-2"></i>
                    <div>{{ coins }}</div>
                </div>
                <div class="me-3 text-end">
                    <strong>{{ data.full_name }}</strong>
                    <p class="text-muted m-0">{{ role == "prof" ? 'Instructor' : role.charAt(0).toUpperCase() + role.slice(1) }}</p>
                </div>
                <i class="bi bi-person-circle" style="font-size: 2.75rem"></i>
            </div>
        </div>
    </nav>
</template>

<script setup>
const { role, userID } = useAuthState();
const route = useRoute();
const course_id = computed(() => route.params.course_id);
const coins = ref(0);

const { data } = await $fetch('/api/user-info', {
    method: 'POST',
    body: {
        user_id: userID.value
    }
})

watch(course_id, async (newCourseId) => {
    if (role.value == 'student' && newCourseId) {
        const { coin_balance } = await $fetch('/api/course-student', {
            method: 'POST',
            body: {
                course_id: newCourseId,
                student_id: userID.value
            }
        })
        coins.value = coin_balance;
    }
}, { immediate: true }); // immediate: true runs the watcher immediately
</script>

<style scoped>
.custom-navbar {
    background-color: white !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    height: 5rem;
    z-index: 1030;
}

.navbar-brand {
    text-decoration: none;
    color: black !important;
}

.navbar-brand h2 {
    font-weight: 700;
    margin: 0;
}


.coin-info-wrapper{
    border: 1px solid black;
    padding: 0.5rem;
    height: 3rem;
    width: fit-content;
    justify-content: space-between;
    align-items: center;
    display: flex;
    border-radius: 1.5rem;

}
</style>