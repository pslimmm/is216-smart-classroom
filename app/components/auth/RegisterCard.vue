<script setup>
import AlertBox from './AlertBox.vue';

// for dynamic updates/toggling
const isSignUp = defineModel("is-sign-up");

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

// show success alert if true
const successMsg = ref('');

const showSuccessBox = (msg) => {
    showAlert.value = true;
    successMsg.value = msg;
    alertType.value = 'alert-success';
}

// show password in plaintext
const showPassword = ref(false);
const showCfmPassword = ref(false);

// For Sign up form submission
const formData = ref({
    fullName: '',
    email: '',
    password: '',
    role: '',
    cfmPassword: ''
})


const handleSubmit = async () => {
    if (!formData.value.email || !formData.value.password) {
        showErrorBox('Please fill in all fields');
        return;
    }
    if (formData.value.cfmPassword != formData.value.password) {
        showErrorBox("Passwords don't match!");
        return;
    }

    const response = await $fetch(
        '/api/auth/register', {
        method: 'POST',
        body: unref(formData)
    }
    );
    if (!response.ok) {
        if (response.error.statusCode == 422) {
            showErrorBox("Account already exists, try logging in instead");
            return;
        } else {
            showError(response.error);
            return;
        }
    } else {
        formData.value = {
            fullName: '',
            email: '',
            password: '',
            role: '',
            cfmPassword: ''
        };
        // isSignUp.value = false;
        showSuccessBox("Account created successfully! Please log in.");
    }

}
</script>

<template>
    <h1 class="fw-bold text-center">Create your account</h1>
    <p class="text-center text-muted fs-5">Sign up for an account</p>
    <form @submit.prevent="handleSubmit">
        <!-- full name -->
        <div class="mb-1">
            <label for="signupName" class="form-label fw-semibold fs-5">Full Name</label>
            <input v-model="formData.fullName" type="text" class="form-control fs-5" id="signupName" placeholder="John Doe"
                required />
        </div>
        <!-- email -->
        <div class="mb-1">
            <label for="signupEmail" class="form-label fw-semibold fs-5">Email</label>
            <input v-model="formData.email" type="email" class="form-control fs-5" id="signupEmail"
                placeholder="you@example.com" required />
        </div>
        <!-- password -->
        <div class="mb-1">
            <label for="signupPassword" class="form-label fw-semibold fs-5">Password</label>
            <div class="input-group">
                <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" class="form-control fs-5"
                    id="signupPassword" minlength="8" required />
                <button type="button" class="inputButton" @click="showPassword = !showPassword">
                    <i v-if="showPassword" class="bi bi-eye fs-5"></i>
                    <i v-else class="bi bi-eye-slash fs-5"></i>
                </button>
            </div>
        </div>
        <!-- cfm password -->
        <div class="mb-1">
            <label for="cfmPassword" class="form-label fw-semibold fs-5">Confirm Password</label>
            <div class="input-group">
                <input v-model="formData.cfmPassword" :type="showCfmPassword ? 'text' : 'password'" class="form-control fs-5"
                    id="signupPassword" minlength="8" required />
                <button type="button" class="inputButton" @click="showCfmPassword = !showCfmPassword">
                    <i v-if="showCfmPassword" class="bi bi-eye fs-5"></i>
                    <i v-else class="bi bi-eye-slash fs-5"></i>
                </button>
            </div>
        </div>
        <!-- role -->
        <div class="mb-1">
            <label for="signupRole" class="form-label fs-5">I am a...</label>
            <select v-model="formData.role" class="form-select fs-5" id="signupRole" required>
                <option selected disabled value="">Choose...</option>
                <option value="student">Student</option>
                <option value="prof">Professor</option>
                <option value="ta">Teaching Assistant</option>
            </select>
        </div>

        <button type="submit" class="btn btn-navy w-100 mt-3 fs-5">
            Create Account
        </button>

        <div class="text-center mt-4 pt-3 border-top fs-5">
            <p>
                Already have an account?
                <a role="button" @click="isSignUp = false"
                    class="link-body-emphasis link-offset-2 link-underline-opacity-75 link-underline-opacity-25-hover">
                    Log in
                </a>
            </p>
        </div>
    </form>

    <AlertBox v-if="showAlert" v-model:show-alert="showAlert" :alert-type="alertType">
        <template v-slot:msg>
            <div class="fs-5">{{ errorMsg || successMsg }}</div>
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