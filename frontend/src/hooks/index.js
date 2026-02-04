import { ref, onUnmounted } from "vue"

export const useIsMobile = () => {
  const isMobile = ref(window.innerWidth <= 768)

  const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }

  window.addEventListener("resize", updateIsMobile)
  onUnmounted(() => {
    window.removeEventListener("resize", updateIsMobile)
  })

  return { isMobile }
}
