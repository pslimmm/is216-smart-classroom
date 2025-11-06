<!-- 
Hello, I've changed the Login(Development) from Username -> Email

If you want to LOGIN as
 Professor
 Email: prof@example.com
 
 Teaching Assistant
 Email: ta@example.com
 
 Student
 Email: student@example.com
 
 Password can be anything you want (Need update logic for security later)  
 
 FEEDBACK: I've combined Login and Sign Up together, cause UI-wise I think it is cool. What do yall think? -->

<script setup>
import LoginCard from '~/components/auth/LoginCard.vue';
import RegisterCard from '~/components/auth/RegisterCard.vue';

const isSignUp = ref(false) // Default to "Login" tab instead of "Sign Up"
</script>

<template>
    <div class="auth-wrapper min-screen d-flex justify-content-center align-items-center px-3 py-3">
        <div class="card shadow-lg rounded-5 p-0 auth-card w-100">
            <div class="row g-0 align-items-stretch">
                <div class="col-12 col-lg-6 mx-0 p-4 p-md-5">
                    <LoginCard v-if="!isSignUp" v-model:is-sign-up="isSignUp" />
                    <RegisterCard v-else v-model:is-sign-up="isSignUp" />
                </div>
                <div class="col-lg-6 d-none d-lg-block mx-0 position-relative">
                    <img src="/img/auth-picture.png"
                        width="960"
                        height="1080"
                        class="img-fluid position-absolute top-0 start-0 rounded-end-5 w-100 h-100 object-fit-cover"
                        alt="Students collaborating"
                        loading="lazy"
                        decoding="async">
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.auth-wrapper {
    background-color: #E1E7F4;
}

.auth-card {
    max-width: min(960px, 100%);
}

@media (min-width: 992px) {
    .auth-card {
        margin-inline: auto;
    }
}
</style>
