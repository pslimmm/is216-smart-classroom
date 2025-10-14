<script setup>
// ============================================
// IMPORTS
// ============================================
import Chart from 'chart.js/auto'; // Chart.js library for data visualization
// ========== Original Dashboard Data ==========

// ============================================
// DATA
// Hardcoded test data - will be replaced with API calls
// ============================================
// Basic student information
const enrolledCourses = ref(["Math 101", "Physics 202"]); // List of enrolled courses
const coins = ref(100); // Total coins for marketplace purchases (managed by Chun Wai)

// ========== Participation Tracking Data ==========
const currentWeek = ref(7); // Current academic week (1-13 typically)

// Weekly participation statistics
const participationData = ref({
    studentId: "S123", // Unique student identifier
    weeks: [1, 2, 3, 4, 5, 6, 7], // Week numbers for the term
    myAvgRating: [3.5, 4.0, 3.2, 4.5, 4.8, 4.0, 4.2], // Student's avg rating per week (1-5 scale)
    classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0], // Class avg rating per week (for comparison)
    myWeeklyCount: [4, 5, 2, 6, 3, 4, 2] // Number of participations per week
});

// Recent participation entries (from TA submissions)
// This array will be populated by Javier's TA submission form
// Coins are awarded by professor approval based on quality
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
    },
    {
        date: "2025-09-30",
        week: 6,
        contribution: "Presented solution to class problem",
        rating: 5.0,
        coinsEarned: 20
    },
    {
        date: "2025-09-29",
        week: 6,
        contribution: "Participated in group discussion",
        rating: 3.5,
        coinsEarned: 10
    }
]);

// Chart.js instances (stored for cleanup on component unmount)
const qualityChart = ref(null);
const countChart = ref(null);

// ============================================
// COMPUTED PROPERTIES
// Dynamic calculations based on participation data
// ============================================

/**
 * Calculate total participations across all weeks
 * @returns {number} Sum of all weekly participation counts
 */
const totalParticipations = computed(() => {
    return participationData.value.myWeeklyCount.reduce((sum, count) => sum + count, 0);
});

/**
 * Calculate student's overall average rating
 * Filters out zero values and computes mean
 * @returns {number} Average rating (1-5 scale)
 */
const myOverallAvgRating = computed(() => {
    const ratings = participationData.value.myAvgRating.filter(r => r > 0);
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
});

/**
 * Calculate class overall average rating
 * Used for comparison with student's performance
 * @returns {number} Class average rating (1-5 scale)
 */
const classOverallAvgRating = computed(() => {
    const ratings = participationData.value.classAvgRating.filter(r => r > 0);
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
});

/**
 * Get current week's participation count
 * @returns {number} Number of participations this week
 */
const currentWeekParticipations = computed(() => {
    return participationData.value.myWeeklyCount[currentWeek.value - 1] || 0;
});

/**
 * Calculate projected grade based on participation
 * Requirements:
 * - A+: ≥3 participations/week AND ≥4.0 avg rating
 * - A: ≥3 participations/week AND ≥3.5 avg rating
 * - B+: ≥2.5 participations/week
 * - B: ≥2 participations/week
 * - C or below: <2 participations/week
 * @returns {string} Projected grade
 */
const gradeProjection = computed(() => {
    const avgParticipationsPerWeek = totalParticipations / currentWeek.value;
    if (avgParticipationsPerWeek >= 3 && myOverallAvgRating >= 4.0) return "A+";
    if (avgParticipationsPerWeek >= 3 && myOverallAvgRating >= 3.5) return "A";
    if (avgParticipationsPerWeek >= 2.5) return "B+";
    if (avgParticipationsPerWeek >= 2) return "B";
    return "C or below";
});

/**
 * Determine alert color class based on weekly progress
 * @returns {string} Bootstrap alert class
 * - alert-success (green): ≥3 participations
 * - alert-warning (yellow): 2 participations
 * - alert-danger (red): <2 participations
 */
const weeklyAlertClass = computed(() => {
    if (currentWeekParticipations >= 3) return 'alert-success';
    if (currentWeekParticipations >= 2) return 'alert-warning';
    return 'alert-danger';
});

// ============================================
// LIFECYCLE HOOKS
// ============================================

/**
 * Mounted Hook
 * Runs when component is added to DOM
 * - Protects route (only students can access)
 * - Creates charts after DOM is ready
 */
onMounted(() => {

    // Wait for DOM to update, then create charts
    nextTick(() => {
        createQualityChart();
        createCountChart();
    });
});

// ============================================
// METHODS
// ============================================

/**
 * Create Quality Rating Comparison Chart
 * Bar chart showing student's avg rating vs class avg rating per week
 * Uses Chart.js library
 */
