<template>
    <div>

        <!-- <transition enter-active-class="slide-in" leave-active-class="slide-out" @after-leave="afterLeave"> -->
        <transition enter-active-class="slide-in" leave-active-class="slide-out">
            <div v-if="showSuccessAlert" class="position-fixed bottom-0 end-0 m-3 alert alert-success"
                style="z-index: 1050;">
                <div class="d-flex justify-content-between align-items-center">
                    <p class="me-2 mb-0 fs-3 fw-semibold">{{ message }}</p>
                    <button class="btn-close" @click="handleClose"></button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
const showSuccessAlert = defineModel('showSuccessAlert'); //v-model ref
const { message } = defineProps({
    message: { type: String, default: ''}
});

const handleClose = () => {
    showSuccessAlert.value = false;
}
</script>

<style scoped>
.slide-in {
    animation: slideIn 0.4s forwards;
}

.slide-out {
    animation: slideOut 0.4s forwards;
}

@keyframes slideIn {
    from {
        transform: translateX(120%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }

    to {
        transform: translateX(120%);
        opacity: 0;
    }
}
</style>