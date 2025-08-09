import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export function usePageLoading(options = {}) {
  const {
    autoHide = true,
    hideDelay = 100,
    loadDataFunction = null
  } = options

  const loading = ref(true)
  const error = ref(null)
  const router = useRouter()

  let hideTimer = null

  const setLoading = (value, message = '') => {
    loading.value = value
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  const hideLoading = (delay = hideDelay) => {
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      loading.value = false
    }, delay)
  }

  const setError = (err) => {
    error.value = err
    loading.value = false
  }

  const clearError = () => {
    error.value = null
  }

  // Auto-hide loading after component mount
  onMounted(async () => {
    try {
      if (loadDataFunction) {
        await loadDataFunction()
      }
      
      if (autoHide) {
        hideLoading()
      }
    } catch (err) {
      console.error('Error loading page data:', err)
      setError(err)
    }
  })

  onUnmounted(() => {
    if (hideTimer) {
      clearTimeout(hideTimer)
    }
  })

  // Handle navigation errors
  router.onError((err) => {
    setError(err)
  })

  return {
    loading,
    error,
    setLoading,
    hideLoading,
    setError,
    clearError
  }
}
