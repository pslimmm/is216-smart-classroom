<template>
    <div class="mw-100" v-if="!['/forbidden', '/', '/auth'].includes(route.path)">
        <!-- <Navbar /> -->
        <Sidebar />
        <main class="main-content">
            <NuxtPage />
        </main>
    </div>
    <NuxtPage v-else />
</template>

<script setup>
const route = useRoute();
</script>

<style></style>

<style scoped>
/* space for the sidebar
    updated to reflect new sidebar - vinz
    this applies to mobile screens*/
.main-content {
    position: relative;
    overflow: auto; /* changed scroll -> auto for dynamic exp */
    min-height: 100vh;
    padding: 5rem 1rem 2rem;
    background: #f8f9fa;
}

/* this applies to desktop screens */
@media (min-width:768px) {
    .main-content {
        padding: 2rem 0rem 2rem 40rem;
        background: #f8f9fa;
    }
}
</style>
