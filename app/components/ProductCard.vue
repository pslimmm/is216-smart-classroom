<script setup>
const { role } = useAuthState();

// take in input of details of items
const props = defineProps({
    id: Number,
    name: String,
    price: Number,
    image: String,
    stock: Number
})


// emits an event
const emit = defineEmits([
    'add-to-cart',
    'remove-from-cart'
]);


//functions

function addToCart() {
    emit('add-to-cart',
        {
            name: props.name,
            price: props.price,
            quantity_in_cart: 1,
        }
    )
}

function removeFromCart() {
    emit('remove-from-cart',
        {
            item_id: props.id,
        }
    )
}

function addStock() {
    emit('add-item-stock',
        {
            item_id: props.id,
            item_name: props.name,
            item_stock: props.stock
        }
    )
}
function deleteItem() {
    emit('delete-item',
        {   
            item_id: props.id
        }
    )
}
</script>

<template>
    <div class="card shadow-sm h-100 ">
        <!-- Product Image -->
        <img :src="image" alt="Product image" class="card-img-top img-fluid object-fit-contain" />

        <!-- Product Details -->
        <div class="card-body d-flex flex-column justify-content-between">
            <div>
                <h2 class="card-title fw-semibold text-navy mb-1">{{ name }}</h2>
                <p class="card-text text-muted ">
                    <i class="bi bi-coin text-warning me-1"></i> {{ price }}
                </p>
                <p>Stock: {{ stock }}</p>
            </div>

            <!-- Buttons -->

            <div v-if="role == student" class="mt-3 d-flex flex-column gap-2">

                <button class="btn btn-navy btn-sm" @click="addToCart">
                    <i class="bi bi-cart-plus me-1"></i> Add to Cart
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="removeFromCart">
                    <i class="bi bi-trash me-1"></i> Remove
                </button>
            </div>

            <div v-if="role == 'prof'" class="mt-3 d-flex flex-column gap-2">
                <button class="btn btn-navy btn-sm" @click="addStock">
                    <i class="bi bi-plus me-1"></i> Add Stock
                </button>

                <button class="btn btn-outline-danger btn-sm" @click="deleteItem">
                    <i class="bi bi-trash me-1"></i> Delete Item
                </button>
            </div>

        </div>
    </div>
</template>

<style scoped>
.card-img-top {
    width: 100%;
    height: 100px;
    max-height: 100px;
    object-fit: contain;
}
</style>
