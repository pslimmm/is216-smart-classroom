<template>
    <div>
        <!-- Back Button and Course Header - Sticky Full Width -->
        <div class="sticky-header d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 mb-4 bg-white">
            <button @click="navigateTo('/courses')" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left me-2"></i>Back to Courses
            </button>
            <div v-if="courseInfo">
                <h2 class="mb-0">{{ courseInfo.course_code }}: {{ courseInfo.course_name }}</h2>
                <p class="text-muted small mb-0">{{ courseInfo.course_term }} | Section {{ courseInfo.course_section }}</p>
            </div>
        </div>

        <div class="container py-5 d-flex justify-content-center flex-column">

        <!-- Recording Section - ONLY for Prof/TA -->
        <div v-if="canRecord" class="card shadow-sm w-100 h-100 mb-4">
            <div class="card-header bg-gradient-primary">
                <h4 class="card-title mb-0 display-2 text-center">
                    Record Lecture
                </h4>
            </div>

            <div class="card-body">
                <div class="text-center py-4">
                    <!-- Recording Status -->
                    <div v-if="isRecording" class="mb-4">
                        <div class="spinner-grow text-danger" role="status">
                            <span class="visually-hidden">Recording...</span>
                        </div>
                        <h5 class="text-danger mt-2">Recording in progress...</h5>
                        <p class="text-muted">{{ recordingDuration }}s</p>
                    </div>

                    <div v-else-if="isTranscribing" class="mb-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Transcribing...</span>
                        </div>
                        <h5 class="text-primary mt-2">Transcribing audio...</h5>
                    </div>

                    <!-- Control Buttons -->
                    <div class="d-flex gap-3 justify-content-center mb-4">
                        <button
                            v-if="!isRecording"
                            @click="startRecording"
                            class="btn btn-danger btn-lg"
                            :disabled="isTranscribing"
                        >
                            <i class="bi bi-mic-fill me-2"></i>
                            Start Recording
                        </button>

                        <button
                            v-if="isRecording"
                            @click="stopRecording"
                            class="btn btn-secondary btn-lg"
                        >
                            <i class="bi bi-stop-fill me-2"></i>
                            Stop Recording
                        </button>

                        <button
                            v-if="audioBlob && !isRecording && !isPlaying"
                            @click="playRecording"
                            class="btn btn-info btn-lg"
                            :disabled="isTranscribing"
                        >
                            <i class="bi bi-play-fill me-2"></i>
                            Play Recording
                        </button>

                        <button
                            v-if="audioBlob && !isRecording && isPlaying"
                            @click="stopPlayback"
                            class="btn btn-warning btn-lg"
                        >
                            <i class="bi bi-stop-fill me-2"></i>
                            Stop Playback
                        </button>
                    </div>

                    <!-- Recording Details -->
                    <div v-if="audioBlob && !isRecording" class="mb-3">
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <label for="recordingTitle" class="form-label">Recording Title:</label>
                                <input
                                    type="text"
                                    id="recordingTitle"
                                    v-model="recordingTitle"
                                    class="form-control mb-3"
                                    placeholder="e.g., Introduction to Cloud Computing"
                                    maxlength="100"
                                />
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <label for="weekSelect" class="form-label">Save to Week:</label>
                                <select id="weekSelect" v-model="selectedWeek" class="form-select">
                                    <option v-for="i in 16" :key="i" :value="`Week ${i}`">Week {{ i }}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Transcribe & Discard Buttons -->
                    <div v-if="audioBlob && !isRecording" class="d-flex gap-3 justify-content-center">
                        <button
                            @click="transcribeAudio"
                            class="btn btn-success btn-lg"
                            :disabled="isTranscribing || !recordingTitle.trim()"
                        >
                            <i class="bi bi-file-text me-2"></i>
                            {{ isTranscribing ? 'Transcribing...' : 'Transcribe & Save' }}
                        </button>
                        <button
                            @click="discardRecording"
                            class="btn btn-outline-danger btn-lg"
                            :disabled="isTranscribing"
                        >
                            <i class="bi bi-trash me-2"></i>
                            Discard
                        </button>
                    </div>
                    <div v-if="audioBlob && !isRecording && !recordingTitle.trim()" class="text-muted small mt-2">
                        Please enter a title for your recording
                    </div>

                    <!-- Error Message -->
                    <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
                        {{ errorMessage }}
                    </div>

                    <!-- Success Message -->
                    <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
                        {{ successMessage }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Search and Notes Section - VISIBLE TO ALL -->
        <div class="card shadow-sm w-100 h-100 mt-4">
            <div class="card-header bg-gradient-primary">
                <h4 class="card-title mb-0 display-2 text-center">
                    Lecture Notes
                    <span v-if="!canRecord" class="badge bg-info ms-2">VIEW ONLY</span>
                </h4>
            </div>

            <div class="card-body display-5">
                <div>
                    <label for="search" class="form-label">Search Bar:</label>
                    <input
                        type="text"
                        id="search"
                        v-model="search"
                        class="form-control"
                        placeholder="What are you searching for?"
                    >
                </div>
            </div>
        </div>

        <!-- Notes Accordion -->
        <div class="accordion accordion-flush mt-4" id="notesAccordion">
            <NoteCard
                v-for="(item, index) in weeksData"
                :key="item.week"
                :week="item.week"
                :transcripts="item.transcripts"
                :searchterm="search"
                @delete-transcript="deleteTranscript"
                @retry-transcript="retryTranscript"
                @rename-transcript="renameTranscript"
                @open-slide-panel="openSlidePanel"
            />
        </div>

        <!-- Slide-out Panel for Full Transcript -->
        <TranscriptSlidePanel
            :is-open="isPanelOpen"
            :transcript="selectedTranscript"
            @close="closeSlidePanel"
        />

        <!-- Delete Confirmation Modal -->
        <DeleteConfirmModal
            :is-open="isDeleteModalOpen"
            @confirm="confirmDelete"
            @cancel="cancelDelete"
        />
        </div>
    </div>
</template>

<script setup>
import NoteCard from '~/components/NoteCard.vue';
import TranscriptSlidePanel from '~/components/TranscriptSlidePanel.vue';
import DeleteConfirmModal from '~/components/DeleteConfirmModal.vue';

definePageMeta({
    middleware: 'role'
});

// ============================================
// COURSE CONTEXT - Get course_id from route
// ============================================
const route = useRoute();
const courseId = computed(() => route.params.course_id);
const courseInfo = ref(null);

// Fetch course information
const loadCourseInfo = async () => {
    try {
        const response = await $fetch('/api/course-info', {
            method: 'POST',
            body: { course_id: courseId.value }
        });

        if (response && response.length > 0) {
            courseInfo.value = response[0];
        }
    } catch (error) {
        console.error('Error loading course info:', error);
    }
};

// Load course info on mount
onMounted(() => {
    loadCourseInfo();
});

// ============================================
// AUTHORIZATION CHECK
// Only prof and ta can record
// All roles (student, prof, ta) can VIEW transcripts
// ============================================
const { role } = useAuthState();
const canRecord = computed(() => ['prof', 'ta'].includes(role.value));


const isRecording = ref(false);
const isTranscribing = ref(false);
const audioBlob = ref(null);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const recordingDuration = ref(0);
const recordingInterval = ref(null);
const selectedWeek = ref('Week 1');
const recordingTitle = ref('');


const currentAudio = ref(null);
const isPlaying = ref(false);


const search = ref('');
const errorMessage = ref('');
const successMessage = ref('');


const isPanelOpen = ref(false);
const selectedTranscript = ref(null);


const isDeleteModalOpen = ref(false);
const transcriptToDelete = ref(null);


const weeksData = ref(
    Array.from({ length: 16 }, (_, i) => ({
        week: `Week ${16 - i}`,
        transcripts: []
    }))
);


const loadRecordings = async () => {
    try {
        const supabase = useSupabase();

        // Fetch recordings for THIS COURSE ONLY
        const { data: recordings, error } = await supabase
            .from('recordings')
            .select('*')
            .eq('course_id', courseId.value)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading recordings:', error);
            return;
        }

        console.log('Loaded recordings for course', courseId.value, ':', recordings?.length || 0);

        // Reset weeksData
        weeksData.value = Array.from({ length: 16 }, (_, i) => ({
            week: `Week ${16 - i}`,
            transcripts: []
        }));

        // Map recordings to weeks
        if (recordings) {
            recordings.forEach(recording => {
                const weekIndex = weeksData.value.findIndex(w => w.week === recording.week);

                if (weekIndex !== -1) {
                    const transcriptEntry = {
                        id: recording.id,
                        week: recording.week,
                        title: recording.title || `Transcript ${recording.id.substring(0, 8)}`,
                        timestamp: new Date(recording.created_at).toLocaleString(),
                        summary: recording.summary || '',
                        preview: recording.preview || '',
                        content: recording.transcript || 'No transcript available',
                        wordCount: recording.word_count || 0,
                        status: recording.status,
                        errorMessage: recording.error_message || '',
                        isPreviewExpanded: false,
                        matchCount: 0
                    };

                    weeksData.value[weekIndex].transcripts.push(transcriptEntry);
                }
            });
        }
    } catch (error) {
        console.error('Failed to load recordings:', error);
    }
};

