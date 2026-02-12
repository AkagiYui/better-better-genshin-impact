<template>
  <div class="status-card glass-panel">
    <div class="card-header">
      <h2>
        <LaptopOutlined /> 运行状态监控
      </h2>
      <button class="refresh-btn" @click="onRestartBbgiButtonClicked">
        <SyncOutlined /> 重启Better-BGI
      </button>
    </div>

    <div class="status-grid">
      <template v-for="(item, index) in overviewData" :key="index">
        <div :class="['status-item', item.hover ? 'group-name' : '']">
          <span class="label">{{ item.label }}</span>
          <span class="value">{{ item.value }}</span>
          <div v-if="item.hover" class="ExpectedToEnd">
            <pre>{{ item.hover }}</pre>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue"
import { message } from "ant-design-vue"
import { LaptopOutlined, SyncOutlined } from "@ant-design/icons-vue"
import { restartBetterBgi, getStatus } from "@/api"
import { useInterval } from "@/hooks"

// 状态数据
const statusData = reactive({
  group: "加载中...",
  ExpectedToEnd: "...",
  line: "...",
  progress: "...",
  running: "...",
  jsProgress: "...",
  scriptName: "...",
})

const overviewData = computed(() => [
  { label: "🧩 执行配置组:", value: statusData.group, hover: statusData.ExpectedToEnd },
  { label: "📜 运行路线:", value: statusData.line },
  { label: "📜 运行脚本:", value: statusData.scriptName },
  { label: "🗺️ 进度:", value: statusData.progress },
  { label: "⚙️ 状态:", value: statusData.running },
  { label: "✨ JS进度:", value: statusData.jsProgress },
])

const refreshStatus = async () => {
  try {
    const res = await getStatus()
    Object.assign(statusData, res.data)
  } catch (e) { console.error(e) }
}

useInterval(refreshStatus, 3000)

onMounted(() => {
  refreshStatus()
})

const onRestartBbgiButtonClicked = () => {
  restartBetterBgi()
  message.success("正在重启中····")
}
</script>

<style scoped>
/* 状态卡片 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 2px dashed #ffb6c1;
  padding-bottom: 10px;
}

.card-header h2 {
  margin: 0;
  color: #ff3385;
  font-size: 1.2rem;
}

.refresh-btn {
  background: #ffecf5;
  color: #ff3385;
  border: 1px solid #ff99cc;
  padding: 4px 12px;
  border-radius: 15px;
  cursor: pointer;
  width: auto;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.status-item {
  background: rgba(255, 255, 255, 0.5);
  padding: 8px;
  border-radius: 12px;
  font-size: 14px;
}

.full-width {
  grid-column: span 2;
}

.label {
  color: #ff80ab;
  font-weight: bold;
  margin-right: 5px;
}

.value {
  color: #d81b60;
  font-weight: bold;
  word-break: break-all;
}

.value.highlight {
  font-size: 1.1em;
  color: #c2185b;
}

.ExpectedToEnd {
  background: rgb(252, 207, 230);
  position: absolute;
  opacity: 0;
  display: none;
  transition: all .2s ease;
  border-radius: 5px;
}

.group-name:hover .ExpectedToEnd {
  opacity: 1;
  display: block;
  visibility: visible;
}

/* 玻璃拟态面板通用样式 */
.glass-panel {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.15);
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 24px;
}

/* ==== 移动端适配特别处理 ==== */
@media (max-width: 576px) {
  .status-grid {
    font-size: 12px;
  }

  .glass-panel {
    /* 移动端增强模糊，确保背景图片不干扰文字 */
    backdrop-filter: blur(15px);
    background: rgba(255, 255, 255, 0.75);
  }
}
</style>
