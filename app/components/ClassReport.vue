<script setup>
import Chart from 'chart.js/auto';

const { userID, role } = useAuthState();
const route = useRoute()

const showSubmitModal = ref(false);

const course_id = route.params.course_id;
const result1 = await $fetch('/api/course-info', {
    method: 'POST',
    body: { course_id }
});

const courseData = result1.courseData;

const currentWeek = computed(() => {
    try {
        const startDate = new Date(courseData.starting_date);
        if (isNaN(startDate.getTime())) return 1;

        const currentDate = new Date();
        if (isNaN(currentDate.getTime())) return 1;

        const diffTime = currentDate - startDate;
        if (diffTime < 0) return 1;

        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        const currentWeek = Math.ceil(diffDays / 7);
        return Math.max(1, currentWeek);
    } catch (error) {
        console.error('Error calculating current week:', error);
        return 1;
    }
});

const selectedWeek = ref(1);
const weekInput = ref('')

const changeWeek = () => {
    const weekValue = parseInt(weekInput.value);
    if (isNaN(weekValue) || weekValue < 1 || weekValue > 14) {
        weekInput.value = "";
        return;
    }
    selectedWeek.value = weekValue;
    weekInput.value = "";
}

watchEffect(() => {
    if (currentWeek.value && !isNaN(currentWeek.value)) {
        selectedWeek.value = currentWeek.value;
    }
});

const classParticipationData = ref([]);
const allStudents = ref([]);
const courseReportData = ref(null);
const isLoading = ref(false);

const fetchCourseReport = async (week) => {
    isLoading.value = true;
    try {
        const result = await $fetch('/api/course-report', {
            method: 'POST',
            body: {
                course_id
            }
        });

        courseReportData.value = result;
        classParticipationData.value = result.classParticipationData || [];
        allStudents.value = result.allStudents || [];
    } catch (error) {
        console.error('Error fetching course report:', error);
        classParticipationData.value = [];
        allStudents.value = [];
        courseReportData.value = null;
    } finally {
        isLoading.value = false;
    }
};

watch(selectedWeek, async (newWeek) => {
    if (newWeek && !isNaN(newWeek) && newWeek >= 1 && newWeek <= 14) {
        await fetchCourseReport(newWeek);
    }
}, { immediate: true });

// Filter only approved participations for calculations and charts
const approvedParticipations = computed(() => {
    return classParticipationData.value.filter(participation =>
        participation.status === 'approved'
    );
});

// Include ALL statuses for recent participations display
const allParticipations = computed(() => {
    return classParticipationData.value; // Includes approved, pending, rejected
});

const classAvgByWeek = computed(() => {
    const averages = {};
    const weekData = {};

    approvedParticipations.value.forEach(participation => {
        const week = participation.week;
        if (!weekData[week]) {
            weekData[week] = { ratings: [], count: 0 };
        }
        const rating = participation.rating;
        if (rating > 0) {
            weekData[week].ratings.push(rating);
        }
        weekData[week].count++;
    });

    Object.keys(weekData).forEach(week => {
        const data = weekData[week];
        averages[week] = data.ratings.length > 0
            ? data.ratings.reduce((sum, rating) => sum + rating, 0) / allStudents.value.length / 3
            : 0;
    });

    return averages;
});

const classStats = computed(() => {
    if (!allStudents.value.length) {
        return {
            totalStudents: 0,
            classAvgRating: 0,
            studentsOnTrack: 0,
            studentsNeedHelp: 0
        };
    }

    const weekParticipations = approvedParticipations.value.filter(
        participation => participation.week === selectedWeek.value
    );

    const validRatings = weekParticipations
        .map(p => p.rating)
        .filter(rating => rating > 0);

    const totalRating = validRatings.reduce((sum, rating) => sum + rating, 0);
    const classAvgRating = validRatings.length > 0 ? totalRating / allStudents.value.length / 3 : 0;

    const studentWeekData = {};
    weekParticipations.forEach(participation => {
        const studentId = participation.student_id;
        if (!studentWeekData[studentId]) {
            studentWeekData[studentId] = { totalRating: 0, count: 0 };
        }
        studentWeekData[studentId].totalRating += participation.rating;
        studentWeekData[studentId].count++;
    });

    let studentsNeedHelp = 0;
    let studentsOnTrack = 0;

    allStudents.value.forEach(student => {
        const studentId = student.student_id;
        const weekData = studentWeekData[studentId];

        if (!weekData || weekData.count === 0) {
            studentsNeedHelp++;
        } else {
            const avgRating = weekData.totalRating / weekData.count;
            if (avgRating < 3 || weekData.count < 2) {
                studentsNeedHelp++;
            } else {
                studentsOnTrack++;
            }
        }
    });

    return {
        totalStudents: allStudents.value.length,
        classAvgRating: classAvgRating.toFixed(2),
        studentsOnTrack: studentsOnTrack,
        studentsNeedHelp: studentsNeedHelp
    };
});

