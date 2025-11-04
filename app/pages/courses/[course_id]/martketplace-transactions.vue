<template>
    <h1>Marketplace Transactions</h1>
    <table class="table" v-if="role == 'student'">
        <thead>
            <tr>
                <th>Date</th>
                <th>Item Name</th>
                <th>Item Amount</th>
                <th>Item Price</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="t of transactionHist">
                <td>{{ t.date }}</td>
                <td>{{ t.item.item_name }}</td>
                <td>{{ t.qty }}</td>
                <td>{{ t.item.item_price }}</td>
                <td>{{ t.qty * t.item.item_price }}</td>
            </tr>
        </tbody>
    </table>
        <table class="table" v-if="role == 'prof'">
        <thead>
            <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Course</th>
                <th>Item Name</th>
                <th>Item Amount</th>
                <th>Item Price</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="t of transactionHist">
                <td>{{ t.date }}</td>
                <td>{{ t.student.full_name }}</td>
                <td>{{ t.course.course_name }}</td>
                <td>{{ t.item.item_name }}</td>
                <td>{{ t.qty }}</td>
                <td>{{ t.item.item_price }}</td>
                <td>{{ t.qty * t.item.item_price }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script setup>
const route = useRoute();
const course_id = route.params.course_id;
const { role, userID } = useAuthState();

const transactionHist = ref([]);

if (role.value == 'student') {
    const { data } = await $fetch('/api/get-marketplace-history', {
        method: 'POST',
        body: {
            course_id,
            student_id: userID.value
        }
    })
    transactionHist.value = data;
} else if (role.value == 'prof'){
        const { data } = await $fetch('/api/get-marketplace-history', {
        method: 'POST',
        body: {
            course_id,
            prof_id: userID.value
        }
    })
    transactionHist.value = data;

}

</script>