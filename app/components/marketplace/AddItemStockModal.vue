<template>
    <div class="overlay">
        <div class="modal-wrapper bg-white rounded-5 p-4 m-3">
            <div class="d-flex flex-row justify-content-between align-items-center">
                <h3 class="text-navy fs-1 fw-semibold">Add Item Stock</h3>
                <button class="btn btn-close" @click="showAddItemModal = false"></button>
            </div>

            <label for="item_name" class="fs-2 fw-semibold">Item name</label>
            <input type="text" name="item_name" class="form-control fs-4" :value="selectedItem.item_name" disabled>

            <label for="item_stock" class="fs-2 fw-semibold">Item stock</label>
            <input type="number" class="form-control fs-4" name="item_stock" v-model="item_stock" required>

            <button type="submit" class="btn btn-navy fw-semibold w-100 fs-3 mt-4" @click="handleSubmit">
                Update Stock
            </button>
        </div>
    </div>
</template>

<script setup>
const showAddItemModal = defineModel("showAddItemModal");
const selectedItem = defineModel("selectedItem");
const { userID } = useAuthState();

const emit = defineEmits(['add-stock']);

const item_stock = ref(0);


const handleSubmit = async () => {
    const { ok, error } = await $fetch('/api/add-marketplace-item-stock', {
        method: 'POST',
        body: {
            item_id: selectedItem.value.item_id,
            item_stock: item_stock.value + selectedItem.value.item_stock
        }
    })

    if (!error) {
        emit('add-stock')
        showAddItemModal.value = false;
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