const studentsData = computed(() => {
    const studentsMap = {};

    if (!allStudents.value || !Array.isArray(allStudents.value)) return studentsMap;

    allStudents.value.forEach(student => {
        if (!student || !student.student_id) return;
        const studentId = student.student_id;
        studentsMap[studentId] = {
            id: studentId,
            name: student.student.full_name || `Student ${studentId}`,
            weeks: [],
            myAvgRating: [],
            classAvgRating: [],
            myWeeklyCount: [],
            recentParticipations: [],
            currentWeekRating: 0,
            currentWeekCount: 0
        };
    });

    const studentWeekData = {};

    // Use approved participations for calculations
    approvedParticipations.value.forEach(participation => {
        if (!participation || !participation.student_id) return;
        const studentId = participation.student_id;
        const week = participation.week;

        if (!studentWeekData[studentId]) studentWeekData[studentId] = {};
        if (!studentWeekData[studentId][week]) {
            studentWeekData[studentId][week] = { ratings: [], count: 0 };
        }

        const rating = participation.rating;
        if (rating > 0) {
            studentWeekData[studentId][week].ratings.push(rating);
        }
        studentWeekData[studentId][week].count++;
    });

    Object.keys(studentsMap).forEach(studentId => {
        const student = studentsMap[studentId];
        const weekData = studentWeekData[studentId] || {};

        const allWeeks = Array.from({ length: currentWeek.value }, (_, i) => i + 1);
        student.weeks = allWeeks;

        student.myAvgRating = allWeeks.map(week => {
            const weekRatings = weekData[week]?.ratings || [];
            return weekRatings.length > 0
                ? weekRatings.reduce((sum, rating) => sum + rating, 0) / 3
                : 0;
        });

        student.myWeeklyCount = allWeeks.map(week => weekData[week]?.count || 0);
        student.classAvgRating = allWeeks.map(week => classAvgByWeek.value[week] || 0);

        const currentWeekVal = selectedWeek.value;
        const currentWeekData = weekData[currentWeekVal];
        student.currentWeekRating = currentWeekData && currentWeekData.ratings.length > 0
            ? currentWeekData.ratings.reduce((sum, r) => sum + r, 0) / currentWeekData.ratings.length
            : 0;
        student.currentWeekCount = currentWeekData ? currentWeekData.count : 0;

        // Use ALL participations for recent participations display
        student.recentParticipations = allParticipations.value
            .filter(p => p.student_id === studentId)
            .map(p => ({
                week: p.week,
                contribution: p.description || 'No description',
                rating: p.rating,
                status: p.status || 'unknown'
            }))
            .sort((a, b) => {
                try {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                } catch { return 0; }
            });
    });

    return studentsMap;
});

const searchQuery = ref('');
const selectedStudentId = ref('');
const showSuggestions = ref(false);

