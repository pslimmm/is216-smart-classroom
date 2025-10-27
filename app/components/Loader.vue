<template>
    <Transition name="fade">
        <div v-if="0 == 1" class="container wrapper">
            <div class="loader"></div>
        </div>
    </Transition>
</template>
<script setup>
const loading = ref(false)

// Show loading on route changes
const router = useRouter()
const route = useRoute()

router.beforeEach((to, from) => {
    loading.value = true
})

router.afterEach(() => {
    // Small delay for smooth transition
    setTimeout(() => {
        loading.value = false
    }, 300)
})

</script>
<style scoped>
.wrapper {
    position: fixed;
    background-color: white;
    width: 100vw;
    height: 100vh;
    padding-top: 5rem;
    padding-left: 5rem;
    z-index: 997;
    overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
    opacity: 1;
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;

}

.loader {
    transform: translateX(-150%) translateY(-150%);
    top: 50%;
    left: 50%;
    width: 40px;
    height: 26px;
    --c: no-repeat linear-gradient(#000 0 0);
    background:
        var(--c) 0 100%,
        var(--c) 50% 100%,
        var(--c) 100% 100%;
    background-size: 8px calc(100% - 4px);
    position: relative;
}

.loader:before {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #000;
    left: 0;
    top: 0;
    animation:
        l3-1 1.5s linear infinite alternate,
        l3-2 0.75s cubic-bezier(0, 200, .8, 200) infinite;
}

@keyframes l3-1 {
    100% {
        left: calc(100% - 8px)
    }
}

@keyframes l3-2 {
    100% {
        top: -0.1px
    }
}
</style>