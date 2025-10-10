<script setup>

const username = ref('');
const password = ref('');

const { role, setRole } = useRole();

const handleLogin = () => {
    if (!username.value || !password.value) {
        alert('Please fill in all fields');
        return;
    }

    let target = null;

    if (username.value == 'prof') {
        setRole('prof');
        target = '/prof';
    } else if (username.value == 'student') {
        setRole('student');
        target = '/student';
    } else if (username.value == 'ta') {
        setRole('ta');
        console.log(role.value);
        target = '/ta';
    } else {
        alert("Invalid username. Try 'prof' or 'student' or 'ta'.");
        return;
    }

    navigateTo(target);
}
</script>

<template>
    <div class="login">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <input v-model="username" type="text" placeholder="Username" />
            <input v-model="password" type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>

        <p>Don't have an account? <NuxtLink to="/register">Register here</NuxtLink>
        </p>

        <NuxtLink to="/" class="back-link">← Back to Welcome</NuxtLink>
    </div>
</template>



<style scoped>
.login {
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

button {
    background-color: teal;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    border-radius: 6px;
}

button:hover {
    background-color: #007777;
}

.back-link {
    display: inline-block;
    margin-top: 15px;
    color: #007777;
    text-decoration: none;
    font-weight: bold;
}

.back-link:hover {
    text-decoration: underline;
}
</style>
