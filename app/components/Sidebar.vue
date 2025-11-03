<template>
    <div class="sidebar-wrapper">


        <!-- Sidebar -->
        <!-- <div class="sidebar" :class="isOpen ? 'sidebar-expanded transition-delay' : ''"> -->
        <!-- <div class="sidebar sidebar-expanded transition-delay"> -->
        <div class="sidebar transition-delay"
            :class="{'sidebar-open': isOpen}">

            <div class="sidebar-header bg-navy">
                <NuxtLink to="/" class="app-logo">
                    <div class="app-logo-text">
                        <!-- <i class="bi bi-hand-index-thumb-fill hand-icon"></i> -->
                        <img src="/hand.png"
                            alt="ClassParti logo"
                            class="hand-icon"/>
                        <span class="text-white fw-bold" style="font-size: 3.5rem;">ClassParti</span>
                    </div>
                </NuxtLink>

                <!-- Toggle button (For mobile only; hidden on desktop via CSS)-->
                <div class="toggle-btn-container">
                    <button @click="toggleSidebar" class="toggle-btn">
                        <!-- change sidebar-toggle-arrow to bootstrap icon -->
                        <i
                            :class="[
                                'sidebar-toggle-icon',
                                isOpen ? 'bi-x-lg' : 'bi-list'
                            ]">
                        </i>
                    </button>
                </div>
            </div>

            <nav>
                <div class="nav-menu">
                    <!-- Main Navigation -->
                    <!-- added main-nav-item -->
                    <!-- <button v-if="role" class="btn nav-item main-nav-item">
                        <NuxtLink :to="'/' + role" class="nav-link w-100 text-start">
                            <i class="bi bi-bar-chart-line"></i>
                            <span>Dashboard</span>
                        </NuxtLink>
                    </button> -->

                    <button v-if="role" class="btn nav-item main-nav-item">
                        <NuxtLink to="/courses" class="nav-link w-100 text-start">
                            <i class="bi bi-journals"></i>
                            <span>Courses</span>
                        </NuxtLink>
                    </button>

                    <button v-if="['prof', 'student'].includes(role)" class="btn nav-item main-nav-item">
                        <NuxtLink to="/marketplace" class="nav-link w-100 text-start">
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

                    <button v-if="['student'].includes(role)" class="btn nav-item main-nav-item">
                        <NuxtLink :to="'/notes'" class="nav-link w-100 text-start">
                            <i class="bi bi-journal-bookmark-fill"></i>
                            <span>Notes</span>
                        </NuxtLink>
                    </button>
                </div>

                
            </nav>

            <div class="sidebar-bottom mt-auto">
                <div class="sidebar-user-block main-nav-item">
                    <i class="bi bi-person-circle sidebar-user-avatar"></i>

                    <!-- right side: details -->
                    <div class="sidebar-user-right">
                        <div class="sidebar-user-text">
                            <strong class="sidebar-user-name">{{ data.full_name }}</strong>
                            <p class="sidebar-user-role">
                                {{ role === 'prof' ? 'Instructor' : role.charAt(0).toUpperCase() + role.slice(1) }}
                            </p>
                        </div>

                        <!-- coins pill (only for students in a specific course) -->
                        <div
                            v-if="role === 'student' && route.params.course_id"
                            class="sidebar-coin"
                            role="button"
                            title="Marketplace"
                            @click="navigateTo('/courses/' + course_id + '/marketplace')"
                        >
                            <i class="bi bi-coin me-2"></i>
                            <div>{{ coins }}</div>
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
        <div
            v-if="isOpen"
            class="overlay"
            @click="toggleSidebar"
        ></div>

        

    </div>
</template>

<script setup>
//assume cause never import thats why not working
//this works, so verify with Peter if Navbar was importing these....
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
/* sidebar styles */
/* mobile-first where it is collapsed
    or basically a floating button in top-left */
.sidebar {
    position: fixed;
    top: 1rem;
    left: 1rem;

    --sidebar-nav-label-size: clamp(2.45rem, 5vw, 3.1rem);
    --sidebar-nav-link-size: calc(var(--sidebar-nav-label-size) * 1.05);
    --sidebar-nav-icon-size: calc(var(--sidebar-nav-label-size) * 0.7);
    --sidebar-toggle-icon-size: clamp(1.6rem, 3.5vw, 2.1rem);
    --sidebar-logo-text-size: clamp(2.3rem, 5vw, 2.85rem);
    --sidebar-hand-icon-size: clamp(2.1rem, 4.5vw, 2.65rem);
    --sidebar-user-name-size: clamp(1.85rem, 4vw, 2.35rem);
    --sidebar-user-role-size: clamp(1.3rem, 3.5vw, 1.7rem);
    --sidebar-user-text-gap: 0.8rem;
    --sidebar-coin-font-size: clamp(1.1rem, 3.2vw, 1.5rem);
    --sidebar-user-avatar-size: clamp(3rem, 9vw, 3.8rem);

    width: 3.5rem;
    height: 3.5rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: white;
    box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;

    z-index: 999;

    /* expand from floating button to full sidebar */
    transition:
        width 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.2s cubic-bezier(0.4,0,0.2,1),
        top 0.2s cubic-bezier(0.4,0,0.2,1),
        left 0.2s cubic-bezier(0.4,0,0.2,1),
        border-radius 0.2s cubic-bezier(0.4,0,0.2,1),
        box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0.75rem 1rem;
    margin-bottom: 0;
    border-radius: inherit;
    color: #fff;
    gap: 0.75rem;
    overflow: hidden;
}

