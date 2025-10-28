<template>
    <div class="sidebar-wrapper">


        <!-- Sidebar -->
        <!-- <div class="sidebar" :class="isOpen ? 'sidebar-expanded transition-delay' : ''"> -->
        <!-- <div class="sidebar sidebar-expanded transition-delay"> -->
        <div
            class="sidebar transition-delay"
            :class="{'sidebar-open': isOpen}">

            <div class="app-logo">
                Test
            </div>

            <nav>
                <div class="nav-menu">
                    <!-- Toggle button (For mobile only; hidden on desktop via CSS)-->
                    <div class="nav-item toggle-btn-container">
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
                    <!-- Main Navigation -->
                     <!-- added main-nav-item -->
                    <button v-if="role" class="btn nav-item main-nav-item">
                        <NuxtLink :to="'/' + role" class="nav-link w-100 text-start">
                            <i class="bi bi-bar-chart-line"></i>
                            <span>Dashboard</span>
                        </NuxtLink>
                    </button>

                    <button v-if="role" class="btn nav-item main-nav-item">
                        <NuxtLink to="/courses" class="nav-link w-100 text-start">
                            <i class="bi bi-journals"></i>
                            <span>Courses</span>
                        </NuxtLink>
                    </button>

                    <button v-if="['prof', 'student'].includes(role)" class="btn nav-item main-nav-item">
                        <NuxtLink to="/marketplace" class="nav-link w-100 text-start">
                            <i class="bi bi-bag"></i>
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
                <div class="mt-auto logout-wrapper">
                    <button v-if="role" class="btn nav-item main-nav-item" @click="clearAuthState">
                        <i class="bi bi-box-arrow-left"></i>
                        <span class="nav-link">Log Out</span>
                    </button>
                </div>
            </nav>
        </div>

        <!-- Dark overlay for mobile when sidebar is expanded -->
        <!-- <div v-if="isOpen" class="overlay" @click="isOpen = !isOpen"></div> -->
        <div
            v-if="isOpen"
            class="overlay"
            @click="toggleSidebar"
        ></div>
    </div>
</template>

<script setup>
const isOpen = ref(false) // collapse by default on mobile
const { role, clearAuthState } = useAuthState();

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

    width: 3.5rem;
    height: 3.5rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: white;
    box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;

    z-index: 998;

    /* expand from floating button to full sidebar */
    transition:
        width 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.2s cubic-bezier(0.4,0,0.2,1),
        top 0.2s cubic-bezier(0.4,0,0.2,1),
        left 0.2s cubic-bezier(0.4,0,0.2,1),
        border-radius 0.2s cubic-bezier(0.4,0,0.2,1),
        box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
}

/* nav links styles */
.nav-menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
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
    font-size: 1.5rem;
}

.nav-item:first-child {
    margin-top: 1rem;
}

.nav-link {
    font-size: 1.25rem;
    line-height: 1.25rem;
    height: 1.25rem;
    text-decoration: none;
    color: #333;
}

.nav-item span {
    opacity: 0;
    margin-left: 1rem;
    color: #333;

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
}

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
    margin-left: 200px;
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
    align-items: center;
    justify-content: flex-start;
    padding-top: 1rem;
}

.sidebar-open .app-logo {
    display: block;
    font-weight: 600;
    margin-bottom: 1rem;
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
    width: 90%;
    height: 100vh;
    max-height: 100vh;
}

.sidebar-open .nav-menu {
    width: 100%;
}

.sidebar-open .toggle-btn-container {
    /* fix spacing when expanded */
    width: 3rem;
    height: 3rem;
    align-self: flex-start;
    margin-left: 0;
    margin-bottom: 0.5rem;
}

/* this is for dashboard, courses, marketplace, review cp, logout button etc */
.sidebar-open .main-nav-item,
.sidebar-open .logout-wrapper .nav-item {
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
}

/* === desktop overrides === */
@media (min-width: 768px) {
    /* force sidebar to always be open */
    .sidebar {
        top: 0;
        left: 0;
        width: 180px;
        height: 100vh;
        border-radius: 0;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        padding-top: 1rem;
        box-shadow: 2px 0 3px rgba(0,0,0,0.1);
    }

    .app-logo {
        display: block;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .main-nav-item {
        display: flex;
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
        width: 90%;
        height: 100vh;
        max-height: 100vh;
    }

    .nav-menu {
        width: 100%;
    }

    /* hide the mobile toggle button on desktop */
    .toggle-btn-container {
        display: none;
    }

    /* dont show overlay on desktop even if isOpen === true */
    .overlay {
        display: none !important;
    }
}

</style>