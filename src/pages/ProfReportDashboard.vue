<template>
  <div>
    <!-- ============================================ -->
    <!-- PROFESSOR NAVIGATION BAR -->
    <!-- ============================================ -->
    <ProfNavBar />

    <!-- ============================================ -->
    <!-- MAIN CONTAINER -->
    <!-- Offset for fixed navbar, bottom padding for scroll -->
    <!-- ============================================ -->
    <div class="container" style="margin-top: 80px; padding-bottom: 40px;">
      <h1 class="mb-4">👨‍🏫 Professor's Class Participation Dashboard</h1>

      <!-- ============================================ -->
      <!-- SECTION 1: CLASS OVERVIEW STATISTICS -->
      <!-- High-level metrics for entire class -->
      <!-- ============================================ -->
      <div class="row mb-4">
        
        <!-- Metric 1: Total Students in Class -->
        <div class="col-md-3">
          <div class="metric-card">
            <div class="metric-icon">👥</div>
            <div class="metric-value">{{ classStats.totalStudents }}</div>
            <div class="metric-label">Total Students</div>
          </div>
        </div>

        <!-- Metric 2: Class Average Rating -->
        <!-- Overall average rating across all students -->
        <div class="col-md-3">
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-value">{{ classStats.classAvgRating.toFixed(2) }}</div>
            <div class="metric-label">Class Avg Rating</div>
          </div>
        </div>

        <!-- Metric 3: Students Meeting Requirements -->
        <!-- Students with ≥3 participations per week on average -->
        <div class="col-md-3">
          <div class="metric-card">
            <div class="metric-icon">✅</div>
            <div class="metric-value">{{ classStats.studentsOnTrack }}</div>
            <div class="metric-label">Students On Track</div>
          </div>
        </div>

        <!-- Metric 4: Students Needing Attention (Alert Card) -->
        <!-- Students below 3 participations per week -->
        <div class="col-md-3">
          <div class="metric-card alert-danger-card">
            <div class="metric-icon">⚠️</div>
            <div class="metric-value">{{ classStats.studentsNeedHelp }}</div>
            <div class="metric-label">Need Attention</div>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- SECTION 2: STUDENT SELECTION INTERFACE -->
      <!-- Search bar and dropdown to select individual student -->
      <!-- ============================================ -->
      <div class="selection-container mb-4">
        <h3 class="mb-3">Select Student to View Details</h3>
        <div class="row">
          
          <!-- Search Input -->
          <!-- Real-time filtering by student name or ID -->
          <div class="col-md-8">
            <div class="input-group">
              <span class="input-group-text">🔍</span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search student by name or ID..."
                v-model="searchQuery"
                @input="filterStudents"
              />
            </div>
          </div>

          <!-- Student Dropdown -->
          <!-- Shows filtered list of students -->
          <div class="col-md-4">
            <select class="form-select" v-model="selectedStudentId" @change="loadStudentData">
              <option value="">-- Select a student --</option>
              <!-- Loop through filtered students -->
              <option 
                v-for="student in filteredStudents" 
                :key="student.id" 
                :value="student.id"
              >
                {{ student.name }} ({{ student.id }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- SECTION 3: SELECTED STUDENT DETAILS -->
      <!-- Shows detailed analytics when a student is selected -->
      <!-- ============================================ -->
      <div v-if="selectedStudent" class="student-details">
        
        <!-- Student Info Header -->
        <div class="student-header mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <!-- Student Name and ID -->
            <div>
              <h2>{{ selectedStudent.name }}</h2>
              <p class="text-muted mb-0">Student ID: {{ selectedStudent.id }}</p>
            </div>
            <!-- Projected Grade Badge (Color-coded) -->
            <!-- Green for A grades, yellow for B, red for C -->
            <div class="grade-badge" :class="getGradeBadgeClass(selectedStudent.projectedGrade)">
              <div class="grade-label">Projected Grade</div>
              <div class="grade-value">{{ selectedStudent.projectedGrade }}</div>
            </div>
          </div>
        </div>

        <!-- ============================================ -->
        <!-- STUDENT PERFORMANCE METRICS -->
        <!-- Four key metrics for the selected student -->
        <!-- ============================================ -->
        <div class="row mb-4">
          
          <!-- Metric 1: Total Participations -->
          <div class="col-md-3">
            <div class="metric-card-sm">
              <div class="metric-icon-sm">🎯</div>
              <div class="metric-value-sm">{{ selectedStudent.totalParticipations }}</div>
              <div class="metric-label-sm">Total Participations</div>
            </div>
          </div>

          <!-- Metric 2: Average Rating -->
          <!-- Student's overall average rating (1-5 scale) -->
          <div class="col-md-3">
            <div class="metric-card-sm">
              <div class="metric-icon-sm">⭐</div>
              <div class="metric-value-sm">{{ selectedStudent.avgRating.toFixed(2) }}</div>
              <div class="metric-label-sm">Avg Rating</div>
            </div>
          </div>

          <!-- Metric 3: Current Week Count -->
          <!-- Number of participations in current week -->
          <div class="col-md-3">
            <div class="metric-card-sm">
              <div class="metric-icon-sm">📅</div>
              <div class="metric-value-sm">{{ selectedStudent.currentWeekCount }}</div>
              <div class="metric-label-sm">This Week</div>
            </div>
          </div>

          <!-- Metric 4: Average Per Week -->
          <!-- Average participations across all weeks -->
          <div class="col-md-3">
            <div class="metric-card-sm">
              <div class="metric-icon-sm">📈</div>
              <div class="metric-value-sm">{{ selectedStudent.avgPerWeek.toFixed(1) }}</div>
              <div class="metric-label-sm">Avg Per Week</div>
            </div>
          </div>
        </div>

        <!-- ============================================ -->
        <!-- ALERT: STUDENT NEEDS ATTENTION -->
        <!-- Shows if student is below 3 participations/week average -->
        <!-- ============================================ -->
        <div v-if="selectedStudent.avgPerWeek < 3" class="alert alert-warning" role="alert">
          <strong>⚠️ Attention:</strong> This student is below the recommended 3 participations per week.
          Current average: {{ selectedStudent.avgPerWeek.toFixed(1) }} participations/week.
        </div>

        <!-- ============================================ -->
        <!-- SECTION 4: STUDENT CHARTS (Chart.js) -->
        <!-- Two side-by-side charts for detailed analysis -->
        <!-- ============================================ -->
        <div class="row">
          
          <!-- Chart 1: Quality Rating Comparison -->
          <!-- Line chart: Student rating vs Class average per week -->
          <div class="col-md-6 mb-4">
            <div class="chart-container">
              <h4 class="mb-3">Quality Rating Comparison</h4>
              <!-- Unique canvas ID per student to avoid chart conflicts -->
              <canvas :id="'qualityChart-' + selectedStudent.id"></canvas>
            </div>
          </div>

          <!-- Chart 2: Weekly Participation Count -->
          <!-- Bar chart with color-coding (green/yellow/red) -->
          <div class="col-md-6 mb-4">
            <div class="chart-container">
              <h4 class="mb-3">Weekly Participation Count</h4>
              <!-- Unique canvas ID per student -->
              <canvas :id="'countChart-' + selectedStudent.id"></canvas>
            </div>
          </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 5: RECENT PARTICIPATION HISTORY -->
        <!-- Table showing detailed participation records -->
        <!-- Data populated by Javier's TA submission feature -->
        <!-- ============================================ -->
        <div class="chart-container">
          <h4 class="mb-3">Recent Participation History</h4>
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Week</th>
                <th>Contribution</th>
                <th>Rating</th>
                <th>Rated By</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loop through student's recent participations -->
              <tr v-for="(participation, index) in selectedStudent.recentParticipations" :key="index">
                <td>{{ participation.date }}</td>
                <td>Week {{ participation.week }}</td>
                <td>{{ participation.contribution }}</td>
                <!-- Color-coded rating badge -->
                <td>
                  <span class="badge" :class="getRatingBadgeClass(participation.rating)">
                    {{ participation.rating }} ⭐
                  </span>
                </td>
                <td>{{ participation.ratedBy }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- NO SELECTION MESSAGE -->
      <!-- Shows when no student is selected yet -->
      <!-- ============================================ -->
      <div v-else class="text-center py-5">
        <i class="text-muted" style="font-size: 3rem;">📋</i>
        <p class="text-muted mt-3">Select a student from the dropdown above to view their participation details.</p>
      </div>
    </div>
  </div>
</template>

<script>
// ============================================
// IMPORTS
// ============================================
import ProfNavBar from "../components/ProfNavBar.vue";
import Chart from 'chart.js/auto'; // Chart.js for data visualization

export default {
  name: "ProfReportDashboard",
  components: { ProfNavBar },
  
  // ============================================
  // DATA
  // Hardcoded test data - will be replaced with API calls
  // ============================================
  data() {
    return {
      // ========== Search & Selection State ==========
      searchQuery: '', // User's search input
      selectedStudentId: '', // Currently selected student ID
      currentWeek: 7, // Current academic week (1-13 typically)
      
      // ========== Class-wide Statistics ==========
      // Summary metrics for the entire class
      classStats: {
        totalStudents: 52, // Total number of students
        classAvgRating: 3.85, // Overall class average rating
        studentsOnTrack: 38, // Students meeting ≥3 participations/week
        studentsNeedHelp: 14 // Students below requirements
      },
      
      // ========== Student List ==========
      // All students in the class (fetched from backend in production)
      allStudents: [
        { id: "S123", name: "John Doe" },
        { id: "S124", name: "Alice Tan" },
        { id: "S125", name: "David Wong" },
        { id: "S126", name: "Siti Rahman" },
        { id: "S127", name: "Michael Chen" },
        { id: "S128", name: "Emily Lim" }
      ],
      filteredStudents: [], // Students after search filter applied
      
      // ========== Individual Student Data ==========
      // Detailed participation data for each student
      // In production, this would be fetched from backend when student is selected
      studentsData: {
        "S123": {
          id: "S123",
          name: "John Doe",
          weeks: [1, 2, 3, 4, 5, 6, 7], // Week numbers
          myAvgRating: [3.5, 4.0, 3.2, 4.5, 4.8, 4.0, 4.2], // Weekly avg ratings
          classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0], // Class avg for comparison
          myWeeklyCount: [4, 5, 2, 6, 3, 4, 2], // Participations per week
          recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Explained recursion concept clearly", rating: 4.5, ratedBy: "TA Smith" },
            { date: "2025-10-05", week: 7, contribution: "Asked insightful question", rating: 3.5, ratedBy: "TA Johnson" },
            { date: "2025-10-01", week: 6, contribution: "Helped classmate debug code", rating: 4.0, ratedBy: "Prof. Lee" }
          ]
        },
        "S124": {
          id: "S124",
          name: "Alice Tan",
          weeks: [1, 2, 3, 4, 5, 6, 7],
          myAvgRating: [4.5, 4.8, 4.6, 4.9, 5.0, 4.7, 4.8],
          classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
          myWeeklyCount: [5, 6, 4, 5, 6, 5, 4],
          recentParticipations: [
            { date: "2025-10-07", week: 7, contribution: "Led group discussion on algorithms", rating: 5.0, ratedBy: "Prof. Lee" },
            { date: "2025-10-06", week: 7, contribution: "Presented excellent solution", rating: 4.8, ratedBy: "Prof. Lee" }
          ]
        },
        "S125": {
          id: "S125",
          name: "David Wong",
          weeks: [1, 2, 3, 4, 5, 6, 7],
          myAvgRating: [2.5, 2.8, 2.0, 3.0, 2.5, 2.2, 2.8],
          classAvgRating: [3.2, 3.8, 3.5, 4.1, 4.0, 3.9, 4.0],
          myWeeklyCount: [1, 2, 1, 2, 1, 1, 2],
          recentParticipations: [
            { date: "2025-10-06", week: 7, contribution: "Basic question about syntax", rating: 2.5, ratedBy: "TA Smith" },
            { date: "2025-10-04", week: 7, contribution: "Participated in discussion", rating: 3.0, ratedBy: "TA Johnson" }
          ]
        }
      },
      
      // ========== Currently Selected Student ==========
      selectedStudent: null, // Will hold computed student data when selected
      
      // ========== Chart Instances ==========
      // Store Chart.js instances for cleanup on component unmount
      charts: {} // Key: chartId (e.g., 'qualityChart-S123'), Value: Chart instance
    };
  },
  
  // ============================================
  // LIFECYCLE HOOKS
  // ============================================
  
  /**
   * Mounted Hook
   * Runs when component is added to DOM
   * - Protects route (only professors can access)
   * - Initializes filtered students list
   */
  mounted() {
    // Route protection: Redirect non-professors to home
    const role = localStorage.getItem("role");
    if (role !== "prof") {
      this.$router.push("/");
    }
    
    // Initialize with full student list
    this.filteredStudents = [...this.allStudents];
  },
  
  /**
   * BeforeUnmount Hook
   * Cleanup before component is removed
   * Destroys all Chart.js instances to prevent memory leaks
   */
  beforeUnmount() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
  },
  
  // ============================================
  // METHODS
  // ============================================
  methods: {
    /**
     * Filter students based on search query
     * Searches both student name and ID (case-insensitive)
     * Updates filteredStudents array in real-time
     */
    filterStudents() {
      const query = this.searchQuery.toLowerCase();
      this.filteredStudents = this.allStudents.filter(student => 
        student.name.toLowerCase().includes(query) || 
        student.id.toLowerCase().includes(query)
      );
    },
    
    /**
     * Load selected student's data and calculate metrics
     * Called when professor selects a student from dropdown
     * - Fetches student data (from hardcoded data, will be API call in production)
     * - Calculates derived metrics (totals, averages, projected grade)
     * - Triggers chart creation after DOM update
     */
    loadStudentData() {
      // Clear selection if dropdown is empty
      if (!this.selectedStudentId) {
        this.selectedStudent = null;
        return;
      }

      // Fetch student data (from hardcoded data, will be API call)
      const data = this.studentsData[this.selectedStudentId];
      if (!data) return;

      // ========== Calculate Derived Metrics ==========
      
      // Total participations across all weeks
      const totalParticipations = data.myWeeklyCount.reduce((sum, count) => sum + count, 0);
      
      // Average rating across all weeks
      const avgRating = data.myAvgRating.reduce((sum, r) => sum + r, 0) / data.myAvgRating.length;
      
      // Average participations per week
      const avgPerWeek = totalParticipations / this.currentWeek;
      
      // Current week's participation count
      const currentWeekCount = data.myWeeklyCount[this.currentWeek - 1] || 0;

      // ========== Calculate Projected Grade ==========
      // Based on participation frequency and quality
      let projectedGrade = "C";
      if (avgPerWeek >= 3 && avgRating >= 4.0) projectedGrade = "A+";
      else if (avgPerWeek >= 3 && avgRating >= 3.5) projectedGrade = "A";
      else if (avgPerWeek >= 2.5) projectedGrade = "B+";
      else if (avgPerWeek >= 2) projectedGrade = "B";

      // Store computed student data
      this.selectedStudent = {
        ...data,
        totalParticipations,
        avgRating,
        avgPerWeek,
        currentWeekCount,
        projectedGrade
      };

      // Wait for DOM to update, then create charts
      this.$nextTick(() => {
        this.createStudentCharts();
      });
    },
    
    /**
     * Create both quality and count charts for selected student
     * - Destroys old charts first to prevent memory leaks
     * - Creates new charts with unique IDs based on student ID
     * - Uses different chart types: line for quality, bar for count
     */
    createStudentCharts() {
      if (!this.selectedStudent) return;

      // Generate unique chart IDs based on student ID
      const qualityChartId = 'qualityChart-' + this.selectedStudent.id;
      const countChartId = 'countChart-' + this.selectedStudent.id;
      
      // ========== Cleanup: Destroy Existing Charts ==========
      if (this.charts[qualityChartId]) {
        this.charts[qualityChartId].destroy();
      }
      if (this.charts[countChartId]) {
        this.charts[countChartId].destroy();
      }

      // ========== Create Quality Rating Chart ==========
      // Line chart comparing student rating vs class average
      const qualityCtx = document.getElementById(qualityChartId);
      if (qualityCtx) {
        this.charts[qualityChartId] = new Chart(qualityCtx, {
          type: 'line', // Line chart for trend visualization
          data: {
            labels: this.selectedStudent.weeks, // X-axis: Week numbers
            datasets: [
              {
                label: this.selectedStudent.name + ' Rating',
                data: this.selectedStudent.myAvgRating,
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
                borderColor: 'rgba(54, 162, 235, 1)', // Blue line
                borderWidth: 3,
                fill: true,
                tension: 0.4 // Smooth curve
              },
              {
                label: 'Class Average',
                data: this.selectedStudent.classAvgRating,
                backgroundColor: 'rgba(255, 159, 64, 0.2)', // Light orange fill
                borderColor: 'rgba(255, 159, 64, 1)', // Orange line
                borderWidth: 3,
                borderDash: [5, 5], // Dashed line for class average
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
                max: 5, // Rating scale 1-5
                ticks: { stepSize: 0.5 },
                title: {
                  display: true,
                  text: 'Rating (1-5)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Week'
                }
              }
            },
            plugins: {
              legend: { display: true, position: 'top' }
            }
          }
        });
      }

      // ========== Create Participation Count Chart ==========
      // Bar chart with color-coding based on performance
      const countCtx = document.getElementById(countChartId);
      if (countCtx) {
        const counts = this.selectedStudent.myWeeklyCount;
        
        // Color-code bars: Green (≥3), Yellow (2), Red (<2)
        const colors = counts.map(count => {
          if (count >= 3) return 'rgba(75, 192, 192, 0.7)'; // Green - meets requirement
          if (count >= 2) return 'rgba(255, 206, 86, 0.7)'; // Yellow - close
          return 'rgba(255, 99, 132, 0.7)'; // Red - needs attention
        });

        this.charts[countChartId] = new Chart(countCtx, {
          type: 'bar', // Bar chart for discrete counts
          data: {
            labels: this.selectedStudent.weeks, // X-axis: Week numbers
            datasets: [{
              label: 'Participations',
              data: counts,
              backgroundColor: colors, // Dynamic colors per bar
              borderColor: colors.map(c => c.replace('0.7', '1')), // Solid border
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }, // Integer steps
                title: {
                  display: true,
                  text: 'Number of Participations'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Week'
                }
              }
            },
            plugins: {
              legend: { display: false } // Hide legend for cleaner look
            }
          }
        });
      }
    },
    
    /**
     * Get Bootstrap badge color class based on rating
     * Used for color-coding ratings in participation history table
     * @param {number} rating - Rating value (1-5)
     * @returns {string} Bootstrap badge class
     */
    getRatingBadgeClass(rating) {
      if (rating >= 4.5) return 'bg-success';  // Excellent (green) - 4.5-5.0
      if (rating >= 4.0) return 'bg-primary';  // Very good (blue) - 4.0-4.4
      if (rating >= 3.5) return 'bg-info';     // Good (light blue) - 3.5-3.9
      if (rating >= 3.0) return 'bg-warning';  // Average (yellow) - 3.0-3.4
      return 'bg-danger';                       // Needs improvement (red) - <3.0
    },
    
    /**
     * Get grade badge styling class
     * Color-codes the projected grade badge
     * @param {string} grade - Projected grade (A+, A, B+, B, C)
     * @returns {string} CSS class name
     */
    getGradeBadgeClass(grade) {
      if (grade.startsWith('A')) return 'grade-excellent'; // Green gradient for A grades
      if (grade.startsWith('B')) return 'grade-good'; // Yellow gradient for B grades
      return 'grade-needs-improvement'; // Red gradient for C and below
    }
  }
};
</script>

