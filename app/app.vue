<template>
    <div class="mw-100" style="min-height: 100vh;" v-if="!['/forbidden', '/', '/auth'].includes(route.path)">
        <Sidebar>
        </Sidebar>

        <main class="main-content">
            <Navbar />
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
}
</style>