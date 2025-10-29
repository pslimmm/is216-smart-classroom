<template>
    <div class="mw-100" v-if="!['/forbidden', '/', '/auth'].includes(route.path)">
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
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 5rem);
    max-width: 100vw;
    margin-top: 5rem;
}
</style>