// Load recordings from Supabase on mount
onMounted(() => {
    loadRecordings();
});

// ============================================
// Data is now stored in Supabase and fetched on mount
// ============================================

// Start recording audio
const startRecording = async () => {
    try {
        errorMessage.value = '';
        successMessage.value = '';

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.value = new MediaRecorder(stream);
        audioChunks.value = [];
        recordingDuration.value = 0;

        mediaRecorder.value.ondataavailable = (event) => {
            audioChunks.value.push(event.data);
        };

        mediaRecorder.value.onstop = () => {
            const blob = new Blob(audioChunks.value, { type: 'audio/webm' });
            audioBlob.value = blob;

            stream.getTracks().forEach(track => track.stop());

            if (recordingInterval.value) {
                clearInterval(recordingInterval.value);
            }
        };

        mediaRecorder.value.start();
        isRecording.value = true;

        recordingInterval.value = setInterval(() => {
            recordingDuration.value++;
        }, 1000);

    } catch (error) {
        console.error('Error accessing microphone:', error);
        errorMessage.value = 'Error accessing microphone. Please check permissions.';
    }
};


const stopRecording = () => {
    if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
        isRecording.value = false;
    }
};


const playRecording = () => {
    if (audioBlob.value) {
        if (currentAudio.value) {
            currentAudio.value.pause();
            currentAudio.value.currentTime = 0;
        }

        const audioUrl = URL.createObjectURL(audioBlob.value);
        const audio = new Audio(audioUrl);

        audio.onplay = () => {
            isPlaying.value = true;
        };

        audio.onended = () => {
            isPlaying.value = false;
            URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
            isPlaying.value = false;
            errorMessage.value = 'Error playing audio';
        };

        currentAudio.value = audio;
        audio.play();
    }
};


