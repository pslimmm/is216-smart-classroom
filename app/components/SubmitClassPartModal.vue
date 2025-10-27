<template>
    <div class="overlay">
        <div class="modal-wrapper bg-white rounded-5 p-4 m-3">
            <div class="d-flex flex-row justify-content-between align-items-center">
                <h3>Submit new class participation</h3>
                <button class="btn btn-close" @click="showSubmitModal = false"></button>
            </div>

            <!-- Student Name with Dropdown -->
            <label for="student" class="form-label">Student Name:</label>
            <div class="input-group position-relative">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input v-model="studentName" @input="filterStudents" @focus="showSuggestions = studentName.length > 0"
                    @blur="setTimeout(() => showSuggestions = false, 200)" type="text" class="form-control"
                    placeholder="Search by student name..." @keyup.enter="autoSelectFirstMatch" />
                <div v-if="showSuggestions && filteredStudents.length > 0"
                    class="suggestions-dropdown position-absolute w-100 bg-white border rounded shadow-sm"
                    style="top: 100%; z-index: 1000; max-height: 200px; overflow-y: auto;">
                    <div v-for="student in filteredStudents" :key="student.student_id" @click="selectStudent(student)"
                        class="suggestion-item p-2 border-bottom" style="cursor: pointer;"
                        @mouseenter="$event.target.style.backgroundColor = '#f8f9fa'"
                        @mouseleave="$event.target.style.backgroundColor = 'white'">
                        <strong>{{ student.student?.full_name || student.name || student.full_name }}</strong>
                    </div>
                </div>
            </div>

            <!-- Date Input with Validation -->
            <label for="date" class="form-label mt-3">Date:</label>
            <input id="date" type="date" class="form-control" v-model="formDate"
                :class="{ 'is-invalid': formDate && !isDateValid }" required />
            <div v-if="formDate && !isDateValid" class="invalid-feedback">
                {{ dateValidationMessage }}
            </div>
            <div v-else-if="formDate && isDateValid" class="valid-feedback">
                Date is valid!
            </div>

            <label for="description" class="form-label mt-3">Description:</label>
            <textarea id="description" v-model="description" class="form-control" rows="5" required
                placeholder="Describe the student's participation . . ."></textarea>

            <label class="form-label mt-3">Rating</label>
            <br>
            <div @mouseout="hoverRating = 0">
                <i v-for="n in 5" :key="n" @click="rating = n" @mouseover="hoverRating = n" class="bi star-rating"
                    :class="[
                        n <= (hoverRating || rating) ? 'bi-star-fill text-warning bounce' : 'bi-star text-secondary'
                    ]" style="font-size: 2rem; cursor: pointer;"></i>
            </div>

            <button type="submit" class="btn btn-primary w-100 fs-3 mt-4" :disabled="!isFormValid" @click="handleSubmit()">
                Submit
            </button>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const showSubmitModal = defineModel("showSubmitModal");
const { userID } = useAuthState();

// Fetch data
const { allStudents, error } = await $fetch('/api/course-report', {
    method: "POST",
    body: {
        course_id: route.params.course_id,
        ta_id: userID.value
    }
});

const { courseData, error2 } = await $fetch('/api/course-info', {
    method: "POST",
    body: {
        course_id: route.params.course_id
    }
});

// Reactive data
const studentName = ref('');
const selectedStudent = ref(null);
const showSuggestions = ref(false);
const formDate = ref('');
const description = ref('');
const rating = ref(0);
const hoverRating = ref(0);

// Filter students based on input
const filteredStudents = computed(() => {
    if (!studentName.value || !allStudents) return [];

    const searchTerm = studentName.value.toLowerCase();
    return allStudents.filter(student => {
        // Handle different possible student object structures
        const studentNameToSearch = student.student?.full_name || student.name || student.full_name || '';
        return studentNameToSearch.toLowerCase().includes(searchTerm);
    });
});

