<script setup>
import { ref, watch } from 'vue'

// from parent 
const { week, notes, searchterm} = defineProps({
    week: String,
    notes: String,
    searchterm: String,
})

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

// watch search term, if searched, open the card
watch(
    () => searchterm,
    (newVal) => {
        if (!newVal) {
        isOpen.value = false // close if empty
        } 
        else if (notes.toLowerCase().includes(newVal.toLowerCase())) {
        isOpen.value = true // open if match
        } 
        else {
        isOpen.value = false // close if no match
        }
    }
)

// Highlight matching search term
const highlight = (text, term) => {
    // if term is empty, just return the text
    if (!term) return text
    // search for term, g = global (all the words), i = case insensitive 
    const regex = new RegExp(`(${term})`, 'gi')
    // if found, $1 means 
    // search: hel , found hello
    // <mark>hel<mark> lo ( mark hel in yellow )
    return text.replace(regex, '<mark>$1</mark>')
}




</script>


<template>

<div class="week-box">

    <div>
        <div class="mb-0">
            <label>
                <h3>
                    <button class="btn btn-primary" @click="toggle">
                    {{ isOpen ? '▲' : '▼' }}
                    </button>
                    {{ week }}
                </h3>
            </label>
                
        </div>


        <div v-show="isOpen" class="card-body">
            <!-- insert notes from API -->
             <span v-html="highlight(notes, searchterm)"></span>
        </div>

  </div>
    


</div>



</template>

<style scoped>

.week-box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

h3{
    margin: 0;
    color: #2980b9;
    font-size: 1.8em;
}




</style>