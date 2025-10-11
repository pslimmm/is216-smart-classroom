<script setup>
const { role, setRole, clearRole } = useRole();

// Compute default path based on role
const defaultPath = computed(() => {
    if (!role.value) return '/';
    if (role.value == 'prof') return '/prof';
    if (role.value == 'student') return '/student';
    if (role.value == 'ta') return '/ta';

    return '/'
});

// Logout function
const logout = () => {
    clearRole();
}

</script>

<style scoped>
p.nav-link {
    margin: 0;
    cursor: pointer;
}

.navbar {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    height: 5rem;
}
</style>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container-fluid">
            <NuxtLink :to="defaultPath" class="navbar-brand fw-bold">
                Smart Classroom
            </NuxtLink>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarComponent"
                aria-controls="navbarComponent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarComponent">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="role">
                        <NuxtLink :to="defaultPath" class="nav-link">Dashboard</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="role">
                        <NuxtLink to="/courses" class="nav-link">Courses</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="['prof', 'student'].includes(role)">
                        <NuxtLink to="/marketplace" class="nav-link">Marketplace</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="role == 'prof'">
                        <NuxtLink to="/prof/review" class="nav-link" active-class="active">Review CP</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="role == 'ta'">
                        <NuxtLink to="/ta/submit" class="nav-link" active-class="active">Submit CP</NuxtLink>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item" v-if="['prof', 'ta'].includes(role)">
                        <NuxtLink to="/classreport" class="nav-link">Reports</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="!role">
                        <NuxtLink to="/login" class="nav-link">Log In</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="!role">
                        <NuxtLink to="/register" class="nav-link">Register</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="role">
                        <p @click="logout" class="nav-link">Log Out </p>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

</template>