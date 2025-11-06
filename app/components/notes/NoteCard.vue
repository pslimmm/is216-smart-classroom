<template>
  <div class="accordion-item" v-if="shouldShow">
    <h2 class="accordion-header">
      <button 
        class="accordion-button collapsed" 
        type="button" 
        data-bs-toggle="collapse" 
        :data-bs-target="'#collapse' + sanitizedWeek"
        :aria-expanded="false"
        :aria-controls="'collapse' + sanitizedWeek"
        @click="handleAccordionClick"
      >
        <div class="fw-semibold fs-3">{{ week }}
          <span v-if="hasNotes" class="badge bg-success ms-2 fs-4">
            {{ transcripts.length }} {{ transcripts.length === 1 ? 'Transcript' : 'Transcripts' }}
          </span>
        </div>
      </button>
    </h2>
    <div 
      :id="'collapse' + sanitizedWeek" 
      class="accordion-collapse collapse"
      data-bs-parent="#notesAccordion"
    >
      <div class="accordion-body">
        <div v-if="filteredTranscripts.length > 0">
          <div 
            v-for="(transcript, index) in filteredTranscripts" 
            :key="transcript.id"
            class="transcript-item mb-4 pb-3"
            :class="{ 'border-bottom': index < filteredTranscripts.length - 1 }"
          >
            <div class="transcript-header d-flex flex-wrap flex-lg-nowrap justify-content-between align-items-start gap-3 mb-2">
              <div class="transcript-meta flex-grow-1 min-w-0">
                <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <i class="bi bi-file-earmark-text me-1 fs-3"></i>

                  <!-- View mode -->
                  <h6
                    v-if="editingTranscriptId !== transcript.id"
                    class="mb-0 transcript-title fs-1 text-break"
                  >
                    {{ transcript.title }}
                  </h6>

                  <!-- Edit mode -->
                  <input
                    v-else
                    :ref="el => { if (el) editInput = el }"
                    v-model="editingTitle"
                    type="text"
                    class="form-control form-control-sm transcript-title-input"
                    @blur="saveRename(transcript.id)"
                    @keydown.enter="saveRename(transcript.id)"
                    @keydown.esc="cancelRename"
                    @click.stop
                  />

                  <span
                    class="badge fs-4 transcript-status-badge mt-2 mt-sm-0 ms-sm-2 ms-lg-3"
                    :class="transcript.status === 'failed' ? 'bg-danger' : 'bg-success'"
                  >
                    <span v-if="transcript.status === 'failed'">Failed</span>
                    <span v-else>Completed</span>
                  </span>
                </div>
                <div class="fs-4 text-muted text-wrap">
                  <i class="bi bi-clock me-1"></i>
                  {{ transcript.timestamp }}
                </div>
              </div>

              <!-- 3-Dot Menu -->
              <div class="dropdown-wrapper position-relative ms-auto">
                <button
                  class="btn btn-sm btn-link text-muted p-0"
                  type="button"
                  @click.stop="toggleDropdown(transcript.id)"
                  style="font-size: 1.2rem;"
                >
                  <i class="bi bi-three-dots-vertical fs-3"></i>
                </button>
                <ul
                  v-if="openDropdownId === transcript.id"
                  class="custom-dropdown-menu"
                  @click.stop
                >
                  <li>
                    <button
                      class="dropdown-item fs-5"
                      @click="handleRename(transcript)"
                    >
                      <i class="bi bi-pencil me-2 fs-4"></i>
                      Rename
                    </button>
                  </li>
                  <li v-if="transcript.status === 'failed'">
                    <button
                      class="dropdown-item text-warning fs-5"
                      @click="handleRetry(transcript.id)"
                    >
                      <i class="bi bi-arrow-clockwise me-2 fs-4"></i>
                      Retry Processing
                    </button>
                  </li>
                  <li>
                    <button
                      class="dropdown-item text-danger fs-5"
                      @click="handleDelete(transcript.id)"
                    >
                      <i class="bi bi-trash me-2 fs-4"></i>
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Failed Status Alert -->
            <div v-if="transcript.status === 'failed'" class="alert alert-danger mb-3 fs-5" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
              <strong>Processing Failed:</strong> {{ transcript.errorMessage || 'Unknown error occurred' }}
              <br>
              <small class="text-muted">Click "Retry Processing" in the menu above to try again.</small>
            </div>

            <!-- Transcript Preview (clickable) -->
            <div
              v-if="transcript.status !== 'failed'"
              class="transcript-content fs-3 py-4"
              v-html="highlightText(transcript.content)"
              @click="openSlidePanel(transcript)"
              style="cursor: pointer;"
              title="Click to view full transcript"
            ></div>

            <!-- View Full Button -->
            <button
              v-if="transcript.status !== 'failed'"
              class="btn btn-sm btn-outline-primary mt-2 fs-5 transcript-view-btn"
              @click="openSlidePanel(transcript)"
            >
              <i class="bi bi-arrows-angle-expand me-1 fs-4"></i>
              View Full Transcript
            </button>
          </div>
        </div>
        <div v-else class="text-muted fst-italic fs-5">
          <i class="bi bi-journal-x me-2 fs-4"></i>
          No transcripts available for this week
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  week: {
    type: String,
    required: true
  },
  transcripts: {
    type: Array,
    default: () => []
  },
  searchterm: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['delete-transcript', 'open-slide-panel', 'retry-transcript', 'rename-transcript']);