const stopPlayback = () => {
    if (currentAudio.value) {
        currentAudio.value.pause();
        currentAudio.value.currentTime = 0;
        isPlaying.value = false;
        currentAudio.value = null;
    }
};

// Discard recording without saving
const discardRecording = () => {

    if (currentAudio.value) {
        currentAudio.value.pause();
        currentAudio.value = null;
    }


    audioBlob.value = null;
    recordingDuration.value = 0;
    recordingTitle.value = '';
    isPlaying.value = false;

    successMessage.value = 'Recording discarded';
    setTimeout(() => {
        successMessage.value = '';
    }, 2000);
};


const transcribeAudio = async () => {
    if (!audioBlob.value) return;

    try {
        isTranscribing.value = true;
        errorMessage.value = '';
        successMessage.value = '';

        // Get user info from auth state
        const { session, role } = useAuthState();
        const userId = session.value?.user?.id;

        if (!userId) {
            errorMessage.value = 'User not authenticated';
            return;
        }

        // Step 1: Upload audio to Supabase Storage with course_id
        const uploadFormData = new FormData();
        uploadFormData.append('file', audioBlob.value, 'recording.webm');
        uploadFormData.append('userId', userId);
        uploadFormData.append('userRole', role.value);
        uploadFormData.append('week', selectedWeek.value);
        uploadFormData.append('duration', recordingDuration.value.toString());
        uploadFormData.append('title', recordingTitle.value.trim());
        uploadFormData.append('courseId', courseId.value); // ADD COURSE ID

        successMessage.value = 'Uploading audio...';

        const uploadResponse = await $fetch('/api/upload-recording', {
            method: 'POST',
            body: uploadFormData
        });

        if (!uploadResponse.success) {
            throw new Error(uploadResponse.message || 'Upload failed');
        }

        const recordingId = uploadResponse.recordingId;
        console.log('Audio uploaded, recording ID:', recordingId);

        // Step 2: Process the recording (transcription)
        successMessage.value = 'Transcribing audio...';

        const processResponse = await $fetch('/api/process-recording', {
            method: 'POST',
            body: { recordingId }
        });

        if (processResponse.success) {
            successMessage.value = `Transcription saved to ${selectedWeek.value}! Refreshing...`;

            // Refresh recordings from database
            await loadRecordings();

            // Clear audio blob and form
            audioBlob.value = null;
            recordingDuration.value = 0;
            recordingTitle.value = '';

            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        } else {
            errorMessage.value = 'Transcription failed. Please try again.';
        }

    } catch (error) {
        console.error('Transcription error:', error);
        errorMessage.value = error.data?.message || error.message || 'Failed to transcribe audio. Please try again.';

        // If upload failed but was saved to DB, refresh to show failed recording
        if (error.message?.includes('Failed to upload audio')) {
            await loadRecordings();
        }
    } finally {
        isTranscribing.value = false;
    }
};

