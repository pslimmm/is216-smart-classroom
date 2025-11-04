<template>
    <div>

        <transition enter-active-class="slide-in" leave-active-class="slide-out" @after-leave="afterLeave">
            <div v-if="showErrorAlert" class="position-fixed top-0 end-0 m-3 alert alert-danger"
                style="z-index: 1050;">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0 fw-bold">Error</h6>
                    <button class="btn-close" @click="showErrorAlert = false"></button>
                </div>
                <p class="mb-0">{{ message }}</p>
            </div>
        </transition>
    </div>
</template>

<script setup>
const showErrorAlert = defineModel('showErrorAlert');
const props = defineProps({
    showErrorAlert: Boolean,
    message: String
})
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
