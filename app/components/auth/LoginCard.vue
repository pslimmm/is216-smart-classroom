<script setup>
import AlertBox from './AlertBox.vue';

// for dynamic updates/toggling
const isSignUp = defineModel("is-sign-up");

// for setting app wide session
const { setAuthState } = useAuthState();

// to set the alert type
const alertType = ref('');

// show alert if true
const showAlert = ref(false);

// show error alert if true
const errorMsg = ref('');

const showErrorBox = (msg) => {
    showAlert.value = true;
    errorMsg.value = msg;
    alertType.value = 'alert-danger';
}

// show password in plaintext
const showPassword = ref(false);

// For log in form submission
const formData = ref({
    email: '',
    password: '',
})

const handleSubmit = async () => {
    if (!formData.value.email || !formData.value.password) {
        showErrorBox('Please fill in all fields');
        return;
    }

    const response = await $fetch(
        '/api/auth/login', {
        method: 'POST',
        body: unref(formData)
    }
    );
    
    if (!response.ok) {
        showErrorBox(response.error);
    } else {
        setAuthState(response.session, response.role, response.user_id);
        navigateTo('/' + response.role);
    }

}
</script>

<template>
    <h1 class="fw-bold text-center">Welcome Back</h1>
    <p class="text-center text-muted fs-4">Login to your account</p>
    <form @submit.prevent="handleSubmit">
        <!-- email -->
        <div class="mb-3">
            <label for="loginEmail" class="form-label fw-semibold fs-1">Email</label>
            <input v-model="formData.email" type="email" class="form-control fs-2" id="loginEmail"
                placeholder="you@example.com" required />
        </div>
        <!-- password -->
        <div class="mb-3">
            <label for="loginPassword" class="form-label fw-semibold fs-1">Password</label>
            <div class="input-group">
                <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" class="form-control fs-2"
                    id="loginPassword" required />
                <button type="button" class="inputButton" @click="showPassword = !showPassword">
                    <i v-if="showPassword" class="bi bi-eye fs-4"></i>
                    <i v-else class="bi bi-eye-slash fs-4"></i>
                </button>
            </div>
        </div>
        <button type="submit" class="btn btn-navy w-100 mt-3 fs-2">
            Log In
        </button>
        <div class="text-center mt-4 pt-3 border-top fs-4">
            <p>Don't have an account?
                <a role="button" @click="isSignUp = true"
                    class="link-body-emphasis link-offset-2 link-underline-opacity-75 link-underline-opacity-25-hover">
                    Sign up
                </a>
            </p>
        </div>
    </form>
    <AlertBox v-if="showAlert" v-model:show-alert="showAlert" :alert-type="alertType">
        <template v-slot:msg>
            <div class="fs-4">{{ errorMsg }}</div>
        </template>
    </AlertBox>


</template>

<style scoped>
.inputButton {
    border: var(--bs-border-width) solid var(--bs-border-color);
    background-color: var(--bs-body-bg);
    color: var(--bs-body-color);
    border-left: 0;
}

.input-group input {
    border-right: 0;
}
</style>