const createQualityChart = () => {
    const ctx = document.getElementById('qualityChart');
    if (!ctx) return; // Exit if canvas not found

    qualityChart.value = new Chart(ctx, {
        type: 'bar', // Bar chart for easy comparison
        data: {
            labels: participationData.value.weeks, // X-axis: Week numbers
            datasets: [
                {
                    label: 'My Avg Rating',
                    data: participationData.value.myAvgRating,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blue
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Class Avg Rating',
                    data: participationData.value.classAvgRating,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)', // Orange
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
                    max: 5, // Rating scale is 1-5
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

/**
 * Create Weekly Participation Count Chart
 * Bar chart with color-coded bars based on performance
 * - Green (≥3): Meets weekly requirement
 * - Yellow (2): Close to requirement
 * - Red (<2): Below requirement
 */
const createCountChart = () => {
    const ctx = document.getElementById('countChart');
    if (!ctx) return; // Exit if canvas not found

    const counts = participationData.value.myWeeklyCount;

    // Color-code bars based on participation count
    const colors = counts.map(count => {
        if (count >= 3) return 'rgba(13, 110, 253, 0.7)'; // Green - meets requirement
        if (count >= 2) return 'rgba(255, 206, 86, 0.7)'; // Yellow - close
        return 'rgba(255, 99, 132, 0.7)'; // Red - needs improvement
    });

    countChart.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: participationData.value.weeks, // X-axis: Week numbers
            datasets: [{
                label: 'My Participation Count',
                data: counts,
                backgroundColor: colors, // Dynamic colors
                borderColor: colors.map(c => c.replace('0.7', '1')), // Solid border
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }, // Integer steps
                    title: { display: true, text: 'No. of Participations' }
                },
                x: {
                    title: { display: true, text: 'Week Number' }
                }
            },
            plugins: {
                legend: { display: false } // Hide legend for cleaner look
            }
        }
    });
};

/**
 * Get Bootstrap badge color class based on rating
 * Used for color-coding ratings in the participation history table
 * @param {number} rating - Rating value (1-5)
 * @returns {string} Bootstrap badge class
 */
const getRatingBadgeClass = (rating) => {
    if (rating >= 4.5) return 'bg-success';  // Excellent (green) - 4.5-5.0
    if (rating >= 4.0) return 'bg-primary';  // Very good (blue) - 4.0-4.4
    if (rating >= 3.5) return 'bg-info';     // Good (light blue) - 3.5-3.9
    if (rating >= 3.0) return 'bg-warning';  // Average (yellow) - 3.0-3.4
    return 'bg-danger';                       // Needs improvement (red) - <3.0
}
</script>

<template>
    <main class="container py-4 flex-grow-1">

        <h1 class="mb-4 d-flex align-items-center gap-2">
            <span class="fw-bold">Welcome back, John Doe!</span>
        </h1>

        <!-- Overview Cards -->
        <div class="row g-4 mb-4">
            <!-- Enrolled Courses -->
            <div class="col-md-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body d-flex gap-3">
                        <div class="display-5">
                            <i class="bi bi-book-half text-primary"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="text-muted text-uppercase small">Enrolled Courses</div>
                            <div class="mt-2">
                                <span v-for="(course, i) in enrolledCourses" :key="i" class="badge bg-primary me-1">{{
                                    course }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Total Coins -->
            <div class="col-md-4">
                <div class="card shadow-sm h-100 border border-warning-subtle bg-gradient-primary text-white">
                    <div class="card-body d-flex gap-3">
                        <div class="display-5">
                            <i class="bi bi-coin text-warning"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="text-uppercase small">Total Coins</div>
                            <div class="h3 fw-bold">{{ coins }}</div>
                            <NuxtLink to="/marketplace" class="btn btn-sm btn-light mt-2">
                                <i class="bi bi-shop me-1"></i> Visit Marketplace
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Projected Grade -->
            <div class="col-md-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body d-flex gap-3">
                        <div class="display-5">
                            <i class="bi bi-mortarboard-fill"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="text-muted text-uppercase small">Projected Grade</div>
                            <div class="h3 fw-bold">{{ gradeProjection }}</div>
                            <div class="text-muted small fst-italic">Based on participation</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section Title -->
        <h2 class="mb-4 d-flex align-items-center gap-2">
            <span class="fw-semibold">My Class Participation</span>
        </h2>

        <!-- Participation Metrics -->
        <div class="row g-4 mb-4">
            <div class="col-md-3">
                <div class="card text-center shadow-sm h-100">
                    <div class="card-body">
                        <div class="fs-3 mb-2 bi bi-clipboard-check text-primary"></div>
                        <div class="h4 fw-bold">26</div>
                        <div class="text-muted small">Total Participations</div>
                    </div>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card text-center shadow-sm h-100">
                    <div class="card-body">
                        <div class="fs-3 mb-2 bi bi-star-fill text-warning"></div>
                        <div class="h4 fw-bold">4.03</div>
                        <div class="text-muted small">My Average Rating</div>
                    </div>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card text-center shadow-sm h-100">
                    <div class="card-body">
                        <div class="fs-3 mb-2 bi bi-graph-up-arrow text-success"></div>
                        <div class="h4 fw-bold">3.79</div>
                        <div class="text-muted small">Class Average Rating</div>
                    </div>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card text-center shadow-sm h-100">
                    <div class="card-body">
                        <div class="fs-3 mb-2 bi bi-calendar-date text-info"></div>
                        <div class="h4 fw-bold">2/3</div>
                        <div class="text-muted small">This Week</div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Weekly Alert -->
        <div class="alert" :class="weeklyAlertClass" role="alert">
            <strong>Week {{ currentWeek }} Progress:</strong>
            {{ currentWeekParticipations }} participation(s) this week.
            <span v-if="currentWeekParticipations >= 3">Great job! You've met the weekly target!</span>
            <span v-else-if="currentWeekParticipations >= 2">One more to reach your target!</span>
            <span v-else>❗ You need {{ 3 - currentWeekParticipations }} more to meet the weekly minimum.</span>
        </div>

        <!-- Charts -->
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

        <!-- Recent History Table -->
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
                                    <span class="badge" :class="getRatingBadgeClass(p.rating)">
                                        {{ p.rating }} <i class="bi bi-star-fill text-warning"></i>
                                    </span>
                                </td>
                                <td>
                                    <span class="badge bg-warning text-dark">+{{ p.coinsEarned }} <i class="bi bi-coin text-danger"></i> </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</template>



<style scoped>
.bg-gradient-primary {
    background: var(--gradient-primary);
    color: hsl(var(--primary-foreground));
}

.card {
    border-radius: 0.75rem;
}

.table th {
    background-color: var(--bs-gray-100);
}

.table td,
.table th {
    vertical-align: middle;
}
</style>