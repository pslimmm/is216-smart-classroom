<script setup>
const { session, role, userID } = useAuthState();

const result = await $fetch('/api/courses', {
    method: 'POST',
    body: {
        role: role.value,
        user_id: userID.value,
        session: session.value
    }
});

if (result.error) {
    showError(result.error);
}

const courses = result.data;
</script>

<template>
    <div class="container py-5">
        <div class="text-center mb-5">
            <!-- Changes depending on role -->
            <h1 v-if="role === 'prof'" class="fw-bold">Teaching Courses</h1>
            <h1 v-else-if="role === 'ta'">Teaching Assistant Courses</h1>
            <h1 v-else>My Courses</h1>
        </div>

        <div class="row g-5">
            <div class="col-12 col-sm-6 col-lg-4 d-flex" v-for="course in courses" :key="course.course_id">
                <button
                    class="course-card card h-100 w-100 rounded-4 shadow text-start border-0 bg-white p-0"
                    @click="navigateTo('/courses/' + (role == 'prof' ? course.id : course.course_id) )"
                >
                    <div class="ratio ratio-16x9">
                        <img
                            :src="result.imageUrl"
                            class="img-fluid rounded-top-4 w-100 h-100 object-fit-cover"
                            :alt="role == 'prof' ? course.course_name : course.course_info.course_name"
                            width="640"
                            height="360"
                            loading="lazy"
                            decoding="async"
                        >
                    </div>

                    <div class="card-body">
                        <h4
                            class="fw-bold mb-3 text-truncate-2"
                            :title="(role=='prof' ? course.course_name : course.course_info.course_name)"
                        >
                            {{ role=='prof' ? (course.course_code + ' ' + course.course_name)
                                            : (course.course_info.course_code + ' ' + course.course_info.course_name) }}
                        </h4>

                        <div class="row align-items-start g-3 mb-3">
                            <div class="col-auto">
                                <i class="bi bi-person-badge fs-1 text-navy" aria-hidden="true"></i>
                            </div>
                            <div class="col">
                                <div class="text-uppercase small">Professor</div>
                                <div
                                    class="fs-5 fw-semibold text-break"
                                    :title="role=='prof' ? course.prof_profile.full_name : course.course_info.prof_profile.full_name"
                                >
                                    {{ role=='prof' ? course.prof_profile.full_name : course.course_info.prof_profile.full_name }}
                                </div>
                            </div>
                            <div class="col-12 col-md-auto small">
                                <div class="d-flex flex-wrap align-items-center gap-3 text-md-end">
                                    <span class="d-flex align-items-center gap-1">
                                        <i class="bi bi-calendar-week fs-5"></i>
                                        {{ role=='prof' ? course.course_term : course.course_info.course_term }}
                                    </span>
                                    <span class="d-flex align-items-center gap-1">
                                        <i class="bi bi-diagram-3 fs-5"></i>
                                        G{{ role=='prof' ? course.course_section : course.course_info.course_section }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 small mb-3">
                            <div class="col-12 col-md-6">
                                <div class="d-flex align-items-start gap-2 flex-wrap">
                                    <div class="min-w-0 flex-grow-1">
                                        <i class="bi bi-clock mt-1 fs-5" aria-hidden="true"></i>
                                        <div class="text-uppercase small">Schedule</div>
                                        <div
                                            class="fw-semibold text-break"
                                            :title="role=='prof' ? course.course_time : course.course_info.course_time"
                                        >
                                            {{ role=='prof' ? course.course_time : course.course_info.course_time }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="d-flex align-items-start gap-2 flex-wrap">
                                    <div class="min-w-0 flex-grow-1">
                                        <i class="bi bi-geo-alt mt-1 fs-5" aria-hidden="true"></i>
                                        <div class="text-uppercase small">Location</div>
                                        <div
                                            class="fw-semibold text-break"
                                            :title="role=='prof' ? course.course_location : course.course_info.course_location"
                                        >
                                            {{ role=='prof' ? course.course_location : course.course_info.course_location }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex flex-column flex-md-row gap-2 align-items-stretch mt-auto w-100">
                            <button
                                @click="navigateTo('/courses/' + (role == 'prof' ? course.id : course.course_id))"
                                class="btn btn-outline-navy w-100 flex-fill"
                            >
                                <i class="bi bi-speedometer2 me-1"></i>
                                DASHBOARD
                            </button>
                            <button
                                @click="navigateTo('/courses/' + (role == 'prof' ? course.id : course.course_id) + '/notes')"
                                class="btn btn-navy w-100 flex-fill"
                            >
                                <i class="bi bi-journal-text me-1"></i>
                                NOTES
                            </button>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>



<style scoped>
.card-img-top {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
}

.course-card {
    cursor: pointer;
    font-size: clamp(1.15rem, 1rem + 0.8vw, 1.25rem);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s;
}

.course-card:hover {
    transform: scale(1.015);
}

.course-card .ratio,
.course-card img {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
}

.course-card .ratio {
    flex: 0 0 auto;
}

.course-card .card-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
}

.course-card h4 {
    font-size: clamp(1.65rem, 1.2rem + 1vw, 1.875rem);
}

.course-card .small,
.course-card .text-muted.small {
    font-size: 1.09375rem;
}

.course-card .fs-5 {
    font-size: 1.5625rem !important;
}

.course-card .fs-1 {
    font-size: 3.125rem !important;
}

.course-card .row.g-3 {
    --bs-gutter-x: 1.25rem;
    --bs-gutter-y: 1.25rem;
}

.course-card .d-grid.gap-2 {
    gap: 1.25rem;
}

.course-card .btn {
    font-size: 1.25rem;
    padding: 0.6rem 1.25rem;
    min-width: 0;
}

.course-card .btn i {
    font-size: 1.1em;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    line-height: 1.4em;
    min-height: 2.8em;
    /* max-height: calc(1.4em * 2); */
    word-break: keep-all;
}

</style>
