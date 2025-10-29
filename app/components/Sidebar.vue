<template>
    <div class="sidebar-wrapper">


        <!-- Sidebar -->
        <div class="sidebar" :class="isOpen ? 'sidebar-expanded transition-delay' : ''">

            <div class="app-logo">

            </div>
            <nav>
                <div class="nav-menu">
                    <!-- Toggle button -->
                    <div class="nav-item toggle-btn-container">
                        <button @click="toggleSidebar" class="toggle-btn">
                            <div class="sidebar-toggle-arrow" :class="isOpen ? 'sidebar-toggle-arrow-active' : ''">
                            </div>
                        </button>
                    </div>
                    <!-- Main Navigation -->
                    <button v-if="role && role !== 'student'" class="btn nav-item">
                        <NuxtLink :to="'/' + role" class="nav-link w-100 text-start">
                            <i class="bi bi-bar-chart-line"></i>
                            <span>Dashboard</span>
                        </NuxtLink>
                    </button>

                    <button v-if="role" class="btn nav-item">
                        <NuxtLink to="/courses" class="nav-link w-100 text-start">
                            <i class="bi bi-journals"></i>
                            <span>Courses</span>
                        </NuxtLink>
                    </button>

                    <button v-if="['prof', 'student'].includes(role)" class="btn nav-item">
                        <NuxtLink to="/marketplace" class="nav-link w-100 text-start">
                            <i class="bi bi-bag"></i>
                            <span>Marketplace</span>
                        </NuxtLink>
                    </button>

                    <button v-if="role === 'prof'" class="btn nav-item">
                        <NuxtLink to="/prof/review" class="nav-link w-100 text-start" active-class="active">
                            <i class="bi bi-card-checklist"></i>
                            <span>Review CP</span>
                        </NuxtLink>
                    </button>

                </div>
                <div class="mt-auto logout-wrapper">
                    <button v-if="role" class="btn nav-item" @click="clearAuthState">
                        <i class="bi bi-box-arrow-left"></i>
                        <span class="nav-link">Log Out</span>
                    </button>
                </div>
            </nav>
        </div>
        <div v-if="isOpen" class="overlay" @click="isOpen = !isOpen"></div>
    </div>
</template>

<script setup>
const isOpen = ref(false)
const { role, clearAuthState } = useAuthState();

const toggleSidebar = () => {
    isOpen.value = !isOpen.value
}

</script>

<style scoped>
/* sidebar styles */
.sidebar {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: left;
    top: 0;
    left: 0;
    height: calc(100vh - 5rem);
    width: 5rem;
    margin-top: 5rem;
    background-color: white;
    box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1);
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 998;
}

.sidebar-wrapper button {
    width: 3rem;
    height: 3rem;
    margin-left: 1rem;
}

.sidebar-expanded {
    width: 200px;
    align-items: center;
}

.sidebar-expanded button,
.sidebar-expanded .toggle-btn-container {
    margin-left: 0;
}

/* nav links styles */
.nav-menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
}

.nav-item,
.toggle-btn {
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
}

.nav-item span {
    /* visibility: hidden; */
    opacity: 0;
    margin-left: 1rem;
    color: #333;
}

.sidebar-expanded .nav-item span {
    /* visibility: visible; */
    opacity: 1;
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-expanded nav {
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 100vh;
    max-height: 100vh;
}

.sidebar-expanded .nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    transition: background-color 0.2s ease;
    white-space: nowrap;
}

.logout-wrapper {
    visibility: hidden;
    margin-bottom: 1rem;
}

.sidebar-expanded .logout-wrapper {
    visibility: visible;
}

.nav-link {
    font-size: 1.25rem;
    line-height: 1.25rem;
    height: 1.25rem;
    text-decoration: none;
    color: #333;
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

.toggle-btn-container {
    width: 3rem !important;
    height: 3rem;
    margin-left: 1rem;
}


.toggle-btn {
    margin: 0 !important;
    position: relative;
    z-index: 1000;
    background: none;
    border: none;
    padding: 0.5rem;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-toggle-arrow {
    position: absolute;
    left: 0.65rem;
    top: 1rem;
    width: 1rem;
    height: 1rem;
    border-right: 0.2rem solid black;
    border-top: 0.2rem solid black;
    transform: translateX(35%) rotate(45deg);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-toggle-arrow-active {
    transform: rotate(-135deg);
}

.overlay {
    position: fixed; 
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 998;
    margin-left: 200px;
}
</style>