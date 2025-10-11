<template>
    <div>
        <StudentNavBar />
    
        <div class="Shop">   

            <div class="container-fluid">
                    <h1>Shop</h1>
                    <h2>Number of coins: {{ coins }}</h2>
            </div>

            
            <div class="container-fluid">
                
                <div class="row mx-5 gap-1">
                        <div class="col-3 col-gap p-0" v-for="obj in products" :key="obj.id">
                            <ProductCard 
                            :name="obj.name"
                            :price="obj.price"
                            :image="obj.image"
                            />
                        </div>
                </div>

            </div>
            

       </div>

    </div>


</template>

<script>
import ProductCard from '../components/ProductCard.vue';
import StudentNavBar from '../components/StudentNavBar.vue';

export default{
    name: "Shop",
    components: { StudentNavBar,ProductCard },
    data() {
        return {
            coins: 1000,
            products: [
                {id: 1, name:"snicker",price:10, image:"src/img/snicker.jpg"},
                {id: 2, name:"snicker",price:10, image:"src/img/snicker.jpg"},
                {id: 3, name:"snicker",price:10, image:"src/img/snicker.jpg"},
                {id: 4, name:"snicker",price:10, image:"src/img/snicker.jpg"},
                {id: 5, name:"snicker",price:10, image:"src/img/snicker.jpg"},

                        
            ]
        }
    }
}
</script>


<style scoped>


    .Shop {
        display: flex;          /* or block if you want normal flow */
        flex-direction: column;  /* stack children vertically */
        justify-content: flex-start; /* align items to top */
        align-items: stretch;    /* fill width */
        text-align: center;        /* left-align headings */
        min-height: 100vh;       /* optional: fill full height */
        background-color: #d2c8c4;

        margin-top: 50px;
    }





</style>