<template>
    <ErrorAlert :message="errorMsg" v-model:showErrorAlert="showErrorAlert" />
    <div class="overlay">
        <div class="modal-wrapper bg-white rounded-5 p-4 m-3">
            <div class="d-flex flex-row justify-content-between align-items-center mb-3">
                <h3 class="text-navy fs-1">Your Cart</h3>
                <button class="btn btn-close" @click="showCartModal = false"></button>
            </div>
            <div class="table-responsive" style="max-height: 350px; overflow-y: scroll;">
                <table class="table fs-5">
                    <thead class="sticky-top">
                        <tr>
                            <th>Item</th>
                            <th>Item Price</th>
                            <th>Item Count</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-if="cart.length != 0" v-for="item in cart">
                            <td class="text-capitalize">{{ item.item.item_name }}</td>
                            <td>
                                <i class="bi bi-coin text-warning ms-1"></i>
                                {{ item.item.item_price }}
                            </td>
                            <td>{{ item.qty }}</td>
                            <td>
                                <i class="bi bi-coin text-warning ms-1"></i>
                                {{ item.item.item_price * item.qty }}
                            </td>
                            <td>
                                <i class="bi bi-trash text-danger" style="cursor: pointer;"
                                    @click="props.removeFromCart({ item_id: item.item.id }); loadCart()"></i>
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="5" class="text-center">No items in cart</td>
                        </tr>
                    </tbody>
                    <tfoot class="sticky-bottom">
                        <tr v-if="cart.length != 0">
                            <th colspan="3" class="text-center">Total</th>
                            <th>
                                <i class="bi bi-coin text-warning ms-1"></i>
                                {{ totalPrice }}
                            </th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <button type="submit" class="btn btn-navy fw-semibold w-100 fs-3 mt-4" @click="handleSubmit"
                :disabled="cart.length == 0">

                Checkout Cart
            </button>
        </div>
    </div>
</template>

<script setup>
const showCartModal = defineModel("showCartModal");
const { userID } = useAuthState();
const route = useRoute();
const course_id = route.params.course_id;
const props = defineProps({
    removeFromCart: Function,
    products: Object,
    coins: Number
})

const cart = ref({});
const loadCart = async () => {

    const result = await $fetch('/api/get-cart', {
        method: 'POST',
        body: {
            course_id,
            student_id: userID.value
        }
    })

    cart.value = result.cart
}
loadCart();

const totalPrice = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.item.item_price * item.qty, 0)
});

const showErrorAlert = ref(false);
const errorMsg = ref('');
const handleSubmit = async () => {
    if (totalPrice.value > props.coins) {
        errorMsg.value = "Insufficient coins";
        showErrorAlert.value = true;
        return;
    }
    const toCheckout = [];
    for (const cartItem of cart.value) {
        for (const item of props.products) {
            if (cartItem.item_id != item.id) {
                continue
            } else {

                const today = new Date().toISOString().split('T')[0];
                toCheckout.push({
                    item_id: cartItem.item_id,
                    student_id: userID.value,
                    date: today,
                    qty: cartItem.qty,
                    price: cartItem.item.item_price,
                    course_id: course_id
                });
                if (cartItem.qty > item.item_count) {
                    errorMsg.value = "Insufficient quantity for " + item.item_name;
                    showErrorAlert.value = true;
                    return;
                }
            }
        }
    }

    const { error } = await $fetch('/api/checkout-cart', {
        method: "POST",
        body: {
            data: toCheckout,
            updated_coin: props.coins - totalPrice.value,
            student_id: userID.value,
            course_id: course_id,
        }
    })

    if (error) {
        errorMsg.value = error.statusMessage;
        showErrorAlert.value = true;
    } else {
        showCartModal.value = false;
    }
}

</script>

<style scoped>
.overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.2);
}

.modal-wrapper {
    width: min(90vw, 750px);
    max-height: 65vh;
    overflow-y: auto;
}

label {
    margin-top: 1rem;
}
</style>