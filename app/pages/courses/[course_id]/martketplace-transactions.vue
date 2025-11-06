<template>
    <main class="container flex-grow-1 my-5">
        <div class="bg-white rounded-4 shadow-sm px-3 px-md-4 py-4 py-md-5">
            <h1 class="display-1 fw-bold text-navy mb-4 text-break">
                <i class="bi bi-shop-window me-2"></i>
                Marketplace Transactions
            </h1>
            <div class="table-responsive">
                <table class="table align-middle transaction-table" v-if="role == 'student'">
                    <thead class="table-light text-nowrap">
                        <tr class="text-navy">
                            <th scope="col">Date</th>
                            <th scope="col">Item Name</th>
                            <th scope="col" class="text-center">Qty</th>
                            <th scope="col">Item Price</th>
                            <th scope="col">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in transactionHist" :key="`${t.date}-${t.item?.id}`">
                            <td class="py-3 transaction-text">{{ t.date }}</td>
                            <td class="py-3 transaction-text text-break">{{ t.item.item_name }}</td>
                            <td class="py-3 transaction-text text-center">{{ t.qty }}</td>
                            <td class="py-3 transaction-text">
                                <i class="bi bi-coin text-warning me-1"></i>
                                {{ t.item.item_price }}
                            </td>
                            <td class="py-3 transaction-text fw-semibold">
                                <i class="bi bi-coin text-warning me-1"></i>
                                {{ t.qty * t.item.item_price }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-responsive mt-4" v-if="role == 'prof'">
                <table class="table align-middle transaction-table">
                    <thead class="table-light text-nowrap">
                        <tr class="text-navy">
                            <th scope="col">Date</th>
                            <th scope="col">Student</th>
                            <th scope="col">Course</th>
                            <th scope="col">Item Name</th>
                            <th scope="col" class="text-center">Qty</th>
                            <th scope="col">Item Price</th>
                            <th scope="col">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in transactionHist" :key="`${t.date}-${t.item?.id}-${t.student?.id}`">
                            <td class="py-3 transaction-text">{{ t.date }}</td>
                            <td class="py-3 transaction-text text-break">{{ t.student.full_name }}</td>
                            <td class="py-3 transaction-text text-break">{{ t.course.course_name }}</td>
                            <td class="py-3 transaction-text text-break">{{ t.item.item_name }}</td>
                            <td class="py-3 transaction-text text-center">{{ t.qty }}</td>
                            <td class="py-3 transaction-text">
                                <i class="bi bi-coin text-warning me-1"></i>
                                {{ t.item.item_price }}
                            </td>
                            <td class="py-3 transaction-text fw-semibold">
                                <i class="bi bi-coin text-warning me-1"></i>
                                {{ t.qty * t.item.item_price }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

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
} else if (role.value == 'prof') {
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

<style scoped>
.transaction-table th {
    font-size: clamp(0.95rem, 0.85rem + 0.4vw, 1.2rem);
}

.transaction-text {
    font-size: clamp(0.95rem, 0.85rem + 0.5vw, 1.25rem);
}

.transaction-table td {
    vertical-align: middle;
}
</style>