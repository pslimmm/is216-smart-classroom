<template>
  <!-- Backdrop -->
  <div
    v-if="isOpen"
    class="slide-panel-backdrop"
    @click="close"
  ></div>

  <!-- Slide-out Panel -->
  <div
    class="slide-panel"
    :class="{ 'slide-panel-open': isOpen }"
  >
    <div class="slide-panel-header">
      <div>
        <h5 class="mb-1 fs-1">{{ transcript?.week || 'Transcript' }}</h5>
        <div class="text-muted fs-3">
          <i class="bi bi-clock me-1 fs-2"></i>
          {{ transcript?.timestamp }}
          <span class="ms-3">
            <i class="bi bi-file-text me-1 fs-2"></i>
            {{ transcript?.wordCount || 0 }} Words
          </span>
        </div>
      </div>
      <button
        class="btn-close"
        @click="close"
        aria-label="Close"
      ></button>
    </div>

    <div class="slide-panel-body">
      <!-- Tabs -->
      <div class="tabs-container">
        <button
          class="tab-button fs-5"
          :class="{ active: activeTab === 'summary' }"
          @click="activeTab = 'summary'"
        >
          <i class="bi bi-stars me-2 fs-4"></i>
          AI Summary
        </button>
        <button
          class="tab-button fs-5"
          :class="{ active: activeTab === 'transcript' }"
          @click="activeTab = 'transcript'"
        >
          <i class="bi bi-file-text me-2 fs-4"></i>
          Full Transcript
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- AI Summary Tab -->
        <div v-if="activeTab === 'summary'" class="summary-content">
          <div v-if="transcript?.summary" v-html="renderMarkdown(transcript.summary)" class="fs-4"></div>
          <div v-else class="text-muted fst-italic fs-4">
            <i class="bi bi-info-circle me-2 fs-3"></i>
            No AI summary available for this transcript.
          </div>
        </div>

        <!-- Full Transcript Tab -->
        <div v-if="activeTab === 'transcript'" class="transcript-full-text fs-4">
          {{ transcript?.content || '' }}
        </div>
      </div>
    </div>

    <div class="slide-panel-footer gap-3">
      <button
        class="btn btn-sm btn-outline-navy fs-4 fw-semibold"
        @click="copyToClipboard"
      >
        <i class="bi bi-clipboard me-1 fs-3"></i>
        Copy
      </button>
      <button
        class="btn btn-sm btn-navy fs-4 fw-semibold"
        @click="downloadAsText"
      >
        <i class="bi bi-download me-1 fs-3"></i>
        Download
      </button>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast-notification">
        <i class="bi bi-check-circle-fill me-2"></i>
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  transcript: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

// Toast notification state
const showToast = ref(false);
const toastMessage = ref('');

// Tab state (default to summary if available)
const activeTab = ref('summary');

const showToastNotification = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// Simple markdown renderer (basic support)
const renderMarkdown = (markdown) => {
  if (!markdown) return '';

  let html = markdown
    // Bold - MUST come before headings to avoid ## conflicts
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic (single asterisk, but not at start of line for headings)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Headings (process after bold/italic to avoid conflicts)
    .replace(/^### (.+)$/gim, '<h3>$1</h3>')
    .replace(/^## (.+)$/gim, '<h2>$1</h2>')
    .replace(/^# (.+)$/gim, '<h1>$1</h1>')
    // Code blocks
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bullet points - match lines starting with dash or asterisk
    .replace(/^[\-\*] (.+)$/gim, '<li>$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gim, '<li>$1</li>')
    // Remove excessive line breaks (more than 2 consecutive)
    .replace(/\n{3,}/g, '\n\n')
    // Replace double line breaks with paragraph breaks
    .replace(/\n\n/g, '</p><p>')
    // Replace single line breaks with <br>
    .replace(/\n/g, '<br>')
    // Wrap in paragraph
    .replace(/^(.+)/, '<p>$1')
    .replace(/(.+)$/, '$1</p>')
    // Wrap consecutive list items in ul tags
    .replace(/(<li>.*?<\/li>(\s*<br>)*)+/g, (match) => {
      return '<ul>' + match.replace(/<br>/g, '') + '</ul>';
    });

  return html;
};

const close = () => {
  emit('close');
};

// Copy transcript to clipboard
const copyToClipboard = async () => {
  if (props.transcript?.content) {
    try {
      await navigator.clipboard.writeText(props.transcript.content);
      showToastNotification('Transcript copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      showToastNotification('Failed to copy transcript');
    }
  }
};

// Download transcript as TXT file
const downloadAsText = () => {
  if (props.transcript?.content) {
    const blob = new Blob([props.transcript.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const filename = `transcript-${props.transcript.week || 'unknown'}-${Date.now()}.txt`;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Close panel on ESC key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      close();
    }
  };
  window.addEventListener('keydown', handleEscape);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEscape);
  });
});
</script>

<style scoped>
/* Backdrop */
.slide-panel-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  transition: opacity 0.3s ease;
}

/* Slide-out Panel */
.slide-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: min(600px, 92vw);
  height: 100dvh;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  display: flex;
  flex-direction: column;
  transform: translateX(100%); /* Hidden off-screen */
  transition: transform 0.3s ease;
  overflow: hidden;
}

