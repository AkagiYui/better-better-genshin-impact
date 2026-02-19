<template>
  <a-modal :open="visible" title="🖥️ 桌面实时监控" :footer="null" :width="isMobile ? '98vw' : '98vw'" centered class="anime-modal" @update:open="handleVisibleChange">
    <div class="screenshot-view">
      <div v-if="screenshotUrl" class="image-wrapper" :style="{ cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'default' }" @mousedown="startDrag" @mousemove="doDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @wheel="handleWheel" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <img
          :src="screenshotUrl"
          :style="{
            transform: `scale(${zoomScale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
            transformOrigin: 'center center'
          }"
          class="live-img"
          @load="onScreenshotLoad" />
      </div>
      <div v-else class="loading-placeholder">Waiting for signal...</div>
    </div>
    <div class="modal-tools">
      <button @click="userWantAutoRefresh = !userWantAutoRefresh">{{ autoRefreshButtonText }}</button>
      <button @click="zoomOut">缩小</button>
      <button @click="zoomIn">放大</button>
      <button @click="fitImage">适应</button>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { message } from "ant-design-vue"
import { useQuery } from "@pinia/colada"
import { useEventListener } from "@vueuse/core"
import { getScreenshot } from "@/api"
import { useIsMobile } from "@/hooks"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["update:visible"])

const { isMobile } = useIsMobile()

const handleVisibleChange = (val) => {
  emit("update:visible", val)
}

const isZoomed = ref(false)
const zoomScale = ref(1)

// 自动刷新
const userWantAutoRefresh = ref(true) // 用户是否希望自动刷新
const autoRefreshButtonText = computed(() => userWantAutoRefresh.value ? "⏸️ 点击暂停刷新" : "▶️ 点击继续刷新")
const isAutoRefresh = computed(() => userWantAutoRefresh.value && props.visible)

const { data: screenshotUrl, refetch } = useQuery({
  key: ["screenshot"],
  query: async () => {
    const res = await getScreenshot()
    return res
  },
  staleTime: 5000,
  placeholderData: "",
  enabled: () => isAutoRefresh.value,
})

watch(() => props.visible, (val) => {
  if (val) refetch()
})

// 拖动查看相关状态
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imagePosition = ref({ x: 0, y: 0 })


const onScreenshotLoad = () => {
  fitImage()
  imagePosition.value = { x: 0, y: 0 } // 重置位置
}

const zoomIn = () => {
  isZoomed.value = true
  zoomScale.value = Math.min(zoomScale.value + 0.2, 6)
}

const zoomOut = () => {
  if (!isZoomed.value) return
  zoomScale.value = Math.max(zoomScale.value - 0.2, 0.2)
  // 如果缩小到1倍以下，重置位置
  if (zoomScale.value <= 1) {
    fitImage()
  }
}

const fitImage = () => {
  isZoomed.value = false
  zoomScale.value = 1
  imagePosition.value = { x: 0, y: 0 }
}

// 鼠标滚轮缩放
const handleWheel = (event) => {
  if (!isZoomed.value) return

  event.preventDefault()
  const delta = event.deltaY > 0 ? -0.2 : 0.2
  const newScale = Math.max(0.2, Math.min(6, zoomScale.value + delta))

  // 计算鼠标位置相对于图片中心的偏移
  const rect = event.currentTarget.getBoundingClientRect()
  const mouseX = event.clientX - rect.left - rect.width / 2
  const mouseY = event.clientY - rect.top - rect.height / 2

  // 计算缩放后的位置调整
  const scaleRatio = newScale / zoomScale.value
  imagePosition.value.x = imagePosition.value.x * scaleRatio + mouseX * (1 - scaleRatio)
  imagePosition.value.y = imagePosition.value.y * scaleRatio + mouseY * (1 - scaleRatio)

  zoomScale.value = newScale
}

// 拖动功能
const startDrag = (event) => {
  if (!isZoomed.value) return
  event.preventDefault()
  isDragging.value = true
  dragStart.value = {
    x: event.clientX - imagePosition.value.x,
    y: event.clientY - imagePosition.value.y,
  }
}

const doDrag = (event) => {
  if (!isDragging.value || !isZoomed.value) return
  event.preventDefault()

  imagePosition.value = {
    x: event.clientX - dragStart.value.x,
    y: event.clientY - dragStart.value.y,
  }
}

const stopDrag = () => {
  isDragging.value = false
}

// 触摸事件处理
const handleTouchStart = (event) => {
  if (!isZoomed.value) return
  event.preventDefault()
  if (event.touches.length === 1) {
    isDragging.value = true
    dragStart.value = {
      x: event.touches[0].clientX - imagePosition.value.x,
      y: event.touches[0].clientY - imagePosition.value.y,
    }
  }
}

const handleTouchMove = (event) => {
  if (!isDragging.value || !isZoomed.value || event.touches.length !== 1) return
  event.preventDefault()

  imagePosition.value = {
    x: event.touches[0].clientX - dragStart.value.x,
    y: event.touches[0].clientY - dragStart.value.y,
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
}

// 监听键盘事件，支持按R键手动刷新
useEventListener("keydown", (event) => {
  if (!props.visible) return // 只在截图模态框打开时处理
  if (event.key === "r" || event.key === "R") {
    event.preventDefault()
    refetch()
    message.info("已手动刷新截图")
  }
})
</script>

<style scoped>
/* 模态框美化 */
.anime-modal :deep(.ant-modal-content) {
  border-radius: 20px;
  border: 3px solid #ffcce6;
  background: #fff0f5;
}

.anime-modal :deep(.ant-modal-header) {
  background: transparent;
  border-bottom: 2px dashed #ffb6c1;
}

.anime-modal :deep(.ant-modal-title) {
  color: #ff3385;
  text-align: center;
}

/* 截图查看器 */
.screenshot-view {
  background: #000;
  border-radius: 10px;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-bottom: 10px;
  max-height: 75vh;
  /* 限制最大高度 */
  width: 100%;
  position: relative;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  user-select: none;
}

.live-img {
  max-width: 100%;
  max-height: 75vh;
  width: auto;
  height: auto;
  object-fit: contain;
  /* 保持宽高比 */
  transition: transform 0.3s ease;
  will-change: transform;
}

.modal-tools {
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  align-items: center;
  /* 垂直居中 */
}

.modal-tools button {
  padding: 8px 14px;
  font-size: 20px;

}


.loading-placeholder {
  color: #ff66a3;
}

/* ==== 移动端适配特别处理 ==== */
@media (max-width: 576px) {
  .modal-tools button {
    font-size: 15px;
    padding: 6px 10px;
  }

  .modal-tools button {
    font-size: 14px;
    padding: 6px 8px;
  }
}

button {
  width: 100%;
  padding: 12px 5px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  background: linear-gradient(135deg, #ff99cc 0%, #ff66a3 100%);
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.3);
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

button:active {
  transform: scale(0.95);
}

button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: 0.5s;
}

button:hover::after {
  left: 100%;
}
</style>
