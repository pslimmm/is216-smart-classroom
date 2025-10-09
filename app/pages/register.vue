<script setup>
const username = ref('');
const email = ref('');
const password = ref('');
const { role, setRole } = useRole();

const handleRegister = () => {
    if (!username || !email || !password || !role) {
        alert("Please fill in all fields");
        return;
    }

    // for now: simulate registration (later, use an API or smth)
    const user = {
        username: username,
        email: email,
        password: password,
        role: role
    };

    console.log("✅ Registered user:", user);

    alert("🎉 Registration successful! Redirecting to login...");
    navigateTo("/login");
}
</script>

<template>
    <div class="register">
        <h1>Register</h1>

        <form @submit.prevent="handleRegister">
            <input v-model="username" type="text" placeholder="Username" />
            <input v-model="email" type="email" placeholder="Email" />
            <input v-model="password" type="password" placeholder="Password" />
            <select v-model="role">
                <option disabled value="">Select role</option>
                <option value="student">Student</option>
                <option value="prof">Professor</option>
                <option value="ta">Teaching Assistant</option>
            </select>
            <button type="submit">Register</button>
        </form>

        <p>Already have an account? <NuxtLink to="/login">Login</NuxtLink>
        </p>
    </div>
</template>

<style scoped>
.register {
    max-width: 400px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input,
select {
    padding: 8px;
    font-size: 1rem;
}

button {
    padding: 10px;
    background-color: teal;
    color: white;
    border: none;
    cursor: pointer;
}
</style>
