<!-- no longer used, will remove once everything is fixed -->
<script setup>
// const { role, setRole, clearRole } = useRole();
const role = useAuthState();

// // Logout function
// const logout = () => {
//     clearRole();
// }


</script>

<style scoped>
p.nav-link {
    margin: 0;
    cursor: pointer;
}

.navbar {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    height: 5rem;
    background-color: white !important;
    z-index: 998;   
}
.navbar a{
    color: black !important;
}

.app-logo {
    display: flex;
    align-items: center;
}

.app-logo{
    width: fit-content;
    /* transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1); */
    
    text-decoration: none;
    color: black;
    cursor: pointer;
}
.app-logo h2 {
    font-weight: bold;
    margin: 0;
}

</style>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container-fluid">
                <NuxtLink to="/" class="app-logo">
                    <!-- insert logo here -->
                    <h2>ClassParti</h2>
                </NuxtLink>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarComponent"
                aria-controls="navbarComponent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarComponent">
                <!-- <ul class="navbar-nav">
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
                        <NuxtLink to="/auth" class="nav-link">Log In</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="!role">
                        <NuxtLink to="/register" class="nav-link">Register</NuxtLink>
                    </li>
                    <li class="nav-item" v-if="role">
                        <p @click="logout" class="nav-link">Log Out </p>
                    </li>
                </ul> -->
            </div>
        </div>
    </nav>

</template>
