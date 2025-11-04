<script setup>
const route = useRoute();
const course_id = route.params.course_id;
const { role } = useAuthState();

const showAddingModal = ref(false);
const products = ref([]);


const { courseData } = await $fetch('/api/course-info', {
    method: 'POST',
    body: {
        course_id
    }
})

const loadProducts = async () => {
    const productResults = await $fetch('/api/marketplace', {
        method: 'POST',
        body: {
            prof_id: courseData.prof_id
        }

    })
    products.value = productResults.products;
}

loadProducts();

watch(showAddingModal, (newVal) => {
    loadProducts();
})

// handle emit events

const addToCart = (pbj) => {

};

const removeFromCart = () => {

};

const showAddItemModal = ref(false);
const selectedItem = ref({});
const addItemStock = (obj) => {
    selectedItem.value = obj;
    showAddItemModal.value = true;
}

watch(showAddItemModal, (newVal) => {
    loadProducts();
})

const deleteItem = async (obj) => {
    await $fetch('/api/delete-marketplace-item', {
        method: 'POST',
        body: {
            item_id : obj.item_id
        }
    })

    loadProducts()
}

</script>

<template>
    <AddItemsModal v-if="showAddingModal" v-model:showAddingModal="showAddingModal" />
    <AddItemStockModal v-if="showAddItemModal" v-model:showAddItemModal="showAddItemModal" v-model:selectedItem="selectedItem"/>
    <main class="container py-4 flex-grow-1">
        <div class="marketplace container py-5">

            <div class="mb-4 d-flex flex-row align-items-center justify-content-between">
                <h1 class="display-1 fw-bold d-flex align-items-center justify-content-center gap-2 text-navy">
                    <i class="bi bi-shop-window text-navy me-2"></i>
                    Marketplace
                </h1>
                <div>

                    <h1 class="text-muted display-4" v-if="role == 'student'">
                        <i class="bi bi-coin text-warning me-1"></i>
                        You have <strong>{{ coins }}</strong> coins
                        <i class="bi bi-coin text-warning me-1"></i>
                    </h1>
                    <div v-if="role == 'prof'">
                        <button class="btn btn-navy" @click="showAddingModal = !showAddingModal">Add new items</button>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-6 col-sm-4 col-md-3" v-for="obj in products" :key="obj.item_name">
                    <ProductCard :id="obj.id" :name="obj.item_name" :price="obj.item_price" :image="obj.img_url"
                        :stock="obj.item_count" @add-to-cart="addToCart" @remove-from-cart="removeFromCart"
                        @delete-item="deleteItem" @add-item-stock="addItemStock" />
                </div>


            </div>

            <div class="mt-5" v-if="role == 'student'">
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
    </main>
</template>

<style scoped>
.marketplace {
    min-height: 100vh;
}

.card-header i,
.card-title i {
    vertical-align: middle;
}
</style>
