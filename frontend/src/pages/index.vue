<template>
  <div class="home-container">
    <div class="main-content">
      <header class="page-header">
        <div class="header-content">
          <h1 class="header-title">✨ Better-BGI 控制台 ✨</h1>
          <p class="header-subtitle">Better-BGI Dashboard</p>
        </div>
      </header>

      <div class="status-card glass-panel">
        <div class="card-header">
          <h2>🖥️ 运行状态监控</h2>
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

      <div class="action-zone">
        <template v-for="(group, index) in buttonGroups" :key="index">
          <div class="button-group glass-panel">
            <h2 class="group-title">{{ group.title }}</h2>
            <div class="btn-grid">
              <button v-for="(btn, i) in group.buttons" :key="i" @click="btn.action ? btn.action() : btn.route ? router.push(btn.route) : () => { }">
                {{ btn.text }}
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <OneLongModal v-model:visible="oneLongModalVisible" />
    <DesktopMonitor v-model:visible="desktopMonitorVisible" />
    <UploadBgiModal v-model:visible="uploadBgiModalVisible" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch, h } from "vue"
import { message, Modal } from "ant-design-vue"
import { useRouter } from "vue-router"
import { SyncOutlined } from "@ant-design/icons-vue"
import { mysSignIn as mysSignInApi, getBaseURL, closeBgi, backup, sendImage as sendImageApi, restartBetterBgi, getStatus, GetAppInfo } from "@/api"

import DesktopMonitor from "@/components/DesktopMonitor.vue"
import OneLongModal from "@/components/OneLongModal.vue"
import UploadBgiModal from "@/components/UploadBgiModal.vue"
import { useInterval } from "@/hooks"

const router = useRouter()
const desktopMonitorVisible = ref(false)
const oneLongModalVisible = ref(false)
const uploadBgiModalVisible = ref(false)

// 退出登录
const handleLogout = () => {
  localStorage.removeItem("bbgi-token")
  router.push({ name: "login" })
}

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

// 按钮定义
const buttonGroups = ref([
  {
    "title": "🔍 实时监测",
    "buttons": [
      { text: "桌面监控", action: () => desktopMonitorVisible.value = true },
      {
        text: "发送截图", action: () => {
          Modal.confirm({
            title: "发送截图", content: "确认发送当前截图？",
            centered: true,
            cancelText: "取消",
            maskClosable: true,
            onOk: async () => { try { const res = await sendImageApi(); Modal.info({ content: res.data || "成功" }) } catch (e) { message.error("失败") } },
          })
        },
      },
      { text: "实时日志", route: { name: "log" } },
      { text: "ABGI日志查询", route: { name: "auto-log" } },
    ],
  },
  {
    "title": "📊 数据分析",
    "buttons": [
      { text: "查看狗粮日志", route: { name: "get-auto-artifacts-pro" } },
      { text: "屑荧进村", route: { name: "log-analysis" } },
      { text: "归档查询", route: { name: "archive" } },
      { text: "旅行者札记", route: { name: "bag-statistics" } },
      { text: "配置组运行情况", route: { name: "other" } },
      { text: "CD管理自动采集", route: { name: "cd-aware-auto-gather" } },
      { text: "采集管理", route: { name: "collection-management" } },
    ],
  },
  {
    "title": "🚀 自动化控制",
    "buttons": [
      { text: "一条龙启动", action: () => { oneLongModalVisible.value = true } },
      {
        text: "关闭BGI和原神", action: () => {
          Modal.confirm({
            title: "确认关闭？", content: "是否关闭【BGI】和【原神】？",
            centered: true,
            cancelText: "取消",
            maskClosable: true,
            onOk: async () => {
              try { await closeBgi(); message.success("已发送关闭指令") } catch (e) { message.error("失败") }
            },
          })
        },
      },
      { text: "调度圣坛", route: { name: "list-groups" } },
      {
        text: "备份 USER 文件", action: () => {
          Modal.confirm({
            title: "确认备份？",
            content: "是否确认备份当前的 USER 文件？",
            okText: "确定",
            cancelText: "取消",
            centered: true,
            onOk: async () => { try { await backup(); message.success("备份成功") } catch (e) { message.error("备份失败") } },
          })
        },
      },
      { text: "脚本屋", route: { name: "js-names" } },
      { text: "地图追踪", route: { name: "pathing" } },
      { text: "联机管理", route: { name: "online" } },
      { text: "ABGI定时任务", route: { name: "task-cron" } },
    ],
  },
  {
    "title": "🧭 提瓦特指挥所",
    "buttons": [
      { text: "录屏管理", route: { name: "obs-video" } },
      { text: "仓库管理", route: { name: "gitlog" } },
      { text: "手动更新BGI", action: () => uploadBgiModalVisible.value = true },
      {
        text: "米游社签到", action: () => {
          Modal.confirm({
            title: "确认签到？",
            content: "是否要米游社签到？",
            cancelText: "取消",
            centered: true,
            onOk: async () => { try { const res = await mysSignInApi(); Modal.info({ title: "结果", content: res.message || "发送成功" }) } catch (e) { message.error("失败") } },
          })
        },
      },
      { text: "ABGI设置", route: { name: "config" } },
      { text: "BGI一条龙配置", route: { name: "bgi-config" } },
      { text: "检查更新", route: { name: "update" } },
      { text: "退出", action: handleLogout },
    ],
  },
])
</script>

<style scoped>
/* ==== 全局布局与背景 ==== */
.home-container {
  position: relative;
  min-height: 100vh;
  background-color: #ffecf5;
  font-family: 'Comic Sans MS', 'Microsoft YaHei', sans-serif;
  overflow-x: hidden;
  /* 波点背景 */
  background-image: radial-gradient(#ffcce6 2px, transparent 2px);
  background-size: 20px 20px;
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


.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ==== 主内容区域 ==== */
.main-content {
  position: relative;
  z-index: 10;
  /* 保证在轮播图之上 */
  width: 92%;
  max-width: 650px;
  margin: 0 auto;
  padding-bottom: 50px;
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

/* Header 样式 */
.page-header {
  position: relative;
  height: 180px;
  border-radius: 0 0 30px 30px;
  overflow: hidden;
  margin-bottom: 25px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3);
}


.header-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding-top: 50px;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
}

.header-title {
  font-size: 2.2rem;
  color: #ff3385;
  margin: 0;
  font-weight: 800;
}

.header-subtitle {
  color: #ff66a3;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.7);
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
}

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

/* 按钮组样式 */
.group-title {
  color: #ff6699;
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.1rem;
  text-shadow: 1px 1px 0 #fff;
}

.btn-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* 强制两列 */
  gap: 12px;
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
  .main-content {
    width: 95%;
  }

  .status-grid {
    font-size: 12px;
  }

  .modal-tools button {
    font-size: 15px;
    padding: 6px 10px;
  }

  /* 确保按钮在移动端清晰且不拥挤 */
  button {
    font-size: 12px;
    padding: 8px 4px;
    white-space: nowrap;
  }

  .modal-tools button {
    font-size: 14px;
    padding: 6px 8px;
  }

  .glass-panel {
    /* 移动端增强模糊，确保背景图片不干扰文字 */
    backdrop-filter: blur(15px);
    background: rgba(255, 255, 255, 0.75);
  }
}
</style>
