<script setup>
const showAlert = defineModel('show-alert');
const props = defineProps({
    'msg' : String,
    'alertType': String
})
</script>
<template>
<div class="alert alert-dismissible" :class="props.alertType" role="alert">
    <div>{{ props.msg }}</div>
    <button type="button" class="btn-close" @click="showAlert = false"></button>
</div>
</template>