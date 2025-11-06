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
    overflow-x: hidden;
    overflow-y: auto; /* allow section cards to scroll while preventing horizontal bleed */
    min-height: 100dvh;
    padding: clamp(3.5rem, 5vw, 5rem) var(--space-2) var(--space-3);
    background: #E1E7F4;
}

/* this applies to desktop screens */
@media (min-width:768px) {
    .main-content {
        padding: var(--space-3) clamp(2rem, 4vw, 3.5rem) var(--space-3) clamp(18rem, 20vw, 22.5rem);
        background-color: #E1E7F4;
    }
}
</style>
