<template>
    <div class="sidebar-wrapper">
        <div class="sidebar transition-delay" :class="{ 'sidebar-open': isOpen }">

            <div class="sidebar-header">
                <NuxtLink to="/" class="app-logo">
                    <div class="app-logo-text">
                        <img src="/hand.png" alt="ClassParti logo" class="hand-icon" />
                        <span class="text-navy fw-bold">ClassParti</span>
                    </div>
                </NuxtLink>

                <!-- Toggle button (For mobile only; hidden on desktop via CSS)-->
                <div class="toggle-btn-container rounded-5">
                    <button @click="toggleSidebar" class="toggle-btn">
                        <i :class="[
                            'sidebar-toggle-icon',
                            isOpen ? 'bi-x-lg' : 'bi-list'
                        ]">
                        </i>
                    </button>
                </div>
            </div>

            <nav>
                <div class="nav-menu">
                    <button v-if="role" class="btn nav-item main-nav-item">
                        <NuxtLink to="/courses" class="nav-link w-100 text-start">
                            <i class="bi bi-journals"></i>
                            <span>Courses</span>
                        </NuxtLink>
                    </button>

                    <button v-if="['prof', 'student'].includes(role) && course_id" class="btn nav-item main-nav-item">
                        <NuxtLink :to="'/courses/' + course_id + '/marketplace'" class="nav-link w-100 text-start">
                            <i class="bi bi-basket"></i>
                            <span>Marketplace</span>
                        </NuxtLink>
                    </button>

                    <button v-if="role === 'prof'" class="btn nav-item main-nav-item">
                        <NuxtLink to="/prof/review" class="nav-link w-100 text-start" active-class="active">
                            <i class="bi bi-card-checklist"></i>
                            <span>Review CP</span>
                        </NuxtLink>
                    </button>
                </div>


            </nav>

            <div class="sidebar-bottom mt-auto">
                <div class="sidebar-user-block main-nav-item">
                    <i class="bi bi-person-circle sidebar-user-avatar"></i>

                    <!-- right side: details -->
                    <div class="sidebar-user-right">
                        <div class="sidebar-user-text mb-0">
                            <strong class="sidebar-user-name">{{ data.full_name }}</strong>
                            <p class="sidebar-user-role mb-0">
                                {{ role === 'prof' ? 'Instructor' : role.charAt(0).toUpperCase() + role.slice(1) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="logout-wrapper">
                    <button v-if="role" class="btn nav-item main-nav-item" @click="clearAuthState">
                        <i class="bi bi-box-arrow-left"></i>
                        <span class="nav-link">Log Out</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- <div v-if="isOpen" class="overlay" @click="isOpen = !isOpen"></div> -->
        <div v-if="isOpen" class="overlay" @click="toggleSidebar"></div>



    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const isOpen = ref(false) // collapse by default on mobile
const { role, userID, clearAuthState } = useAuthState();

// taken from navbar
const route = useRoute();
const course_id = computed(() => route.params.course_id);
const coins = ref(0);

const { data } = await $fetch('/api/user-info', {
    method: 'POST',
    body: {
        user_id: userID.value
    }
})

watch(course_id, async (newCourseId) => {
    if (role.value == 'student' && newCourseId) {
        const { coin_balance } = await $fetch('/api/course-student', {
            method: 'POST',
            body: {
                course_id: newCourseId,
                student_id: userID.value
            }
        })
        coins.value = coin_balance;
    }
}, { immediate: true }); // immediate: true runs the watcher immediately

const toggleSidebar = () => {
    isOpen.value = !isOpen.value
}

</script>

<style scoped>
/* Sidebar Styling */
/* Mobile-First where it is collapsed or basically a floating btton in top-left */

.sidebar {
    position: fixed;
    top: 1rem;
    left: 1rem;

    width: 3.5rem;
    /* Mobile width */
    height: 3.5rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1);
    /* border-radius: 0.5rem; */

    z-index: 999;
    /*higher priority in stacking order of elements */
    transition:
        width 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        top 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        left 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        border-radius 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
    margin-bottom: 0;
}

/* Nuxtlinks or Nav Links styling */
.nav-menu {
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
}

.nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    transition: background-color 0.2s ease;
    white-space: nowrap;
    margin-bottom: 0.5rem;
}

.nav-item:hover {
    background-color: #f5f5f5;
}

.nav-item i {
    min-width: 24px;
    text-align: center;
    font-size: 2rem;
}

.nav-item:first-child {
    margin-top: 1rem;
}

.nav-link {
    font-size: 1.25rem;
    line-height: 1.5rem;
    height: auto;
    text-decoration: none;
    color: #333;
}

.nav-item span {
    opacity: 0;
    margin-left: 1rem;
    color: #333;
    pointer-events: none;
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.logout-wrapper {
    display: none;
    margin-bottom: 1rem;
}

/* This section is for mobile - when sidebar collapse
    - hide app logo
    - hide all main nav items (icons and text) */
.app-logo {
    display: none;
    text-decoration: none;
    color: inherit;
}

.app-logo:visited,
.app-logo:active,
.app-logo:hover,
.app-logo:focus {
    text-decoration: none;
    color: inherit;
}

.main-nav-item {
    display: none;
}

.toggle-btn-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
}

