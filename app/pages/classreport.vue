<script setup>
import Chart from 'chart.js/auto';

definePageMeta({
    middleware: 'role'
});

const searchQuery = ref('');
const selectedStudentId = ref('');
const currentWeek = ref(7);
const showSuggestions = ref(false);

const classStats = {
    totalStudents: 6,
    classAvgRating: 3.85,
    studentsOnTrack: 4,
    studentsNeedHelp: 2
};

const allStudents = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Albert" },
    { id: "3", name: "Alana" },
    { id: "4", name: "Bob" },
    { id: "5", name: "Charlie" },
    { id: "6", name: "Davis" }
];

const filteredStudents = ref([]);
const searchSuggestions = computed(() => {
    if (!searchQuery.value.trim()) return [];
    const query = searchQuery.value.toLowerCase();
    return allStudents.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query)
    );
});

const studentsData = {
    "1": {
        id: "1",
        name: "Alice",
        weeks: [1, 2, 3, 4, 5, 6, 7],
        myAvgRating: [3.5, 4.0, 3.2, 4.5, 4.8, 4.0, 4.2],
        classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
        myWeeklyCount: [4, 5, 2, 6, 3, 4, 2],
        recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Explained recursion concept clearly", rating: 4.5, ratedBy: "TA Smith" },
            { date: "2025-10-05", week: 7, contribution: "Asked insightful question", rating: 3.5, ratedBy: "TA Johnson" }
        ]
    },
    "2": {
        id: "2",
        name: "Albert",
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
        name: "Alana",
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
        name: "Bob",
        weeks: [1, 2, 3, 4, 5, 6, 7],
        myAvgRating: [2.5, 2.8, 2.0, 3.0, 2.5, 2.2, 2.8],
        classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
        myWeeklyCount: [1, 2, 1, 2, 1, 1, 2],
        recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Basic question about syntax", rating: 2.5, ratedBy: "TA Smith" }
        ]
    },
    "5": {
        id: "5",
        name: "Charlie",
        weeks: [1, 2, 3, 4, 5, 6, 7],
        myAvgRating: [4.5, 4.8, 4.6, 4.9, 5.0, 4.7, 4.8],
        classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
        myWeeklyCount: [4, 3, 1, 2, 3, 4, 4],
        recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Great contribution", rating: 4, ratedBy: "TA Smith" }
        ]
    },
    "6": {
        id: "6",
        name: "Davis",
        weeks: [1, 2, 3, 4, 5, 6, 7],
        myAvgRating: [2.5, 2.8, 2.0, 3.0, 2.5, 2.2, 2.8],
        classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
        myWeeklyCount: [1, 2, 1, 2, 1, 1, 2],
        recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Basic question", rating: 2.5, ratedBy: "TA Smith" }
        ]
    }
};

const selectedStudent = ref(null);
const charts = ref({});

onMounted(() => {
    filteredStudents.value = [...allStudents];
});

const selectSuggestion = (student) => {
    searchQuery.value = student.name;
    selectedStudentId.value = student.id;
    showSuggestions.value = false;
    loadStudentData();
};

const filterStudents = () => {
    const query = searchQuery.value.toLowerCase();
    filteredStudents.value = allStudents.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query)
    );
    showSuggestions.value = query.length > 0;
};

const loadStudentData = () => {
    if (!selectedStudentId.value) {
        selectedStudent.value = null;
        return;
    }

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

    selectedStudent.value = {
        ...data,
        totalParticipations,
        avgRating,
        avgPerWeek,
        currentWeekCount,
        projectedGrade
    };

    nextTick(() => {
        createStudentCharts();
    });
};

