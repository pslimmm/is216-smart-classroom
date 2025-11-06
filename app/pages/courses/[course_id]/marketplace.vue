<script setup>
import AddItemsModal from '~/components/marketplace/AddItemsModal.vue';
import AddItemStockModal from '~/components/marketplace/AddItemStockModal.vue';
import CartModal from '~/components/marketplace/CartModal.vue';
import ProductCard from '~/components/marketplace/ProductCard.vue';

const route = useRoute();
const course_id = route.params.course_id;
const { role, userID } = useAuthState();


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
    products.value = [...productResults.products];
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
const loadCoins = async () => {
    const { coin_balance } = await $fetch('/api/course-student', {
        method: 'POST',
        body: {
            course_id: course_id,
            student_id: userID.value
        }
    })
    coins.value = coin_balance;
}
if (role.value == 'student') {
    loadCoins()
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

    successAlert('Added to Cart')
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

    successAlert('Removed From Cart')
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
    successAlert('Deleted item successfully')
}

// cart
const showCartModal = ref(false);
watch(showCartModal, (newVal) => {
    loadProducts();
    if (role.value == 'student') {
        loadCoins();
    }
})

const successAlert = (msg) => {
    successMsg.value = msg;
    showSuccessAlert.value = true;
    setTimeout(() => showSuccessAlert.value = false, 2000)
}
</script>

<template>
    <SuccessAlert :message="successMsg" v-model:showSuccessAlert="showSuccessAlert" />
    <AddItemsModal v-if="showAddingModal" v-model:showAddingModal="showAddingModal" @add-item="showSuccessAlert('Added new item successfully')"/>
    <AddItemStockModal v-if="showAddItemModal" v-model:showAddItemModal="showAddItemModal"
        v-model:selectedItem="selectedItem"  @add-stock="successAlert('Stock added')"/>
    <CartModal v-if="showCartModal" v-model:showCartModal="showCartModal" :removeFromCart="removeFromCart"
        :products="products" :coins="coins" @checkout="successAlert('Checked Out Successfully')"/>
    <main class="container flex-grow-1">
        <div class="mt-4 mb-4 row bg-white rounded-3 py-3 px-4 g-3 g-lg-0 align-items-center">
            <h1 class="display-3 fw-bold gap-2 text-navy col-12 col-lg-7">
                <i class="bi bi-shop-window me-2"></i>
                Marketplace
            </h1>
            <div class="col-12 col-lg-5 d-flex flex-column align-items-center justify-content-lg-end ">
                <div class="row w-100">
                    <div class="col-12">
                        <button class="btn btn-navy fs-5 fw-semibold w-100"
                            @click="navigateTo('martketplace-transactions')">Transaction History</button>
                    </div>
                </div>
                <div v-if="role == 'student'" class="row mt-3 w-100">
                    <div class="col-lg-4 col-md-6 col-12 mb-3 mb-lg-0">
                        <button class="btn btn-navy fs-5 fw-semibold w-100 h-100"
                            @click="navigateTo('/courses/' + course_id)">Course Dashboard</button>

                    </div>
                    <div class="col-lg-4 col-md-4 col-12 mb-3 mb-lg-0">
                        <button class="btn btn-navy fs-5 fw-semibold w-100 h-100" @click="showCartModal = true">
                            <i class="bi bi-cart"></i>
                            View Cart
                        </button>

                    </div>
                    <div class="col-lg-4 col-md-2 col-12 mb-3 mb-lg-0">
                        <div
                            class="border border-warning rounded-3 p-2 bg-navy text-light border-2 border-box fs-4 fw-semibold d-flex flex-row align-items-center justify-content-center w-100 h-100">
                            <i class="bi bi-coin text-warning me-2"></i>
                            {{ coins }}
                        </div>

                    </div>
                </div>
                <div v-if="role == 'prof'" class="row mt-3 w-100">
                    <div class="col-12">
                        <button class="btn btn-navy fs-5 fw-semibold w-100"
                            @click="showAddingModal = !showAddingModal">Add new items</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <div v-if="products.length != 0" class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="obj in products" :key="obj.item_name">
                <ProductCard :id="obj.id" :name="obj.item_name" :price="obj.item_price" :image="obj.img_url"
                    :stock="obj.item_count" @add-to-cart="addToCart" @remove-from-cart="removeFromCart"
                    @delete-item="deleteItem" @add-item-stock="addItemStock" />
            </div>
            <div v-else class="text-center text-muted">
                No products available for now...
            </div>
        </div>
    </main>
</template>

<style scoped>
.marketplace {
    min-height: 100dvh;
}

@supports not (height: 100dvh) {
    .marketplace {
        min-height: 100vh;
    }
}

.card-header i,
.card-title i {
    vertical-align: middle;
}
</style>
