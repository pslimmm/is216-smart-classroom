<template>
  <!-- Modal Backdrop -->
  <Transition name="modal-backdrop">
    <div
      v-if="isOpen"
      class="modal-backdrop-custom"
      @click="cancel"
    ></div>
  </Transition>

  <!-- Modal -->
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="modal-custom"
      role="dialog"
      aria-labelledby="deleteModalTitle"
      aria-modal="true"
    >
      <div class="modal-dialog-custom">
        <div class="modal-content-custom">
          <!-- Header -->
          <div class="modal-header-custom">
            <h5 id="deleteModalTitle" class="modal-title">
              Confirm Deletion
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="cancel"
              aria-label="Close"
            ></button>
          </div>

          <!-- Body -->
          <div class="modal-body-custom">
            <p class="mb-3">
              Are you sure you want to delete this transcript?
            </p>
            <div class="alert alert-warning d-flex align-items-start">
              <i class="bi bi-info-circle me-2 mt-1"></i>
              <div>
                <strong>This action cannot be undone.</strong><br>
                The transcript and its associated audio file will be permanently deleted from storage.
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer-custom">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirm"
            >
              <i class="bi bi-trash me-2"></i>
              Delete Transcript
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};

// Close modal on ESC key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      cancel();
    }
  };
  window.addEventListener('keydown', handleEscape);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEscape);
  });
});
</script>

<style scoped>
/* Modal Backdrop */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

/* Modal Container */
.modal-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Modal Dialog */
.modal-dialog-custom {
  max-width: 500px;
  width: 100%;
}

/* Modal Content */
.modal-content-custom {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

/* Header */
.modal-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

/* Body */
.modal-body-custom {
  padding: 1.5rem;
}

.modal-body-custom p {
  font-size: 1rem;
  color: #333;
}

/* Footer */
.modal-footer-custom {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  background-color: #f8f9fa;
}

/* Transitions */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
