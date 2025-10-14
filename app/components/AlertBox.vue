<script setup>
const showAlert = defineModel('show-alert');
const props = defineProps({
    'alertType': String
})
</script>
<template>
<div class="alert alert-dismissible" :class="props.alertType" role="alert">
    <slot name="msg"></slot>
    <button type="button" class="btn-close" @click="showAlert = false"></button>
</div>
</template>