const createStudentCharts = () => {
    if (!selectedStudent.value) return;

    const qualityChartId = 'qualityChart-' + selectedStudent.value.id;
    const countChartId = 'countChart-' + selectedStudent.value.id;

    if (charts.value[qualityChartId]) {
        charts.value[qualityChartId].destroy();
    }
    if (charts.value[countChartId]) {
        charts.value[countChartId].destroy();
    }

    const qualityCtx = document.getElementById(qualityChartId);
    if (qualityCtx) {
        charts.value[qualityChartId] = new Chart(qualityCtx, {
            type: 'line',
            data: {
                labels: selectedStudent.value.weeks,
                datasets: [
                    {
                        label: selectedStudent.value.name + ' Rating',
                        data: selectedStudent.value.myAvgRating,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(13, 110, 253, 1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Class Average',
                        data: selectedStudent.value.classAvgRating,
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 193, 7, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
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
                        max: 5,
                        ticks: { stepSize: 0.5 },
                        title: { display: true, text: 'Rating' }
                    },
                    x: {
                        title: { display: true, text: 'Weeks' }
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
        const colors = counts.map(count => {
            if (count >= 3) return 'rgba(13, 110, 253, 0.7)';
            if (count >= 2) return 'rgba(255, 206, 86, 0.7)';
            return 'rgba(255, 99, 132, 0.7)';
        });

        charts.value[countChartId] = new Chart(countCtx, {
            type: 'bar',
            data: {
                labels: selectedStudent.value.weeks,
                datasets: [{
                    label: 'Participations',
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
    }
};

const getGradeBadgeClass = (grade) => {
    if (grade.startsWith('A')) return 'bg-success';
    if (grade.startsWith('B')) return 'bg-warning';
    return 'bg-danger';
};

const getRatingBadgeClass = (rating) => {
    if (rating >= 4) return 'bg-success';
    if (rating >= 3) return 'bg-warning';
    return 'bg-danger';
};

const studentStats = computed(() => {
    if (!selectedStudent.value) return [];
    return [
        { label: 'Total Participations', value: selectedStudent.value.totalParticipations, icon: 'bi-card-list' },
        { label: 'Avg Rating', value: selectedStudent.value.avgRating.toFixed(2), icon: 'bi-star-fill' },
        { label: 'Avg Per Week', value: selectedStudent.value.avgPerWeek.toFixed(1), icon: 'bi-calendar-week' },
        { label: 'This Week', value: selectedStudent.value.currentWeekCount, icon: 'bi-calendar-check' }
    ];
});

onBeforeUnmount(() => {
    Object.values(charts.value).forEach(chart => chart?.destroy());
});
</script>

<template>
    <main class="container py-4 my-4">
        <div class="container-fluid">
            <h1 class="mb-4 display-1 fw-bold">Class Participation Report</h1>

            <div class="row g-3 mb-5">
                <div class="col-md-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body d-flex justify-content-between align-items-center pb-2">
                            <h6 class="fs-2 mb-0 text-muted">Total Students</h6>
                            <i class="bi bi-people-fill text-primary fs-1"></i>
                        </div>
                        <div class="card-body pt-0">
                            <h4 class="fs-3 fw-bold">{{ classStats.totalStudents }}</h4>
                        </div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body d-flex justify-content-between align-items-center pb-2">
                            <h6 class="fs-2 mb-0 text-muted">Class Avg Rating</h6>
                            <i class="bi bi-bar-chart-line-fill text-info fs-1"></i>
                        </div>
                        <div class="card-body pt-0">
                            <h4 class="fs-3 fw-bold">{{ classStats.classAvgRating }}</h4>
                        </div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body d-flex justify-content-between align-items-center pb-2">
                            <h6 class="fs-2 mb-0 text-muted">Students on Track</h6>
                            <i class="bi bi-check-circle-fill text-success fs-1"></i>
                        </div>
                        <div class="card-body pt-0">
                            <h4 class="fs-3 fw-bold">{{ classStats.studentsOnTrack }}</h4>
                        </div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card shadow-sm h-100 border border-danger">
                        <div class="card-body d-flex justify-content-between align-items-center pb-2">
                            <h6 class="fs-2 mb-0 text-muted">Need Attention</h6>
                            <i class="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                        </div>
                        <div class="card-body pt-0">
                            <h4 class="fs-3 fw-bold">{{ classStats.studentsNeedHelp }}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-4 rounded-4 shadow-sm mb-5">
                <h3 class="mb-4">Select Student to View Details</h3>
                <div class="row g-3 align-items-center">
                    <div class="col-md-8">
                        <div class="input-group position-relative">
                            <span class="input-group-text"><i class="bi bi-search"></i></span>
                            <input 
                                v-model="searchQuery" 
                                @input="filterStudents" 
                                @focus="showSuggestions = searchQuery.length > 0"
                                @blur="setTimeout(() => showSuggestions = false, 200)"
                                type="text" 
                                class="form-control"
                                placeholder="Search by student name..." 
                            />
                            <div 
                                v-if="showSuggestions && searchSuggestions.length > 0" 
                                class="suggestions-dropdown position-absolute w-100 bg-white border rounded shadow-sm"
                                style="top: 100%; z-index: 1000; max-height: 200px; overflow-y: auto;"
                            >
                                <div 
                                    v-for="student in searchSuggestions" 
                                    :key="student.id"
                                    @click="selectSuggestion(student)"
                                    class="suggestion-item p-2 border-bottom"
                                    style="cursor: pointer;"
                                    @mouseenter="$event.target.style.backgroundColor = '#f8f9fa'"
                                    @mouseleave="$event.target.style.backgroundColor = 'white'"
                                >
                                    <strong>{{ student.name }}</strong> <span class="text-muted">(ID: {{ student.id }})</span>
                                </div>
                            </div>
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
                    This student is below 3 participations/week: <strong>{{ selectedStudent.avgPerWeek.toFixed(1) }}</strong>
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

            <div v-else class="text-center py-5 text-muted">
                <i class="bi bi-clipboard fs-1 mb-3"></i>
                <p>Select a student above to view participation analytics.</p>
            </div>
        </div>
    </main>
</template>

<style scoped>
.suggestion-item {
    transition: background-color 0.2s;
}
</style>