.sidebar:not(.sidebar-open) .toggle-btn-container {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-btn {
    margin: 0 !important;
    position: relative;
    z-index: 1000;
    background: none;
    border: none;
    padding: 0.5rem;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

/* replaced .sidebar-toggle-arrow and .sidebar-toggle-arrow-active
    with .sidebar-toggle-icon */
.sidebar-toggle-icon {
    font-size: 1.25rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

/* overlay (mobile only, when sidebar-open)
    darkens the rest of the page */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 998;
    background: rgba(0, 0, 0, 0.4)
}

/* Mobile expanded state
    we add this class when isOpen === true */
.sidebar-open {
    top: 0;
    left: 0;
    width: 180px;
    height: 100vh;
    border-radius: 0;
    box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1);

    /* flex it back to full column layout */
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    padding-top: 1rem;
}

.sidebar-open .sidebar-user-block {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    column-gap: 0.75rem;
}

.sidebar-open .sidebar-header {
    justify-content: space-between;
    padding: 0 1rem;
    margin-bottom: 1rem;
    height: auto;
}

.sidebar-open .app-logo {
    display: block;
    font-weight: 600;
    text-decoration: none;
    color: inherit;
}

.sidebar-open .main-nav-item {
    display: flex;
}

/* when open on mobile: show text + logout */
.sidebar-open .nav-item span {
    opacity: 1;
    pointer-events: auto;
}

.sidebar-open .logout-wrapper {
    display: block;
}

.sidebar-open nav {
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
    height: 100vh;
    max-height: 100vh;
}

.sidebar-open .toggle-btn-container {
    width: 3rem;
    height: 3rem;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* this is for dashboard, courses, marketplace, review cp, logout button etc */
.sidebar-open .main-nav-item,
.sidebar-open .logout-wrapper .nav-item {
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
}

/* added Icon and styled ClassParti */
.app-logo-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.75rem;
    /* suitable for mobile size */
    line-height: 1.75rem;
    /* keep text tight with icon */
    font-weight: 600;
    margin: 0;
    color: black;
}

.hand-icon {
    width: 2rem;
    height: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    object-fit: contain;
}

/* DESKTOP SIDEBAR
    - whatever is added here will OVERRIDE mobile version */
@media (min-width: 768px) {

    /* force sidebar to always be open */
    .sidebar {
        top: 0;
        left: 0;
        width: 22.5rem;
        height: 100vh;
        border-radius: 0;

        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;

        padding-top: 1rem;
        box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1);
    }

    .sidebar-header {
        justify-content: flex-start;
        padding: 0 1rem;
        margin-bottom: 1rem;
        height: auto;
    }

    .sidebar-user-block {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        column-gap: 0.75rem;
    }

    .sidebar-user-avatar {
        font-size: 3.5rem;
    }

    .sidebar-user-name {
        font-size: 1.6rem;
    }

    .sidebar-user-role {
        font-size: 1.25rem;
    }

    .sidebar-open .toggle-btn-container,
    .toggle-btn-container {
        display: none;
    }

    .app-logo {
        display: block;
        font-weight: 600;
        text-decoration: none;
        color: inherit;
    }

    .app-logo-text {
        font-size: 2.5rem;
        /* change this to control desktop size remember */
        line-height: 2.5rem;
        /* matches line height so scales nicely */
    }

    .main-nav-item {
        display: flex;
    }

    .nav-link {
        font-size: 2rem;
        line-height: 2rem;
        height: auto;
    }

    /* always show labels on desktop */
    .nav-item span {
        opacity: 1;
        pointer-events: auto;
    }

    .logout-wrapper {
        display: block;
    }

    nav {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0 1rem;
        height: 100vh;
        max-height: 100vh;
    }

    /* hide the mobile toggle button on desktop */
    .toggle-btn-container {
        display: none !important;
    }

    /* dont show overlay on desktop even if isOpen === true */
    .overlay {
        display: none !important;
    }
}

/* BELOW IS the USER Account details
    - will solve both desktop and mobil version */

.sidebar-bottom {
    display: flex;
    flex-direction: column;
}

.sidebar-user-block {
    flex-direction: row;
    align-items: center;
    column-gap: 0.75rem;

    border-radius: 0.5rem;
    padding: 1rem 1rem 0 1rem;
    color: #333;
}

/* in desktop and in mobile when sidebar-open, remember main-nav-item is display:flex
    so that means right sidebar-user-block will show regardless
    and then for mobile, it is hidden because when collapsed, the display:none
    remember! */

.sidebar-user-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 0;
}

.sidebar-user-text {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.75rem;
    flex: 1;
    min-width: 0;
    width: 100%;
}

.sidebar-user-name {
    font-weight: 700;
    font-size: clamp(1.125rem, 4.2vw, 1.5rem);
    line-height: 1.2rem;
    margin: 0;
    word-break: break-word;
    color: #333;
}

.sidebar-user-role {
    font-size: clamp(0.95rem, 3.6vw, 1.25rem);
    line-height: 1.2rem;
    margin: 0.15rem 0 0 0;
    color: #6c757d;
    /* chose this color as it matches text-muted (bootstrap class) */
    margin: 0;
}

.sidebar-user-avatar {
    flex: 0 0 auto;
    font-size: clamp(2.5rem, 10vw, 3.5rem);
    line-height: 1;
    color: #000;
}
</style>
