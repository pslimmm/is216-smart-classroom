<script setup>
import Chart from 'chart.js/auto';

const searchQuery = ref('')
const selectedStudentId = ref('');
const currentWeek = ref(7);

const classStats = {
    totalStudents: 6,
    classAvgRating: 3.85,
    studentsOnTrack: 4,
    studentsNeedHelp: 2
};

const allStudents = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
    { id: "4", name: "Davis" },
    { id: "5", name: "Peter" },
    { id: "6", name: "Yichen" }
];
const filteredStudents = ref([]);

const studentsData = {
    "1": {
        id: "1",
        name: "Alice",
        weeks: [1, 2, 3, 4, 5, 6, 7], // Week numbers
        myAvgRating: [3.5, 4.0, 3.2, 4.5, 4.8, 4.0, 4.2], // Weekly avg ratings
        classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0], // Class avg for comparison
        myWeeklyCount: [4, 5, 2, 6, 3, 4, 2], // Participations per week
        recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Explained recursion concept clearly", rating: 4.5, ratedBy: "TA Smith" },
            { date: "2025-10-05", week: 7, contribution: "Asked insightful question", rating: 3.5, ratedBy: "TA Johnson" },
            { date: "2025-10-01", week: 6, contribution: "Helped classmate debug code", rating: 4.0, ratedBy: "Prof. Lee" }
        ]
    },
    "2": {
        id: "2",
        name: "Bob",
        weeks: [1, 2, 3, 4, 5, 6, 7],
        myAvgRating: [4.5, 4.8, 4.6, 4.9, 5.0, 4.7, 4.8],
        classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
        myWeeklyCount: [3, 2, 3, 3, 2, 3, 2],
        recentParticipations: [
            { date: "2025-10-07", week: 7, contribution: "Led group discussion on algorithms", rating: 5.0, ratedBy: "Prof. Lee" },
            { date: "2025-10-06", week: 7, contribution: "Presented excellent solution", rating: 4.8, ratedBy: "Prof. Lee" }
        ]
    },
    "3": {
        id: "3",
        name: "Charlie",
        weeks: [1, 2, 3, 4, 5, 6, 7],
        myAvgRating: [2.5, 2.8, 2.0, 3.0, 2.5, 2.2, 2.8],
        classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
        myWeeklyCount: [1, 2, 1, 2, 1, 1, 3],
        recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Basic question about syntax", rating: 2.5, ratedBy: "TA Smith" },
            { date: "2025-10-04", week: 7, contribution: "Participated in discussion", rating: 3.0, ratedBy: "TA Johnson" }
        ]
    },
    "4": {
        id: "4",
        name: "Davis",
        weeks: [1, 2, 3, 4, 5, 6, 7],
        myAvgRating: [2.5, 2.8, 2.0, 3.0, 2.5, 2.2, 2.8],
        classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
        myWeeklyCount: [1, 2, 1, 2, 1, 1, 2],
        recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Basic question about syntax", rating: 2.5, ratedBy: "TA Smith" },
            { date: "2025-10-04", week: 7, contribution: "Participated in discussion", rating: 3.0, ratedBy: "TA Johnson" }
        ]
    },
    "5": {
        id: "5",
        name: "Peter",
        weeks: [1, 2, 3, 4, 5, 6, 7],
        myAvgRating: [4.5, 4.8, 4.6, 4.9, 5.0, 4.7, 4.8],
        classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
        myWeeklyCount: [4, 3, 1, 2, 3, 4, 4],
        recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Basic question about syntax", rating: 4, ratedBy: "TA Smith" },
            { date: "2025-10-04", week: 7, contribution: "Participated in discussion", rating: 4.5, ratedBy: "TA Johnson" }
        ]
    },
    "6": {
        id: "6",
        name: "Yichen",
        weeks: [1, 2, 3, 4, 5, 6, 7],
        myAvgRating: [2.5, 2.8, 2.0, 3.0, 2.5, 2.2, 2.8],
        classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
        myWeeklyCount: [1, 2, 1, 2, 1, 1, 2],
        recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Basic question about syntax", rating: 2.5, ratedBy: "TA Smith" },
            { date: "2025-10-04", week: 7, contribution: "Participated in discussion", rating: 3.0, ratedBy: "TA Johnson" }
        ]
    }
};

const selectedStudent = ref(null)
const charts = ref({})

onMounted(() => {
    filteredStudents.value = [...allStudents];
});

