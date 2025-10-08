<template>
  <div>
    <StudentNavBar />

    <div class="container mt-4">
      <h1>Student Dashboard</h1>
      <p>Welcome back, student 👋 Check your progress below.</p>

      <!-- example dashboard content -->
      <ul>
        <li>Enrolled Courses: {{ enrolledCourses.length }}</li>
        <li>Total Coins: {{ coins }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import StudentNavBar from "../components/StudentNavBar.vue";

export default {
  name: "StudentDashboard",
  components: { StudentNavBar },
  data() {
    return {
      enrolledCourses: ["Math 101", "Physics 202"],
      coins: 125
    };
  },
  mounted() {
    // protect route (allow only students)
    // MAY want to remove and install a better protect route Eg match role to existing studentID?
    const role = localStorage.getItem("role");
    if (role !== "student") {
      this.$router.push('/'); // go back to login
    }
  },

  methods: {
    logout() {
      localStorage.removeItem("role");
      this.$router.push('/login');
    }
  }
};
</script>