.slide-panel-open {
  transform: translateX(0) !important; /* Slide in - force override */
}

@supports not (height: 100dvh) {
  .slide-panel-backdrop,
  .slide-panel {
    height: 100vh;
  }
}

/* Tablet: Ensure panel fits */
@media (max-width: 992px) {
  .slide-panel {
    width: 90vw;
  }
}

/* Mobile: Full-screen modal */
@media (max-width: 768px) {
  .slide-panel {
    width: 100vw !important;
    height: 100dvh;
    left: 0;
    right: 0;
  }

  .slide-panel-header {
    padding: 1rem;
  }

  .slide-panel-header h5 {
    font-size: 1rem;
  }

  .slide-panel-header small {
    font-size: 0.75rem;
  }

  .tabs-container {
    padding: 0 0.5rem;
  }

  .tab-button {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }

  .tab-content {
    padding: 1rem;
  }

  .summary-content {
    font-size: 0.9rem;
  }

  .transcript-full-text {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .slide-panel-footer {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .slide-panel-footer button {
    font-size: 0.85rem;
  }
}

/* Header */
.slide-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa;
}

.slide-panel-header h5 {
  margin: 0;
  font-weight: 600;
}

/* Body */
.slide-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* Tabs */
.tabs-container {
  display: flex;
  border-bottom: 2px solid #dee2e6;
  background-color: #f8f9fa;
  padding: 0 1.5rem;
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.tab-button:hover {
  color: #0c63e4;
  background-color: rgba(12, 99, 228, 0.05);
}

.tab-button.active {
  color: #0c63e4;
  border-bottom-color: #0c63e4;
  background-color: white;
}

/* Tab Content */
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.transcript-full-text {
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 1rem;
  color: #333;
}

/* AI Summary Styling */
.summary-content {
  line-height: 1.6;
  color: #333;
  font-size: 0.95rem;
}

.summary-content :deep(p) {
  margin: 0.5rem 0;
}

.summary-content :deep(h1) {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 1.25rem 0 0.5rem 0;
  color: #1a202c;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.35rem;
}

.summary-content :deep(h2) {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 1rem 0 0.4rem 0;
  color: #2d3748;
}

.summary-content :deep(h3) {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.75rem 0 0.35rem 0;
  color: #4a5568;
}

.summary-content :deep(strong) {
  font-weight: 600;
  color: #2d3748;
  background-color: #fff3cd;
  padding: 0.1rem 0.25rem;
  border-radius: 2px;
}

.summary-content :deep(code) {
  background-color: #f1f3f5;
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  color: #d63384;
}

.summary-content :deep(ul) {
  margin: 0.4rem 0 0.6rem 0;
  padding-left: 1.5rem;
}

.summary-content :deep(li) {
  margin: 0.25rem 0;
  line-height: 1.5;
}

.summary-content :deep(br) {
  display: none;
}

/* Footer */
.slide-panel-footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  background-color: #f8f9fa;
}

/* Scrollbar styling */
.slide-panel-body::-webkit-scrollbar {
  width: 8px;
}

.slide-panel-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.slide-panel-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.slide-panel-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive */
@media (max-width: 768px) {
  .slide-panel {
    width: 100%;
    right: 0;
  }
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  background-color: #2d3748;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);

  display: flex;
  align-items: center;
  gap: 0.5rem;

  font-size: 0.95rem;
  font-weight: 500;
}

.toast-notification i {
  color: #48bb78;
  font-size: 1.2rem;
}

/* Toast Transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
