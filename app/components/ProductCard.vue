<script setup>

    // take in input of details of items
    const props = defineProps( {
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

    function addToCart(){


        emit('add-to-cart',
            {
                name: props.name,
                price: props.price,
                quantity_in_cart: 1,
            }
        )
    }
    
    function removeFromCart(){

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
    <!-- Create a card -->
    <div class="card">
        <img class="card-img-top" :src="image" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">{{ name }}</h5>
            <p class="card-text">Cost: {{ price }} Coins</p>
            <button class="btn btn-primary" @click="addToCart">  Add to Cart </button>
            <button class="btn btn-danger" @click="removeFromCart">  Remove </button>
        </div>
    </div>

</template>

<style scoped>
.card {
 background-color: rgb(235, 233, 230);
}
.card-img-top {
    width:100%;
    height:16vw;
    object-fit: scale-down;
}
</style>

