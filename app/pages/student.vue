<script setup>
import Chart from 'chart.js/auto';

definePageMeta({
    middleware: 'role'
});

const enrolledCourses = ref(["Math 101", "Physics 202"]);
const coins = ref(100);
const currentWeek = ref(7);

const participationData = ref({
    studentId: "S123",
    weeks: [1, 2, 3, 4, 5, 6, 7],
    myAvgRating: [3.5, 4.0, 3.2, 4.5, 4.8, 4.0, 4.2],
    classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
    myWeeklyCount: [4, 5, 2, 6, 3, 4, 2]
});

const recentParticipations = ref([
    {
        date: "2025-10-06",
        week: 7,
        contribution: "Explained recursion concept clearly",
        rating: 4.5,
        coinsEarned: 15
    },
    {
        date: "2025-10-05",
        week: 7,
        contribution: "Asked insightful question about algorithms",
        rating: 3.5,
        coinsEarned: 10
    },
    {
        date: "2025-10-01",
        week: 6,
        contribution: "Helped classmate with debugging",
        rating: 4.0,
        coinsEarned: 12
    }
]);

const qualityChart = ref(null);
const countChart = ref(null);

const totalParticipations = computed(() => {
    return participationData.value.myWeeklyCount.reduce((sum, count) => sum + count, 0);
});

const myOverallAvgRating = computed(() => {
    const ratings = participationData.value.myAvgRating.filter(r => r > 0);
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
});

const classOverallAvgRating = computed(() => {
    const ratings = participationData.value.classAvgRating.filter(r => r > 0);
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
});

const currentWeekParticipations = computed(() => {
    return participationData.value.myWeeklyCount[currentWeek.value - 1] || 0;
});

const gradeProjection = computed(() => {
    const avgParticipationsPerWeek = totalParticipations.value / currentWeek.value;
    if (avgParticipationsPerWeek >= 3 && myOverallAvgRating.value >= 4.0) return "A+";
    if (avgParticipationsPerWeek >= 3 && myOverallAvgRating.value >= 3.5) return "A";
    if (avgParticipationsPerWeek >= 2.5) return "B+";
    if (avgParticipationsPerWeek >= 2) return "B";
    return "C or below";
});

const weeklyAlertClass = computed(() => {
    if (currentWeekParticipations.value >= 3) return 'alert-success';
    if (currentWeekParticipations.value >= 2) return 'alert-warning';
    return 'alert-danger';
});

onMounted(() => {
    nextTick(() => {
        createQualityChart();
        createCountChart();
    });
});

watch(currentWeek, () => {
    nextTick(() => {
        if (qualityChart.value) qualityChart.value.destroy();
        if (countChart.value) countChart.value.destroy();
        createQualityChart();
        createCountChart();
    });
});

const createQualityChart = () => {
    const ctx = document.getElementById('qualityChart');
    if (!ctx) return;

    qualityChart.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: participationData.value.weeks,
            datasets: [
                {
                    label: 'My Avg Rating',
                    data: participationData.value.myAvgRating,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Class Avg Rating',
                    data: participationData.value.classAvgRating,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    min: 0,
                    max: 5,
                    ticks: { stepSize: 0.5 },
                    title: { display: true, text: 'Average Rating (1-5)' }
                },
                x: {
                    title: { display: true, text: 'Week Number' }
                }
            }
        }
    });
};

const createCountChart = () => {
    const ctx = document.getElementById('countChart');
    if (!ctx) return;

    const counts = participationData.value.myWeeklyCount;
    const colors = counts.map(count => {
        if (count >= 3) return 'rgba(13, 110, 253, 0.7)';
        if (count >= 2) return 'rgba(255, 206, 86, 0.7)';
        return 'rgba(255, 99, 132, 0.7)';
    });

    countChart.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: participationData.value.weeks,
            datasets: [{
                label: 'My Participation Count',
                data: counts,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.7', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    title: { display: true, text: 'No. of Participations' }
                },
                x: {
                    title: { display: true, text: 'Week Number' }
                }
            }
        }
    });
};

onBeforeUnmount(() => {
    if (qualityChart.value) qualityChart.value.destroy();
    if (countChart.value) countChart.value.destroy();
});
</script>

<template>
    <main class="container py-4 my-4">
        <div class="container-fluid">
            <h1 class="mb-4 display-1 fw-bold">My Participation Dashboard</h1>

            <div class="row g-4 mb-5">
                <div class="col-lg-3 col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-coin text-warning fs-1 mb-2"></i>
                            <h4 class="fw-bold">{{ coins }}</h4>
                            <small class="text-muted">Total Coins</small>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-card-list text-primary fs-1 mb-2"></i>
                            <h4 class="fw-bold">{{ totalParticipations }}</h4>
                            <small class="text-muted">Total Participations</small>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-star-fill text-info fs-1 mb-2"></i>
                            <h4 class="fw-bold">{{ myOverallAvgRating.toFixed(2) }}</h4>
                            <small class="text-muted">My Avg Rating</small>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-trophy-fill text-success fs-1 mb-2"></i>
                            <h4 class="fw-bold">{{ gradeProjection }}</h4>
                            <small class="text-muted">Projected Grade</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h6 class="text-muted mb-2">Current Week</h6>
                            <div class="d-flex align-items-center gap-3">
                                <label for="weekSelect" class="form-label mb-0">Week:</label>
                                <select 
                                    id="weekSelect" 
                                    v-model="currentWeek" 
                                    class="form-select form-select-sm"
                                    style="width: auto;"
                                >
                                    <option v-for="week in 13" :key="week" :value="week">{{ week }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h6 class="text-muted mb-2">Class Average</h6>
                            <h4 class="fw-bold">{{ classOverallAvgRating.toFixed(2) }}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div :class="['alert mb-4', weeklyAlertClass]">
                <strong>Week {{ currentWeek }} Progress: {{ currentWeekParticipations }}/3</strong><br>
                <span v-if="currentWeekParticipations >= 3">Great job! You've met the weekly target!</span>
                <span v-else-if="currentWeekParticipations >= 2">One more to reach your target!</span>
                <span v-else>❗ You need {{ 3 - currentWeekParticipations }} more to meet the weekly minimum.</span>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-lg-6">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="fw-semibold mb-3">Quality Rating: Me vs Class</h5>
                            <canvas id="qualityChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="fw-semibold mb-3">Weekly Participation Count</h5>
                            <canvas id="countChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="fw-semibold mb-3">Recent Participation History</h5>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Week</th>
                                    <th>Contribution</th>
                                    <th>Rating</th>
                                    <th>Coins Earned</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(p, i) in recentParticipations" :key="i">
                                    <td>{{ p.date }}</td>
                                    <td>Week {{ p.week }}</td>
                                    <td>{{ p.contribution }}</td>
                                    <td>
                                        <span class="badge bg-info">{{ p.rating }} ⭐</span>
                                    </td>
                                    <td>
                                        <span class="badge bg-warning text-dark">
                                            <i class="bi bi-coin"></i> {{ p.coinsEarned }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.card {
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-2px);
}
</style>