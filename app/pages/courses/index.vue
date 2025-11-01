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
            <h1 class="fw-bold">My Courses</h1>
        </div>

        <div class="row g-5">
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3" v-for="course in courses" :key="course.course_id">
                <button class="card w-100 rounded-4 shadow text-start border-0 bg-white p-0" style="cursor: pointer;" @click="navigateTo('/courses/' + (role == 'prof' ? course.id : course.course_id) )">
                    <div class="ratio ratio-16x9">
                        <img :src="result.imageUrl" class="rounded-top-4" :alt="role == 'prof' ? course.course_name : course.course_info.course_name">
                    </div>

                    <div class="card-body">
                        <!-- title (eg IS216 Database)-->
                        <h4 class="fw-bold mb-2 text-truncate-2" :title="(role=='prof' ? course.course_name : course.course_info.course_name)">
                            {{ role=='prof' ? (course.course_code + ' ' + course.course_name)
                                            : (course.course_info.course_code + ' ' + course.course_info.course_name) }}
                        </h4>

                        <!-- academic year and group -->
                        <div class="d-flex flex-row align-items-start gap-2 mb-2">
                            <i class="bi bi-person-badge mt-1 display-2" aria-hidden="true"></i>
                            <div class="d-flex flex-column flex-grow-1 min-w-0">
                                <div class="text-uppercase text-muted small fs-6">Professor</div>
                                <div
                                    class="text-truncate fs-5"
                                    :title="role=='prof' ? course.prof_profile.full_name : course.course_info.prof_profile.full_name"
                                >
                                    {{ role=='prof' ? course.prof_profile.full_name : course.course_info.prof_profile.full_name }}
                                </div>
                            </div>
                            
                            <div class="ms-auto d-flex flex-column text-end gap-1">
                                <span>
                                    <i class="bi bi-calendar-week me-1 fs-3"></i>
                                    {{ role=='prof' ? course.course_term : course.course_info.course_term }}
                                </span>
                                <span>
                                    <i class="bi bi-diagram-3 me-1 fs-3"></i>
                                    G{{ role=='prof' ? course.course_section : course.course_info.course_section }}
                                </span>
                            </div>
                        </div>

                        <!-- professor name, schedule, location -->
                        <div class="d-grid gap-2 mb-0 small">
                            <div class="d-flex align-items-start gap-2">
                                <i class="bi bi-clock mt-1 fs-3" aria-hidden="true"></i>
                                <div class="min-w-0">
                                    <div class="text-uppercase text-muted small fs-6">Schedule</div>
                                    <div class="text-truncate fs-5"
                                        :title="role=='prof' ? course.course_time : course.course_info.course_time">
                                        {{ role=='prof' ? course.course_time : course.course_info.course_time }}
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex align-items-start gap-2">
                                <i class="bi bi-geo-alt mt-1 fs-3" aria-hidden="true"></i>
                                <div class="min-w-0">
                                    <div class="text-uppercase text-muted small fs-6">Location</div>
                                    <div class="text-truncate fs-5"
                                        :title="role=='prof' ? course.course_location : course.course_info.course_location">
                                        {{ role=='prof' ? course.course_location : course.course_info.course_location }}
                                    </div>
                                </div>
                            </div>
                        </div>
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
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

</style>