const filterStudents = () => {
    const query = searchQuery.value.toLowerCase();
    filteredStudents.value = allStudents.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query)
    );
};


const loadStudentData = () => {
    if (!selectedStudentId.value) {
        selectedStudent.value = null;
        return;
    }

    // Fetch student data (from hardcoded data, will be API call)
    const data = studentsData[selectedStudentId.value];
    if (!data) return;

    const totalParticipations = data.myWeeklyCount.reduce((sum, count) => sum + count, 0);
    const avgRating = data.myAvgRating.reduce((sum, r) => sum + r, 0) / data.myAvgRating.length;
    const avgPerWeek = totalParticipations / currentWeek.value;
    const currentWeekCount = data.myWeeklyCount[currentWeek.value - 1] || 0;

    let projectedGrade = "C";
    if (avgPerWeek >= 3 && avgRating >= 4.0) projectedGrade = "A+";
    else if (avgPerWeek >= 3 && avgRating >= 3.5) projectedGrade = "A";
    else if (avgPerWeek >= 2.5) projectedGrade = "B+";
    else if (avgPerWeek >= 2) projectedGrade = "B";

    // Store computed student data
    selectedStudent.value = {
        ...data,
        totalParticipations,
        avgRating,
        avgPerWeek,
        currentWeekCount,
        projectedGrade
    };

    // Wait for DOM to update, then create charts
    nextTick(() => {
        createStudentCharts();
    });
};

