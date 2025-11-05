<script setup>
import ProfTaDashboard from '~/components/proftadashboard/ProfTaDashboard.vue';
import StudentDashboard from '~/components/StudentDashboard.vue';

const { role } = useAuthState();
const route = useRoute();
</script>
<template>
    <ProfTaDashboard v-if="['prof', 'ta'].includes(role)"/>
    <StudentDashboard v-else-if="role == 'student'"/>
</template>

<style scoped>
</style>