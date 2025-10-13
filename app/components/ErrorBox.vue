<script setup>
const showErrorAlert = defineModel('show-error');
const props = defineProps({
    msg: String
})

</script>
<template>
<div class="alert alert-danger alert-dismissible" role="alert">
    <div>{{ props.msg }}</div>
    <button type="button" class="btn-close" @click="showErrorAlert = false"></button>
</div>
</template>