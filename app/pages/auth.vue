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

const isSignUp = ref(false) // Default to "Login" tab instead of "Sign Up"
</script>

<template>
    <div class="min-vh-100 d-flex justify-content-center align-items-center px-3 py-5 bg-light">
        <div class="card shadow-lg rounded-5 p-0" style="width: 80%">
            <div class="row g-0">
                <div class="col-md-6 col-sm-12 mx-0 p-5">
                            <LoginCard v-if="!isSignUp" v-model:is-sign-up="isSignUp"/>
                            <RegisterCard v-else v-model:is-sign-up="isSignUp"/>
                </div>
                <div class="col-6 d-md-block d-none mx-0 position-relative">
                    <img src="/img/auth-picture.png"
                        class="img-fluid position-absolute top-0 start-0 rounded-end-5 w-100 h-100 object-fit-cover">
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>

</style>