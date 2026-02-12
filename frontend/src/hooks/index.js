import { ref, onUnmounted, onMounted, watch, unref } from "vue"

export const useIsMobile = () => {
  const isMobile = ref(window.innerWidth <= 768)

  const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }

  onMounted(() => {
    window.addEventListener("resize", updateIsMobile)
  })
  onUnmounted(() => {
    window.removeEventListener("resize", updateIsMobile)
  })

  return { isMobile }
}

export const useWindowEvent = (event, handler) => {
  onMounted(() => {
    window.addEventListener(event, handler)
  })
  onUnmounted(() => {
    window.removeEventListener(event, handler)
  })
}

/**
 * Starts/stops a setInterval based on a reactive flag.
 *
 * @param {() => void} callback
 * @param {number} interval
 * @param {boolean | import('vue').Ref<boolean> | import('vue').ComputedRef<boolean>} [isActive=true]
 */
export const useInterval = (callback, interval, isActive = true) => {
  let timerId = null

  watch(() => unref(isActive), (active) => {
    if (active) {
      if (timerId) clearInterval(timerId)
      timerId = setInterval(callback, interval)
    } else {
      if (timerId) clearInterval(timerId)
      timerId = null
    }
  }, { immediate: true })

  onUnmounted(() => {
    if (timerId) clearInterval(timerId)
  })

  return {}
}
