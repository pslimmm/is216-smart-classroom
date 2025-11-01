<script setup>
import Chart from 'chart.js/auto';

const route = useRoute();
const { userID } = useAuthState();
const course_id = route.params.course_id;
const student_id = userID.value;

// Reactive data
const courseInfo = ref(null);
const participationTransactions = ref([]);
const allParticipationTransactions = ref([]);
const classAvgData = ref({});
const currentWeek = ref(1);
const totalCoins = ref(0);
const selectedWeek = ref(currentWeek.value);

// Chart references
const qualityChart = ref(null);
const countChart = ref(null);

// Fetch course info to get starting date
try {
    const response = await $fetch('/api/course-info', {
        method: 'POST',
        body: { course_id }
    });
    if (response.ok) {
        courseInfo.value = response.courseData;
        calculateCurrentWeek(courseInfo.value.starting_date);
    }
} catch (error) {
    console.error('Error fetching course info:', error);
}

// Fetch student participation data
try {
    const response = await $fetch('/api/course-student', {
        method: 'POST',
        body: {
            course_id,
            student_id
        }
    });
    if (response.ok) {
        participationTransactions.value = response.data.filter((p) => p.status == 'approved');
        allParticipationTransactions.value = response.data;
        totalCoins.value = response.coin_balance
    }
} catch (error) {
    console.error('Error fetching student participation:', error);
}

// Calculate current week based on course start date
function calculateCurrentWeek(startingDate) {
    const startDate = new Date(startingDate);
    const today = new Date();
    const diffTime = today - startDate;
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
    currentWeek.value = Math.max(1, Math.min(diffWeeks, 14));
}


// Fetch class average data for all weeks
for (let week = 1; week <= currentWeek.value; week++) {
    try {
        const response = await $fetch('/api/get-course-avg', {
            method: 'POST',
            body: {
                course_id,
                week
            }
        });
        if (response.ok) {
            classAvgData.value[week] = response.courseAvg || 0;
        }
    } catch (error) {
        console.error(`Error fetching class average for week ${week}:`, error);
        classAvgData.value[week] = 0;
    }
}

// Process data for charts
const processedData = computed(() => {
    const weeks = Array.from({ length: currentWeek.value }, (_, i) => i + 1);
    const myAvgRating = [];
    const classAvgRating = [];
    const myWeeklyCount = [];

    weeks.forEach(week => {
        // Calculate student's average rating for the week
        const weekTransactions = participationTransactions.value.filter(t => t.week == week);
        const weekRatings = weekTransactions.map(t => t.rating);
        const avgRating = weekRatings.length > 0 ? weekRatings.reduce((sum, r) => sum + r, 0) / 3 : 0;

        myAvgRating.push(avgRating);
        myWeeklyCount.push(weekTransactions.length);
        classAvgRating.push(classAvgData.value[week] || 0);
    });

    return {
        weeks,
        myAvgRating,
        classAvgRating,
        myWeeklyCount
    };
});

const totalParticipations = computed(() => {
    return participationTransactions.value.length;
});
const myAvgRating = computed(() => {
    if (participationTransactions.value.length === 0) return 0;
    const totalRating = participationTransactions.value.reduce((sum, t) => sum + t.rating, 0);
    return (totalRating / 3 / currentWeek.value);
});

const projectedGradeStyle = ref('text-success')
const projectedGrade = computed(() => {
    const avgRating = myAvgRating.value;
    const avgParticipationsPerWeek = totalParticipations.value / Math.max(currentWeek.value, 1);

    if (avgParticipationsPerWeek >= 3 && avgRating >= 4.0) return "A+";
    if (avgParticipationsPerWeek >= 3 && avgRating >= 3.5) return "A";
    if (avgParticipationsPerWeek >= 2.5) return "B+";
    if (avgParticipationsPerWeek >= 2) {
        projectedGradeStyle.value = 'text-warning';
        return "B"
    };

    projectedGradeStyle.value = 'text-danger';
    return "C or below";
});

const currentWeekParticipations = computed(() => {
    return participationTransactions.value.filter(t => t.week === selectedWeek.value).length;
});

