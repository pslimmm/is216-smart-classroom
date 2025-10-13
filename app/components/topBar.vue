<script setup>
const { role, clearRole } = useRole();

const handleLogout = () => {
    clearRole();
    console.log("Logged out")
}
</script>

<template>
        <header class="border-bottom bg-white shadow-sm">
            <div class="container d-flex justify-content-between align-items-center py-3">
                <h1 class="h4 text-primary fw-bold mb-0">Smart Classroom</h1>
                <button class="btn btn-outline-primary" @click="handleLogout">Logout</button>
            </div>
        </header>
</template>


