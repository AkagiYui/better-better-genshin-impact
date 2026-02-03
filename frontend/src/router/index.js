import { createRouter, createWebHistory } from "vue-router"

// 路由配置
const routes = [
  { path: "/login", name: "login", component: () => import("@/views/Login.vue"), meta: { requires: false } },

  { path: "/", name: "home", component: () => import("@/views/Home.vue"), meta: { requires: true } },
  { path: "/config", name: "config", component: () => import("@/views/Config.vue"), meta: { requires: true } },
  { path: "/log", name: "log", component: () => import("@/views/Log.vue"), meta: { requires: true } },
  { path: "/log-analysis", name: "log-analysis", component: () => import("@/views/LogAnalysis.vue"), meta: { requires: true } },
  { path: "/auto-log", name: "auto-log", component: () => import("@/views/AutoLog.vue"), meta: { requires: true } },
  { path: "/archive", name: "archive", component: () => import("@/views/Archive.vue"), meta: { requires: true } },
  { path: "/other", name: "other", component: () => import("@/views/Other.vue"), meta: { requires: true } },
  { path: "/js-names", name: "js-names", component: () => import("@/views/JsNames.vue"), meta: { requires: true } },
  { path: "/pathing", name: "pathing", component: () => import("@/views/Pathing.vue"), meta: { requires: true } },
  { path: "/list-groups", name: "list-groups", component: () => import("@/views/ListGroups.vue"), meta: { requires: true } },
  { path: "/get-auto-artifacts-pro", name: "get-auto-artifacts-pro", component: () => import("@/views/AutoArtifactsPro.vue"), meta: { requires: true } },
  { path: "/get-auto-artifacts-pro2", name: "get-auto-artifacts-pro2", component: () => import("@/views/AutoArtifactsPro2.vue"), meta: { requires: true } },
  { path: "/harvest", name: "harvest", component: () => import("@/views/Harvest.vue"), meta: { requires: true } },
  { path: "/bg", name: "bg", component: () => import("@/views/Bg.vue"), meta: { requires: true } },
  { path: "/error", name: "error", component: () => import("@/views/Error.vue"), meta: { requires: true } },
  { path: "/calculate-task-enabled-list", name: "calculate-task-enabled-list", component: () => import("@/views/CalculateTaskEnabledList.vue"), meta: { requires: true } },
  { path: "/bag-statistics", name: "bag-statistics", component: () => import("@/views/BagStatistics.vue"), meta: { requires: true } },
  { path: "/material-trend", name: "material-trend", component: () => import("@/views/MaterialTrend.vue"), meta: { requires: true } },
  { path: "/gitlog", name: "gitlog", component: () => import("@/views/Gitlog.vue"), meta: { requires: true } },
  { path: "/online", name: "online", component: () => import("@/views/online.vue"), meta: { requires: true } },
  { path: "/cd-aware-auto-gather", name: "cd-aware-auto-gather", component: () => import("@/views/CDAwareAutoGather.vue"), meta: { requires: true } },
  { path: "/screen", name: "screen", component: () => import("@/views/screen.vue"), meta: { requires: true } },
  { path: "/obs-video", name: "obs-video", component: () => import("@/views/obsVideo.vue"), meta: { requires: true } },
  { path: "/task-cron", name: "task-cron", component: () => import("@/views/TaskCron.vue"), meta: { requires: true } },
  { path: "/bgi-config", name: "bgi-config", component: () => import("@/views/BgiConfig.vue"), meta: { requires: true } },
  { path: "/update", name: "update", component: () => import("@/views/Update.vue"), meta: { requires: true } },
  { path: "/collection-management", name: "collection-management", component: () => import("@/views/CollectionManagement.vue"), meta: { requires: true } },
  { path: "/log-detail", name: "log-detail", component: () => import("@/views/LogDetail.vue"), meta: { requires: true } },
  { path: "/morale", name: "morale", component: () => import("@/views/Morale.vue"), meta: { requires: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫 - 检查认证状态
router.beforeEach((to, from) => {
  const token = localStorage.getItem("bbgi-token")
  const requires = to.meta.requires

  // 如果路由需要认证但没有token，重定向到登录页
  if (requires && !token) {
    return { name: "login" }
  }

  // 如果已登录且尝试访问登录页，重定向到首页
  if (to.name === "login" && token) {
    return { name: "home" }
  }

  // 其他情况正常导航
  return true
})

export default router
