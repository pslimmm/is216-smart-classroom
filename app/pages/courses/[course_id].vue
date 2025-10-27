<script setup>

const { role } = useAuthState();
</script>
<template>
    <ClassReport v-if="['prof', 'ta'].includes(role)"/>
    <StudentDashboard v-else-if="role == 'student'"/>
</template>