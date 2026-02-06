<template>
  <a-modal
    :open="visible"
    title="📦 上传 BGI 更新包"
    :confirm-loading="loading"
    ok-text="开始上传"
    cancel-text="取消"
    class="anime-modal"
    centered
    @ok="handleUploadBgiOk"
    @update:open="handleVisibleChange">
    <div class="upload-area">
      <input ref="bgiFileInput" type="file" accept=".zip,.7z" style="display: none" @change="handleBgiFileSelect" />
      <a-button size="large" @click="handleChooseFileClick">
        📂 选择压缩包 (.zip / .7z)
      </a-button>
      <div v-if="selectedFile" class="file-info">
        <p>已选: {{ selectedFile.name }}</p>
        <p>大小: {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
      </div>
      <div v-if="uploadProgress > 0" class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }">
          {{ uploadProgress }}%
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch } from "vue"
import { message } from "ant-design-vue"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["update:visible"])

const loading = ref(false)
const selectedFile = ref(null)
const uploadProgress = ref(0)
const bgiFileInput = ref(null)

const handleVisibleChange = (val) => {
  emit("update:visible", val)
}

// Reset internal state when modal opens.
watch(
  () => props.visible,
  (val) => {
    if (!val) return
    selectedFile.value = null
    uploadProgress.value = 0
    loading.value = false
    // Allow selecting the same file again.
    if (bgiFileInput.value) bgiFileInput.value.value = ""
  },
)

const handleChooseFileClick = () => {
  bgiFileInput.value?.click()
}

const handleBgiFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.name.endsWith(".zip") && !file.name.endsWith(".7z")) {
    message.error("只能选择 .zip 或 .7z！")
    return
  }
  if (file.size > 500 * 1024 * 1024) {
    message.error("文件过大！")
    return
  }
  selectedFile.value = file
}

const handleUploadBgiOk = async () => {
  if (!selectedFile.value) return message.warning("请先选择文件")
  loading.value = true

  const formData = new FormData()
  formData.append("file", selectedFile.value)
  const xhr = new XMLHttpRequest()

  xhr.upload.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
      uploadProgress.value = Math.round((e.loaded / e.total) * 100)
    }
  })

  xhr.addEventListener("load", () => {
    loading.value = false
    if (xhr.status === 200) {
      message.success("更新成功，请重启")
      emit("update:visible", false)
    } else {
      message.error("更新失败")
    }
  })

  xhr.addEventListener("error", () => {
    loading.value = false
    message.error("网络错误")
  })

  try {
    const token = localStorage.getItem("bbgi-token")
    xhr.open("POST", "/api/UpdateBgi/Upload")
    if (token) xhr.setRequestHeader("Authorization", token)
    xhr.send(formData)
  } catch (e) {
    loading.value = false
  }
}
</script>

<style scoped>
/* Keep consistent modal styling with other components (DesktopMonitor/OneLongModal). */
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
</style>
