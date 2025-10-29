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
            <h2 class="fw-bold">My Courses</h2>
            <p class="text-muted">Select a course</p>
        </div>

        <div class="row g-4">
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3" v-for="course in courses" :key="course.course_id">
                <button class="card w-100 rounded-4 shadow text-start border-0 bg-white p-0" style="cursor: pointer;" @click="navigateTo('/courses/' + (role == 'prof' ? course.id : course.course_id) )">
                    <div class="ratio ratio-16x9">
                        <img :src="result.imageUrl" class="rounded-top-4" :alt="role == 'prof' ? course.course_name : course.course_info.course_name">
                    </div>

                    <div class="card-body lh-sm">
                        <!-- title (eg IS216 Database)-->
                        <h3 class="h6 fw-bold mb-2 text-truncate-2" :title="(role=='prof' ? course.course_name : course.course_info.course_name)">
                            {{ role=='prof' ? (course.course_code + ' ' + course.course_name)
                                            : (course.course_info.course_code + ' ' + course.course_info.course_name) }}
                        </h3>

                        <!-- academic year and group -->
                        <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                            <span class="badge text-bg-light">
                            <i class="bi bi-calendar-week me-1"></i>
                            {{ role=='prof' ? course.course_term : course.course_info.course_term }}
                            </span>
                            <span class="badge text-bg-light">
                            <i class="bi bi-diagram-3 me-1"></i> G{{ role=='prof' ? course.course_section : course.course_info.course_section }}
                            </span>
                        </div>

                        <!-- professor name, schedule, location -->
                        <ul class="list-unstyled d-grid gap-2 mb-0 small">
                            <li class="d-flex align-items-start gap-2">
                            <i class="bi bi-person-badge mt-1" aria-hidden="true"></i>
                            <div>
                                <div class="text-uppercase text-muted small">Professor</div>
                                <div class="text-truncate" :title="role=='prof' ? course.prof_profile.full_name : course.course_info.prof_profile.full_name">
                                {{ role=='prof' ? course.prof_profile.full_name : course.course_info.prof_profile.full_name }}
                                </div>
                            </div>
                            </li>

                            <li class="d-flex align-items-start gap-2">
                            <i class="bi bi-clock mt-1" aria-hidden="true"></i>
                            <div>
                                <div class="text-uppercase text-muted small">Schedule</div>
                                <div class="text-truncate" :title="role=='prof' ? course.course_time : course.course_info.course_time">
                                {{ role=='prof' ? course.course_time : course.course_info.course_time }}
                                </div>
                            </div>
                            </li>

                            <li class="d-flex align-items-start gap-2">
                            <i class="bi bi-geo-alt mt-1" aria-hidden="true"></i>
                            <div>
                                <div class="text-uppercase text-muted small">Location</div>
                                <div class="text-truncate" :title="role=='prof' ? course.course_location : course.course_info.course_location">
                                {{ role=='prof' ? course.course_location : course.course_info.course_location }}
                                </div>
                            </div>
                            </li>
                        </ul>

                    </div>
                </button>
            </div>
        </div>
    </div>
</template>



<style scoped>
.card-img-top {
    height: 200px;
    object-fit: cover;
}

button.card:hover {
    transform: scale(1.03);
    transition: transform 0.2s;
}

/* thise is inplace for long titles (Eg Fundamentals of Programming) */
.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.lh-sm {
    line-height: 1.25;
}

</style>