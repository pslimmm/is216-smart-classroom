<script setup>
const route = useRoute();
const course_id = route.params.course_id;
const { role, userID } = useAuthState();

// cart
const showCartModal = ref(false);

// course info
const { courseData } = await $fetch('/api/course-info', {
    method: 'POST',
    body: {
        course_id
    }
})

// load marketplace products
const products = ref([]);
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

// prof actions
// add new items
const showAddingModal = ref(false);
watch(showAddingModal, (newVal) => {
    loadProducts();
})

// load coins for student
const coins = ref(0);
if (role.value == 'student') {
    const { coin_balance } = await $fetch('/api/course-student', {
        method: 'POST',
        body: {
            course_id: course_id,
            student_id: userID.value
        }
    })
    coins.value = coin_balance;
}

// handle emit events
const successMsg = ref('');
const showSuccessAlert = ref(false);
const addToCart = async (obj) => {
    await $fetch('/api/update-cart', {
        method: 'POST',
        body: {
            course_id: course_id,
            student_id: userID.value,
            item_id: obj.item_id,
            action: 'add'
        }
    })
    successMsg.value = 'Added items to cart';
    showSuccessAlert.value = true;

    setTimeout(() => showSuccessAlert.value = false, 2000)
};

const removeFromCart = async (obj) => {
    await $fetch('/api/update-cart', {
        method: 'POST',
        body: {
            course_id: course_id,
            student_id: userID.value,
            item_id: obj.item_id,
            action: 'delete'
        }
    })
};

// prof emit events
// add item stock
const showAddItemModal = ref(false);
const selectedItem = ref({});
const addItemStock = (obj) => {
    selectedItem.value = obj;
    showAddItemModal.value = true;
}

watch(showAddItemModal, (newVal) => {
    loadProducts();
})

// delete item
const deleteItem = async (obj) => {
    await $fetch('/api/delete-marketplace-item', {
        method: 'POST',
        body: {
            item_id: obj.item_id,
            prof_id: userID.value
        }
    })

    loadProducts()
}



</script>

<template>
    <SuccessAlert :message="successMsg" v-model:showSuccessAlert="showSuccessAlert" />
    <AddItemsModal v-if="showAddingModal" v-model:showAddingModal="showAddingModal" />
    <AddItemStockModal v-if="showAddItemModal" v-model:showAddItemModal="showAddItemModal"
        v-model:selectedItem="selectedItem" />
    <CartModal v-if="showCartModal" v-model:showCartModal="showCartModal" :removeFromCart="removeFromCart"
        :products="products" :coins="coins" />
    <main class="container flex-grow-1">
        <div class="marketplace container py-5">

            <div class="mb-4 row bg-white rounded-3 py-3">
                <h1 class="display-1 fw-bold gap-2 text-navy col-lg-6 col-sm-12">
                    <i class="bi bi-shop-window me-2"></i>
                    Marketplace
                </h1>
                <div class="col-sm-12 col-lg-6 d-flex flex-row align-items-center justify-content-lg-end">
                    <button class="btn btn-navy me-3 fs-4 fw-semibold" @click="navigateTo('martketplace-transactions')">Transaction History</button>
                    <div v-if="role == 'student'" class="d-flex flex-row align-items-center">
                        <button class="btn btn-navy me-3 fs-4 fw-semibold" @click="navigateTo('/courses/' + course_id)">Course Dashboard</button>
                        <button class="btn btn-navy me-3 fs-4 fw-semibold" @click="showCartModal = !showCartModal">
                            <i class="bi bi-cart me-1"></i>
                            View Cart
                        </button>
                        <div class="border border-warning rounded-3 p-2 bg-navy text-light border-2 border-box fs-4 fw-semibold">
                            <i class="bi bi-coin text-warning me-1"></i>
                                {{ coins }}
                        </div>
                    </div>
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
