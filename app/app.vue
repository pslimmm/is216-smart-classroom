<template>
    <div class="mw-100" style="min-height: 100vh;" v-if="!['/forbidden', '/', '/auth'].includes(route.path)">
        <Navbar />
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
/* space for the sidebar */
.main-content {
    padding-left: 5rem;
    position: relative;
    overflow: hidden;
    margin-top: 5rem;
}
</style>