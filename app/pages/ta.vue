<script setup>
const { role } = useRole();

const taData = {
    courses: ["Math 101", "Science 202"],
    pendingReviews: 3,
    activeStudents: 45
};

</script>

<template>
    <div>

        <!-- main Dashboard Content -->
        <div class="ta-dashboard">
            <h1>Teaching Assistant Dashboard</h1>
            <p>Welcome, TA 👋 Here’s your teaching overview:</p>

            <ul>
                <li>Assigned courses: {{ taData.courses.length }}</li>
                <li>Pending reviews: {{ taData.pendingReviews }}</li>
                <li>Active students: {{ taData.activeStudents }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.ta-dashboard {
    max-width: 600px;
    margin: 80px auto 50px;
    /* added top margin for navbar space */
    padding: 20px;
    background-color: #f0f8ff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #004080;
}

ul {
    list-style: none;
    padding: 0;
    line-height: 1.8;
}
</style>
