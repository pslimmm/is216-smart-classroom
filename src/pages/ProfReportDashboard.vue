<template>
  <div>
    <ProfNavBar />

    <!-- main report Content -->
    <div class="prof-report">
      <h1>Professor's Report Dashboard</h1>
      <p>📊 Overview of student performance and course insights</p>

      <section class="summary">
        <div class="card">
          <h3>Total Students</h3>
          <p>{{ report.totalStudents }}</p>
        </div>
        <div class="card">
          <h3>Average Score</h3>
          <p>{{ report.averageScore }}%</p>
        </div>
        <div class="card">
          <h3>Courses Managed</h3>
          <p>{{ report.courses.length }}</p>
        </div>
      </section>

      <section class="details">
        <h2>Course Reports</h2>
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Avg Grade</th>
              <th>Top Student</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in report.courses" :key="course.name">
              <td>{{ course.name }}</td>
              <td>{{ course.avgGrade }}%</td>
              <td>{{ course.topStudent }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import ProfNavBar from "../components/ProfNavBar.vue";

export default {
  name: "ProfReportDashboard",
  components: { ProfNavBar },
  data() {
    return {
      report: {
        totalStudents: 52,
        averageScore: 85,
        courses: [
          { name: "Physics 101", avgGrade: 88, topStudent: "Alice Tan" },
          { name: "Math 202", avgGrade: 83, topStudent: "David Wong" },
          { name: "Chemistry 303", avgGrade: 85, topStudent: "Siti Rahman" }
        ]
      }
    };
  },
  mounted() {
    // protect route (allow only professors)
    const role = localStorage.getItem("role");
    if (role !== "prof") {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.prof-report {
  max-width: 900px;
  margin: 80px auto 40px; /* extra top margin to clear navbar */
  padding: 20px;
  text-align: center;
}

.summary {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.card {
  background-color: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 200px;
}

.details {
  margin-top: 40px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
}

th {
  background-color: #004080;
  color: white;
}

/* remove old logout button styles */
</style>