// Filter students function (for @input)
const filterStudents = () => {
    showSuggestions.value = studentName.value.length > 0;
    selectedStudent.value = null; // Reset selection when typing
};

// Auto-select first matching student when Enter is pressed
const autoSelectFirstMatch = () => {
    if (filteredStudents.value.length > 0 && !selectedStudent.value) {
        selectStudent(filteredStudents.value[0]);
    }
};

// Select a student from dropdown
const selectStudent = (student) => {
    // Set the student name based on available properties
    studentName.value = student.student?.full_name || student.name || student.full_name;
    selectedStudent.value = student;
    showSuggestions.value = false;
};

// Date validation
const isDateValid = computed(() => {
    
    if (!formDate.value || !courseData?.starting_date) {
        return false;
    }

    try {
        const startDate = new Date(courseData.starting_date);
        if (isNaN(startDate.getTime())) {
            console.error('Invalid starting date:', courseData.starting_date);
            return false;
        }

        const givenDate = new Date(formDate.value);
        if (isNaN(givenDate.getTime())) {
            return false;
        }

        // Check if date is before starting date
        if (givenDate < startDate) {
            return false;
        }

        // Check if date is more than 14 weeks after starting date
        const diffTime = givenDate - startDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        const diffWeeks = diffDays / 7;


        return diffWeeks <= 14;
    } catch (error) {
        console.error('Error calculating date validation:', error);
        return false;
    }
});

// Date validation message

const dateValidationMessage = computed(() => {
    if (!formDate.value || !courseData?.starting_date) return '';

    try {
        const startDate = new Date(courseData.starting_date);
        const givenDate = new Date(formDate.value);

        if (givenDate < startDate) {
            return `Date cannot be before course start date (${new Date(courseData.starting_date).toLocaleDateString()})`;
        }

        const diffTime = givenDate - startDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        const diffWeeks = diffDays / 7;

        if (diffWeeks > 14) {
            return 'Date cannot be more than 14 weeks after course start date';
        }

        return '';
    } catch (error) {
        return 'Invalid date';
    }
});

// Form validation
const isFormValid = computed(() => {
    const isValid = selectedStudent.value &&
        formDate.value &&
        isDateValid.value &&
        description.value.trim() &&
        rating.value > 0;
        
    return isValid;
});

const calculatedWeek = computed(() => {
    if (!formDate.value || !courseData?.starting_date) return 1;
    
    try {
        const startDate = new Date(courseData.starting_date);
        const givenDate = new Date(formDate.value);
        
        const diffTime = givenDate - startDate;
        const diffDays = Math.max(0, diffTime / (1000 * 60 * 60 * 24));
        const week = Math.ceil(diffDays / 7);
        
        return Math.max(1, Math.min(week, 14)); // Ensure between 1-14
    } catch (error) {
        return 1;
    }
});

const handleSubmit = async () => {
    // console.log({
    //         course_id: route.params.course_id,
    //         student_id: selectedStudent.value.student_id,
    //         week: calculatedWeek.value,
    //         description: description.value,
    //         rating: rating.value,
    //         status: "pending"
    //     });
    const { error } = await $fetch('/api/submitcp',{
        method: 'POST',
        body: {
            ta_id: userID.value,
            course_id: route.params.course_id,
            student_id: selectedStudent.value.student_id,
            week: calculatedWeek.value,
            description: description.value,
            rating: rating.value
        }
    })
    if(!error){
        showSubmitModal.value = false;
        navigateTo('/courses/' + route.params.course_id);
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
    width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.star-rating {
    transform: translateY(0);
}

.bounce {
    animation: bounce 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    transform: translateY(2rem) !important;
}

@keyframes bounce {
    0% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-15px) scale(1.15);
    }

    100% {
        transform: translateY(-10px) scale(1.1);
    }
}

/* Input group styling */
.input-group {
    z-index: 1001;
}

.suggestions-dropdown {
    border: 1px solid #dee2e6;
}

.suggestion-item:hover {
    background-color: #f8f9fa !important;
}
</style>