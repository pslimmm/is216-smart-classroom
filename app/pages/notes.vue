<template>

    <div class="container py-5 d-flex justify-content-center flex-column">

        <!-- <div class="card shadow-sm w-100" style="max-width: 600px;"> -->
            <div class="card shadow-sm w-100 h-100">
                <div class="card-header bg-gradient-primary">
                    <h4 class="card-title mb-0 display-2 text-center">Notes</h4>
                </div>
    
                <div class="card-body display-5">
                    <form @submit.prevent="submitLog" class="vstack gap-3">
    
                    <div>
                        <label for="search" class="form-label">Search Bar:</label>
                        <input type ="text" id="search" v-model="search" class="form-control" 
                        placeholder="What are you searching for?">
                    </div>
    
                    </form>
                </div>
                
    
            </div>

            <div class="card shadow-sm w-100 h-100 mt-5">
                <div v-for="(item,index) in weeksData" :key="item.week">
                    <NoteCard 
                    :week="item.week" 
                    :notes="item.notes"
                    :searchterm="search"
                    
                    />
                </div>
                
                

    
            </div>
            

        
    </div>


</template>

<script setup>
import NoteCard from '~/components/NoteCard.vue';

import { ref } from 'vue'

// Data for notes
const weeksData = ref(
  Array.from({ length: 16 }, (_, i) => ({
      week: `Week ${16 - i}`,
      // TODO: insert notes after calling api (yichen)
      notes: `Notes content for Week ${16 - i}` 
  }))
)
const search= ref("")



</script>

<style scoped>


</style>