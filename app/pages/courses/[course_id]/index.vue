<script setup>

const { role } = useAuthState();
const route = useRoute();
</script>
<template>
    <ClassReport v-if="['prof', 'ta'].includes(role)"/>
    <StudentDashboard v-else-if="role == 'student'"/>
</template>

<style scoped>
</style>