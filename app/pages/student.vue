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
const coins = ref(125); // Total coins for marketplace purchases (managed by Chun Wai)

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
        if (count >= 3) return 'rgba(75, 192, 192, 0.7)'; // Green - meets requirement
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
                    title: { display: true, text: 'Number of Participations' }
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
    <Navbar />
    <div>

        <!-- ============================================ -->
        <!-- MAIN CONTAINER -->
        <!-- Offset for fixed navbar, bottom padding for scroll -->
        <!-- ============================================ -->
        <div class="container" style="margin-top: 80px; padding-bottom: 40px;">
            <h1 class="mb-4">👋 Welcome back, Student!</h1>

            <!-- ============================================ -->
            <!-- SECTION 1: QUICK OVERVIEW CARDS -->
            <!-- Top row showing enrolled courses, coins, and grade -->
            <!-- ============================================ -->
            <div class="row mb-4">

                <!-- Card 1: Enrolled Courses -->
                <div class="col-md-4">
                    <div class="info-card">
                        <div class="info-icon">📚</div>
                        <div class="info-content">
                            <div class="info-label">Enrolled Courses</div>
                            <!-- <div class="info-value">{{ enrolledCourses.length }}</div> -->
                            <!-- Display course badges dynamically -->
                            <div class="course-list">
                                <span v-for="(course, idx) in enrolledCourses" :key="idx" class="badge bg-primary me-1">
                                    {{ course }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Total Coins (Highlighted) -->
                <!-- Coins earned from class participation, used in marketplace -->
                <!-- Managed by Chun Wai's marketplace feature -->
                <div class="col-md-4">
                    <div class="info-card highlight-card">
                        <div class="info-icon">🪙</div>
                        <div class="info-content">
                            <div class="info-label">Total Coins</div>
                            <div class="info-value">{{ coins }}</div>
                            <a href="/marketplace" class="btn btn-sm btn-success mt-2">Visit Marketplace</a>
                        </div>
                    </div>
                </div>

                <!-- Card 3: Projected Grade -->
                <!-- Calculated based on participation frequency and quality -->
                <div class="col-md-4">
                    <div class="info-card">
                        <div class="info-icon">🎓</div>
                        <div class="info-content">
                            <div class="info-label">Projected Grade</div>
                            <div class="info-value">{{ gradeProjection }}</div>
                            <div class="info-subtext">Based on participation</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Divider between overview and participation sections -->
            <hr class="my-4">

            <!-- ============================================ -->
            <!-- SECTION 2: CLASS PARTICIPATION TRACKING -->
            <!-- Main feature: Charts and metrics for participation -->
            <!-- ============================================ -->
            <h2 class="mb-4">📊 My Class Participation</h2>

            <!-- Participation Metrics Cards -->
            <div class="row mb-4">

                <!-- Metric 1: Total Participations This Term -->
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="metric-icon">🎯</div>
                        <div class="metric-value">{{ totalParticipations }}</div>
                        <div class="metric-label">Total Participations</div>
                    </div>
                </div>

                <!-- Metric 2: Student's Average Rating -->
                <!-- Average across all weeks (1-5 scale) -->
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="metric-icon">⭐</div>
                        <div class="metric-value">{{ myOverallAvgRating.toFixed(2) }}</div>
                        <div class="metric-label">My Avg Rating</div>
                    </div>
                </div>

                <!-- Metric 3: Class Average Rating -->
                <!-- For comparison with student's performance -->
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="metric-icon">📈</div>
                        <div class="metric-value">{{ classOverallAvgRating.toFixed(2) }}</div>
                        <div class="metric-label">Class Avg Rating</div>
                    </div>
                </div>

                <!-- Metric 4: Current Week Progress -->
                <!-- Shows progress toward weekly goal of 3 participations -->
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="metric-icon">📅</div>
                        <div class="metric-value">{{ currentWeekParticipations }}/3</div>
                        <div class="metric-label">This Week</div>
                    </div>
                </div>
            </div>

            <!-- ============================================ -->
            <!-- CURRENT WEEK ALERT -->
            <!-- Color-coded alert based on weekly progress -->
            <!-- Green (≥3): Met target, Yellow (2): Close, Red (<2): Needs more -->
            <!-- ============================================ -->
            <div class="alert" :class="weeklyAlertClass" role="alert">
                <strong>Week {{ currentWeek }} Progress:</strong>
                {{ currentWeekParticipations }} participation(s) this week.
                <!-- Dynamic message based on progress -->
                <span v-if="currentWeekParticipations >= 3">🎉 Great job! You've met the weekly target!</span>
                <span v-else-if="currentWeekParticipations >= 2">⚠️ One more to reach your target!</span>
                <span v-else>❗ You need {{ 3 - currentWeekParticipations }} more to meet the weekly minimum.</span>
            </div>

            <!-- ============================================ -->
            <!-- SECTION 3: CHARTS (Chart.js Visualizations) -->
            <!-- Two side-by-side charts for data analysis -->
            <!-- ============================================ -->
            <div class="row mb-4">

                <!-- Chart 1: Quality Rating Comparison -->
                <!-- Bar chart: Student avg rating vs Class avg rating per week -->
                <div class="col-lg-6 mb-4">
                    <div class="chart-container">
                        <h4 class="mb-3">📊 Quality Rating: Me vs Class</h4>
                        <!-- Canvas element for Chart.js rendering -->
                        <canvas id="qualityChart"></canvas>
                    </div>
                </div>

                <!-- Chart 2: Weekly Participation Count -->
                <!-- Bar chart with color-coding: Green (≥3), Yellow (2), Red (<2) -->
                <div class="col-lg-6 mb-4">
                    <div class="chart-container">
                        <h4 class="mb-3">📈 Weekly Participation Count</h4>
                        <!-- Canvas element for Chart.js rendering -->
                        <canvas id="countChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- ============================================ -->
            <!-- SECTION 4: RECENT PARTICIPATION HISTORY -->
            <!-- Table displaying recent submissions with details -->
            <!-- Data populated by Javier's TA submission feature -->
            <!-- ============================================ -->
            <div class="chart-container">
                <h4 class="mb-3">📝 Recent Participation History</h4>
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Week</th>
                                <th>Contribution</th>
                                <th>Rating</th>
                                <th>Coins Earned</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loop through recent participations -->
                            <tr v-for="(participation, index) in recentParticipations" :key="index">
                                <td>{{ participation.date }}</td>
                                <td>Week {{ participation.week }}</td>
                                <td>{{ participation.contribution }}</td>
                                <!-- Color-coded rating badge based on quality -->
                                <td>
                                    <span class="badge" :class="getRatingBadgeClass(participation.rating)">
                                        {{ participation.rating }} ⭐
                                    </span>
                                </td>
                                <!-- Coins earned from this participation (approved by professor) -->
                                <td>
                                    <span class="badge bg-warning text-dark">+{{ participation.coinsEarned }} 🪙</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped>
/* ============================================ */
/* INFO CARDS (Top Overview Section) */
/* ============================================ */
.info-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 15px;
    transition: transform 0.2s;
}

.info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Special styling for coins card */
.highlight-card {
    border: 2px solid #ffc107;
    background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
}

.info-icon {
    font-size: 2.5rem;
    flex-shrink: 0;
}

.info-content {
    flex: 1;
}

.info-label {
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin: 5px 0;
}

.info-subtext {
    font-size: 0.85rem;
    color: #888;
    font-style: italic;
}

.course-list {
    margin-top: 8px;
}

/* ============================================ */
/* METRIC CARDS (Participation Statistics) */
/* ============================================ */
.metric-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.metric-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.metric-icon {
    font-size: 2rem;
    margin-bottom: 10px;
}

.metric-value {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
}

.metric-label {
    font-size: 0.9rem;
    color: #666;
    margin-top: 5px;
}

/* ============================================ */
/* CHART CONTAINERS */
/* ============================================ */
.chart-container {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container h4 {
    color: #333;
    border-bottom: 3px solid #007bff;
    padding-bottom: 10px;
}

/* ============================================ */
/* TABLE STYLING */
/* ============================================ */
.table {
    margin-top: 15px;
}

.table th {
    background-color: #f8f9fa;
    font-weight: 600;
}
</style>