import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import StudentDashboard from '../pages/StudentDashboard.vue'
import WelcomePage from '../pages/WelcomePage.vue'
import ProfDashboard from '../pages/ProfDashboard.vue'
import TeachingAssistantDashboard from '../pages/TeachingAssistantDashboard.vue'

const routes = [
  { path: '/', component: WelcomePage }, // default route
  { path: '/login', component: LoginPage },
  { path: '/register', component: () => import('../pages/RegisterPage.vue') }, //load only when it is visited
  { path: '/welcome', component: WelcomePage },
  { path: '/student', component: StudentDashboard },
  { path: '/prof', component: ProfDashboard },
  { path: '/prof-report', component: () => import('../pages/ProfReportDashboard.vue') }, //load only when it is visited
  { path: '/ta', component: TeachingAssistantDashboard}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