.sidebar-header .toggle-btn,
.sidebar-header .sidebar-toggle-icon {
    color: inherit;
}

.sidebar:not(.sidebar-open) .sidebar-header {
    justify-content: center;
    padding: 0;
}

/* nav links styles */
.nav-menu {
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    /* background-color: red; */
}

.nav-item {
    /**split from .toggle-btn AND added new below */
    display: flex;
    align-items: center;
    width: 100%;
    transition: background-color 0.2s ease;
    white-space: nowrap;

}

.nav-item:hover {
    background-color: #f5f5f5;
}

.nav-item i {
    min-width: 24px;
    text-align: center;
    font-size: var(--sidebar-nav-icon-size);
}

.nav-item:first-child {
    margin-top: 1rem;
}

.nav-link {
    font-size: var(--sidebar-nav-link-size);
    line-height: 1.15;
    height: auto;
    text-decoration: none;
    color: #333;
}

.nav-item span {
    opacity: 0;
    margin-left: 1rem;
    color: #333;
    font-size: var(--sidebar-nav-label-size);
    line-height: 1.15;

    /**added new */
    pointer-events: none;
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* logout hidden in collapsed mobile mode */
.logout-wrapper {
    display: none;
    margin-bottom: 1rem;
}

/* --- mobile collapsed ---
    when collapsed on mobile, it will
    - hide app logo
    - hide all main nav items (icons and text)*/
.app-logo {
    display: none;
    text-decoration: none;
    color: inherit;
    /* background-color: purple; */
}

/* .app-logo:visited,
.app-logo:active,
.app-logo:hover,
.app-logo:focus {
    text-decoration: none;
    color: inherit;
} */

.main-nav-item {
    display: none;
}

.toggle-btn-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    /* background-color: blue; */
}

/* this is to make toggle btn center relative to sidebar
    when it is collapsed */
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
    cursor: pointer; /**added new */
}

/* replaced .sidebar-toggle-arrow and .sidebar-toggle-arrow-active
    with .sidebar-toggle-icon */
