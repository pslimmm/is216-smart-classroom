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
    height: 100vh;
    /* width: calc(100vw - 5rem);; */
    margin-top: 5rem;
    padding-left: 0;
}

/* this applies to desktop screens */
@media (min-width:768px) {
    .main-content {
        padding-left: 180px;
        height: 100vh;
        margin-top: 0;
    }
}
</style>