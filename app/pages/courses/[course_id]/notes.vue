<template>
    <div class="container-fluid py-4 px-3 px-md-5 notes-page">
        <!-- Top Row -->
        <div class="row mb-5 g-4 align-items-stretch">
            <!-- Record -->
            <div v-if="canRecord" class="col-12">
                <div class="section-elev rounded-4 h-100 d-flex flex-column">
                    <!-- Record Header -->
                    <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                        <div class="fw-bold display-heading">Record Lecture</div>
                    </div>
                    <!-- Body -->
                    <div class="px-4 py-4 flex-grow-1">
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
                            
                            <div v-if="audioBlob && !isRecording && !recordingTitle.trim()"
                                class="text-muted small mb-2">
                                Please enter a title for your recording
                            </div>
                            <!-- Recording Details -->
                            <div v-if="audioBlob && !isRecording" class="mb-3">
                                <div class="row justify-content-center">
                                    <div class="col-12 col-md-8 col-lg-6">
                                        <label for="recordingTitle" class="form-label">Recording Title:</label>
                                        <input type="text" id="recordingTitle" v-model="recordingTitle"
                                            class="form-control mb-3"
                                            placeholder="e.g., Introduction to Cloud Computing" maxlength="100" />
                                    </div>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-12 col-md-8 col-lg-6">
                                        <label for="weekSelect" class="form-label">Save to Week:</label>
                                        <select id="weekSelect" v-model="selectedWeek" class="form-select">
                                            <option v-for="i in 16" :key="i" :value="`Week ${i}`">Week {{ i }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <!-- Control Buttons -->
                            <div class="row">
                                <div class="col-12 mt-3">
                                    <button v-if="!isRecording" @click="startRecording"
                                        class="btn btn-danger btn-lg fs-5 btn-fluid w-100" :disabled="isTranscribing">
                                        <i class="bi bi-mic-fill me-2"></i>
                                        Start Recording
                                    </button>

                                    <button v-if="isRecording" @click="stopRecording"
                                        class="btn btn-secondary btn-lg fs-5 btn-fluid w-100">
                                        <i class="bi bi-stop-fill me-2"></i>
                                        Stop Recording
                                    </button>
                                </div>
                                <div class="col-12 mt-3">
                                    <button v-if="audioBlob && !isRecording && !isPlaying" @click="playRecording"
                                        class="btn btn-info btn-lg fs-5 btn-fluid w-100" :disabled="isTranscribing">
                                        <i class="bi bi-play-fill me-2"></i>
                                        Play Recording
                                    </button>

                                    <button v-if="audioBlob && !isRecording && isPlaying" @click="stopPlayback"
                                        class="btn btn-warning btn-lg fs-5 btn-fluid w-100">
                                        <i class="bi bi-stop-fill me-2"></i>
                                        Stop Playback
                                    </button>
                                </div>
                            </div>



                            <!-- Transcribe & Discard Buttons -->
                            <div v-if="audioBlob && !isRecording" class="row">
                                <div class="col-lg-6 col-12 mt-3">
                                    <button @click="transcribeAudio" class="btn btn-success w-100 btn-lg"
                                        :disabled="isTranscribing || !recordingTitle.trim()">
                                        <i class="bi bi-file-text me-2"></i>
                                        {{ isTranscribing ? 'Transcribing...' : 'Transcribe & Save' }}
                                    </button>

                                </div>
                                <div class="col-lg-6 col-12 mt-3">
                                    <button @click="discardRecording" class="btn btn-outline-danger btn-lg w-100"
                                        :disabled="isTranscribing">
                                        <i class="bi bi-trash me-2"></i>
                                        Discard
                                    </button>

                                </div>
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
            </div>

            <!-- Search and Notes Section (Visible to All) -->
            <div class="col-12">
                <div class="section-elev rounded-4 h-100 d-flex flex-column">
                    <!-- Search and Notes Header -->
                    <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                        <div class="fw-bold display-heading">Search Notes</div>
                    </div>

                    <!-- Body -->
                    <div class="px-4 py-4 flex-grow-1">
                        <!-- <label for="search" class="form-label">Search Notes: </label> -->
                        <input type="text" id="search" v-model="search" class="form-control note-search"
                            placeholder="Type in keywords"></input>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-5 g-4 align-items-stretch">
            <!-- Notes Accordion -->
            <div class="col-12">
                <div class="section-elev rounded-4 h-100 d-flex flex-column">
                    <!-- Notes Accordion Header -->
                    <div class="bg-navy text-white px-4 py-3 rounded-top-4">
                        <div class="fw-bold display-heading">Recorded Lecture Notes</div>
                    </div>

                    <!-- Body -->
                    <div class="px-4 py-4 flex-grow-1">
                        <div class="accordion accordion-flush" id="notesAccordion">
                            <NoteCard v-for="(item, index) in weeksData" :key="item.week" :week="item.week"
                                :transcripts="item.transcripts" :searchterm="search"
                                @delete-transcript="deleteTranscript" @retry-transcript="retryTranscript"
                                @rename-transcript="renameTranscript" @open-slide-panel="openSlidePanel" />
                        </div>

                        <!-- Slide-out Panel for Full Transcript -->
                        <TranscriptSlidePanel :is-open="isPanelOpen" :transcript="selectedTranscript"
                            @close="closeSlidePanel" />

                        <!-- Delete Confirmation Modal -->
                        <DeleteConfirmModal :is-open="isDeleteModalOpen" @confirm="confirmDelete"
                            @cancel="cancelDelete" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import NoteCard from '~/components/notes/NoteCard.vue';
import TranscriptSlidePanel from '~/components/notes/TranscriptSlidePanel.vue';
import DeleteConfirmModal from '~/components/notes/DeleteConfirmModal.vue';

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
.notes-page {
    overflow-x: hidden;
}

.section-elev {
    background-color: white;
}

.display-heading {
    font-size: 2rem;
    text-wrap: balance;
}

.note-search {
    font-size: 1.5rem;
    padding: 0.85rem 1rem;
}

.btn-fluid {
    width: 100%;
}

@media (min-width: 576px) {
    .btn-fluid {
        width: auto;
        min-width: 0;
        flex: 1 1 auto;
    }
}

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