// Dropdown state
const openDropdownId = ref(null);

// Edit state
const editingTranscriptId = ref(null);
const editingTitle = ref('');
const originalTitle = ref('');
let editInput = null;

const toggleDropdown = (transcriptId) => {
  if (openDropdownId.value === transcriptId) {
    openDropdownId.value = null;
  } else {
    openDropdownId.value = transcriptId;
  }
};

const handleDelete = (transcriptId) => {
  openDropdownId.value = null;
  emit('delete-transcript', transcriptId);
};

const handleRetry = (transcriptId) => {
  openDropdownId.value = null;
  emit('retry-transcript', transcriptId);
};

const handleRename = async (transcript) => {
  openDropdownId.value = null;
  editingTranscriptId.value = transcript.id;
  editingTitle.value = transcript.title;
  originalTitle.value = transcript.title;

  await nextTick();
  if (editInput) {
    editInput.focus();
    editInput.select();
  }
};

const saveRename = (transcriptId) => {
  const trimmed = editingTitle.value.trim();

  // Revert if empty
  if (!trimmed) {
    cancelRename();
    return;
  }

  // Only save if changed
  if (trimmed !== originalTitle.value) {
    emit('rename-transcript', { id: transcriptId, newTitle: trimmed });
  }

  // Exit edit mode
  editingTranscriptId.value = null;
  editingTitle.value = '';
};

const cancelRename = () => {
  editingTranscriptId.value = null;
  editingTitle.value = '';
  originalTitle.value = '';
};

const openSlidePanel = (transcript) => {
  emit('open-slide-panel', transcript);
};

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = () => {
    openDropdownId.value = null;
  };
  document.addEventListener('click', handleClickOutside);

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});

const sanitizedWeek = computed(() => {
  return props.week.replace(/\s+/g, '');
});

// Handle accordion toggle
const handleAccordionClick = (event) => {
  const collapseElement = document.getElementById('collapse' + sanitizedWeek.value);
  
  if (collapseElement) {
    // Toggle the 'show' class to expand/collapse
    collapseElement.classList.toggle('show');
    
    // Update button aria-expanded and collapsed class
    const button = event.currentTarget;
    const isExpanded = collapseElement.classList.contains('show');
    button.setAttribute('aria-expanded', isExpanded);
    
    if (isExpanded) {
      button.classList.remove('collapsed');
    } else {
      button.classList.add('collapsed');
    }
  }
};

const hasNotes = computed(() => {
  return props.transcripts && props.transcripts.length > 0;
});

const filteredTranscripts = computed(() => {
  if (!props.transcripts || props.transcripts.length === 0) return [];
  
  if (!props.searchterm || !props.searchterm.trim()) {
    return props.transcripts;
  }
  
  const searchLower = props.searchterm.toLowerCase();
  return props.transcripts.filter(transcript => 
    transcript.content.toLowerCase().includes(searchLower)
  );
});

const shouldShow = computed(() => {
  if (!props.searchterm) return true;
  return filteredTranscripts.value.length > 0;
});

const highlightText = (text) => {
  if (!props.searchterm || !props.searchterm.trim()) {
    return text.replace(/\n/g, '<br>');
  }
  
  const escapedSearch = props.searchterm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearch})`, 'gi');
  
  return text
    .replace(/\n/g, '<br>')
    .replace(regex, '<mark class="highlight-search">$1</mark>');
};
</script>

<style scoped>
.accordion-button {
  font-size: 1.1rem;
}

.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0c63e4;
}

.transcript-content {
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.transcript-content::-webkit-scrollbar {
  width: 6px;
}

.transcript-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.transcript-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.transcript-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.transcript-item {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
  word-wrap: break-word;
}

.transcript-header {
  gap: 1rem;
}

.transcript-meta {
  flex: 1 1 auto;
  min-width: 0;
}

.transcript-status-badge {
  flex-shrink: 0;
}

.transcript-view-btn {
  width: 100%;
}

@media (min-width: 576px) {
  .transcript-view-btn {
    width: auto;
  }
}

@media (max-width: 575.98px) {
  .dropdown-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}

:deep(.highlight-search) {
  background-color: #ffeb3b;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}

.badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
}

.dropdown-wrapper {
  flex-shrink: 0;
}

.dropdown-wrapper .btn-link {
  white-space: nowrap;
}

/* Custom Dropdown Menu */
.custom-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 160px;
  padding: 0.5rem 0;
  margin: 0.25rem 0 0;
  font-size: 1rem;
  color: #212529;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,.175);
  list-style: none;
}

.custom-dropdown-menu .dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
}

.custom-dropdown-menu .dropdown-item:hover {
  background-color: #f8f9fa;
}

.custom-dropdown-menu .dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #dc3545;
}

.custom-dropdown-menu .dropdown-item.text-warning:hover {
  background-color: #fff3cd;
  color: #856404;
}

.transcript-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.05rem;
}

.transcript-title-input {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2c3e50;
  border: 2px solid #007bff;
  padding: 0.25rem 0.5rem;
  max-width: 400px;
  width: 100%;
}

.transcript-title-input:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  border-color: #0056b3;
}
</style>
