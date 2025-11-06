<script setup>
import Chart from 'chart.js/auto';
import SubmitClassPartModal from './SubmitClassPartModal.vue';
import ApproveClassPartModal from './ApproveClassPartModal.vue';
import RejectClassPartModal from './RejectClassPartModal.vue';

const { role } = useAuthState();
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
// const weekInput = ref('')

// const changeWeek = () => {
//     const weekValue = parseInt(weekInput.value);
//     if (isNaN(weekValue) || weekValue < 1 || weekValue > 14) {
//         weekInput.value = "";
//         return;
//     }
//     selectedWeek.value = weekValue;
//     weekInput.value = "";
// }

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
                transaction_id: p.id,
                remarks: p.prof_remarks,
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
                            backgroundColor: 'rgba(54, 162, 235, 0.7)',
                            borderColor: 'rgba(54, 162, 253, 1)',
                            borderWidth: 2,
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
                    maintainAspectRatio: false,
                    resizeDelay: 150,
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
                    responsive: true,
                    maintainAspectRatio: false,
                    resizeDelay: 150,
                    interaction: { intersect: false, mode: 'index' },
                    scales: {
                        y: {
                            max: 5,
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
        { label: 'Total Participations', value: selectedStudent.value.totalParticipations, icon: 'bi-card-list', color: 'text-primary' },
        { label: 'Overall CP Rating (Out of 5)', value: selectedStudent.value.avgRating.toFixed(2), icon: 'bi-star-fill', color: 'text-info' },
        { label: 'Avg CP Per Week', value: selectedStudent.value.avgPerWeek.toFixed(2), icon: 'bi-calendar-week', color: 'text-warning' },
        { label: `Week ${selectedWeek.value} Participations`, value: selectedStudent.value.currentWeekCount, icon: 'bi-calendar-check', color: 'text-success' }
    ];
});

// approve and reject cp functions

const showApproveModal = ref(false);
const showRejectModal = ref(false);

watch(showApproveModal, async (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
        await fetchCourseReport(selectedWeek.value);
        if (selectedStudentId.value) {
            loadStudentData();
        }
    }
});

watch(showRejectModal, async (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
        await fetchCourseReport(selectedWeek.value);
        if (selectedStudentId.value) {
            loadStudentData();
        }
    }
});

const selectedTransaction = ref({});
const approveCP = (p) => {
    selectedTransaction.value = p;
    showApproveModal.value = true;
}

const rejectCP = (p) => {
    selectedTransaction.value = p;
    showRejectModal.value = true;
}

onBeforeUnmount(() => {
    Object.values(charts.value).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') chart.destroy();
    });
});

</script>

