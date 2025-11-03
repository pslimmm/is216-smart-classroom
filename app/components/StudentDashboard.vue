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
        type: 'line',
        data: {
            labels: processedData.value.weeks,
            datasets: [
                {
                    label: 'My Average Rating',
                    data: processedData.value.myAvgRating,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Class Average Rating',
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
                    min: 0,
                    max: 5,
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
    <div class="py-4 px-5 modern">
        <!-- Top Row -->
        <div class="row mb-5 g-4 align-items-stretch">
            <!-- Course Info Card -->
            <div class="col-12 col-lg-8">
                <div class="section-elev rounded-4 h-100 d-flex flex-column">
                    <!-- Course Info Header -->
                    <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                        <div class="fw-bold" style="font-size: 3.25rem;">Course Information</div>
                    </div>
                    <!-- Body -->
                    <div class="px-4 py-4 flex-grow-1">
                        <div class="fw-bold text-navy" style="font-size: 3rem;">
                            {{ courseInfo?.course_name || 'Course' }}
                        </div>
                        <div>
                            <div class="fs-1"><strong>Code:</strong> {{ courseInfo?.course_code }}</div>
                            <div class="fs-1"><strong>Section:</strong> {{ courseInfo?.course_section }}</div>
                            <div class="fs-1"><strong>Time:</strong> {{ courseInfo?.course_time }}</div>
                            <div class="fs-1"><strong>Location:</strong> {{ courseInfo?.course_location }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Course Stats -->
            <div class="col-12 col-lg-4">
                <div class="section-elev rounded-4 h-100 d-flex flex-column">
                    <!-- Course Stats Header -->
                    <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                        <div class="fw-bold" style="font-size: 3.25rem;">Course Statistics</div>
                    </div>
                    <!-- Body -->
                    <div class="px-4 py-4 flex-grow-1">
                        <div class="row row-cols-2 g-3">
                            <div class="col" v-for="stat in [
                                { icon: 'bi-coin', color: 'text-warning', value: totalCoins, label: 'Coins' },
                                { icon: 'bi-card-list', color: 'text-primary', value: totalParticipations, label: 'Total Participation' },
                                { icon: 'bi-star-fill', color: 'text-info', value: myAvgRating.toFixed(2), label: 'My Avg Rating' },
                                { icon: 'bi-trophy-fill', color: projectedGradeStyle, value: projectedGrade, label: 'Projected Grade' }
                            ]" :key="stat.label">
                                <div class="card shadow-sm border-0 h-100 stat-card text-center py-3">
                                    <div class="d-flex flex-column align-items-center">
                                        <i class="bi fs-1 mb-2" :class="[stat.icon, stat.color]"></i>
                                        <div class="fw-bold fs-3">{{ stat.value }}</div>
                                        <small class="text-muted">{{ stat.label }}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="col-12 mb-5">
            <div class="section-elev rounded-4 d-flex align-items-center">
                <!-- Left Side: Title -->
                <div class="fw-bold bg-navy text-white px-4 py-3 flex-shrink-0 rounded-start-4"
                    style="font-size: 3.25rem;">
                    This Week's Progress:
                </div>
                <!-- Right Side: Progress Bar -->
                <div class="progress-wrap flex-grow-1 mx-3 d-flex flex-column">
                    <div class="progress-track mb-2">
                        <div class="progress-bar progress-gradient text-white fw-bold text-center" :class="{
                            'bg-success': currentWeekProgressPercentage >= 100,
                            'bg-warning': currentWeekProgressPercentage >= 66 && currentWeekProgressPercentage < 100,
                            'bg-danger': currentWeekProgressPercentage < 66
                        }" :style="{ width: currentWeekProgressPercentage + '%' }">
                            {{ currentWeekProgressPercentage }}%
                        </div>
                    </div>
                    <small class="fw-semibold fs-5">
                        You have done {{ currentWeekParticipations }}/3 participations this week.
                    </small>
                </div>
            </div>
        </div>

        <!-- Course Analytics -->
        <div class="col-12 mb-5">
            <!-- Course Analytics Header -->
            <div class="section-elev rounded-4">
                <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                    <div class="fw-bold" style="font-size: 3.25rem;">Course Analytics</div>
                </div>

                <!-- Body -->
                <div class="px-4 py-4">
                    <!-- Week Selector & Class Average -->
                    <div class="row g-3 g-md-4 py-2">
                        <div class="col-12 col-md-6 d-flex align-items-center gap-2 flex-wrap px-5">
                            <label for="weekSelect" class="form-label fs-2 text-navy fw-semibold">Select Week:</label>
                            <select id="weekSelect" v-model="selectedWeek"
                                class="form-select form-select-sm w-auto fs-4">
                                <option v-for="w in processedData.weeks" :key="w" :value="w">
                                    {{ w }}
                                </option>
                            </select>
                        </div>

                        <div class="col-12 col-md-6 d-flex align-items-center gap-2 flex-wrap">
                            <div class="fs-2 text-navy fw-semibold">Class Average - Week {{ selectedWeek }} : </div>
                            <div class="fs-2 fw-semibold">
                                {{ (classAvgData[selectedWeek] || 0).toFixed(2) }}
                            </div>
                        </div>
                    </div>

                    <!-- Bottom section: Charts -->
                    <div class="row g-3 g-md-4">
                        <div class="col-12 col-lg-6">
                            <div class="border rounded-3 p-3 h-100">
                                <h6 class="fw-semibold mb-3">Quality Rating: Me vs Class</h6>
                                <div class="ratio ratio-16x9">
                                    <canvas id="qualityChart"></canvas>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 col-lg-6">
                            <div class="border rounded-3 p-3 h-100">
                                <h6 class="fw-semibold mb-3">Weekly Participation</h6>
                                <div class="ratio ratio-16x9">
                                    <canvas id="countChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="col-12 mb-3">
            <div class="section-elev rounded-4">
                <!-- Table Header -->
                <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                    <div class="fw-bold" style="font-size: 3.25rem;">Participation History</div>
                </div>
                <!-- Body -->
                <div class="px-4 py-4">
                    <div class="table-responsive rounded-3 border">
                        <table class="table align-middle mb-0">
                            <thead class="table-light sticky-top fs-3">
                                <tr>
                                    <th>Week</th>
                                    <th>Contribution</th>
                                    <th>Rating</th>
                                    <th>Coins</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="p in participationHistory" :key="p.id">
                                    <td>
                                        <span class="fs-3">{{ p.week }}</span>
                                    </td>
                                    <td class="text-truncate fs-3" style="max-width: 340px">
                                        {{ p.contribution }}
                                    </td>
                                    <td>
                                        <span class="text-navy fw-semibold fs-3">{{ p.rating.toFixed(0) }}
                                            <i class="bi bi-star-fill text-warning"></i>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="text-warning fw-semibold fs-3">
                                            <i class="bi bi-coin"></i>
                                            {{ p.coinsEarned }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="text-white fw-semibold fs-3 px-3 py-2 my-0" :class="{
                                            'bg-danger': p.status === 'rejected',
                                            'bg-warning': p.status === 'pending',
                                            'bg-success': p.status === 'approved'
                                        }">{{ p.status }}
                                        </span>
                                    </td>
                                    <td class="text-muted text-truncate fs-3">
                                        {{ p.remarks }}
                                    </td>
                                </tr>
                                <tr v-if="!participationHistory.length">
                                    <td colspan="6" class="text-center fs-3 fw-semibold py-4">
                                        No participation records found
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Unified style theme (no white cards) */
.section-elev {
    /* background-color: #f8f8ff; */
    background-color: white;
}

.section-header {
    background: linear-gradient(90deg, #5b8cff 0%, #6a57ff 100%);
}

.stat-tile {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #f8fafc;
    transition: all 0.2s ease;
}

.stat-tile:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.progress-wrap {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
}

/* Track spans 100% of wrapper width */
.progress-track {
    width: 100%;
    height: 32px;
    /* adjust thickness */
    background: #f1f5f9;
    /* track color */
    border-radius: 999px;
    overflow: hidden;
}

/* The colored fill */
.progress-bar {
    height: 100%;
    border-radius: 999px;
    transition: width .35s ease;
}

/* Red→orange gradient */
.progress-gradient {
    background: linear-gradient(90deg, #ff3b30 0%, #ffb800 100%);
}

/* Reuse existing colors */
.text-navy {
    color: navy !important;
}

.bg-light-subtle {
    background: #f8fafc;
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

/* Added 3 Nov 2025 */
.modern {
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
}

.text-navy {
    color: navy !important;
}

/* Elevated card look */
.card-elev {
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(2, 6, 23, 0.06);
}

.card-elev:hover {
    transform: translateY(-2px);
    transition: transform .18s ease, box-shadow .18s ease;
    box-shadow: 0 12px 30px rgba(2, 6, 23, 0.12);
}

/* Stat card icon */
.stat-card .icon-wrap {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: #F1F5FF;
}

/* Table polish */
.table thead th {
    font-weight: 600;
    color: var(--navy);
}

.table tbody tr+tr {
    border-top: 1px solid var(--border);
}

/* Responsiveness niceties */
@media (max-width: 576px) {
    .stat-card .icon-wrap {
        width: 40px;
        height: 40px;
    }
}

.bg-navy {
    background-color: navy;
}
</style>
