<template>
    <div class="sidebar-wrapper">
        <!-- Toggle button -->
        <button @click="toggleSidebar" class="toggle-btn" :class="isOpen ? 'btn-expanded' : ''">
            <div class="sidebar-toggle-arrow" :class="isOpen ? 'sidebar-toggle-arrow-active' : ''"></div>
        </button>

        <!-- Sidebar -->
        <div class="sidebar" :class="isOpen ? 'sidebar-expanded' : ''">
            <nav>
                <div class="nav-menu">
                    <!-- Main Navigation -->
                    <button class="btn nav-item">
                        <NuxtLink to="/" class="nav-link">
                            <i class="bi bi-house"></i>
                            <span>Home</span>
                        </NuxtLink>
                    </button>

                    <button v-if="role" class="btn nav-item">
                        <NuxtLink :to="'/' + role" class="nav-link">
                            <i class="bi bi-bar-chart-line"></i>
                            <span>Dashboard</span>
                        </NuxtLink>
                    </button>

                    <button v-if="role" class="btn nav-item">
                        <NuxtLink to="/courses" class="nav-link">
                            <i class="bi bi-journals"></i>
                            <span>Courses</span>
                        </NuxtLink>
                    </button>

                    <button v-if="['prof', 'student'].includes(role)" class="btn nav-item">
                        <NuxtLink to="/marketplace" class="nav-link">
                            <i class="bi bi-bag"></i>
                            <span>Marketplace</span>
                        </NuxtLink>
                    </button>

                    <button v-if="role === 'prof'" class="btn nav-item">
                        <NuxtLink to="/prof/review" class="nav-link" active-class="active">
                            <i class="bi bi-card-checklist"></i>
                            <span>Review CP</span>
                        </NuxtLink>
                    </button>

                    <button v-if="role === 'ta'" class="btn nav-item">
                        <NuxtLink to="/ta/submit" class="nav-link" active-class="active">
                            <i class="bi bi-card-checklist"></i>
                            <span>Submit CP</span>
                        </NuxtLink>
                    </button>

                    <!-- Right-aligned items -->
                    <button v-if="['prof', 'ta'].includes(role)" class="btn nav-item">
                        <NuxtLink to="/classreport" class="nav-link">
                            <i class="bi bi-file-earmark-text"></i>
                            <span>Reports</span>
                        </NuxtLink>
                    </button>
                </div>
                <div class="mt-auto logout-wrapper">
                    <button v-if="role" class="btn nav-item" @click="clearAuthState">
                        <span class="nav-link">Log Out</span>
                    </button>
                </div>
            </nav>
        </div>

        <!-- Overlay -->
        <div v-if="isOpen" class="overlay" @click="closeSidebar"></div>
    </div>
</template>

<script setup>
const isOpen = ref(false)
const { role, clearAuthState } = useAuthState();
console.log(role);
const toggleSidebar = () => {
    isOpen.value = !isOpen.value
}

const closeSidebar = () => {
    isOpen.value = false
}

</script>

<style scoped>
.sidebar {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 0;
    left: 0;
    height: 100vh;
    width: 5rem;
    background-color: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
}

.sidebar-wrapper {
    position: relative;
}

.sidebar-wrapper button {
    width: 3rem;
    height: 3rem;

}

.sidebar-expanded {
    width: 250px;
}

.nav-item span {
    visibility: hidden;
    opacity: 0;
    margin-left: 1rem;
    color: #333;
}

.sidebar-expanded .nav-item span {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-toggle-arrow {
    width: 1rem;
    height: 1rem;
    border-right: 0.2rem solid black;
    border-top: 0.2rem solid black;
    transform: translateX(35%) rotate(45deg);
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-toggle-arrow-active {
    transform: rotate(-135deg);
}

.nav-menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
}

.nav-menu:first-of-type {
    margin-top: 4rem;
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
    padding: 0.5rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease;
    white-space: nowrap;
}

.logout-wrapper {
    visibility: hidden;
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

.toggle-btn {
    position: fixed;
    left: 1rem;
    top: 1rem;
    z-index: 1000;
    background: none;
    border: none;
    padding: 0.5rem;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-expanded {
    transform: translateX(200px);
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
}
</style>