.sidebar-toggle-icon {
    font-size: var(--sidebar-toggle-icon-size);
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* background-color: red; */
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

/* === Mobile expanded state ===
    we add this class when isOpen === true */
.sidebar-open {
    top: 0;
    left: 0;
    width: 180px;
    height: 100vh;
    border-radius: 0;
    box-shadow: 2px 0 3px rgba(0,0,0,0.1);

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
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    height: auto;
    border-radius: 0;
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
    font-size: var(--sidebar-logo-text-size); /* suitable for mobile size */
    line-height: 1.1; /* keep text tight with icon */
    font-weight: 600;
    margin: 0;
    color: black;
}

.hand-icon {
    /* font-size: 2rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center; */
    width: var(--sidebar-hand-icon-size);
    height: var(--sidebar-hand-icon-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    object-fit: contain;
}

/* === desktop overrides === */
@media (min-width: 768px) {
    /* force sidebar to always be open */
    .sidebar {
        top: 0;
        left: 0;
        width: 35rem;
        height: 100vh;
        border-radius: 0;
        /* --sidebar-user-block-padding: 1.75rem 2rem 0 2rem; */
        --sidebar-user-block-radius: 0.75rem;
        --sidebar-user-block-gap: 1.25rem;
        --sidebar-nav-label-size: clamp(2.75rem, calc(0.9vw + 2.5rem), 3.1rem);
        --sidebar-nav-link-size: calc(var(--sidebar-nav-label-size) * 1.08);
        --sidebar-nav-icon-size: calc(var(--sidebar-nav-label-size) * 0.72);
        --sidebar-toggle-icon-size: clamp(1.9rem, calc(0.7vw + 1.6rem), 2.3rem);
        --sidebar-logo-text-size: clamp(2.9rem, calc(0.9vw + 2.5rem), 3.25rem);
        --sidebar-hand-icon-size: clamp(2.5rem, calc(0.9vw + 2.3rem), 3rem);
        --sidebar-user-name-size: clamp(2.2rem, calc(1vw + 1.8rem), 2.85rem);
        --sidebar-user-name-line-height: 1.35;
        --sidebar-user-role-size: clamp(1.6rem, calc(0.7vw + 1.3rem), 2rem);
        --sidebar-user-role-line-height: 1.4;
        --sidebar-user-text-gap: 1rem;
        --sidebar-coin-padding: 0.8rem 1.3rem;
        --sidebar-coin-radius: 2rem;
        --sidebar-coin-font-size: clamp(1.3rem, calc(0.6vw + 1.05rem), 1.7rem);
        --sidebar-user-avatar-size: clamp(3.6rem, calc(2vw + 3rem), 4.6rem);

        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;

        padding: 2rem 2.5rem;
        box-shadow: 2px 0 3px rgba(0,0,0,0.1);
    }

    .sidebar-header {
        justify-content: flex-start;
        padding: 0;
        margin-bottom: 2rem;
        height: auto;
        column-gap: 1.5rem;
    }

    .sidebar-user-block {
        align-items: flex-start;
    }

    /* .sidebar-open .toggle-btn-container,
    .toggle-btn-container {
        display: none;
    } */

    .app-logo {
        display: block;
        font-weight: 600;
        text-decoration: none;
        color: inherit;
    }

    .app-logo-text {
        font-size: var(--sidebar-logo-text-size); /* change this to control desktop size remember */
        line-height: 1.1;
    }

    .main-nav-item {
        display: flex;
        border-radius: 0.75rem;
    }

    .nav-link {
        line-height: 1.2;
        height: auto;
    }

    .nav-item {
        padding: 1.25rem 1.75rem;
        min-height: 5rem;
        border-radius: inherit;
    }

    .nav-menu {
        gap: 1.25rem;
    }

    /* always show labels on desktop */
    .nav-item span {
        opacity: 1;
        pointer-events: auto;
    }

    .logout-wrapper {
        display: block;
        padding: 0 2rem 0;
    }

    nav {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0;
        gap: 1.5rem;
    }

    /* hide the mobile toggle button on desktop */
    .toggle-btn-container {
        display: none !important;
    }

    /* dont show overlay on desktop even if isOpen === true */
    .overlay {
        display: none !important;
    }

    .sidebar-bottom {
        padding: 2rem 2rem 0;
        gap: 1.5rem;
    }

    .hand-icon {
        width: var(--sidebar-hand-icon-size);
        height: var(--sidebar-hand-icon-size);
    }
}

/* for the user summary taken from navbar and xfered here */
/* user div above logout */
.sidebar-bottom {
    display: flex;
    flex-direction: column;
}

.sidebar-user-block {
    /* flex-direction: column;
    border-radius: 0.5rem;
    padding: 1rem 1rem 0 1rem;
    color: #333; */
    flex-direction: row;
    /* align-items: flex-start; */
    align-items: center;
    column-gap: var(--sidebar-user-block-gap, 0.75rem);

    border-radius: var(--sidebar-user-block-radius, 0.5rem);
    padding: var(--sidebar-user-block-padding, 1.75rem 2rem 0 2rem);
    color: #333;
}

/* in desktop and in mobile when sidebar-open, remember main-nav-item is display:flex
    so that means right sidebar-user-block will show regardless
    and then for mobile, it is hidden because when collapsed, the display:none
    remember! */

.sidebar-user-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
}

.sidebar-user-text {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--sidebar-user-text-gap, 0.75rem);
    flex: 1;
    min-width: 0;
    width: 100%;
}

.sidebar-user-name {
    font-weight: 700;
    font-size: var(--sidebar-user-name-size, clamp(1.125rem,4.2vw,1.5rem));
    line-height: var(--sidebar-user-name-line-height, 1.2rem);
    margin: 0;
    word-break: break-word;
    color: #000;
}

.sidebar-user-role {
    font-size: var(--sidebar-user-role-size, clamp(0.95rem,3.6vw,1.25rem));
    line-height: var(--sidebar-user-role-line-height, 1.2rem);
    margin: 0.15rem 0 0 0;
    color: #6c757d; /* chose this color as it matches text-muted (bootstrap class) */
    /* margin: 0; */
}

.sidebar-coin {
    border: 1px solid black;
    padding: var(--sidebar-coin-padding, 0.5rem 0.75rem);
    border-radius: var(--sidebar-coin-radius, 1.5rem);
    display: flex;
    align-items: center;
    width: fit-content;
    margin-bottom: 0.75rem;
    cursor: pointer;
    background-color: #fff;

    align-self: flex-start;
    margin-top: 0.25rem;
    font-size: var(--sidebar-coin-font-size, inherit);
}

.sidebar-coin i {
    font-size: calc(var(--sidebar-nav-icon-size, 2rem) * 0.55);
    line-height: 1;
}

.sidebar-user-avatar {
    flex: 0 0 auto;
    font-size: var(--sidebar-user-avatar-size, clamp(2.5rem,10vw,3.5rem));
    line-height: 1;
    color: #000;
}

</style>
