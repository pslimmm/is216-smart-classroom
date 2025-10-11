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

// Not sure if we still need this - Vinz
const username = ref('');
const password = ref('');

const { role, setRole } = useRole();
const activeTab = ref('login') // Default to "Login" tab instead of "Sign Up"

// For Sign up form submission
const formData = ref({
    fullName: '',
    email: '',
    password: '',
    role: '',
})

        console.log(role)
// Submit form
const handleSubmit = () => {
    if (activeTab.value === 'login') {
        const username = formData.value.email
        const password = formData.value.password

        if (!username || !password) {
            alert('Please fill in all fields')
            return
        }

        // Mock login, replace later
        // Last time was username, now change to email
        if (username === 'prof@example.com') {
            setRole('prof')
            return navigateTo('/prof')
        } else if (username === 'student@example.com') {
            setRole('student')
            return navigateTo('/student')
        } else if (username === 'ta@example.com') {
            setRole('ta')
            return navigateTo('/ta')
        } else {
            alert("Invalid login. Try 'prof@example.com', 'student@example.com', or 'ta@example.com'")
        }
    } else {
        // Signup logic, need update as this is a mocked sign up (Directly setRole and navigate)
        const { fullName, email, password, role } = formData.value

        if (!fullName || !email || !password || !role) {
            alert('Please fill in all fields')
            return
        }

        setRole(role)
        return navigateTo(`/${role}`)
    }
}

// For the text below Smart Classroom
// "Sign in to access your dashboard" OR "Create an account to get started"
const subtitle = computed(() => {
    return activeTab.value === 'login' ? 'Sign in to access your dashboard' : 'Create an account to get started'
})

</script>

<template>
    <div class="min-vh-100 d-flex justify-content-center align-items-center px-3 py-5 bg-light">
        <div class="card shadow-lg" style="max-width: 500px; width:100%">

            <div class="card-header text-center bg-white border-bottom-0">
                <div class="mb-3 d-flex justify-content-center">
                    <!-- Insert Smart Classroom Icon later -->
                </div>
                <h3 class="mb-1">Smart Classroom</h3>
                <p class="text-muted small"> {{ subtitle }}</p>
            </div>

            <div class="card-body">

                <!-- Tab "Login" or "Sign Up" Variation #1 -->

                <!-- <div class="d-flex justify-content-around mb-4">
                    <button class="btn" :class="activeTab === 'login' ? 'btn-primary' : 'btn-outline-primary'"
                        @click="activeTab = 'login'">
                        Login
                    </button>
                    <button class="btn" :class="activeTab === 'signup' ? 'btn-primary' : 'btn-outline-primary'"
                        @click="activeTab = 'signup'">
                        Sign Up
                    </button>
                </div> -->

                <!-- Tab "Login" or "Sign Up" Variation #2-->
                <!-- Vinz prefers this one, what yall think? -->

                <ul class="nav nav-tabs mb-4" id="authTabs" role="tablist">
                    <li class="nav-item">
                        <button class="btn" :class="activeTab === 'login' ? 'btn-primary' : 'btn-outline-primary'"
                            @click="activeTab = 'login'" style="border-radius: 0;">
                            Login
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="btn" :class="activeTab === 'signup' ? 'btn-primary' : 'btn-outline-primary'"
                            @click="activeTab = 'signup'" style="border-radius: 0;">
                            Sign Up
                        </button>
                    </li>
                </ul>

                <!-- This one is for the Login or Sign Up inputfields! -->
                <form @submit.prevent="handleSubmit">
                    <!-- Login tab fields -->
                    <div v-if="activeTab === 'login'">
                        <div class="mb-3">
                            <label for="loginEmail" class="form-label">Email</label>
                            <input v-model="formData.email" type="email" class="form-control" id="loginEmail"
                                placeholder="you@example.com" required />
                        </div>
                        <div class="mb-3">
                            <label for="loginPassword" class="form-label">Password</label>
                            <input v-model="formData.password" type="password" class="form-control" id="loginPassword"
                                required />
                        </div>
                    </div>

                    <!-- Sign Up tab fields -->
                    <div v-else>
                        <div class="mb-3">
                            <label for="signupName" class="form-label">Full Name</label>
                            <input v-model="formData.fullName" type="text" class="form-control" id="signupName"
                                placeholder="John Doe" required />
                        </div>
                        <div class="mb-3">
                            <label for="signupEmail" class="form-label">Email</label>
                            <input v-model="formData.email" type="email" class="form-control" id="signupEmail"
                                placeholder="you@example.com" required />
                        </div>
                        <div class="mb-3">
                            <label for="signupPassword" class="form-label">Password</label>
                            <input v-model="formData.password" type="password" class="form-control" id="signupPassword"
                                required />
                        </div>
                        <div class="mb-3">
                            <label for="signupRole" class="form-label">I am a...</label>
                            <select v-model="formData.role" class="form-select" id="signupRole" required>
                                <option selected disabled value="">Choose...</option>
                                <option value="student">Student</option>
                                <option value="prof">Professor</option>
                                <option value="ta">Teaching Assistant</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 mt-3">
                        {{ activeTab === 'login' ? 'Sign In' : 'Create Account' }}
                    </button>

                    <div class="text-center mt-3">
                        <NuxtLink to="/">← Back to Homepage</NuxtLink>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>