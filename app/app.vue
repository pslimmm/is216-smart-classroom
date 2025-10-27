<template>
    <div class="mw-100" v-if="!['/forbidden', '/', '/auth'].includes(route.path)">
        <Navbar />
        <Sidebar />
        <main class="main-content">
            <Loader />
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
    overflow: scroll;
    height: calc(100vh - 5rem);
    /* width: calc(100vw - 5rem);; */
    margin-top: 5rem;
}
</style>