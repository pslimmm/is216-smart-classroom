<template>
    <main class="container flex-grow-1 my-5">
        <div class="container py-5 px-4 bg-white rounded-4">
            <h1 class="display-1 fw-bold text-navy mb-5">
                <i class="bi bi-shop-window me-2"></i>
                Marketplace Transactions
            </h1>
            <table class="table" v-if="role == 'student'">
                <thead>
                    <tr class="fs-4 text-navy">
                        <th>Date</th>
                        <th>Item Name</th>
                        <th>Item Amount</th>
                        <th>Item Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody class="fs-4">
                    <tr v-for="t of transactionHist">
                        <td class="py-3">{{ t.date }}</td>
                        <td class="py-3">{{ t.item.item_name }}</td>
                        <td class="py-3">{{ t.qty }}</td>
                        <td class="py-3">
                            <i class="bi bi-coin text-warning"></i>
                            {{ t.item.item_price }}
                        </td>
                        <td class="py-3">
                            <i class="bi bi-coin text-warning"></i>
                            {{ t.qty * t.item.item_price }}
                        </td>
                    </tr>
                </tbody>
            </table>
                <table class="table" v-if="role == 'prof'">
                <thead>
                    <tr class="fs-3 text-navy">
                        <th>Date</th>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Item Name</th>
                        <th>Item Amount</th>
                        <th>Item Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody class="fs-4">
                    <tr v-for="t of transactionHist">
                        <td class="py-3">{{ t.date }}</td>
                        <td class="py-3">{{ t.student.full_name }}</td>
                        <td class="py-3">{{ t.course.course_name }}</td>
                        <td class="py-3">{{ t.item.item_name }}</td>
                        <td class="py-3">{{ t.qty }}</td>
                        <td class="py-3">
                            <i class="bi bi-coin text-warning"></i>
                            {{ t.item.item_price }}
                        </td>
                        <td class="py-3">
                            <i class="bi bi-coin text-warning"></i>
                            {{ t.qty * t.item.item_price }}
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </main>

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