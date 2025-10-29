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

        <div class="row">
            <div class="col-md-4 mb-4" v-for="course in courses" :key="course.course_id">
                <!-- Course Card -->
                <div class="card w-100 rounded-4 shadow border-0 bg-white">
                    <img :src="result.imageUrl" class="rounded-top-4" :alt="role == 'prof' ? course.course_name : course.course_info.course_name">
                    <div class="card-body lh-1">
                        <p class="fw-bold">{{ role == "prof" ? course.course_code : course.course_info.course_code }} {{ role == "prof" ? course.course_name : course.course_info.course_name }}</p>
                        <p>Term and Section</p>
                        <p class="text-muted">{{ role == "prof" ? course.course_term : course.course_info.course_term }} • G{{ role == "prof" ? course.course_section : course.course_info.course_section }}</p>
                        <p>Professor</p>
                        <p class="text-muted">{{ role == "prof" ? course.prof_profile.full_name : course.course_info.prof_profile.full_name }}</p>
                        <p>Schedule</p>
                        <p class="text-muted">{{ role == "prof" ? course.course_time : course.course_info.course_time }}</p>
                        <p>Location</p>
                        <p class="text-muted">{{ role == "prof" ? course.course_location : course.course_info.course_location }}</p>

                        <!-- Action Buttons -->
                        <div class="d-flex gap-2 mt-3">
                            <button
                                @click="navigateTo('/courses/' + (role == 'prof' ? course.id : course.course_id))"
                                class="btn btn-outline-primary flex-fill"
                            >
                                <i class="bi bi-speedometer2 me-1"></i>
                                DASHBOARD
                            </button>
                            <button
                                @click="navigateTo('/courses/' + (role == 'prof' ? course.id : course.course_id) + '/notes')"
                                class="btn btn-primary flex-fill"
                            >
                                <i class="bi bi-journal-text me-1"></i>
                                NOTES
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped>
.card-img-top {
    height: 200px;
    object-fit: cover;
}

.card:hover {
    transform: scale(1.02);
    transition: transform 0.2s;
}
</style>