<template>
    <SubmitClassPartModal v-if="showSubmitModal" v-model:showSubmitModal="showSubmitModal"/>
    <ApproveClassPartModal v-if="showApproveModal" v-model:showApproveModal="showApproveModal"
        :transaction="selectedTransaction" :student_name="selectedStudent.name" :student_id="selectedStudentId" />
    <RejectClassPartModal v-if="showRejectModal" v-model:showRejectModal="showRejectModal"
        :transaction="selectedTransaction" :student_name="selectedStudent.name" />

    <div class="py-4 px-5">
        <div class="row mb-5 g-4 align-items-stretch">
            <!-- Course Info -->
            <div class="col-12 col-lg-8">
                <!-- <div class="col-12 col-lg-"> -->
                <div class="section-elev rounded-4 h-100 d-flex-column">
                    <!-- Course Info Header -->
                    <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                        <div class="fw-bold fs-2">Course Information</div>
                    </div>

                    <!-- Course Info Body -->
                    <div class="px-4 py-4 flex-grow-1">
                        <div class="fw-bold text-navy fs-2">
                            {{ courseData.course_name }}
                        </div>
                        <div>
                            <div class="fs-2"><strong>Code:</strong> {{ courseData.course_code }}</div>
                            <div class="fs-2"><strong>Section:</strong> G{{ courseData.course_section }}</div>
                            <div class="fs-2"><strong>Time:</strong> {{ courseData.course_time }}</div>
                            <div class="fs-2"><strong>Location:</strong> {{ courseData.course_location }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section Statistics -->


            <!-- Submit Class Participation -->
            <div class="col-12 col-lg-4">
                <div class="section-elev rounded-4 h-100 d-flex flex-column">
                    <!-- Submit Class Participation Header -->
                    <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                        <div class="fw-bold display-heading">Actions</div>
                    </div>
                    <!-- Submit Class Participation Body -->
                    <div class="px-4 py-4 flex-grow-1 d-flex flex-column justify-content-start gap-3">
                        <button v-if="role == 'ta'" @click="showSubmitModal = true"
                            class="btn btn-navy fs-3 fw-semibold">Submit New CP</button>
                        <NuxtLink v-if="role == 'prof'" :to="course_id + '/ApprovedCP'"
                            class="btn btn-navy fs-3 fw-semibold">Review
                            Approved CP</NuxtLink>
                        <NuxtLink v-if="role == 'prof'" :to="course_id + '/RejectedCP'"
                            class="btn btn-navy fs-3 fw-semibold">Review
                            Rejected CP</NuxtLink>
                    </div>
                    <SubmitClassPartModal v-if="showSubmitModal" v-model:showSubmitModal="showSubmitModal" />
                </div>
            </div>
        </div>


        <!-- Class Participation Report -->
        <div class="col-12 mb-5">
            <div class="col-12">
                <!-- <div class="col-12 col-lg-"> -->
                <div class="section-elev rounded-4 h-100 d-flex-column">
                    <!-- Class Participation Report Header -->
                    <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                        <div class="fw-bold fs-2">Class Participation Report</div>
                    </div>

                    <!-- Class Participation Report Body -->
                    <div class="px-4 py-4 flex-grow-1">
                        <div
                            class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 mb-4 align-items-center">

                            <div class="col">
                                <div class="d-flex flex-column align-items-center">
                                    <h6 class="fs-4 mb-0 text-muted">Total Students</h6>
                                    <i class="bi bi-people-fill text-primary fs-3"></i>
                                    <h4 class="fs-4 fw-bold">{{ classStats.totalStudents }}</h4>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex flex-column align-items-center">
                                    <h6 class="fs-4 mb-0 text-muted">Class Avg Rating</h6>
                                    <i class="bi bi-bar-chart-line-fill text-info fs-3"></i>
                                    <h4 class="fs-4 fw-bold">{{ classStats.classAvgRating }}</h4>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex flex-column align-items-center">
                                    <h6 class="fs-4 mb-0 text-muted">Students on Track</h6>
                                    <i class="bi bi-check-circle-fill text-success fs-3"></i>
                                    <h4 class="fs-4 fw-bold">{{ classStats.studentsOnTrack }}</h4>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex flex-column align-items-center">
                                    <h6 class="fs-4 mb-0 text-muted">Needs Attention</h6>
                                    <i class="bi bi-exclamation-triangle-fill text-danger fs-3"></i>
                                    <h4 class="fs-4 fw-bold">{{ classStats.studentsNeedHelp }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Select Student to View Details -->
        <div class="col-12 mb-5">
            <div class="section-elev rounded-4 h-100 d-flex flex-column">
                <!-- Select Student to View Details Header -->
                <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                    <div class="fw-bold display-heading">Select Student to View Details</div>
                </div>

                <!-- Select Student to View Details Body -->
                <div class="px-4 py-4 flex-grow-1">
                    <div class="d-flex justify-content-between">
                        <div class="input-group position-relative">
                            <span class="input-group-text"><i class="bi bi-search fs-3"></i></span>
                            <input v-model="searchQuery" @input="filterStudents"
                                @focus="showSuggestions = searchQuery.length > 0"
                                @blur="setTimeout(() => showSuggestions = false, 200)" type="text"
                                class="form-control fs-3" placeholder="Search by student name..." />
                            <div v-if="showSuggestions && searchSuggestions.length > 0"
                                class="suggestions-dropdown position-absolute w-100 bg-white border rounded shadow-sm"
                                style="top: 100%; z-index: 1000; max-height: 200px; overflow-y: auto;">
                                <div v-for="student in searchSuggestions" :key="student.student_id"
                                    @click="selectSuggestion(student)" class="suggestion-item p-2 border-bottom fs-4"
                                    style="cursor: pointer;"
                                    @mouseenter="$event.target.style.backgroundColor = '#f8f9fa'"
                                    @mouseleave="$event.target.style.backgroundColor = 'white'">
                                    <strong>{{ student.student.full_name }}</strong>
                                </div>
                            </div>
                        </div>
                        <button class="btn bg-navy text-white ms-3 fs-3 fw-semibold"
                            @click="selectedStudentId = ''">Reset</button>
                    </div>
                </div>


                <span class="text-muted fw-bold px-4">(Press any name in the table below or search for a name above to
                    open dashboard)
                </span>

                <!-- Select Student Table -->
                <div class="px-4 py-4">
                    <div class="table-responsive rounded-3 border">
                        <div v-if="allStudents">
                            <table class="table align-middle mb-0 table-hover">
                                <thead class="table-light sticky-top fs-4">
                                    <tr>
                                        <th>No.</th>
                                        <th>Student Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(student, index) in allStudents" :key="student.student_id"
                                        @click="selectedStudentId = student.student_id" style="cursor: pointer">
                                        <td class="fs-4">{{ index + 1 }}</td>
                                        <td class="fs-4">{{ student.student.full_name }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="text-center py-4 text-muted">
                            <i class="bi bi-person fs-2 fw-bold mb-3"></i>
                            <p class="fs-2 fw-bold">No students found for this section.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- End of Select Students to View Details -->

        <!-- Start of v-if selectedStudent -->
        <div v-if="selectedStudent">
            <!-- Selected Student Details -->
            <div class="col-12 mb-5">
                <div class="section-elev rounded-4">
                    <!-- Selected Student Details Header -->
                    <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                        <div class="fw-bold display-heading">{{ selectedStudent.name }}'s Participation
                            Report</div>
                    </div>

                    <!-- Selected Student Details Body -->
                    <div class="px-4 py-3 flex-shrink-0 rounded-start-4">
                        <div class="text-navy fw-semibold mb-3 fs-3">Currently on Week {{
                            selectedWeek }} (Total weeks so far: {{ currentWeek }})</div>
                        <div class="d-flex flex-row align-items-center gap-3 mb-4 fw-bold fs-4">
                            <label for="weekSelect" class="form-label mb-0">Change to Week:</label>
                            <select id="weekSelect" v-model.number="selectedWeek"
                                class="form-select form-select-sm fs-5" style="width: auto;">
                                <!-- Cap options to 14 to match your watcher validation -->
                                <option v-for="week in Math.min(currentWeek, 14)" :key="week" :value="week">
                                    {{ week }}
                                </option>
                            </select>

                            <!-- Clicking this will jump the dropdown to the current week (also capped to 14) -->
                            <button @click="selectedWeek = Math.min(currentWeek, 14)"
                                class="btn btn-navy fs-5 fw-semibold">
                                Current Week
                            </button>
                        </div>
                    </div>

                    <div class="px-4 py-4">
                        <div
                            class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 mb-4 align-items-center">
                            <!-- Stats -->
                            <div class="col" v-for="stat in studentStats" :key="stat.label">
                                <div class="d-flex flex-column align-items-center">
                                    <i :class="['bi fs-2 mb-2', stat.icon, stat.color]"></i>
                                    <h5 class="fw-bold fs-3">{{ stat.value }}</h5>
                                    <small class="text-muted fs-5">{{ stat.label }}</small>
                                </div>
                            </div>

                            <!-- Projected Grade -->
                            <div class="col">
                                <div class="d-flex flex-column align-items-center">
                                    <i class="bi fs-2 mb-2 bi-calculator"></i>
                                    <h5 class="fw-bold fs-3 text-white px-3 py-2 rounded-3"
                                        :class="getGradeBadgeClass(selectedStudent.projectedGrade)">{{
                                            selectedStudent.projectedGrade }}</h5>
                                    <small class="text-muted fs-5">Projected Graded:</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Warning to Appear if participation below 3 -->
                    <div v-if="selectedStudent.avgPerWeek < 3" class="alert alert-warning fs-5">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        This student is below 3 participations/week: <strong>{{
                            selectedStudent.avgPerWeek.toFixed(2) }}
                            participation(s) / week</strong>
                    </div>

                    <!-- Chart -->
                    <div class="row g-3 g-md-4 px-4 py-4">
                        <!-- Left Chart -->
                        <div class="col-12 col-lg-6">
                            <div class="border rounded-3 p-3 h-100">
                                <h6 class="fw-semibold mb-3">Quality Rating: Student vs Class</h6>
                                <div class="ratio ratio-16x9 chart-wrap">
                                    <canvas :id="'qualityChart-' + selectedStudent.id"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- Right Chart -->
                        <div class="col-12 col-lg-6">
                            <div class="border rounded-3 p-3 h-100">
                                <h6 class="fw-semibold mb-3">Week Participation</h6>
                                <div class="ratio ratio-16x9 chart-wrap">
                                    <canvas :id="'countChart-' + selectedStudent.id"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- End of Chart -->
                </div>
                <!-- End of Selected Student Details -->
            </div>

            <!-- Participation History -->
            <div class="col-12 mb-3">
                <div class="section-elev rounded-4">
                    <!-- Participation History Header -->
                    <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                        <div class="fw-bold display-heading">Participation History</div>
                    </div>

                    <!-- Body -->
                    <div class="px-4 py-4">
                        <div class="table-responsive rounded-3 border">
                            <div v-if="selectedStudent.recentParticipations.length > 0">
                                <table class="table align-middle mb-0">
                                    <thead class="table-light sticky-top fs-4">
                                        <tr class="text-center">
                                            <th>Week</th>
                                            <th>Contribution</th>
                                            <th>Rating</th>
                                            <th>Status</th>
                                            <th>Remarks</th>
                                            <th v-if="role == 'prof'">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="text-center">
                                        <tr v-for="p in selectedStudent.recentParticipations"
                                            :key="p.date + p.contribution">
                                            <td>
                                                <span class="fs-4">{{ p.week }}</span>
                                            </td>
                                            <td class="text-truncate fs-4 truncate-md">
                                                {{ p.contribution }}
                                            </td>
                                            <td>
                                                <span class="text-navy fw-semibold fs-4"> {{ p.rating.toFixed(0) }}
                                                    <i class="bi bi-star-fill text-warning"></i>
                                                </span>
                                            </td>
                                            <td :class="{
                                                'bg-danger': p.status === 'rejected',
                                                'bg-warning': p.status === 'pending',
                                                'bg-success': p.status === 'approved'
                                            }" class="border-bottom-0 text-center">
                                                <span class="text-white fw-semibold fs-4 text-capitalize"> {{ p.status
                                                    }}
                                                </span>
                                            </td>
                                            <td class="text-muted text-truncate fs-4 truncate-md">
                                                {{ p.remarks }}
                                            </td>
                                            <td v-if="role == 'prof'">
                                                <div class="row">
                                                    <div class="col-lg-6 col-12">
                                                        <button @click="approveCP(p)"
                                                            class="btn btn-success fs-4 fw-semibold w-100"
                                                            
                                                            :disabled="!['rejected', 'pending'].includes(p.status)">
                                                            Approve
                                                        </button>

                                                    </div>
                                                    <div class="col-lg-6 col-12 mt-lg-0 mt-3">
                                                        <button @click="rejectCP(p)"
                                                            class="btn btn-danger fs-4 fw-semibold w-100"
                                                            :disabled="!['approved', 'pending'].includes(p.status)">
                                                            {{ p.status == 'approved' ? 'Retract' : 'Reject' }}
                                                        </button>

                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="text-center py-4 text-muted">
                                <i class="bi bi-clipboard-x fs-2 mb-3"></i>
                                <p class="fs-3">No participation history found for this student.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.section-elev {
    background-color: white;
}

.display-heading {
    font-size: 2rem;
    text-wrap: balance;
}

.truncate-md {
    max-width: min(100%, 21rem);
}

@media (max-width: 576px) {
    .truncate-md {
        max-width: 100%;
    }
}

.suggestion-item {
    transition: background-color 0.2s;
}

/* Table polish */
.table-responsive {
    max-height: min(60vh, 320px);
    overflow-y: auto;
}

.table thead th {
    font-weight: 600;
    color: navy;
}

.table tbody tr+tr {
    border-top: 1px solid var(--border);
}

.sticky-top {
    position: sticky;
    top: 0;
    z-index: 10;
}
</style>
