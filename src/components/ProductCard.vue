<template>
    <div class="card" style="width: auto;">
        <img class="card-img-top" :src="image" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">{{ name }}</h5>
            <p class="card-text">Cost: {{ price }} Coins</p>
            <a href="#" class="btn btn-primary"> Add to Cart </a>
        </div>
    </div>
</template>

<script>

export default {
    name: "ProductCard",
    props: {
        name: String,
        price: Number,
        image: String
    }
}

</script>

<style scoped >

.card {
    background-color: #d2c8c4
}


</style>