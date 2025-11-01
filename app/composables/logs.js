const savedLogs = JSON.parse(localStorage.getItem('logs') || '[]')

export const logsStore = reactive({
  logs: savedLogs,

  addLog(entry) {
    this.logs.push({ id: Date.now(), ...entry, status: 'pending' })
  },

  approveLog(id) {
    const log = this.logs.find(l => l.id === id)
    if (log) log.status = 'approved'
  },

  rejectLog(id, reason) {
    const log = this.logs.find(l => l.id === id)
    if (log) {
      log.status = 'rejected'
      log.reason = reason
    }
  },

  deleteLog(id) {
    this.logs = this.logs.filter(l => l.id !== id)
  },

  clearAll() {
    this.logs = []
  }
})

watch(
  () => logsStore.logs,
  (newLogs) => localStorage.setItem('logs', JSON.stringify(newLogs)),
  { deep: true }
)
