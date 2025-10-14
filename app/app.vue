<template>
    <div class="mw-100" style="min-height: 100vh;" v-if="!['/forbidden', '/', '/auth'].includes(route.path)">
        <Sidebar>
        </Sidebar>

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
.main-content {
    /* padding: 1rem; */
    padding-left: 4rem;
    /* Space for the toggle button */
}
</style>