<style scoped>
/* ============================================ */
/* CLASS OVERVIEW METRIC CARDS */
/* Top row cards showing class statistics */
/* ============================================ */
.metric-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Special styling for "Need Attention" card */
.alert-danger-card {
  border: 2px solid #dc3545;
}

.metric-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.metric-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
}

/* ============================================ */
/* STUDENT SELECTION SECTION */
/* Search and dropdown container */
/* ============================================ */
.selection-container {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.selection-container h3 {
  color: #333;
  border-bottom: 3px solid #007bff;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

/* ============================================ */
/* SELECTED STUDENT DETAILS SECTION */
/* Container for all student-specific information */
/* ============================================ */
.student-details {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.student-header {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 20px;
}

.student-header h2 {
  margin: 0;
  color: #333;
}

/* ============================================ */
/* GRADE BADGE STYLING */
/* Color-coded badge for projected grade */
/* ============================================ */
.grade-badge {
  padding: 15px 30px;
  border-radius: 12px;
  text-align: center;
  min-width: 150px;
}

/* Green gradient for A grades */
.grade-excellent {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

/* Yellow gradient for B grades */
.grade-good {
  background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
  color: #333;
}

/* Red gradient for C and below */
.grade-needs-improvement {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.grade-label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.grade-value {
  font-size: 2rem;
  font-weight: bold;
}

/* ============================================ */
/* STUDENT METRIC CARDS (Smaller version) */
/* Four metrics below student header */
/* ============================================ */
.metric-card-sm {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  border: 2px solid #e9ecef;
}

.metric-icon-sm {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.metric-value-sm {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.metric-label-sm {
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;
}

/* ============================================ */
/* CHART CONTAINERS */
/* Styling for Chart.js canvas containers */
/* ============================================ */
.chart-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #e9ecef;
}

.chart-container h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
  font-weight: 600;
}

/* ============================================ */
/* TABLE STYLING */
/* Participation history table */
/* ============================================ */
.table {
  margin-top: 15px;
  background: white;
}

.table th {
  background-color: #e9ecef;
  font-weight: 600;
  color: #495057;
}

.table-hover tbody tr:hover {
  background-color: #f1f3f5;
}
</style>