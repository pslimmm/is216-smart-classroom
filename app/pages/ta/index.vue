<script setup>;

// const { role } = useRole();

const taData = {
    courses: ["Math 101", "Science 202"],
    pendingReviews: 3,
    activeStudents: 45
};

// Below is the mock data, to be replaced with APIs/data from db
const stats = ref({
    totalStudents: 42,
    todayParticipations: 8,
    totalParticipations: 120,
});

// can replace inside this with real stats
const loadStats = () => {
    stats.value = {
        totalStudents: 31,
        todayParticipations: 6,
        totalParticipations: 27,
    };
};

onMounted(() => {
    loadStats();
});

</script>

<template>
    <!-- <div>
        <div class="ta-dashboard">
            <h1>Teaching Assistant Dashboard</h1>
            <p>Welcome, TA 👋 Here’s your teaching overview:</p>

            <ul>
                <li>Assigned courses: {{ taData.courses.length }}</li>
                <li>Pending reviews: {{ taData.pendingReviews }}</li>
                <li>Active students: {{ taData.activeStudents }}</li>
            </ul>
        </div>
    </div> -->
    <main class="container py-4 flex-grow-1">
        <div class="container py-4">
            <div class="mb-4">
                <h2 class="h3 fw-bold">Teaching Assistant Dashboard</h2>
                <p class="text-muted">Record and track student participations</p>
            </div>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-md-4">
                <div class="card shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center pb-2">
                        <h6 class="mb-0 text-muted">Total Students</h6>
                        <i class="bi bi-people text-primary" style="font-size: 1.5rem;"></i>
                    </div>
                    <div class="card-body pt-0">
                        <div class="fs-4 fw-bold">{{ stats.totalStudents }}</div>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center pb-2">
                        <h6 class="mb-0 text-muted">Today's Participations</h6>
                        <i class="bi bi-graph-up text-success" style="font-size: 1.5rem;"></i>
                    </div>
                    <div class="card-body pt-0">
                        <div class="fs-4 fw-bold">{{ stats.todayParticipations }}</div>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center pb-2">
                        <h6 class="mb-0 text-muted">Total Recorded</h6>
                        <i class="bi bi-check-circle text-info" style="font-size: 1.5rem;"></i>
                    </div>
                    <div class="card-body pt-0">
                        <div class="fs-4 fw-bold">{{ stats.totalParticipations }}</div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.ta-dashboard {
    max-width: 600px;
    margin: 80px auto 50px;
    /* added top margin for navbar space */
    padding: 20px;
    background-color: #f0f8ff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #004080;
}

ul {
    list-style: none;
    padding: 0;
    line-height: 1.8;
}
</style>