const filteredStudents = computed(() => {
    if (!allStudents.value || !Array.isArray(allStudents.value)) return [];
    return allStudents.value.filter(student =>
        student.student.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        student.student_id?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const searchSuggestions = computed(() => {
    if (!searchQuery.value.trim() || !filteredStudents.value.length) return [];
    return filteredStudents.value;
});

const selectedStudent = ref(null);
const charts = ref({});

const selectSuggestion = (student) => {
    if (!student) return;
    searchQuery.value = "";
    selectedStudentId.value = student.student_id;
    showSuggestions.value = false;
};

const filterStudents = () => {
    showSuggestions.value = searchQuery.value.length > 0;
};

const loadStudentData = () => {
    Object.values(charts.value).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') chart.destroy();
    });
    charts.value = {};

    if (!selectedStudentId.value) {
        selectedStudent.value = null;
        return;
    }

    const data = studentsData.value[selectedStudentId.value];
    if (!data) {
        selectedStudent.value = null;
        return;
    }

    const totalParticipations = data.myWeeklyCount.reduce((sum, count) => sum + count, 0);
    const avgRating = data.myAvgRating.length > 0
        ? data.myAvgRating.reduce((sum, r) => sum + r, 0) / data.myAvgRating.length
        : 0;
    const currentWeekVal = currentWeek.value;
    const avgPerWeek = currentWeekVal > 0 ? totalParticipations / currentWeekVal : 0;
    const currentWeekCount = data.currentWeekCount;

    let projectedGrade = "C";
    if (avgPerWeek >= 3 && avgRating >= 4.0) projectedGrade = "A+";
    else if (avgPerWeek >= 3 && avgRating >= 3.5) projectedGrade = "A";
    else if (avgPerWeek >= 2.5) projectedGrade = "B+";
    else if (avgPerWeek >= 2) projectedGrade = "B";

    selectedStudent.value = {
        ...data,
        totalParticipations: totalParticipations,
        avgRating: avgRating,
        avgPerWeek: avgPerWeek,
        currentWeekCount: currentWeekCount,
        projectedGrade
    };

    nextTick(() => createStudentCharts());
};

watch(selectedStudentId, (newId) => {
    if (newId) loadStudentData();
    else {
        selectedStudent.value = null;
        Object.values(charts.value).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') chart.destroy();
        });
        charts.value = {};
    }
});

watch(selectedWeek, () => {
    if (selectedStudentId.value) loadStudentData();
});