const currentWeekProgressPercentage = computed(() => {
    const progress = Math.min((currentWeekParticipations.value / 3) * 100, 100);
    return Math.round(progress);
});

const participationHistory = computed(() => {
    return allParticipationTransactions.value
        .map(transaction => ({
            id: transaction.id,
            week: transaction.week,
            contribution: transaction.description || 'No description provided',
            rating: transaction.rating,
            coinsEarned: transaction.coins_awarded,
            remarks: transaction.prof_remarks,
            status: transaction.status
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Chart functions
const destroyCharts = () => {
    [qualityChart.value, countChart.value].forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
};

const createQualityChart = () => {
    const ctx = document.getElementById('qualityChart');
    if (!ctx) return;

    if (qualityChart.value) {
        qualityChart.value.destroy();
    }

    qualityChart.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: processedData.value.weeks,
            datasets: [
                {
                    label: 'My Avg Rating',
                    data: processedData.value.myAvgRating,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Class Avg Rating',
                    data: processedData.value.classAvgRating,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
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
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.parsed.y?.toFixed(2) || '0'}`;
                        }
                    }
                }
            }
        }
    });
};

const createCountChart = () => {
    const ctx = document.getElementById('countChart');
    if (!ctx) return;

    if (countChart.value) {
        countChart.value.destroy();
    }

    const counts = processedData.value.myWeeklyCount;
    const colors = counts.map(count => {
        if (count >= 3) return 'rgba(40, 167, 69, 0.7)';
        if (count >= 2) return 'rgba(255, 193, 7, 0.7)';
        if (count >= 1) return 'rgba(253, 126, 20, 0.7)';
        return 'rgba(220, 53, 69, 0.7)';
    });

    countChart.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: processedData.value.weeks,
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
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    title: { display: true, text: 'No. of Participations' }
                },
                x: {
                    title: { display: true, text: 'Week Number' }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `My Participation Count: ${context.parsed.y}`;
                        }
                    }
                }
            }
        }
    });
};

const initializeCharts = () => {
    destroyCharts();
    nextTick(() => {
        createQualityChart();
        createCountChart();
    });
};

// Initialize data
onMounted(async () => {
    initializeCharts();

});

watch([selectedWeek, processedData], () => {
    initializeCharts();
});

onBeforeUnmount(() => {
    destroyCharts();
});
</script>

<template>
    <main class="container py-4 my-4">
        <!-- <div class="container-fluid"> -->
            <h1 class="mb-4 fw-bold" style="font-size: clamp(1.75rem, 2vw+1.25rem, 3rem);">My Participation Dashboard</h1>

            <!-- Course Information -->
            <div class="card shadow-sm mb-4" v-if="courseInfo">
                <div class="card-body">
                    <h4 class="card-title">{{ courseInfo.course_name }}</h4>
                    <p class="card-text mb-1">
                        <strong>Course Code:</strong> {{ courseInfo.course_code }} |
                        <strong>Section:</strong> {{ courseInfo.course_section }}
                    </p>
                    <p class="card-text mb-1">
                        <strong>Term:</strong> {{ courseInfo.course_term }} |
                        <strong>Time:</strong> {{ courseInfo.course_time }}
                    </p>
                    <p class="card-text mb-0">
                        <strong>Location:</strong> {{ courseInfo.course_location }} |
                        <strong>Started:</strong> {{ new Date(courseInfo.starting_date).toLocaleDateString() }}
                    </p>
                </div>
            </div>

            <!-- Progress Bar Card -->
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h5 class="card-title mb-3">This Week's Progress</h5>
                    <div class="progress" style="height: 30px;">
                        <div class="progress-bar" :class="{
                            'bg-success': currentWeekProgressPercentage >= 100,
                            'bg-warning': currentWeekProgressPercentage >= 66 && currentWeekProgressPercentage < 100,
                            'bg-danger': currentWeekProgressPercentage < 66
                        }" :style="{ width: currentWeekProgressPercentage + '%' }">
                            <span class="fw-bold fs-6">{{ currentWeekParticipations }}/3</span>
                        </div>
                    </div>
                    <div class="text-center mt-2">
                        <h3 class="fw-bold text-primary">{{ currentWeekProgressPercentage }}%</h3>
                        <small class="text-muted">{{ currentWeekParticipations }}/3 participation done this week</small>
                    </div>
                </div>
            </div>

            <!-- <div class="row g-4 mb-5"> -->
            <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 g-md-4 mb-5">
                <div class="col">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-coin text-warning fs-1 mb-2"></i>
                            <h4 class="fw-bold fs-4">{{ totalCoins }}</h4>
                            <small class="text-muted small">Total Coins</small>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-card-list text-primary fs-1 mb-2"></i>
                            <h4 class="fw-bold fs-4">{{ totalParticipations }}</h4>
                            <small class="text-muted small">Total Participations</small>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-star-fill text-info fs-1 mb-2"></i>
                            <h4 class="fw-bold fs-4">{{ myAvgRating.toFixed(2) }}</h4>
                            <small class="text-muted small">My Avg Rating</small>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-trophy-fill fs-1 mb-2" :class="projectedGradeStyle"></i>
                            <h4 class="fw-bold fs-4">{{ projectedGrade }}</h4>
                            <small class="text-muted small">Projected Grade</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-4">
                <div class="col-12 col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h6 class="text-muted mb-2">Current Week</h6>
                            <div class="d-flex align-items-center gap-3">
                                <label for="weekSelect" class="form-label mb-0">Week:</label>
                                <select id="weekSelect" v-model="selectedWeek" class="form-select form-select-sm w-auto">
                                    <option v-for="week in processedData.weeks" :key="week" :value="week">{{ week }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h6 class="text-muted mb-2">Class Average (Week {{ selectedWeek }})</h6>
                            <h4 class="fw-bold">{{ (classAvgData[selectedWeek] || 0).toFixed(2) }}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-12 col-lg-6">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="fw-semibold mb-3">Quality Rating: Me vs Class</h5>
                            <!-- added ratio -->
                            <div class="ratio ratio-16x9">
                                <canvas id="qualityChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-lg-6">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="fw-semibold mb-3">Weekly Participation Count</h5>
                            <!-- samee here -->
                            <div class="ratio ratio-16x9">
                                <canvas id="countChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="fw-semibold mb-3">Participation History</h5>
                    <div class="table-responsive border rounded" >
                        <table class="table table-bordered table-hover align-middle mb-0">
                            <thead class="table-secondary sticky-top">
                                <tr>
                                    <th>Week</th>
                                    <th>Contribution</th>
                                    <th>Rating</th>
                                    <th>Coins Earned</th>
                                    <th>Status</th>
                                    <th>Additional Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="p in participationHistory" :key="p.id">
                                    <td>Week {{ p.week }}</td>
                                    <td>{{ p.contribution }}</td>
                                    <td>
                                        <span class="badge bg-info">{{ p.rating.toFixed(0) }} ⭐</span>
                                    </td>
                                    <td>
                                        <span class="badge bg-warning text-dark">
                                            <i class="bi bi-coin"></i> {{ p.coinsEarned }}
                                        </span>
                                    </td>
                                    <td :class="p.status == 'rejected' ? 'bg-danger' : (p.status == 'pending' ? 'bg-warning' : 'bg-success')" class="text-light">{{ p.status }}</td>
                                    <td>{{ p.remarks }}</td>
                                </tr>
                                <tr v-if="participationHistory.length === 0">
                                    <td colspan="5" class="text-center text-muted py-4">
                                        No participation records found
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        <!-- </div> -->
    </main>
</template>

<style scoped>
.card {
    /* transition: transform 0.2s; */
    transition: transform .18s ease,
                box-shadow .18s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 .75rem 1.5rem rgba(0,0,0,.8);
}

.progress {
    border-radius: 10px;
}

.progress-bar {
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.5s ease-in-out;
}


.table-responsive {
    max-height: 300px;
    overflow-y: auto;
}

.table thead {
    position: sticky;
    top: 0;
    z-index: 1;
}

</style>