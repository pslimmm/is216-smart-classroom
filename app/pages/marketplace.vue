<script setup>
const props = defineProps({
    name: String,
    price: Number,
    image: String
})

// define variables
let coins = ref(100);
let totalPrice = ref(0);
let balance = computed(() => coins.value - totalPrice.value);

const products = reactive([
    { name: "Snickers", price: 10, image: "/img/snicker.jpg" },
    { name: "Mnm's", price: 10, image: "/img/mnm.jpg" },
    { name: "Mars", price: 10, image: "/img/mars.jpg" },
    { name: "Mamee Monster", price: 10, image: "/img/mameemonster.jpg" },
    { name: "Skittles", price: 10, image: "/img/skittles.jpg" },
    { name: "Twisters", price: 10, image: "/img/twister.jpg" },
    { name: "Lays", price: 10, image: "/img/lays.jpg" },
    { name: "Mentos", price: 10, image: "/img/mentos.jpg" },
])

// push in an array of objects
var cart = reactive([]);

//functions
function addToCartShop(obj) {
    let exist = false;
    for (let item of cart) {
        if (item.name == obj.name) {
            item.quantity_in_cart += 1;
            exist = true;
            break;
        }
    }
    if (!exist) {
        cart.push(obj);
    }
    calculate_price();
}

function removeFromCartShop(obj) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name == obj.name) {
            cart[i].quantity_in_cart -= 1;
            //if its 0 quantity, remove the whole object entirely
            if (cart[i].quantity_in_cart == 0) {
                cart.splice(i, 1);
                break;
            }
        }
    }
    calculate_price();
}


//calculate price
function calculate_price() {
    totalPrice.value = 0;
    for (let obj of cart) {
        totalPrice.value += Number(obj.quantity_in_cart) * Number(obj.price);
    }
}


// checkout
function checkout() {
    //update the student balance 
    coins.value -= totalPrice.value;
    cart.splice(0, cart.length);
    totalPrice.value = 0;
}

</script>

<template>
    <!-- <NuxtPage /> -->
    <!-- <main class="container py-4 flex-grow-1"> -->
        <div class="marketplace container py-5">

            <div class="mb-4 text-center">
                <h1 class="display-1 fw-bold d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-shop-window text-primary"></i>
                    Marketplace
                </h1>
                <h1 class="text-muted display-4">
                    <i class="bi bi-coin text-warning me-1"></i>
                    You have <strong>{{ coins }}</strong> coins
                    <i class="bi bi-coin text-warning me-1"></i>
                </h1>
            </div>

            <!-- Products Grid -->
            <div class="row g-4">
                <div class="col-6 col-sm-4 col-md-3" v-for="obj in products" :key="obj.name">
                    <ProductCard :name="obj.name" :price="obj.price" :image="obj.image" @add-to-cart="addToCartShop"
                        @remove-from-cart="removeFromCartShop" />
                </div>
            </div>

            <!-- Cart Summary -->
            <div class="mt-5">
                <div class="row justify-content-center g-4">
                    <div class="col-md-6">
                        <div class="card shadow-sm">
                            <div class="card-header bg-primary text-white fw-bold d-flex align-items-center gap-2">
                                <i class="bi bi-cart-check"></i> Cart Summary
                            </div>
                            <div class="card-body p-0">
                                <table class="table mb-0 align-middle">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Item</th>
                                            <th>Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="cart.length === 0">
                                            <td colspan="2" class="text-center text-muted py-4">Cart is empty</td>
                                        </tr>
                                        <tr v-for="obj in cart" :key="obj.name">
                                            <td>{{ obj.name }}</td>
                                            <td>{{ obj.quantity_in_cart }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Summary & Checkout -->
                    <div class="col-md-4">
                        <div class="card shadow-sm h-100">
                            <div
                                class="card-header bg-gradient-primary text-white fw-bold d-flex align-items-center gap-2">
                                <i class="bi bi-cash-coin"></i> Summary
                            </div>
                            <div class="card-body">
                                <ul class="list-group list-group-flush mb-3">
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Your Coins</span>
                                        <strong>{{ coins }}</strong>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Total Price</span>
                                        <strong>{{ totalPrice }}</strong>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between"
                                        :class="{ 'text-danger': balance < 0, 'text-success': balance >= 0 }">
                                        <span>Balance</span>
                                        <strong>{{ balance }}</strong>
                                    </li>
                                </ul>
                                <button class="btn btn-primary w-100" :disabled="balance < 0" @click="checkout">
                                    <i class="bi bi-bag-check me-1"></i> Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <!-- </main> -->
</template>

<style scoped>
.marketplace {
    background-color: var(--bs-body-bg);
    min-height: 100vh;
}

.card-header i,
.card-title i {
    vertical-align: middle;
}
</style>
