<template>
  <div class="api-base-input-container">
    <div class="api-base-input-wrapper">
      <input
        ref="baseURLInput"
        v-model="baseURL"
        placeholder="API BaseURL"
        class="api-base-input"
        @blur="saveBaseURL"
        @keyup.enter="saveBaseURL" />
      <button class="api-base-clear" title="清除" @click="clearBaseURL">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { message } from "ant-design-vue"
import { getBaseURL, setBaseURL } from "@/api"

const baseURL = ref(getBaseURL() || "")

onMounted(() => {
  // 1. 首先检查URL参数中是否有api-base
  const urlParams = new URLSearchParams(window.location.search)
  const apiBaseParam = urlParams.get("api-base")

  if (apiBaseParam && this.isValidURL(apiBaseParam)) {
    // 如果URL参数中有合法的api-base，使用它
    baseURL.value = apiBaseParam
    setBaseURL(apiBaseParam)
    // 清除URL参数，避免刷新时重复处理
    const newUrl = window.location.pathname
    window.history.replaceState({}, "", newUrl)
  }
})

const isValidURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const saveBaseURL = () => {
  const url = baseURL.value.trim()
  if (url && isValidURL(url)) {
    setBaseURL(url)
    message.success("API BaseURL 已更新")
  } else if (url === "") {
    setBaseURL("")
    message.info("API BaseURL 已清除，使用默认配置")
  } else {
    message.error("请输入有效的URL")
  }
}

const clearBaseURL = () => {
  baseURL.value = ""
  setBaseURL("")
  message.info("API BaseURL 已清除，使用默认配置")
}
</script>

<style scoped>

/* API BaseURL 悬浮输入框样式 */
.api-base-input-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
}

.api-base-input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px;
  border: 2px solid #ff6699;
}

.api-base-input {
  border: none;
  outline: none;
  padding: 6px 10px;
  font-size: 13px;
  width: 200px;
  background: transparent;
  color: #333;
}

.api-base-input::placeholder {
  color: #999;
}

.api-base-clear {
  border: none;
  background: #ff6699;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background 0.2s;
  margin-left: 4px;
}

.api-base-clear:hover {
  background: #ff4477;
}
</style>
