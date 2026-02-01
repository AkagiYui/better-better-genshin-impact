<template>
  <div id="app">
    <!-- API BaseURL 悬浮输入框 -->
    <div class="api-base-input-container">
      <div class="api-base-input-wrapper">
        <input
          ref="baseURLInput"
          v-model="baseURL"
          @blur="saveBaseURL"
          @keyup.enter="saveBaseURL"
          placeholder="API BaseURL"
          class="api-base-input"
        />
        <button @click="clearBaseURL" class="api-base-clear" title="清除">✕</button>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getBaseURL, setBaseURL } from './utils/api'

export default {
  name: 'App',
  data() {
    return {
      baseURL: ''
    }
  },
  mounted() {
    // 1. 首先检查URL参数中是否有api-base
    const urlParams = new URLSearchParams(window.location.search)
    const apiBaseParam = urlParams.get('api-base')
    
    if (apiBaseParam && this.isValidURL(apiBaseParam)) {
      // 如果URL参数中有合法的api-base，使用它
      this.baseURL = apiBaseParam
      setBaseURL(apiBaseParam)
      // 清除URL参数，避免刷新时重复处理
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    } else {
      // 否则使用localStorage中保存的值
      this.baseURL = getBaseURL() || ''
    }
  },
  methods: {
    saveBaseURL() {
      const url = this.baseURL.trim()
      if (url && this.isValidURL(url)) {
        setBaseURL(url)
        this.$message.success('API BaseURL 已更新')
      } else if (url === '') {
        setBaseURL('')
        this.$message.info('API BaseURL 已清除，使用默认配置')
      } else {
        this.$message.error('请输入有效的URL')
        this.baseURL = getBaseURL() || ''
      }
    },
    clearBaseURL() {
      this.baseURL = ''
      setBaseURL('')
      this.$message.info('API BaseURL 已清除，使用默认配置')
    },
    isValidURL(url) {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Comic Sans MS', 'Segoe UI', sans-serif;
  background-color: #ffecf5;
  color: #ff6699;
  overflow-x: hidden;
  overflow-y: auto;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="5" fill="%23ffcce6" opacity="0.5"/></svg>');
}

#app {
  height: 100vh;
}

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

/* =========================== */
/* 日期选择器全局修复 - 最高优先级 */
/* =========================== */
.ant-picker-dropdown {
  z-index: 99999 !important;
}

.ant-picker-dropdown .ant-picker-panel-container {
  width: 280px !important;
  min-width: 280px !important;
}

.ant-picker-dropdown table {
  width: 100% !important;
  min-width: 100% !important;
  table-layout: fixed !important;
  border-collapse: separate !important;
  border-spacing: 0 !important;
}

.ant-picker-dropdown thead,
.ant-picker-dropdown tbody {
  width: 100% !important;
  display: table-row-group !important;
}

.ant-picker-dropdown tr {
  width: 100% !important;
  display: table-row !important;
}

.ant-picker-dropdown th,
.ant-picker-dropdown td {
  width: 14.285714% !important;
  min-width: 14.285714% !important;
  max-width: 14.285714% !important;
  display: table-cell !important;
  border: none !important;
  padding: 4px !important;
  margin: 0 !important;
  text-align: center !important;
  box-sizing: border-box !important;
}

.ant-picker-dropdown th {
  background-color: transparent !important;
}

.ant-picker-dropdown tr:nth-child(2n) {
  background-color: transparent !important;
}

/* =========================== */
/* Ant Design 表格修复 - 覆盖 markdown.css */
/* =========================== */
.ant-table-wrapper table {
  border-collapse: separate !important;
  border-spacing: 0 !important;
  border: 1px solid #f5a5a5 !important;
  border-radius: 8px !important;
  overflow: hidden !important;
}

.ant-table-wrapper th {
  border: none !important;
  border-bottom: 2px solid #74a7eb !important;
  background: #7cb4ec !important;
  padding: 12px 16px !important;
  font-weight: 600 !important;
}

.ant-table-wrapper td {
  border: none !important;
  border-bottom: 1px solid #d9fc3c !important;
  background: rgb(232, 243, 217) !important;
  padding: 12px 16px !important;
}

.ant-table-wrapper tr {
  border: none !important;
}

.ant-table-wrapper tbody tr:nth-child(2n) {
  background: #d9e6cb !important;
}

.ant-table-wrapper tbody tr:last-child td {
  border-bottom: none !important;
}
</style>