<template>
    <div class="overlay">
        <div class="modal-wrapper bg-white rounded-5 p-4 m-3">
            <div class="d-flex flex-row justify-content-between align-items-center">
                <h3>Add new marketplace items</h3>
                <button class="btn btn-close" @click="showAddingModal = false"></button>
            </div>

            <label for="item_name">Item name</label>
            <input type="text" name="item_name" class="form-control" v-model="item_name" required>

            <label for="item_price">Item price</label>
            <input type="number" class="form-control" name="item_price" v-model="item_price" required>

            <label for="item_stock">Item stock</label>
            <input type="number" class="form-control" name="item_stock" v-model="item_stock" required>

            <label for="item_image">Item image</label>
            <input type="file" name="item_image" @change="handleFileUpload" accept="image/*" class="form-control">

            <button type="submit" class="btn btn-primary w-100 fs-3 mt-4" @click="handleSubmit">
                Submit
            </button>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const showAddingModal = defineModel("showAddingModal");
const { userID } = useAuthState();

const item_name = ref('');
const item_price = ref(0);
const item_stock = ref(0);
const item_image = ref(null);


const handleFileUpload = (event) => {
    item_image.value = event.target.files[0]
}


const handleSubmit = async () => {
    if (item_image.value) {
        const reader = new FileReader()
        reader.onload = async () => {
            const base64Image = reader.result

            const { ok, error } = await $fetch('/api/add-items', {
                method: 'POST',
                body: {
                    item_name: item_name.value,
                    item_price: item_price.value,
                    item_count: item_stock.value,
                    prof_id: userID.value,
                    base64Image,
                }
            })

            if (!error) {
                showAddingModal.value = false;
            }

        }
        reader.readAsDataURL(item_image.value)


    } else {
        const { ok, error } = await $fetch('/api/add-items', {
            method: 'POST',
            body: {
                item_name: item_name.value,
                item_price: item_price.value,
                item_count: item_stock.value,
                prof_id: userID.value,
            }
        })
        if (!error) {
            showAddingModal.value = false;
        }

    }
}


</script>

<style scoped>
.overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.2);
}

.modal-wrapper {
    width: min(90vw, 500px);
    max-height: 90vh;
    overflow-y: auto;
}

label {
    margin-top: 1rem;
}
</style>