const createStudentCharts = () => {
    if (!selectedStudent.value) return;

    const qualityChartId = 'qualityChart-' + selectedStudent.value.id;
    const countChartId = 'countChart-' + selectedStudent.value.id;

    if (charts[qualityChartId]) {
        charts[qualityChartId].destroy();
    }
    if (charts[countChartId]) {
        charts[countChartId].destroy();
    }

    const qualityCtx = document.getElementById(qualityChartId);
    if (qualityCtx) {
        charts[qualityChartId] = new Chart(qualityCtx, {
            type: 'line', // Line chart for trend visualization
            data: {
                labels: selectedStudent.value.weeks, // X-axis: Week numbers
                datasets: [
                    {
                        label: selectedStudent.value.name + ' Rating',
                        data: selectedStudent.value.myAvgRating,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
                        borderColor: 'rgba(13, 110, 253, 1)', // Blue line
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4 // Smooth curve
                    },
                    {
                        label: 'Class Average',
                        data: selectedStudent.value.classAvgRating,
                        backgroundColor: 'rgba(255, 159, 64, 0.2)', // Light orange fill
                        borderColor: 'rgba(255, 193, 7, 1)', // Orange line
                        borderWidth: 2,
                        borderDash: [5, 5], // Dashed line for class average
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        min: 0,
                        max: 5, // Rating scale 1-5
                        ticks: { stepSize: 0.5 },
                        title: {
                            display: true,
                            text: 'Rating'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Weeks'
                        }
                    }
                },
                plugins: {
                    legend: { display: true, position: 'bottom' }
                }
            }
        });
    }

    const countCtx = document.getElementById(countChartId);
    if (countCtx) {
        const counts = selectedStudent.value.myWeeklyCount;

        // Color-code bars: Primary (≥3), Yellow (2), Red (<2)
        const colors = counts.map(count => {
            if (count >= 3) return 'rgba(13, 110, 253, 0.7)'; // Primary - meets requirement
            if (count >= 2) return 'rgba(255, 206, 86, 0.7)'; // Yellow - close
            return 'rgba(255, 99, 132, 0.7)'; // Red - needs attention
        });

        charts[countChartId] = new Chart(countCtx, {
            type: 'bar', // Bar chart for discrete counts
            data: {
                labels: selectedStudent.value.weeks, // X-axis: Week numbers
                datasets: [{
                    label: 'Participations',
                    data: counts,
                    backgroundColor: colors, // Dynamic colors per bar
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
                        title: {
                            display: true,
                            text: 'No. of Participations'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Weeks'
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
};

const getRatingBadgeClass = (rating) => {
    if (rating >= 4.5) return 'bg-success';
    if (rating >= 4.0) return 'bg-primary';
    if (rating >= 3.5) return 'bg-info';
    if (rating >= 3.0) return 'bg-warning';
    return 'bg-danger';
};

const getGradeBadgeClass = (grade) => {
    if (grade.startsWith('A')) return 'grade-excellent';
    if (grade.startsWith('B')) return 'grade-good';
    return 'grade-needs-improvement';
}

// Tried doing a loop but failed... will try again next time
// const metrics = [
//   { icon: 'bi-people-fill', value: classStats.totalStudents, label: 'Total Students' },
//   { icon: 'bi-bar-chart-line-fill', value: classStats.classAvgRating.toFixed(2), label: 'Class Avg Rating' },
//   { icon: 'bi-check-circle-fill', value: classStats.studentsOnTrack, label: 'Students On Track' },
//   { icon: 'bi-exclamation-triangle-fill', value: classStats.studentsNeedHelp, label: 'Need Attention', variant: 'border border-danger' },
// ];

// const studentStats = [
//   { icon: 'bi-bullseye', value: selectedStudent.totalParticipations, label: 'Total Participations' },
//   { icon: 'bi-star-fill', value: selectedStudent.avgRating.toFixed(2), label: 'Avg Rating' },
//   { icon: 'bi-calendar-event', value: selectedStudent.currentWeekCount, label: 'This Week' },
//   { icon: 'bi-graph-up-arrow', value: selectedStudent.avgPerWeek.toFixed(1), label: 'Avg Per Week' },
// ];
</script>

<template>
    <main class="container py-4 flex-grow-1">
        <div class="container py-5">
            <h1 class="display-1 fw-bold mb-4 d-flex align-items-center gap-2">
                Class Participation Report
            </h1>

            <div class="row g-4 mb-5">
                <!-- Total Students Card -->
                <div class="col-md-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body d-flex justify-content-between align-items-center pb-2">
                            <h6 class="fs-2 mb-0 text-muted">Total Students</h6>
                            <i class="bi bi-people-fill text-primary fs-1"></i>
                        </div>
                        <div class="card-body pt-0">
                            <h4 class="fs-3 fw-bold">6</h4>
                        </div>
                    </div>
                </div>

                <!-- Class Avg Rating Card -->
                <div class="col-md-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body d-flex justify-content-between align-items-center pb-2">
                            <h6 class="fs-2 mb-0 text-muted">Class Avg Rating</h6>
                            <i class="bi bi-bar-chart-line-fill text-info fs-1"></i>
                        </div>
                        <div class="card-body pt-0">
                            <h4 class="fs-3 fw-bold">3.85</h4>
                        </div>
                    </div>
                </div>

                <!-- Students on Track -->
                <div class="col-md-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body d-flex justify-content-between align-items-center pb-2">
                            <h6 class="fs-2 mb-0 text-muted">Students on Track</h6>
                            <i class="bi bi-check-circle-fill text-success fs-1"></i>
                        </div>
                        <div class="card-body pt-0">
                            <h4 class="fs-3 fw-bold">4</h4>
                        </div>
                    </div>
                </div>

                <!-- Attention -->
                <div class="col-md-3">
                    <div class="card shadow-sm h-100 border border-danger">
                        <div class="card-body d-flex justify-content-between align-items-center pb-2">
                            <h6 class="fs-2 mb-0 text-muted">Need Attention</h6>
                            <i class="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                        </div>
                        <div class="card-body pt-0">
                            <h4 class="fs-3 fw-bold">3</h4>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Select Student to View Details -->
            <div class="bg-white p-4 rounded-4 shadow-sm mb-5">
                <h3 class="mb-4">Select Student to View Details</h3>
                <div class="row g-3 align-items-center">
                    <div class="col-md-8">
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-search"></i></span>
                            <input v-model="searchQuery" @input="filterStudents" type="text" class="form-control"
                                placeholder="Filter by name or ID" />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select v-model="selectedStudentId" @change="loadStudentData" class="form-select">
                            <option value="">-- Select a student --</option>
                            <option v-for="student in filteredStudents" :key="student.id" :value="student.id">
                                {{ student.name }} ({{ student.id }})
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Section: Student Detail View -->
            <div v-if="selectedStudent" class="bg-white p-4 rounded-4 shadow-sm mb-5">
                <div class="d-flex justify-content-around align-items-center mb-4 border-bottom pb-3">
                    <div>
                        <h2 class="fw-bold">{{ selectedStudent.name }}</h2>
                        <p class="text-muted mb-0">Student ID: {{ selectedStudent.id }}</p>
                    </div>
                    <div>
                        <h4>Projected Grade:</h4>
                        <div :class="['badge fs-5 p-3 rounded-4', getGradeBadgeClass(selectedStudent.projectedGrade)]">
                            {{ selectedStudent.projectedGrade }}
                        </div>
                    </div>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-md-3" v-for="stat in studentStats" :key="stat.label">
                        <div class="bg-light p-3 rounded-3 text-center border">
                            <i :class="['bi fs-4 mb-2', stat.icon]"></i>
                            <h5 class="fw-bold">{{ stat.value }}</h5>
                            <small class="text-muted">{{ stat.label }}</small>
                        </div>
                    </div>
                </div>

                <div v-if="selectedStudent.avgPerWeek < 3" class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    This student is below 3 participations/week: <strong>{{ selectedStudent.avgPerWeek.toFixed(1)
                    }}</strong>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-4">
                        <div class="bg-body-secondary p-4 rounded-3 border">
                            <h5 class="mb-3">Quality Rating Comparison</h5>
                            <canvas :id="'qualityChart-' + selectedStudent.id"></canvas>
                        </div>
                    </div>
                    <div class="col-md-6 mb-4">
                        <div class="bg-body-secondary p-4 rounded-3 border">
                            <h5 class="mb-3">Weekly Participation Count</h5>
                            <canvas :id="'countChart-' + selectedStudent.id"></canvas>
                        </div>
                    </div>
                </div>

                <div class="table-responsive">
                    <h5 class="mb-3">Recent Participation History</h5>
                    <table class="table table-bordered table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Date</th>
                                <th>Week</th>
                                <th>Contribution</th>
                                <th>Rating</th>
                                <th>Rated By</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in selectedStudent.recentParticipations" :key="p.date">
                                <td>{{ p.date }}</td>
                                <td>Week {{ p.week }}</td>
                                <td>{{ p.contribution }}</td>
                                <td>
                                    <span :class="['badge', getRatingBadgeClass(p.rating)]">
                                        {{ p.rating }} ⭐
                                    </span>
                                </td>
                                <td>{{ p.ratedBy }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-5 text-muted">
                <i class="bi bi-clipboard fs-1 mb-3"></i>
                <p>Select a student above to view participation analytics.</p>
            </div>
        </div>
    </main>
</template>



<style scoped>
/* ============================================ */
/* CLASS OVERVIEW METRIC CARDS */
/* Top row cards showing class statistics */
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

/* Special styling for "Need Attention" card */
.alert-danger-card {
    border: 2px solid #dc3545;
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
/* STUDENT SELECTION SECTION */
/* Search and dropdown container */
/* ============================================ */
.selection-container {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selection-container h3 {
    color: #333;
    border-bottom: 3px solid #007bff;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

/* ============================================ */
/* SELECTED STUDENT DETAILS SECTION */
/* Container for all student-specific information */
/* ============================================ */
.student-details {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.student-header {
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 20px;
}

.student-header h2 {
    margin: 0;
    color: #333;
}

/* ============================================ */
/* GRADE BADGE STYLING */
/* Color-coded badge for projected grade */
/* ============================================ */
.grade-badge {
    padding: 15px 30px;
    border-radius: 12px;
    text-align: center;
    min-width: 150px;
}

/* Green gradient for A grades */
.grade-excellent {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
}

/* Yellow gradient for B grades */
.grade-good {
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    color: #333;
}

/* Red gradient for C and below */
.grade-needs-improvement {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
}

.grade-label {
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
}

.grade-value {
    font-size: 2rem;
    font-weight: bold;
}

/* ============================================ */
/* STUDENT METRIC CARDS (Smaller version) */
/* Four metrics below student header */
/* ============================================ */
.metric-card-sm {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    border: 2px solid #e9ecef;
}

.metric-icon-sm {
    font-size: 1.5rem;
    margin-bottom: 8px;
}

.metric-value-sm {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
}

.metric-label-sm {
    font-size: 0.85rem;
    color: #666;
    margin-top: 5px;
}

/* ============================================ */
/* CHART CONTAINERS */
/* Styling for Chart.js canvas containers */
/* ============================================ */
.chart-container {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border: 2px solid #e9ecef;
}

.chart-container h4 {
    color: #333;
    margin-bottom: 15px;
    font-size: 1.1rem;
    font-weight: 600;
}

/* ============================================ */
/* TABLE STYLING */
/* Participation history table */
/* ============================================ */
.table {
    margin-top: 15px;
    background: white;
}

.table th {
    background-color: #e9ecef;
    font-weight: 600;
    color: #495057;
}

.table-hover tbody tr:hover {
    background-color: #f1f3f5;
}
</style>