const createStudentCharts = () => {
    if (!selectedStudent.value) return;

    const qualityChartId = 'qualityChart-' + selectedStudent.value.id;
    const countChartId = 'countChart-' + selectedStudent.value.id;

    if (charts.value[qualityChartId]) {
        charts.value[qualityChartId].destroy();
        delete charts.value[qualityChartId];
    }
    if (charts.value[countChartId]) {
        charts.value[countChartId].destroy();
        delete charts.value[countChartId];
    }

    const qualityCtx = document.getElementById(qualityChartId);
    if (qualityCtx && selectedStudent.value.weeks && selectedStudent.value.weeks.length > 0) {
        try {
            charts.value[qualityChartId] = new Chart(qualityCtx, {
                type: 'line',
                data: {
                    labels: selectedStudent.value.weeks.map(w => `Week ${w}`),
                    datasets: [
                        {
                            label: selectedStudent.value.name + ' Rating',
                            data: selectedStudent.value.myAvgRating,
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            borderColor: 'rgba(13, 110, 253, 1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: selectedStudent.value.myAvgRating.map(rating =>
                                rating === 0 ? 'rgba(200, 200, 200, 0.8)' :
                                    rating >= 4 ? 'rgba(40, 167, 69, 0.8)' :
                                        rating >= 3 ? 'rgba(255, 193, 7, 0.8)' :
                                            'rgba(220, 53, 69, 0.8)'
                            ),
                            pointBorderColor: selectedStudent.value.myAvgRating.map(rating =>
                                rating === 0 ? 'rgba(100, 100, 100, 1)' :
                                    rating >= 4 ? 'rgba(40, 167, 69, 1)' :
                                        rating >= 3 ? 'rgba(255, 193, 7, 1)' :
                                            'rgba(220, 53, 69, 1)'
                            ),
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        },
                        {
                            label: 'Class Average',
                            data: selectedStudent.value.classAvgRating,
                            backgroundColor: 'rgba(255, 159, 64, 0.1)',
                            borderColor: 'rgba(255, 193, 7, 1)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            fill: false,
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    interaction: { intersect: false, mode: 'index' },
                    scales: {
                        y: {
                            min: 0, max: 5,
                            ticks: {
                                stepSize: 0.5,
                                callback: function (value) { return value === 0 ? 'No data' : value.toFixed(1); }
                            },
                            title: { display: true, text: 'Average Rating' }
                        },
                        x: {
                            title: { display: true, text: 'Week Number' },
                            ticks: {
                                callback: function (value, index) {
                                    const weekNum = index + 1;
                                    return weekNum === currentWeek.value ? `Week ${weekNum}*` : `Week ${weekNum}`;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: { display: true, position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
                        tooltip: {
                            enabled: true,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff', bodyColor: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, cornerRadius: 8,
                            callbacks: {
                                title: function (tooltipItems) { return tooltipItems[0].label; },
                                label: function (context) {
                                    const datasetLabel = context.dataset.label || '';
                                    const value = context.parsed.y;
                                    return value === 0 ? `${datasetLabel}: No participation` : `${datasetLabel}: ${value.toFixed(2)}`;
                                },
                                afterLabel: function (context) {
                                    return context.dataIndex + 1 === currentWeek.value ? '(Current Week)' : null;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) { console.error('Error creating quality chart:', error); }
    }

    const countCtx = document.getElementById(countChartId);
    if (countCtx && selectedStudent.value.weeks && selectedStudent.value.weeks.length > 0) {
        try {
            const counts = selectedStudent.value.myWeeklyCount;
            charts.value[countChartId] = new Chart(countCtx, {
                type: 'bar',
                data: {
                    labels: selectedStudent.value.weeks.map(w => `Week ${w}`),
                    datasets: [{
                        label: 'Number of Participations',
                        data: counts,
                        backgroundColor: counts.map((count, index) => {
                            if (count === 0) return 'rgba(200, 200, 200, 0.6)';
                            if (index + 1 === currentWeek.value) return 'rgba(111, 66, 193, 0.8)';
                            if (count >= 3) return 'rgba(13, 110, 253, 0.7)';
                            if (count >= 2) return 'rgba(255, 206, 86, 0.7)';
                            return 'rgba(255, 99, 132, 0.7)';
                        }),
                        borderColor: counts.map((count, index) => {
                            if (count === 0) return 'rgba(100, 100, 100, 1)';
                            if (index + 1 === currentWeek.value) return 'rgba(111, 66, 193, 1)';
                            if (count >= 3) return 'rgba(13, 110, 253, 1)';
                            if (count >= 2) return 'rgba(255, 206, 86, 1)';
                            return 'rgba(255, 99, 132, 1)';
                        }),
                        borderWidth: 2, borderRadius: 4, borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: true,
                    interaction: { intersect: false, mode: 'index' },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                callback: function (value) { return value === 0 ? 'No data' : value; }
                            },
                            title: { display: true, text: 'Number of Participations' }
                        },
                        x: {
                            title: { display: true, text: 'Week Number' },
                            ticks: {
                                callback: function (value, index) {
                                    const weekNum = index + 1;
                                    return weekNum === currentWeek.value ? `Week ${weekNum}*` : `Week ${weekNum}`;
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            enabled: true,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff', bodyColor: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, cornerRadius: 8,
                            callbacks: {
                                title: function (tooltipItems) { return tooltipItems[0].label; },
                                label: function (context) {
                                    const count = context.parsed.y;
                                    if (count === 0) return 'No participations';
                                    return count === 1 ? '1 participation' : `${count} participations`;
                                },
                                afterLabel: function (context) {
                                    return context.dataIndex + 1 === currentWeek.value ? '(Current Week)' : null;
                                }
                            }
                        },
                        legend: {
                            display: true, position: 'bottom',
                            labels: {
                                generateLabels: function (chart) {
                                    return [
                                        { text: 'No participation', fillStyle: 'rgba(200, 200, 200, 0.6)', strokeStyle: 'rgba(100, 100, 100, 1)', lineWidth: 2 },
                                        { text: 'Current week', fillStyle: 'rgba(111, 66, 193, 0.8)', strokeStyle: 'rgba(111, 66, 193, 1)', lineWidth: 2 },
                                        { text: '3+ participations', fillStyle: 'rgba(13, 110, 253, 0.7)', strokeStyle: 'rgba(13, 110, 253, 1)', lineWidth: 2 },
                                        { text: '2 participations', fillStyle: 'rgba(255, 206, 86, 0.7)', strokeStyle: 'rgba(255, 206, 86, 1)', lineWidth: 2 },
                                        { text: '1 participation', fillStyle: 'rgba(255, 99, 132, 0.7)', strokeStyle: 'rgba(255, 99, 132, 1)', lineWidth: 2 }
                                    ];
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) { console.error('Error creating count chart:', error); }
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

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'approved': return 'bg-success';
        case 'pending': return 'bg-warning';
        case 'rejected': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

const studentStats = computed(() => {
    if (!selectedStudent.value) return [];
    return [
        { label: 'Total Participations', value: selectedStudent.value.totalParticipations, icon: 'bi-card-list' },
        { label: 'Overall CP Rating (out of 5)', value: selectedStudent.value.avgRating.toFixed(2), icon: 'bi-star-fill' },
        { label: 'Avg CP Per Week', value: selectedStudent.value.avgPerWeek.toFixed(2), icon: 'bi-calendar-week' },
        { label: `Week ${selectedWeek.value} Participations`, value: selectedStudent.value.currentWeekCount, icon: 'bi-calendar-check' }
    ];
});

onBeforeUnmount(() => {
    Object.values(charts.value).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') chart.destroy();
    });
});
</script>

<template>
    <main class="container py-4 my-4">
        <div class="container-fluid">
            <h1 class="mb-4 display-1 fw-bold">Class Participation Report</h1>
            <div class="card shadow-sm mb-4" v-if="courseData">
                <div class="card-body">
                    <h4 class="card-title">{{ courseData.course_name }}</h4>
                    <p class="card-text mb-1">
                        <strong>Course Code:</strong> {{ courseData.course_code }} |
                        <strong>Section:</strong> {{ courseData.course_section }}
                    </p>
                    <p class="card-text mb-1">
                        <strong>Term:</strong> {{ courseData.course_term }} |
                        <strong>Time:</strong> {{ courseData.course_time }}
                    </p>
                    <p class="card-text mb-0">
                        <strong>Location:</strong> {{ courseData.course_location }} |
                        <strong>Started:</strong> {{ new Date(courseData.starting_date).toLocaleDateString() }}
                    </p>
                </div>
            </div>
            <SubmitClassPartModal v-if="showSubmitModal" v-model:showSubmitModal="showSubmitModal" />
            <div class="row d-flex">
                <div class="col-md-6 mb-4">
                    <div class="card h-100 shadow-sm">
                        <p>Currently on Week {{ selectedWeek }} (Total weeks so far: {{ currentWeek }})</p>
                        <div class="d-flex align-items-center gap-3 mb-4">
                            <label for="weekSelect" class="form-label mb-0">Change to Week:</label>
                            <select id="weekSelect" v-model="weekInput" class="form-select form-select-sm"
                                style="width: auto;" @change="changeWeek()" :value="selectedWeek">
                                <option v-for="week in currentWeek" :key="week" :value="week">{{ week }}
                                </option>
                            </select>
                        </div>
                        <button @click="selectedWeek = currentWeek" class="btn btn-secondary btn-sm mb-4">Current
                            Week</button>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="card h-100 shadow-sm">
                        <h3 class="fw-bold text-center">Actions</h3>
                        <button @click="showSubmitModal = true" class="btn btn-primary btn-sm mb-4 ms-1">Submit New
                            CP</button>
                    </div>
                </div>
            </div>
            <div v-if="isLoading" class="text-center py-4">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <div v-else class="row g-3 mb-4">
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
                            <h6 class="fs-2 mb-0 text-muted">Needs Attention</h6>
                            <i class="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                        </div>
                        <div class="card-body pt-0">
                            <h4 class="fs-3 fw-bold">{{ classStats.studentsNeedHelp }}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-4 rounded-4 shadow-sm mb-4">
                <h3 class="mb-4">Select Student to View Details</h3>
                <div class="d-flex justify-content-between">
                    <div class="input-group position-relative">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input v-model="searchQuery" @input="filterStudents"
                            @focus="showSuggestions = searchQuery.length > 0"
                            @blur="setTimeout(() => showSuggestions = false, 200)" type="text" class="form-control"
                            placeholder="Search by student name..." />
                        <div v-if="showSuggestions && searchSuggestions.length > 0"
                            class="suggestions-dropdown position-absolute w-100 bg-white border rounded shadow-sm"
                            style="top: 100%; z-index: 1000; max-height: 200px; overflow-y: auto;">
                            <div v-for="student in searchSuggestions" :key="student.student_id"
                                @click="selectSuggestion(student)" class="suggestion-item p-2 border-bottom"
                                style="cursor: pointer;" @mouseenter="$event.target.style.backgroundColor = '#f8f9fa'"
                                @mouseleave="$event.target.style.backgroundColor = 'white'">
                                <strong>{{ student.student.full_name }}</strong>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary ms-3" @click="selectedStudentId = ''">Reset</button>
                </div>
            </div>

            <div v-if="selectedStudent" class="bg-white p-4 rounded-4 shadow-sm mb-5">
                <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <div>
                        <h2 class="fw-bold">{{ selectedStudent.name }}</h2>
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
                    This student is below 3 participations/week: <strong>{{ selectedStudent.avgPerWeek.toFixed(2) }}
                        participation(s) / week</strong>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-4">
                        <div class="bg-body-secondary p-4 rounded-3 border">
                            <h5 class="mb-3">Quality Rating Comparison</h5>
                            <div style="height: 300px;">
                                <canvas :id="'qualityChart-' + selectedStudent.id"></canvas>
                            </div>
                            <div class="mt-2 text-muted small">
                                <i class="bi bi-info-circle me-1"></i>
                                * indicates current week.
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-4">
                        <div class="bg-body-secondary p-4 rounded-3 border">
                            <h5 class="mb-3">Weekly Participation Count</h5>
                            <div style="height: 300px;">
                                <canvas :id="'countChart-' + selectedStudent.id"></canvas>
                            </div>
                            <div class="mt-2 text-muted small">
                                <i class="bi bi-info-circle me-1"></i>
                                * indicates current week.
                            </div>
                        </div>
                    </div>
                </div>

                <h5 class="mb-3">All Participation History</h5>
                <div class="table-responsive">
                    <div v-if="selectedStudent.recentParticipations.length > 0" class="border rounded">
                        <table class="table table-bordered table-hover align-middle mb-0">
                            <thead class="table-secondary sticky-top">
                                <tr>
                                    <th>Week</th>
                                    <th>Contribution</th>
                                    <th>Rating</th>
                                    <th>Status</th>
                                    <th v-if="role == 'prof'">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="p in selectedStudent.recentParticipations" :key="p.date + p.contribution">
                                    <td>Week {{ p.week }}</td>
                                    <td>{{ p.contribution }}</td>
                                    <td>
                                        <span :class="['badge', getRatingBadgeClass(p.rating)]">
                                            {{ p.rating }} ⭐
                                        </span>
                                    </td>
                                    <td>
                                        <span :class="['badge', getStatusBadgeClass(p.status)]">
                                            {{ p.status }}
                                        </span>
                                    </td>
                                    <td v-if="role == 'prof'"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="text-center py-4 text-muted">
                        <i class="bi bi-clipboard-x fs-1 mb-3"></i>
                        <p>No participation history found for this student.</p>
                    </div>
                </div>
            </div>

            <div v-else class="rounded-4 p-4 bg-white">

                <p class="text-center">Press any name in the table below or search for a name above to open dashboard
                </p>
                <table class="table table-bordered table-hover align-middle mb-0 text-start">
                    <thead>
                        <tr class="table-secondary">
                            <th class="col-1">*</th>
                            <th class="col ms-3">Student Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(student, index) in allStudents" :key="student.student_id"
                            @click="selectedStudentId = student.student_id" style="cursor: pointer">
                            <td>{{ index + 1 }}</td>
                            <td class="ms-3">{{ student.student.full_name }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</template>

<style scoped>
.suggestion-item {
    transition: background-color 0.2s;
}

.table-responsive {
    max-height: 300px;
    overflow-y: auto;
}

.sticky-top {
    position: sticky;
    top: 0;
    z-index: 10;
}
</style>