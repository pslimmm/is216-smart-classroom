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
    { name:"Snickers",price:10, image:"/img/snicker.jpg"},
    { name:"Mnm's",price:10, image:"/img/mnm.jpg"},
    { name:"Mars",price:10, image:"/img/mars.jpg"},
    { name:"Mamee Monster",price:10, image:"/img/mameemonster.jpg"},
    { name:"Skittles",price:10, image:"/img/skittles.jpg"},
    { name:"Twisters",price:10, image:"/img/twister.jpg"},
    { name:"Lays",price:10, image:"/img/lays.jpg"},
    { name:"Mentos",price:10, image:"/img/mentos.jpg"},
    ])

    // push in an array of objects
    var cart = reactive([]);


    //functions
    function addToCartShop(obj){
        let exist = false;
        for (let item of cart){
            if( item.name == obj.name){
                item.quantity_in_cart +=1 ;

                exist = true;
                break;
            }

        }
        if (!exist){
            cart.push(obj);
        }

        calculate_price();

    }

    function removeFromCartShop(obj){
        for (let i=0 ; i<cart.length ; i++){
            if( cart[i].name == obj.name ){
                cart[i].quantity_in_cart -= 1;
                //if its 0 quantity, remove the whole object entirely   
                if( cart[i].quantity_in_cart == 0 ){
                    cart.splice(i,1);
                    break;
                }
                
            }
        }

        calculate_price();
    }
    

    //calculate price
    function calculate_price(){
        totalPrice.value = 0;
        for( let obj of cart ){
            totalPrice.value += Number(obj.quantity_in_cart) * Number(obj.price);
        } 
    }


    // checkout

    function checkout(){
        //update the student balance 

        coins.value -= totalPrice.value;
        cart.splice(0,cart.length);
        totalPrice.value = 0;




    }

    

    

</script>

<template>
    <!-- <NuxtPage /> -->

    <div>

        <div class="marketplace">   

            <div class="container-fluid">
                    <h1>Marketplace</h1>
                    <h2>Number of coins: {{ coins }}</h2>
            </div>

            <!-- Product details -->
            <div class="container">
                
                <div class="row mx-5">
                        
                        <div class="col-3 col-gap p-0" v-for="obj in products">
                            <ProductCard 
                            :name="obj.name"
                            :price="obj.price"
                            :image="obj.image"
                            @add-to-cart = "addToCartShop"
                            @remove-from-cart = "removeFromCartShop"
                            />
                        </div>
                       

                </div>

            </div>

            <!-- Cart detail -->
            <div class="d-flex justify-content-center mt-4">

                <table class="table table-striped table-light w-auto">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="obj in cart">
                            <td>{{ obj.name }}</td>
                            <td>{{ obj.quantity_in_cart }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Total price and balance -->
                <table class="table ms-4 w-auto">
                    <thead>
                        <tr>
                            <th>Your coins</th>
                            <td>{{ coins }}</td>
                        </tr>
                        <tr>
                            <th>Total Price</th>
                            <td>{{ totalPrice }}</td>
                        </tr>
                        <tr>
                            <th>Balance</th>
                            <td :class="{'text-danger':balance<0, 'text-black':balance>=0}">{{ balance }}</td>
                        </tr>
                    </thead>

                </table>

                <!-- Checkout button -->
                <div class="d-block w-auto ms-4">
                 <button :disabled="balance<0" class="btn btn-primary" @click="checkout">Checkout</button>
             
                </div>
                
                
            </div>
            

                 


            

        </div>

    </div>

</template>

<style scoped>
.marketplace {
        display: flex;          /* or block if you want normal flow */
        flex-direction: column;  /* stack children vertically */
        justify-content: flex-start; /* align items to top */
        align-items: stretch;    /* fill width */
        text-align: center;        /* left-align headings */
        min-height: 100vh;       /* optional: fill full height */

        margin-top: 80px;
}


</style>