// Cleanup on unmount
onBeforeUnmount(() => {
    if (recordingInterval.value) {
        clearInterval(recordingInterval.value);
    }
    if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
    }
    if (currentAudio.value) {
        currentAudio.value.pause();
        currentAudio.value = null;
    }
});

// ============================================
// Slide Panel Functions
// ============================================
const openSlidePanel = (transcript) => {
    selectedTranscript.value = transcript;
    isPanelOpen.value = true;
};

const closeSlidePanel = () => {
    isPanelOpen.value = false;
    setTimeout(() => {
        selectedTranscript.value = null;
    }, 300); // Wait for animation to finish
};

// ============================================
// Retry Failed Transcript
// ============================================
const retryTranscript = async (transcriptId) => {
    try {
        successMessage.value = 'Retrying transcription...';

        // Call the process-recording endpoint to retry
        const response = await $fetch('/api/process-recording', {
            method: 'POST',
            body: { recordingId: transcriptId }
        });

        if (response.success) {
            successMessage.value = 'Transcription retry successful!';

            // Refresh recordings from database
            await loadRecordings();

            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        } else {
            errorMessage.value = 'Retry failed. Please try again.';
        }
    } catch (error) {
        console.error('Retry error:', error);
        errorMessage.value = error.data?.message || error.message || 'Failed to retry transcription.';

        setTimeout(() => {
            errorMessage.value = '';
        }, 5000);
    }
};

// ============================================
// Rename Transcript
// ============================================
const renameTranscript = async ({ id, newTitle }) => {
    try {
        const response = await $fetch('/api/rename-recording', {
            method: 'POST',
            body: {
                recordingId: id,
                newTitle: newTitle
            }
        });

        if (response.success) {
            // Silent update - just refresh the data
            await loadRecordings();
        }
    } catch (error) {
        console.error('Rename error:', error);
        errorMessage.value = error.data?.message || error.message || 'Failed to rename recording.';

        setTimeout(() => {
            errorMessage.value = '';
        }, 5000);
    }
};

// ============================================
// Delete Individual Transcript with Modal
// ============================================
const deleteTranscript = (transcriptId) => {
    // Open modal and store the transcript ID
    transcriptToDelete.value = transcriptId;
    isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
    // Close modal and clear the transcript ID
    isDeleteModalOpen.value = false;
    transcriptToDelete.value = null;
};

const confirmDelete = async () => {
    // Close modal first
    isDeleteModalOpen.value = false;

    if (!transcriptToDelete.value) return;

    try {
        const supabase = useSupabase();

        // Step 1: Get the recording to find audio path
        const { data: recording, error: fetchError } = await supabase
            .from('recordings')
            .select('audio_path')
            .eq('id', transcriptToDelete.value)
            .single();

        if (fetchError) {
            console.error('Error fetching recording:', fetchError);
            errorMessage.value = 'Failed to find recording';
            transcriptToDelete.value = null;
            return;
        }

        // Step 2: Delete audio file from Storage
        if (recording?.audio_path) {
            const { error: storageError } = await supabase.storage
                .from('audio-recordings')
                .remove([recording.audio_path]);

            if (storageError) {
                console.error('Error deleting audio file:', storageError);
                errorMessage.value = 'Failed to delete audio file';
                transcriptToDelete.value = null;
                return;
            }

            console.log('Deleted audio file:', recording.audio_path);
        }

        // Step 3: Delete from database
        const { error: dbError } = await supabase
            .from('recordings')
            .delete()
            .eq('id', transcriptToDelete.value);

        if (dbError) {
            console.error('Error deleting recording:', dbError);
            errorMessage.value = 'Failed to delete recording';
            transcriptToDelete.value = null;
            return;
        }

        // Step 4: Refresh the UI
        await loadRecordings();

        successMessage.value = 'Transcript deleted successfully!';
        setTimeout(() => {
            successMessage.value = '';
        }, 3000);

        // Clear the stored transcript ID
        transcriptToDelete.value = null;

    } catch (error) {
        console.error('Delete transcript error:', error);
        errorMessage.value = 'Failed to delete transcript';
        transcriptToDelete.value = null;
    }
};
</script>

<style scoped>
.spinner-grow,
.spinner-border {
    width: 3rem;
    height: 3rem;
}

.sticky-header {
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    padding: 1rem 1.5rem;
    margin: 0 -0.75rem 1.5rem;
    border-radius: 0.75rem;
}

/* Responsive: Stack content on mobile */
@media (min-width: 768px) {
    .sticky-header {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 0.5rem;
        margin: 0 0 2rem;
        padding: 1.25rem 2rem;
        width: 100vw;
    }

    .sticky-header h2 {
        font-size: 1.2rem;
    }

    .sticky-header button {
        font-size: 0.9rem;
        padding: 0.5rem 0.75rem;
    }
}
</style>
