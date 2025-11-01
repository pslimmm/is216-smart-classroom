<script setup>

// take in input of details of items
const props = defineProps({
    name: String,
    price: Number,
    image: String,
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
            name: props.name,
            price: props.price,
            quantity_in_cart: 0,
        }
    )
}
</script>

<template>
    <div class="card shadow-sm h-100 border border-primary-subtle">
        <!-- Product Image -->
        <img :src="image" alt="Product image" class="card-img-top img-fluid object-fit-contain" />

        <!-- Product Details -->
        <div class="card-body d-flex flex-column justify-content-between">
            <div>
                <h2 class="card-title fw-semibold text-primary mb-1">{{ name }}</h2>
                <p class="card-text text-muted fs-3">
                    <i class="bi bi-coin text-warning me-1"></i> {{ price }} Coins
                </p>
            </div>

            <!-- Buttons -->
            <div class="mt-3 d-flex flex-column gap-2">
                <button class="btn btn-outline-primary btn-sm" @click="addToCart">
                    <i class="bi bi-cart-plus me-1"></i> Add to Cart
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="removeFromCart">
                    <i class="bi bi-trash me-1"></i> Remove
                </button>
            </div>
        </div>
    </div>
    <!--<div class="card">
        <img class="card-img-top" :src="image" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">{{ name }}</h5>
            <p class="card-text">Cost: {{ price }} Coins</p>
            <button class="btn btn-primary" @click="addToCart"> Add to Cart </button>
            <button class="btn btn-danger" @click="removeFromCart"> Remove </button>
        </div>
    </div> -->
</template>

<style scoped>
.card-img-top {
    width: 100%;
    max-height: 180px;
    object-fit: contain;
}
</style>
