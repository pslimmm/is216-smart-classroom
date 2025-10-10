import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import StudentDashboard from '../pages/StudentDashboard.vue'
import WelcomePage from '../pages/WelcomePage.vue'
import ProfDashboard from '../pages/ProfDashboard.vue'
import TeachingAssistantDashboard from '../pages/TeachingAssistantDashboard.vue'
import SubmitPage from '../pages/SubmitPage.vue'
import ReviewPage from '../pages/ReviewPage.vue'
import ApprovedPage from '../pages/ApprovedPage.vue'
import RejectedPage from '../pages/RejectedPage.vue'


const routes = [
  { path: '/', component: WelcomePage }, // default route aka welcomepage
  { path: '/login', component: LoginPage },
  { path: '/register', component: () => import('../pages/RegisterPage.vue') }, //load only when it is visited
  { path: '/student', component: StudentDashboard },
  { path: '/prof', component: ProfDashboard },
  { path: '/prof-report', component: () => import('../pages/ProfReportDashboard.vue') }, //load only when it is visited
  { path: '/ta', component: TeachingAssistantDashboard},
  { path: '/ta/submit', component: SubmitPage},
  { path: '/prof/review', component: ReviewPage},
  { path: '/prof/review/approved', component: ApprovedPage},
  { path: '/prof/review/rejected', component: RejectedPage}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
